import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CommonModule} from '@angular/common'
import{RouterModule} from '@angular/router';
import{FormsModule} from '@angular/forms';

interface Tratamento{
  id: string;
  nome: string;
  preco: string;
  imagem: string;
  descricao: string;
 
  
}

@Component({
  selector: 'app-detalhamento',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalhamento.html',
  styleUrl: './detalhamento.css'
})
export class Detalhamento  implements OnInit {
  
  tratamentoSelecionado!: Tratamento;
  sessoes: number = 1; //quantidade inicial de sessões
  
  tratamento: Tratamento []= [
    //corporal
    {
      id: 'cuidadoscomapele',
      nome: 'Cronograma de cuidados com a pele Anual',
      preco: 'R$ 3.210,00',
      imagem: '../../../assets/imagem/cronograma-de-cuidadospele.webp',
      descricao: 'O tratamento de cuidados com a pele é um conjunto de procedimentos estéticos que visam melhorar a saúde e a aparência da pele. Ele inclui limpeza, esfoliação, hidratação e nutrição da pele. Divisão por Estações do Ano. Verão: foco em proteção solar, controle de oleosidade e hidratação leve. Inverno: tratamentos mais intensos como peelings, hidratação profunda e renovação celular. Outono/Primavera: equilibrio entre renovação e preparação para mudanças climáticas.' 
    },
    {
      id: 'pelerenovadora',
      nome: 'Cronograma Pele Renovada',
      preco: 'R$ 1.270,00',
      imagem: '../../../assets/imagem/pele-renovadora.webp',
      descricao: 'O peeling renovador é um tratamento estético que utiliza ácidos para esfoliar a pele, removendo células mortas e promovendo a regeneração celular. Ele é eficaz no tratamento de manchas, rugas e acne.'
    },
    {
      id: 'peledeporcelana',
      nome: 'Pele de Porcelana',
      preco: 'R$ 600,00',
      descricao: 'O tratamento de pele de porcelana é um procedimento estético que visa deixar a pele mais lisa, uniforme e com aparência saudável. Ele pode incluir limpeza profunda, esfoliação, hidratação e aplicação de produtos específicos para o tipo de pele.',
      imagem: '../../../assets/imagem/pele-de-porcelana.webp'
    },
    {
    id: 'vasinhos',
    nome: 'Vasinhos PEIM',
    preco: 'R$ 160,00 – R$ 1.400,00',
    descricao: "O tratamento de pele de porcelana é um procedimento estético que visa deixar a pele mais lisa, uniforme e radiante. Ele pode incluir esfoliação, hidratação e aplicação de produtos específicos para melhorar a textura da pele.",
    imagem: '../../../assets/imagem/Vasinhos.webp'
    },
    {
      id: 'perfectgluteos',
      nome: 'Perfect Glúteos',
      preco: 'R$ 1.800,00',
      descricao:'O tratamento Perfect Glúteos é um procedimento estético que visa melhorar a forma e o volume dos glúteos, proporcionando um contorno mais definido e atraente.',
      imagem: '../../../assets/imagem/Perfect-Gluteos.webp'
    },
    {
      id: 'hidrolipoclasianaoaspirativa',
      nome: 'Hidrolipoclasia não aspirativa',
      preco: 'R$ 300,00 – R$ 1.600,00',
      descricao: 'A hidrolipoclasia não aspirativa é um tratamento estético que utiliza água para eliminar a gordura localizada sem a necessidade de cirurgia. Ele é eficaz na redução de medidas e na melhora do contorno corporal.',
      imagem: '../../../assets/imagem/Hidrolipoclasia-nao-aspirativa.webp'
    },
    {
      id: 'limpezadepelenascostas',
      nome: 'Limpeza de pele nas costas',
      preco: 'R$ 200,00 – R$ 1.600,00',
      descricao: 'A limpeza de pele nas costas é um procedimento estético que visa remover impurezas, cravos e espinhas da pele das costas, deixando-a mais limpa e saudável.',
      imagem: '../../../assets/imagem/Limpeza-de-pele-nas-costas-.webp'
    },
    {
      id: 'estriasoff',
      nome: 'Estrias Off',
      preco: 'R$ 1.000,00 – R$ 1.800,00',
      descricao: 'O tratamento Estrias Off é um procedimento estético que visa reduzir a aparência de estrias na pele, melhorando sua textura e uniformidade.',
      imagem: '../../../assets/imagem/Estrias-Off-.webp'
    },
    {
      id: 'pumpup',
      nome: 'Pump UP',
      preco: 'R$ 130,00 – R$ 900,00',
      descricao: 'O Pump UP é um tratamento estético que visa aumentar o volume dos músculos e melhorar a definição corporal.',
      imagem: '../../../assets/imagem/Pump-UP.webp'
    },
    {
      id: 'modelatta',
      nome: 'Modelatta',
      preco: 'R$ 130,00 – R$ 900,00',
      descricao:'O Modelatta é um tratamento estético que visa modelar o corpo e melhorar a silhueta, proporcionando uma aparência mais tonificada e definida.',
      imagem: '../../../assets/imagem/Modelatta-.webp'
    },
     //massagem
    {
      id: "shiatsu",
      nome: "Shiatsu",
      preco: "R$ 200,00 – R$ 1.800,00",          descricao: "O Shiatsu é uma técnica de massagem japonesa que utiliza pressão com os dedos em pontos específicos do corpo para aliviar tensões, melhorar a circulação e promover o relaxamento.",
      imagem: '../../../assets/imagem/massagem/shiatsu.webp'
    },
    {
      id:"drenagemlinfaticaposoperatorio",
      nome: "Drenagem Linfática Pós-Operatório",
      preco:"R$ 180,00 - R$ 1.600,00",
      descricao: "A drenagem linfática pós-operatório é uma técnica de massagem que ajuda a reduzir o inchaço e a dor após cirurgias, melhorando a circulação linfática e promovendo uma recuperação mais rápida.",
      imagem: '../../../assets/imagem/massagem/drenagem-linfatica-pos-operatorio.webp',
    },
    {
      id: "drenomodeladora",
      nome: "Drenagem Modeladora Esplendor Revitalizante",
      preco: "R$ 130,00 – R$ 1.100,00",
      descricao: "A drenagem modeladora é uma técnica de massagem que combina movimentos de drenagem linfática com manobras de modelagem corporal, ajudando a reduzir medidas e melhorar o contorno do corpo.",
      imagem: "../../../assets/imagem/massagem/drenomodeladora.webp",
    },
    {
      id: "drenagemlinfatica",
      nome: "Drenagem Linfática",
      preco: "R$ 150,00 – R$ 1.150,00",
      descricao: "A drenagem linfática é uma técnica de massagem que estimula o sistema linfático, ajudando a eliminar toxinas, reduzir o inchaço e melhorar a circulação sanguínea.",
      imagem: "../../../assets/imagem/massagem/Drenagemlinfatica.webp",
    },
    {
      id: "drenagemwinter",
      nome: "Drenagem Winter Renovação e Relaxamento Profundo",
      preco: "R$ 150,00 – R$ 1.150,00",
      descricao: "A drenagem Winter é uma técnica de massagem que combina movimentos de drenagem linfática com manobras de relaxamento, proporcionando alívio para o corpo e a mente durante os meses mais frios.",
      imagem: "../../../assets/imagem/massagem/drenagem-winter.webp",
    },
    {
      id: "drenagemlinfaticafacial",
      nome: "Drenagem Linfática Facial",
      preco: "R$ 120,00 – R$ 1.000,00",          descricao: "A drenagem linfática facial é uma técnica de massagem que ajuda a reduzir o inchaço e as olheiras no rosto, melhorando a circulação sanguínea e promovendo uma aparência mais fresca e rejuvenescida.",
      imagem: "../../../assets/imagem/massagem/drenagem-linfatica-facial.webp",
    },
    {
      id: "massagem360",
      nome: "Massagem 360",
      preco: "R$ 180,00 – R$ 1.500,00",
      descricao: "A Massagem 360 é uma técnica de massagem que envolve todo o corpo, proporcionando um equilíbrio integral e relaxamento profundo. Ela combina movimentos suaves e firmes para aliviar tensões musculares e promover o bem-estar geral.",
      imagem: "../../../assets/imagem/massagem/massagem-360.webp",
    },
    {
      id: "spafacial",
      nome: "Spa Facial",
      preco: "R$ 120,00 – R$ 1.000,00",
      descricao: "O Spa Facial é um tratamento estético que combina limpeza, esfoliação, hidratação e nutrição da pele do rosto. Ele proporciona uma experiência relaxante e revitalizante, deixando a pele mais saudável e radiante.",
      imagem: "../../../assets/imagem/massagem/spa-facial.webp",
    },
    {
       id: "massagemliftingfacial",
       nome: "Massagem Lifting Facial",
       preco: "R$ 120,00 – R$ 1.000,00",
       descricao: "A Massagem Lifting Facial é uma técnica de massagem que utiliza movimentos específicos para tonificar e rejuvenescer a pele do rosto. Ela ajuda a reduzir rugas e linhas de expressão, proporcionando uma aparência mais jovem e revitalizada.",
       imagem: "../../../assets/imagem/massagem/massagem-lifting-facial.webp",
    },
    {
      id: "detoxzen",
      nome: "Detox Zen",
      preco: "R$ 170,00 – R$ 1.200,00",
       descricao: "O Detox Zen é um tratamento de massagem que combina técnicas de drenagem linfática com aromaterapia para promover a desintoxicação do corpo e o relaxamento profundo.",
      imagem: "../../../assets/imagem/massagem/detox-zen.webp",
    },
    //faciais
    {
      id:"enzimas",
      nome: "Enzimas",
        preco: "R$ 200,00 – R$ 1.600,00",
        descricao: "O tratamento de mesoterapia capilar na Clínica Humanitá é especialmente projetado para promover o crescimento de novos fios e reduzir a queda de cabelo, oferecendo uma solução eficaz e segura para quem deseja cabelos mais densos e saudáveis.",
        imagem: '../../../assets/imagem/Enzimas.jpg'
    },
    {
       id: "rejuvenessindolor",
        nome: "Rejuvess Indolor",
        preco: "R$ 220,00 – R$ 1.900,00",
        descricao: "A radiofrequência no rosto é um tratamento estético que utiliza uma fonte de calor capaz de estimular a pele a produzir novas fibras de colágeno, melhorando a qualidade e a elasticidade da pele, corrigindo linhas de expressão e rugas, melhorando a hidratação e a firmeza do rosto.",
        imagem: '../../../assets/imagem/Rejuveness-Indolor.webp'
    },
    {
      id: "radiofrequenciareducao",
      nome: "Radiofrequência Redução de Flacidez",
      preco: "R$ 120,00 – R$ 900,00",
      descricao: "A radiofrequência é uma técnica não invasiva que utiliza ondas eletromagnéticas para aquecer as camadas mais profundas da pele, estimulando a produção de colágeno e elastina. Isso resulta em uma pele mais firme e tonificada, reduzindo a flacidez e melhorando a textura da pele.",
      imagem: "../../../assets/imagem/Radiofrequência-Redução de flacidez.png"
    },
    {
      id: "hidragloss",
      nome: "Hidragloss",
      preco: "R$ 120,00 – R$ 500,00",
      descricao: "A técnica é indicada para quem quer dar um “up” e revitalizar os lábios de forma natural, hidratar, melhorar o volume, formato e retirar as “linhas” que aparecem na boca após alguns anos. É realizado por meio de um microagulhamento na região dos lábios e ativos e máscaras específicas para rejuvenescer e dar volume, além de hidratar profundamente.",
      imagem: "../../../assets/imagem/hydragloss-labios-calme.jpg"
    },
    {
    id: "carboxiterapia",
    nome: "Carboxiterapia Olheiras",
    preco: "R$ 250,00 – R$ 1.050,00",
    descricao: "Este procedimento ajuda a clarear a pele ao redor dos olhos e combater as olheiras inchadas, aquelas pequenas “bolsas” que podem surgir abaixo dos olhos. Recupere a luminosidade do seu olhar e livre-se das olheiras indesejadas com a carboxiterapia.",
    imagem: "../../../assets/imagem/Carboxiterapia-olheiras.webp"
    },
    {
       id: "blefaroplastia",
       nome: "Blefaroplastia com Plasma",
       preco: "R$ 400,00 – R$ 2.850,00",
       descricao: "A blefaroplastia com plasma é uma versão não invasiva da cirurgia para lifting de pálpebras. Indicada para remoção do excesso de pele e tratamento de rugas ao redor dos olhos.",
       imagem:"../../../assets/imagem/blefaroplastia.jpg"
    },
    {
       id: "hrejuvenecimento",
       nome:"Rejuvenescimento com Jato de Plasma Full Face",
        preco: "R$ 600,00 – R$ 3.850,00",
        descricao: "O jato de plasma é um tratamento estético que pode ser usado para tratamento de rugas, linhas de expressão, manchas escuras na pele, cicatrizes e principalmente flacidez de pálpebras. Esse tratamento aumenta a produção de colágeno e fibras elásticas conferindo mais firmeza à pele.",
        imagem: "../../../assets/imagem/Rejuvenecimento-com-Jato-de-plasma-Full-face.png"
    },
     {   id: "detoxfacial",
        nome: "Detox Facial",
        preco: "R$ 130,00 – R$ 500,00",
        descricao: "O Detox Facial é um tratamento estético que visa limpar profundamente a pele, removendo impurezas e toxinas acumuladas. Ele ajuda a revitalizar a pele, proporcionando uma aparência mais saudável e radiante.",
        imagem: "../../../assets/imagem/DETOX-FACIAL.webp"
      },
      {
         id: "peelingquimico",
         nome: "Peeling Químico Descamativo",
        preco: "R$ 350,00 – R$ 1.250,00",
        descricao: "O peeling químico é um tratamento estético que utiliza substâncias químicas para esfoliar a pele, removendo as camadas superficiais e promovendo a regeneração celular. Ele é eficaz no tratamento de manchas, rugas e acne.",
        imagem: "../../../assets/imagem/peeling-quimico-descamativo.webp"
      },
      {
        id: "hidratacaoprofunda",
        nome: "Hidratação Profunda com Peeling de Diamante",
        preco: "R$ 120,00 – R$ 500,00",
        descricao: "A hidratação profunda com peeling de diamante é um tratamento estético que combina a esfoliação suave da pele com a aplicação de produtos hidratantes. Ele ajuda a remover células mortas, melhorar a textura da pele e proporcionar uma hidratação intensa.",
        imagem: "../../../assets/imagem/hidratacao-profunda-com-peeling-de-diamante.webp"
      },


    
    //..adicionar mais tratamentos conforme necessário
  ];
  constructor(private Route: ActivatedRoute){}

  ngOnInit(): void {
    const id = this.Route.snapshot.paramMap.get('id');
    this.tratamentoSelecionado = this.tratamento.find((t) => t.id === id) || this.tratamento [0];
    const encontrado = this.tratamento.find(t => t.id === id);

  }

adicionarAoCarrinho(){
  console.log('Adicionado: ' + this.tratamentoSelecionado.nome+ 'Sessões: ' + this.sessoes);


}
}

