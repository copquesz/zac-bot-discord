import { Player } from './../entities/Player.entity';
import { FindOneOptions, getRepository, Repository } from 'typeorm';


export class PlayerService {

    playerRepository: Repository<Player>;

    constructor(){
        this.playerRepository = getRepository(Player);
    }

    async save(player: Player): Promise<Player>{
        return  await this.playerRepository.save(player);
    }

    async findOne(options: FindOneOptions): Promise<Player | undefined>{
        return await this.playerRepository.findOne(options);
    }
    
    async veryfyIfPlayerExists(options: FindOneOptions): Promise<Boolean>{       
        let result = await this.findOne(options);
        if(result) return true;
        else return false;
    }

}