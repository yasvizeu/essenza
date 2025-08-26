import { Persona } from "src/personas/entities/persona.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { FichaAnamnese } from "src/ficha-anamnese/entities/ficha-anamnese.entity";

@Entity()
export class Cliente extends Persona {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => FichaAnamnese)
    @JoinColumn()
    fichaAnamnese: FichaAnamnese;
}
