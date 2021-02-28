import { LolApi } from 'twisted'
import { Regions } from 'twisted/dist/constants';


interface RiotApiConfig{
    rateLimitRetry: boolean,
    rateLimitRetryAttempts: number,
    concurrency: undefined,
    key?: string,
    debug: {
        logTime: boolean,
        logUrls: boolean,
        logRatelimit: boolean
    }
}

export class RiotApiService{

    private api: LolApi;

    private config: RiotApiConfig = {
        rateLimitRetry: true,
        rateLimitRetryAttempts: 1,
        concurrency: undefined,    
        key: process.env.RIOT_API_TOKEN,  
        debug: {
            logTime: false,
            logUrls: false,
            logRatelimit: false
        }
    };

    constructor(){   
        this.api = new LolApi(this.config);     
    }

    public async getChampion(key: number){
        return await this.api.DataDragon.getChampion(key);
    }

    public async getSummonerByNickName (name: string, region: Regions) {
        return await this.api.Summoner.getByName(name, region);
    }

    public async getChampionsMastery(encryptedSummonerId: string, region: Regions){
        return await this.api.Champion.masteryBySummoner(encryptedSummonerId, region);
    }
}

