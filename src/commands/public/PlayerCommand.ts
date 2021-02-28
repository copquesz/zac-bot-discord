
//Entities
import { Player } from "./../../entities/Player.entity";

// Services
import { PlayerService } from "./../../services/Player.service";
import { stripIndents } from "common-tags";
import { Command, AkairoError } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import * as capitalize from "capitalize";

export default class PlayerCommand extends Command {
  private playerService: PlayerService;
  public constructor() {
    super("player", {
      aliases: ["player"],
      category: "Player Commands",
      description: {
        content: "Displays player stats.",
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
        const embed = new MessageEmbed()
          .setAuthor(`Player - ${capitalize.words(member.nickname!)}`)
          .setColor("#3498db").setDescription(stripIndents`
                ID: ${player.memberId}
                Win Rate: ${player.winRate} 
                KDA: ${player.kda}
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
