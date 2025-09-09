import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('servico')
export class Servico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @Column()
    preco: number;

    @Column({ default: true })
    disponivel: boolean;

    @Column({ nullable: true })
    categoria?: string;

    @Column({ nullable: true })
    duracao?: number;

    @Column({ nullable: true })
    imagem?: string;

    @OneToMany('ServicoProduto', (sp: any) => sp.servico, { cascade: true })
    bom: any[];
}
