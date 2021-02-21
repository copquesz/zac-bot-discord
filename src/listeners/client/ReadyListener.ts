import { enviroments } from './../../../enviroment';
import { Listener } from 'discord-akairo';
import { LolApi, Constants } from 'twisted';

export default class ReadyListener extends Listener {
    public constructor(){
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        });
    }
    public exec(): void {
        console.log(`${this.client.user?.tag} is now online and ready!`);     
    }   
}