import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Persona } from "../../personas/entities/persona.entity";

@Entity()
export class Profissional extends Persona {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    admin: boolean;

    @Column()
    especialidade: string;

    @Column()
    cnec: number;
}
