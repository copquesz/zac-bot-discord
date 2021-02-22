import BotClient from './client/BotClient';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

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
  startKeepAlive();
})

function startKeepAlive(){
  setInterval(() => {
    var options = {
      host: host,
      port: process.env.PORT,
      path: '/'
    };
    http.get(options, res => {
      res.on('data', chuck => {
        try{
          console.log(`Heroku response: ${chuck}`)
        } 
        catch(err){
          console.log(err.message)
        }
      })
    }).on('error', err => {
      console.log(`Erro: ${err.message}`)
    })
  }, 15 * 60 * 1000)

}