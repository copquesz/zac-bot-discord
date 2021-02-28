import { join } from 'path';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'discord-akairo';
import { stripIndents } from 'common-tags';
import capitalize from 'capitalize';


export default class HelpCommand extends Command {
    public constructor(){
        super('help', {
            aliases: ['help', 'comands'],
            category: 'Public Commands',
            description: {
                content: 'View available commands on the bot',
                usage: 'help [command]',
                examples: ['help', 'help ping']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                    default: null
                }
            ]
        })
    }

    public exec(message: Message, { command }: { command: Command }): Promise<Message> {
        if(command){  
            return message.channel.send(
                new MessageEmbed()
                    .setAuthor(`Help - ${capitalize.words(command.id)}`)
                    .setColor('#3498db')
                    .setDescription(stripIndents`
                        **Description**
                        ${command.description.content || 'No content provided'}

                        **Usage**
                        ${command.description.usage || 'No usage provided'}

                        **Examples**
                        ${command.description.examples ? command.description.examples.map((e: any) => `\`${e}\``).join("\n") : "No examples provided"}
                    `)
            )
        }

        const embed = new MessageEmbed()
            .setAuthor(`Help | ${this.client.user?.username}`)
            .setColor('#3498db')
            .setFooter(`${this.client.commandHandler.prefix}help [command] for more information on a command`);

        for(const category of this.handler.categories.values()){
            if(["default"].includes(category.id)) continue;
            
            embed.addField(category.id,
                category
                .filter(command => command.aliases.length > 0)
                .map(command => `**\`${command}\`**`)
                .join(", ") || "No commands in the category"
            )
        }

        return message.channel.send(embed);
    }

}