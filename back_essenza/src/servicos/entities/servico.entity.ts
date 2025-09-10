import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('servico')
export class Servico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    preco: number;

    @Column({ default: true })
    disponivel: boolean;

    @Column({ nullable: false })
    categoria: string;

    @Column({ nullable: true })
    duracao?: number;

    @Column({ nullable: true })
    imagem?: string;

    @OneToMany('ServicoProduto', (sp: any) => sp.servico, { cascade: true })
    bom: any[];
}
