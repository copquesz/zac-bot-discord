import { ChampionMasteryInterface } from './../../interfaces/ChampionMastery.interface';
import { RiotApiService } from './../../riot/RiotApiService';

//Entities
import { Player } from "./../../entities/Player.entity";

// Services
import { PlayerService } from "./../../services/Player.service";
import { stripIndents } from "common-tags";
import { Command, AkairoError } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import * as capitalize from "capitalize";
import { Regions } from 'twisted/dist/constants';
import { ChampionMasteryDTO, ChampionsDataDragon, ChampionsDataDragonDetails } from 'twisted/dist/models-dto';

export default class PlayerCommand extends Command {

  private playerService: PlayerService;
  private riotService: RiotApiService;

  public constructor() {
    super("player", {
      aliases: ["player"],
      category: "Player Commands",
      description: {
        content: "Exibe estatísticas do Player.",
        usage: "player @mention",
        examples: ["player"],
      },
      ratelimit: 3,
      args: [
        {
          id: "member",
          type: "member",
          default: "Player não encontrado",
          limit: 1,
        },
      ],
    });

    this.playerService = new PlayerService();
    this.riotService = new RiotApiService();
  }

  public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
    let player: Player | undefined;
    const result = await this.playerService.veryfyIfPlayerExists({
      where: [{ memberId: member.id }],
    });
    if (result) {
      player = await this.playerService.findOne({
        where: [{ memberId: member.id }],
      });
      if (player != undefined) {
        
        var championsMasteryArray = new Array<ChampionMasteryInterface>();
        await this.riotService.getChampionsMastery(player.summonerId, Regions.BRAZIL).then(
            async result => {
              let data = await result;
              if(data.response.length > 3){
                for(var i = 0; i < 3 ; i++ ){  
                  const championMastery: ChampionMasteryDTO =  data.response[i];           
                  await this.riotService.getChampion(championMastery.championId).then(
                    async champion => {
                      //console.log(champion);
                      await championsMasteryArray.push({name: champion.name, level: championMastery.championLevel, lastPlayed: new Date(championMastery.lastPlayTime), points: championMastery.championPoints});
                    }
                  )
                }
              }
            }
        );

        const embed = new MessageEmbed()
          .setAuthor(`Player - ${capitalize.words(member.user.username)}`)
          .setColor("#3498db").setDescription(stripIndents`
                Conta: ${player.nickname}
                Win Rate in SCRIM: ${player.winRate} 
                KDA in SCRIM: ${player.kda}

                Melhores Campeões:
                ${championsMasteryArray.map((data, index) => 
                  `${index + 1}º - Campeão: ${data.name} | Pontos: ${data.points} | Maestria: ${data.level}`).join('\n ')}
            `);
            return message.channel.send(embed);
      } 
      else{
        throw new AkairoError('Player undefined');
      }
    }
    else {
    const embed = new MessageEmbed()
        .setAuthor("Zac Bot")
        .setColor("#e74c3c")
        .setDescription("Player não configurado");
        return message.channel.send(embed);
    }
  }
}
