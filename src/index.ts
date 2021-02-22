import BotClient from './client/BotClient';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const token: string = process.env.ZAC_BOT_TOKEN!;
const owners: string | string [] = [];
const client: BotClient = new BotClient({token, owners});;

const port = parseInt(process.env.PORT!) || 5000;
const host = '0.0.0.0';
const app = express();

app.listen(port, host, () =>{
  console.log(`App listen on port: ${port}`);
  client.start();
})