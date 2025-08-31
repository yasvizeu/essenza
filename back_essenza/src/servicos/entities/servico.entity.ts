import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Servico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @Column()
    preco: number;

    @OneToMany('ServicoProduto', (sp: any) => sp.servico, { cascade: true })
    bom: any[];
}
