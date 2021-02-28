import { Player } from './entities/Player.entity';
import BotClient from './client/BotClient';
import dotenv from 'dotenv';
import express from 'express';
import {createConnection, createConnections, Connection, getConnection, getConnectionOptions, getRepository} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const token: string = process.env.ZAC_BOT_TOKEN!;
const owners: string | string [] = [];
const client: BotClient = new BotClient({token, owners});;

const port = parseInt(process.env.PORT!) || 5000;
const host = '0.0.0.0';
const app = express();

createConnection().then(async connection => {  
  app.listen(port, host, async () =>{  
    client.start();
    console.log(`App listen on port: ${port}`);
  })
}).catch(error => console.log("Erro Connection Database",error));
