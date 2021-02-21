import { enviroments } from '../../enviroment';
import { join } from 'path';
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Message } from 'discord.js';

declare module "discord-akairo"{
    interface AkairoClient{
        commandHandler: CommandHandler;
        listenerHandler: ListenerHandler;
    }
}

interface BotConfig{
    token?: string;
    owners?: string | string [];
}

export default class BotClient extends AkairoClient{    
    public config: BotConfig;

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, '..', 'listeners')
    });

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, '..', 'commands'),
        prefix: enviroments.PREFIX,
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 6e4,
        argumentDefaults: {
            prompt: {
                modifyStart: (message: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel de command ...`,
                modifyRetry: (message: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel de command ...`,
                timeout: 'You took to long, the command has now been canceled ...',
                ended: 'You exceeded the maximum amount of tries, this command has been canceled ...',
                cancel: 'This command has been canceled ...',
                retries: 3,
                time: 3e4
            },
            otherwise: ''
        },
        ignorePermissions: enviroments.owners
    });

    public constructor(config: BotConfig){
        super({
            ownerID: config.owners
        });
        this.config = config;
    }

    private async _init(): Promise<void>{
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            process
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    public async start(): Promise<string>{
        await this._init();
        return this.login(this.config.token);
    }
}
