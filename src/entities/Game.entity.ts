import {Entity, Column, PrimaryGeneratedColumn, OneToMany,} from "typeorm";
import { GameDetail } from "./GameDetail.entity";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp'})
    creatAt: Date;

    @Column({ type: 'timestamp', default: null })
    endAt: Date;

    @Column({ type: 'time', default: null })
    time: Date;

    @Column({ default: false })
    win: boolean;

    @Column({ default: false })
    loose: boolean;

    @OneToMany(() => GameDetail, gameDetail => gameDetail.game)
    gameDetails: GameDetail[];

    constructor(){
        this.creatAt = new Date();
    }
}