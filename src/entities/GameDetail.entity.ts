import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { Player } from './Player.entity';
import { Role } from '../enum/Role';
import { Game } from "./Game.entity";

@Entity()
export class GameDetail {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    damage: number;

    @Column({ default: 0 })
    kills: number;

    @Column({ default: 0 })
    deaths: number;

    @Column({ default: 0 })
    assists: number;

    @Column({ default: 0 })
    farm: number;

    @Column({ default: 0 })
    sentinelWards: number;

    @Column({ default: 0 })
    pinkWards: number;

    @Column({ default: null })
    champion: string;

    @ManyToOne(() => Game, game => game.gameDetails)
    game: Game;

    @Column("enum", { enum: Role })
    role: Role;

    @ManyToOne(() => Player)
    player: Player;

    constructor(){ }

}