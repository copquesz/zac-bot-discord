import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Player {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: null})
    memberId: string;

    @Column({default: null})
    nickname: string;

    @Column({type: "decimal", precision: 2, default: 0})
    winRate: number;

    @Column({type: "decimal", precision: 2, default: 0})
    kda: number;

    constructor(){
    }
}