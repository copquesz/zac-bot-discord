import { enviroments } from './../enviroment';
import BotClient from './client/BotClient';

const token: string = enviroments.ZAC_BOT_TOKEN;
const owners: string | string [] = enviroments.owners;

const client: BotClient = new BotClient({token, owners});
client.start();