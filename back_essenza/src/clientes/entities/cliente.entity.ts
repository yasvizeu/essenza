import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Persona } from "../../personas/entities/persona.entity";
import { FichaAnamnese } from "../../ficha-anamnese/entities/ficha-anamnese.entity";

@Entity()
export class Cliente extends Persona {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne('FichaAnamnese')
    @JoinColumn()
    fichaAnamnese: any;
}
