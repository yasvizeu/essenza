# Sistema de Estoque - Essenza

## 🎯 Visão Geral

Sistema completo de gestão de estoque para clínicas de estética, permitindo que profissionais administradores gerenciem produtos, controlem quantidades e visualizem estatísticas em tempo real.

## ✨ Funcionalidades Principais

### 📊 Dashboard de Estatísticas
- **Total de Produtos**: Contagem geral de produtos cadastrados
- **Produtos Ativos**: Quantidade de produtos disponíveis
- **Baixo Estoque**: Alertas para produtos com estoque crítico
- **Valor Total**: Valor monetário total do estoque

### 🛍️ Gestão de Produtos
- **Cadastro Completo**: Nome, descrição, categoria, preços, quantidades
- **Categorias**: Limpeza, Tratamento, Maquiagem, Proteção, Hidratação, Outros
- **Imagens**: Suporte para URLs de imagens dos produtos
- **Código de Barras**: Campo opcional para identificação
- **Fornecedor**: Rastreamento de origem dos produtos
- **Lote e Validade**: Controle de qualidade e datas

### 📦 Controle de Estoque
- **Adicionar Estoque**: Incrementar quantidades existentes
- **Remover Estoque**: Decrementar quantidades (com validação)
- **Ajustar Estoque**: Definir quantidade específica
- **Quantidade Mínima**: Alertas automáticos para reabastecimento

### 🔍 Filtros e Busca
- **Busca por Nome**: Pesquisa textual em produtos
- **Filtro por Categoria**: Visualização organizada por tipo
- **Paginação**: Navegação eficiente em grandes volumes
- **Ordenação**: Produtos organizados alfabeticamente

### ⚠️ Alertas Inteligentes
- **Estoque Baixo**: Produtos abaixo da quantidade mínima
- **Vencimento**: Produtos próximos da data de validade
- **Status Visual**: Cores e badges para diferentes situações

## 🏗️ Arquitetura

### Backend (NestJS)
```
src/produto/
├── entities/
│   └── produto.entity.ts          # Entidade do banco de dados
├── dto/
│   ├── create-produto.dto.ts      # Validação de criação
│   └── update-produto.dto.ts      # Validação de atualização
├── produto.service.ts              # Lógica de negócio
├── produto.controller.ts           # Endpoints da API
└── produto.module.ts               # Módulo NestJS
```

### Frontend (Angular)
```
src/app/components/estoque/
├── estoque.ts                     # Componente principal
├── estoque.html                   # Template HTML
├── estoque.scss                   # Estilos CSS
├── estoque-module.ts              # Módulo Angular
└── estoque.spec.ts                # Testes unitários
```

## 🚀 Como Usar

### 1. Acessar o Sistema
- Navegue para `/estoque` na aplicação
- Apenas profissionais administradores têm acesso

### 2. Cadastrar Novo Produto
1. Clique em "Novo Produto"
2. Preencha todos os campos obrigatórios (*)
3. Defina quantidade inicial e mínima
4. Clique em "Cadastrar"

### 3. Gerenciar Estoque
1. Na tabela, clique no ícone 📦 (estoque)
2. Escolha a operação: Adicionar, Remover ou Ajustar
3. Informe a quantidade
4. Execute a operação

### 4. Editar Produto
1. Clique no ícone ✏️ (editar)
2. Modifique os campos desejados
3. Clique em "Atualizar"

### 5. Excluir Produto
1. Clique no ícone 🗑️ (excluir)
2. Confirme a exclusão

## 📋 Campos do Produto

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Nome | string | ✅ | Nome do produto |
| Descrição | text | ✅ | Descrição detalhada |
| Categoria | select | ✅ | Tipo de produto |
| Preço de Venda | decimal | ✅ | Preço para o cliente |
| Preço de Custo | decimal | ❌ | Custo de aquisição |
| Quantidade | integer | ✅ | Quantidade em estoque |
| Quantidade Mínima | integer | ✅ | Alerta de estoque baixo |
| Unidade | select | ✅ | ml, g, unidades, etc. |
| Código de Barras | string | ❌ | Identificação do produto |
| Fornecedor | string | ❌ | Nome do fornecedor |
| Data de Validade | date | ❌ | Data de vencimento |
| Lote | string | ❌ | Número do lote |
| Imagem | URL | ❌ | Link da imagem |

## 🔌 Endpoints da API

### Produtos
- `GET /produtos` - Listar todos os produtos
- `GET /produtos/:id` - Buscar produto por ID
- `POST /produtos` - Criar novo produto
- `PATCH /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Excluir produto

### Estoque
- `POST /produtos/:id/adicionar-estoque` - Adicionar quantidade
- `POST /produtos/:id/remover-estoque` - Remover quantidade
- `PATCH /produtos/:id/ajustar-estoque` - Ajustar quantidade

### Relatórios
- `GET /produtos/baixo-estoque` - Produtos com estoque baixo
- `GET /produtos/vencendo?dias=30` - Produtos próximos do vencimento
- `GET /produtos/inativos` - Produtos desativados
- `GET /produtos/estatisticas` - Estatísticas gerais
- `GET /produtos/buscar?termo=texto` - Busca por termo

## 🎨 Interface e Design

### Características Visuais
- **Design Responsivo**: Funciona em todos os dispositivos
- **Tema Moderno**: Gradientes e sombras elegantes
- **Animações Suaves**: Transições e efeitos visuais
- **Cores Semânticas**: Verde para sucesso, vermelho para alertas
- **Ícones Intuitivos**: Bootstrap Icons para melhor UX

### Componentes
- **Cards de Estatísticas**: Dashboard visual com métricas
- **Tabela Interativa**: Hover effects e ações contextuais
- **Modais Responsivos**: Formulários organizados e intuitivos
- **Filtros Dinâmicos**: Busca e categorização eficientes
- **Paginação Elegante**: Navegação fluida entre páginas

## 🔒 Segurança e Validações

### Validações Frontend
- Campos obrigatórios marcados com *
- Validação de tipos de dados
- Verificação de quantidades mínimas
- Formatação automática de preços

### Validações Backend
- Validação de entrada com class-validator
- Verificação de integridade referencial
- Controle de acesso por tipo de usuário
- Sanitização de dados de entrada

## 📱 Responsividade

### Breakpoints
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Adaptação para telas médias
- **Mobile**: Layout otimizado para dispositivos móveis

### Adaptações Mobile
- Cards de estatísticas empilhados
- Tabela com scroll horizontal
- Botões de ação reorganizados
- Modais com margens ajustadas

## 🚀 Próximas Funcionalidades

### Planejadas
1. **Notificações Push**: Alertas em tempo real
2. **Relatórios PDF**: Exportação de relatórios
3. **Integração com Fornecedores**: Pedidos automáticos
4. **Histórico de Movimentações**: Rastreamento completo
5. **Dashboard Avançado**: Gráficos e métricas

### Melhorias Técnicas
1. **Cache Redis**: Performance otimizada
2. **WebSockets**: Atualizações em tempo real
3. **Upload de Imagens**: Gerenciamento de arquivos
4. **API de Terceiros**: Integração com sistemas externos

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js
- **TypeORM**: ORM para banco de dados
- **MySQL**: Banco de dados relacional
- **Class-validator**: Validação de dados

### Frontend
- **Angular 17**: Framework frontend
- **Bootstrap 5**: Framework CSS
- **SCSS**: Pré-processador CSS
- **Bootstrap Icons**: Biblioteca de ícones

## 📖 Como Contribuir

### Desenvolvimento
1. Clone o repositório
2. Instale as dependências (`npm install`)
3. Configure o banco de dados
4. Execute o projeto (`npm run start:dev`)

### Testes
1. Execute testes unitários (`npm run test`)
2. Execute testes e2e (`npm run test:e2e`)
3. Verifique cobertura de código

### Deploy
1. Build da aplicação (`npm run build`)
2. Configuração de variáveis de ambiente
3. Deploy no servidor de produção

## 🆘 Suporte

### Documentação
- [NestJS Documentation](https://docs.nestjs.com/)
- [Angular Documentation](https://angular.io/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)

### Contato
Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação técnica
- Entre em contato com a equipe de desenvolvimento

---

**Sistema de Estoque Essenza** - Gestão inteligente para clínicas de estética 🎯
