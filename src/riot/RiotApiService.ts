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

    public async summonerByNicknameExample (name: string, region: Regions) {
        return await this.api.Summoner.getByName(name, region);
    }
}

