//Entities
import { Player } from "../../entities/Player.entity";
// DTO's
import { ApiResponseDTO, SummonerV4DTO } from 'twisted/dist/models-dto';
// Services
import { PlayerService } from "../../services/Player.service";
import { RiotApiService } from '../../riot/RiotApiService';
// Twisted | Riot
import { Regions } from 'twisted/dist/constants';
// Discord.js | Discord Akairo
import { Message, MessageEmbed } from "discord.js";
import { Command, AkairoError } from "discord-akairo";
// Utils
import { stripIndents } from "common-tags";
import * as capitalize from "capitalize";

export default class PlayerConfigCommand extends Command {

  private playerService: PlayerService;
  private riotService: RiotApiService;

  public constructor() {
    super("player-config", {
      aliases: ["player-config"],
      category: "Coach Commands", 
      description: {
        content: "Configura o Player no Sistema.",
        usage: "player-config @mention <riot-nickname>",
        examples: ["player"],
      },
      ratelimit: 3,
      separator: ',',
      args: [       
        {
          id: "args",
          type: "string",
          match: 'separate',
          default: "Nickname não encontrado",
          limit: 1,
        },
      ],
    });
    this.playerService = new PlayerService();
    this.riotService = new RiotApiService();
  }

  public async exec(message: Message, { args }: {args: Array<string>}): Promise<Message> {

    // Verify if command has @mention
    const countUsers = message.mentions.users.size;
    if(countUsers > 0) {

      // Get user mentioned
      const user = message.mentions.users.first();
      // Build parameter nickname
      const nickname = args.map(nick => {return nick.split(' ')})[0].slice(1).join(" ");

      // Instance summoner
      var summoner: ApiResponseDTO<SummonerV4DTO> = new ApiResponseDTO<SummonerV4DTO>();
      // Instance player
      var player: Player | undefined = new Player();

      // Condicion that's verify if player mentioned have register in database
      const playerResult = await this.playerService.veryfyIfPlayerExists({
        where: [{ memberId: user?.id }],
      });

      // Load summoner callback of API
      await this.riotService.getSummonerByNickName(nickname, Regions.BRAZIL).then(
        async data => {
          summoner = await data;             
          // Continue if response success
          if(summoner.response){              
            if(playerResult){
              player = await this.playerService.findOne({
                where: [{ memberId: user?.id }],
              });
              player!.summonerId = summoner.response.id;
              player!.nickname = summoner.response.name;
              this.playerService.save(player!);
            }
            else{              
              player!.summonerId = summoner.response.id;
              player!.memberId = user!.id;
              player!.nickname = summoner.response.name;
              this.playerService.save(player!);
            }                       
          }
        },
        // Bot reply if Summoner not found
        () => message.reply('Summoner não encontrado.')     
      )    

      // Returns Message Embed
      const embed = new MessageEmbed()
        .setAuthor("Zac Bot")
        .setColor("#2ecc71")
        .setDescription(stripIndents `
          Player **${capitalize.words(user!.username)}** configurado com sucesso!
        `);
      return message.channel.send(embed);     
    }

    // Throws if no have player mentioned
    else{
      message.reply('Nenhum Player foi mencionado.')   
      throw new AkairoError('Nenhum Player foi mencionado.')
    }  
  }
}
