import {Column} from "typeorm";

export abstract class Persona {
    @Column()
    name:string;

    @Column()
    birthDate:string;

    @Column({unique: true})
    cpf: string;

    @Column()
    email:string;

    @Column()
    password: string;

    @Column()
    cell: string;

    @Column()
    address: string;

    @Column()
    type: 'cliente'|'profissional';
}
