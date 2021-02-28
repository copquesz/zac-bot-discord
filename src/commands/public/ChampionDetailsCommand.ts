import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import * as champions from '../../riot/data/champion.json';
import * as capitalize from 'capitalize';
import * as youtubeSearch from "youtube-search";


export default class ChampionDetailsCommand extends Command {
    public constructor(){
        super('champion', {
            aliases: ['champion'],
            category: 'LoL Commands',
            description: {
                content: 'Displays user information.',
                usage: 'champion < name >',
                examples: [
                    'champion'
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: 'name',
                    type: 'string',
                    default: 'No champion provided'
                }
            ]
        })
    } 

    public async exec(message: Message, { name }: { name: string }): Promise<Message>{        
        var embed; 
        const championName = this.keyChampion(name);       
        try{      
            const champion = Object.assign(champions)['data'][championName];

            const krReplaysPromisse = await Object.assign(this.searchVideos(championName, 'KR Replays', 3)); 
            const krReplaysValues = krReplaysPromisse.results.map((obj: youtubeSearch.YouTubeSearchResults) => `[${obj.title}](${obj.link})`).join("\n")

            const montagesReplaysPromisse =  await Object.assign(this.searchVideos(championName, 'Montage', 2));
            const montagesReplaysValues = montagesReplaysPromisse.results.map((obj: any) => `[${obj.title}](${obj.link})`).join("\n")

            embed = new MessageEmbed({
                author: {
                    name: `Champion: ${championName}`,
                    iconURL: `http://ddragon.leagueoflegends.com/cdn/11.4.1/img/champion/${champion.image.full}`
                },
                color: '#3498db',
                description: champion.lore,
                fields: [
                    { name: '\u200B', value: '\u200B' },
                    { name: ':heart: HP', value: champion.stats.hp, inline: true },
                    { name: ':heart: HP / LV', value: champion.stats.hpperlevel, inline: true },                                        
                    { name: ':droplet: MANA / :zap: ENERGY', value: champion.stats.mp, inline: true },
                    { name: ':droplet: MANA / LV', value: champion.stats.mpperlevel, inline: true },                      
                    { name: ':mechanical_arm: ARMOR', value: champion.stats.armor, inline: true },
                    { name: ':mechanical_arm: ARMOR/LV', value: champion.stats.armorperlevel, inline: true },                                        
                    { name: ':dagger: DAMAGE', value: champion.stats.attackdamage, inline: true },
                    { name: ':dagger: DAMAGE / LV', value: champion.stats.attackdamageperlevel, inline: true },                                        
                    { name: ':crossed_swords: ATTACK SPEED', value: champion.stats.attackspeed, inline: true },
                    { name: ':crossed_swords: ATTACK SPEED / LV', value: champion.stats.attackspeedperlevel, inline: true }, 
                    { name: ':boot: Move Speed', value: champion.stats.movespeed, inline: true },    
                    { name: ':boomerang: ATTACK RANGE', value: champion.stats.attackrange, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Como Jogar - Dicas, Rota, Itemização e Runas:', value: krReplaysValues || "No commands in the category"},
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Montages:', value: montagesReplaysValues || "No commands in the category"},
                    { name: '\u200B', value: '\u200B' }
                ],
                footer: {
                    text: `Informações Campeão: ${championName}`
                }
                
            })
            .setTimestamp()
        } catch(err) {
            embed = new MessageEmbed({
                author: {
                    name: `Erro | ${this.client.user?.username}`
                },
                color: '#e74c3c',
                description: `${err}`,
                footer: {
                    text: `Falha Comando: !champion ${name}`
                }
            })
            .setTimestamp()
        }
        return await message.channel.send(embed) 
    }    

    public async searchVideos(championName: string, key: string, results: number): Promise<any>{
        var opts: youtubeSearch.YouTubeSearchOptions = { maxResults: results, key: process.env.YOUTUBE_API_TOKEN };
        return await youtubeSearch.default(`${key} ${championName}`, opts);
    }

    public keyChampion(name: string){
        name = name.toLocaleLowerCase();  

        switch(name){

            // AurelionSol
            case 'aurelion sol': 
            case 'aurelionsol':
            {name = 'AurelionSol'; break;}

            // DrMundo
            case 'drmundo':
            case 'dr mundo': 
            {name = 'DrMundo'; break;}
            
            // Gangplank
            case 'gp': 
            case 'gangplank':
            case 'gang plank':
            {name = 'Gangplank'; break;}

            // Khazix
            case 'khazix':
            case 'kha zix':
            case "Kha'zix":
            case 'kz': 
            {name = 'Khazix'; break;}

            // KogMaw
            case 'kogmaw':
            case "kog'maw":
            case 'kog maw':
            {name = 'KogMaw'; break;}

            // LeeSin
            case 'lee':
            case 'leesin':
            case 'lee sin':
            {name = 'LeeSin'; break;}

            // MasterYi
            case 'masteryi':
            case 'master yi':
            {name = 'MasterYi'; break;}

            // MissFoturne
            case 'missfortune':
            case 'miss fortune':
            case 'mf':
            {name = 'MissFortune'; break;}

            // WuKong
            case 'monkeyking':
            case 'monkey king':
            case 'wukong':
            case 'wu':
            {name = 'MonkeyKing'; break;}

            // RekSai
            case 'reksai':
            case "rek'sai":
            {name = 'RekSai'; break;}

            // TahmKench
            case 'tahmkench':
            case 'tahm kench':
            case 'tk':
            {name = 'TahmKench'; break;} 
            
            // TwistedFate
            case 'twistedfate':
            case 'twisted fate':
            case 'tf': 
            {name = 'TwistedFate'; break;} 

            // Velkoz
            case "vel'koz": name = 'Velkoz'; break; 

            // XinZao
            case 'warwick':
            case 'ww': 
            {name = 'Warwick'; break;}
                          
            // XinZao
            case 'xinzhao':
            case 'xin zhao': 
            {name = 'XinZhao'; break;}

            default: name = capitalize.words(name); break;            
        } 

        return name;
    }

}