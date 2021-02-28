import { GameDetail } from './../../entities/GameDetail.entity';
import { Role } from './../../enum/Role';
import { Player } from './../../entities/Player.entity';
import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { Message, MessageEmbed } from 'discord.js';
import { getRepository } from 'typeorm';
import * as capitalize from 'capitalize';


export default class GameCommand extends Command {
    public constructor(){
        super('game-start', {
            aliases: ['game-start'],
            category: 'Coach Commands',
            description: {
                content: 'Instancia o game da scrim',
                usage: 'game-start @mention role',
                examples: [
                    'game-start @player role'
                ]
            },
            ratelimit: 3,
            separator: ',', 
            args: [        
                {   
                    id: 'args',
                    type: 'string',
                    default: 'Role não encontrado',
                    match: 'separate',                    
                    prompt: {                       
                        retry: 'Role inválido!',
                        optional: false
                    }
                }                 
            ]
        })
    } 

    public async exec(message: Message, {args}: {args: Array<string>}): Promise<Message> {  
        const countUsers = message.mentions.users.size;
        const countRoles = args.length;
     
       if((countUsers > 0 && countRoles > 0)){
            // Map Users
            const users = message.mentions.users.map(user => {
                return user;
            });
            // Map Roles
            const roles = args.map(arg => {
                return arg.split(" ", 2)[1];                
            });             

            var gameDetails: Array<GameDetail> = new Array<GameDetail>();
            for (var i = 0; i < roles.length; i++) {

                // Prepare Game Detail Model
                const player = this.veryfyIfPlayerExists(users[i].id)
                const role = this.getRole(roles[i]);  

                // Instance a Game  Detail
                const gameDetail = new GameDetail();
                gameDetail.player = await player;
                gameDetail.role = role;

                // Push arrays
                gameDetails.push(gameDetail);
                
            }

            console.log(gameDetails);

            const embed = new MessageEmbed()
            .setAuthor(`Zac Bot - Game Start`)
            .setColor('#f1c40f')
            .setDescription(stripIndents`
               Game criado com sucesso!

               ${gameDetails.map(gameDetail => 'Player: ' + gameDetail.player.nickname + ' - ' + gameDetail.role).join('\n')}
            `)
            .setFooter(`Game`);

            return message.channel.send(embed);
        }

        else {
           const embed = new MessageEmbed()
            .setAuthor(`Zac Bot - Game Start`)
            .setColor('#e74c3c')
            .setDescription(stripIndents`
               Falha!
               Ex: !game-start @player1 role1, @player2 role2, ... 
            `)
            .setFooter(`Falha Game Start`);

            return message.channel.send(embed);
        }       
    }

    async veryfyIfPlayerExists(memberId: string){
        const playerRepository = getRepository(Player);
        let playerResult = await playerRepository.findOne({
            where: [
                {memberId: memberId}
            ]
        })
        if(playerResult == undefined){
            playerResult = new Player();
            playerResult.memberId = memberId;
            playerResult = await playerRepository.save(playerResult)
        }   
        return playerResult;
    }

    getRole(role: string): Role{
        if(role == 'top') return Role.TOP;
        if(role == 'jg' || role == 'jungle') return Role.JUNGLE;
        if(role == 'mid') return Role.MID;
        if(role == 'adc') return Role.ADC;
        if(role == 'sup') return Role.SUP    
        else return Role.UNDEFINED;
    }

}