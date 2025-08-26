# Sistema de Login de Cliente - Essenza

## Visão Geral

Este documento descreve o sistema de login de cliente implementado no projeto Essenza, incluindo as funcionalidades existentes e as melhorias adicionadas para integração com o sistema de profissionais.

## Funcionalidades do Login de Cliente

### 1. Interface de Login

**Arquivo:** `src/app/components/login/`

#### Características da Interface:
- **Design Glassmorphism:** Efeito de vidro translúcido consistente com o projeto
- **Fundo com Imagem:** Imagem de folhas como background
- **Responsivo:** Adaptável a diferentes tamanhos de tela
- **Acessível:** Labels, placeholders e feedback visual

#### Elementos da Interface:
- Logo da Essenza em formato circular
- Título dinâmico ("Login Cliente" / "Login Profissional")
- Toggle para alternar entre Cliente e Profissional
- Campos de e-mail e senha
- Botão de mostrar/ocultar senha
- Links para recuperação de senha e registro

### 2. Validações Implementadas

#### Validações de E-mail:
- Campo obrigatório
- Formato de e-mail válido
- Feedback visual em tempo real

#### Validações de Senha:
- Campo obrigatório
- Botão para mostrar/ocultar senha
- Ícone do olho que alterna conforme estado

### 3. Funcionalidades de Autenticação

#### Processo de Login:
1. **Seleção do Tipo de Usuário:**
   - Toggle entre "Cliente" e "Profissional"
   - Interface visual que indica o tipo selecionado

2. **Validação de Formulário:**
   - Verificação de campos obrigatórios
   - Validação de formato de e-mail
   - Marcação visual de campos inválidos

3. **Autenticação com Backend:**
   - Chamada para endpoint `/personas/login`
   - Verificação de credenciais
   - Identificação automática do tipo de usuário

4. **Armazenamento de Sessão:**
   - Token de autenticação (mock)
   - Tipo de usuário (cliente/profissional)
   - Dados do usuário em JSON

5. **Redirecionamento:**
   - Baseado no tipo de usuário autenticado
   - Navegação para página apropriada

## Integração com Backend

### Endpoint de Autenticação:
- **URL:** `POST /personas/login`
- **Body:**
  ```json
  {
    "email": "cliente@exemplo.com",
    "senha": "senha123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "cliente@exemplo.com",
      "type": "cliente",
      // ... outros dados do usuário
    },
    "type": "cliente"
  }
  ```

### Fluxo de Autenticação:
1. Frontend envia credenciais
2. Backend busca usuário por e-mail
3. Verifica senha
4. Identifica tipo de usuário (cliente/profissional)
5. Retorna dados do usuário autenticado

## Componentes Técnicos

### 1. Componente TypeScript (`login.ts`)

#### Propriedades:
- `loginForm`: FormGroup para dados de cliente
- `professionalForm`: FormGroup para dados de profissional
- `isProfissional`: Boolean para controlar tipo de usuário
- `showPassword`: Boolean para mostrar/ocultar senha

#### Métodos Principais:
- `ngOnInit()`: Inicialização dos formulários
- `onSubmit()`: Processamento do login
- `togglePassword()`: Alternar visibilidade da senha
- `ngAfterViewInit()`: Foco automático no campo de e-mail

### 2. Template HTML (`login.html`)

#### Estrutura:
- Container principal com background
- Overlay para efeito de transparência
- Card de login com efeito glassmorphism
- Formulário reativo com validações
- Toggle para seleção de tipo de usuário
- Links de navegação

### 3. Estilos SCSS (`login.scss`)

#### Características Visuais:
- **Background:** Imagem de folhas com overlay
- **Card:** Efeito glassmorphism com blur
- **Campos:** Estilo translúcido com foco verde
- **Botões:** Hover effects e transições suaves
- **Links:** Estilo consistente com hover

## Navegação e Links

### Links Disponíveis:
- **"Esqueceu a senha?"** - Link para recuperação (a implementar)
- **"Criar conta cliente"** - Navega para `/register`
- **"Criar conta profissional"** - Navega para `/professional-register`

### Rotas Relacionadas:
- `/login` - Página de login
- `/register` - Registro de cliente
- `/professional-register` - Registro de profissional
- `/home` - Página inicial após login

## Segurança

### Implementado:
- Validação de dados no frontend
- Validação de dados no backend
- Armazenamento seguro de dados de sessão
- Verificação de credenciais

### Recomendações para Produção:
- Implementar hash de senhas (bcrypt)
- Implementar JWT tokens
- Implementar refresh tokens
- Implementar rate limiting
- Implementar HTTPS
- Implementar logout automático
- Implementar recuperação de senha

## Experiência do Usuário (UX)

### Pontos Positivos:
- **Interface Intuitiva:** Design limpo e fácil de usar
- **Feedback Visual:** Validações em tempo real
- **Responsividade:** Funciona em diferentes dispositivos
- **Acessibilidade:** Labels e placeholders adequados
- **Performance:** Carregamento rápido e suave

### Melhorias Implementadas:
- Toggle visual para seleção de tipo de usuário
- Links diretos para registro de cliente e profissional
- Integração completa com sistema de autenticação
- Tratamento de erros com mensagens claras
- Foco automático no primeiro campo

## Fluxo de Uso

### 1. Acesso à Página:
1. Usuário acessa `/login`
2. Página carrega com foco no campo de e-mail
3. Interface mostra opção padrão "Cliente"

### 2. Seleção do Tipo de Usuário:
1. Usuário pode alternar entre "Cliente" e "Profissional"
2. Interface atualiza visualmente
3. Formulário mantém dados preenchidos

### 3. Preenchimento de Credenciais:
1. Usuário digita e-mail
2. Validação em tempo real
3. Usuário digita senha
4. Opção de mostrar/ocultar senha

### 4. Submissão e Autenticação:
1. Usuário clica em "Entrar"
2. Validação de formulário
3. Chamada para backend
4. Processamento de resposta

### 5. Redirecionamento:
1. Sucesso: Redirecionamento para página apropriada
2. Erro: Mensagem de erro e permanência na página

## Tratamento de Erros

### Tipos de Erro:
- **Credenciais Inválidas:** E-mail ou senha incorretos
- **Campos Vazios:** Validação de campos obrigatórios
- **Formato Inválido:** E-mail em formato incorreto
- **Erro de Rede:** Problemas de conectividade

### Feedback ao Usuário:
- Mensagens de erro claras e específicas
- Validação visual nos campos
- Alertas para erros de autenticação
- Console logs para debugging

## Integração com Sistema de Profissionais

### Funcionalidades Compartilhadas:
- **Interface Unificada:** Mesma página para ambos os tipos
- **Autenticação Centralizada:** Endpoint único para login
- **Design Consistente:** Visual padronizado
- **Navegação Integrada:** Links para ambos os registros

### Diferenciadores:
- **Identificação Automática:** Backend identifica tipo de usuário
- **Redirecionamento Específico:** Cada tipo vai para sua área
- **Dados Específicos:** Informações específicas por tipo

## Próximas Melhorias

### Funcionalidades Planejadas:
1. **Recuperação de Senha:**
   - Formulário de recuperação
   - Envio de e-mail
   - Reset de senha

2. **Lembrar de Mim:**
   - Checkbox para manter sessão
   - Token de longa duração

3. **Login Social:**
   - Integração com Google
   - Integração com Facebook

4. **Validação Avançada:**
   - Captcha para segurança
   - Rate limiting no frontend

5. **Dashboard de Cliente:**
   - Página específica para clientes
   - Histórico de consultas
   - Perfil do usuário

## Tecnologias Utilizadas

### Frontend:
- **Angular 17:** Framework principal
- **TypeScript:** Linguagem de programação
- **Reactive Forms:** Validação de formulários
- **SCSS:** Estilização avançada
- **Bootstrap:** Componentes visuais

### Backend:
- **NestJS:** Framework do servidor
- **TypeORM:** ORM para banco de dados
- **MySQL:** Banco de dados
- **Class Validator:** Validação de dados

### Design:
- **Glassmorphism:** Efeito visual principal
- **CSS Grid/Flexbox:** Layout responsivo
- **Bootstrap Icons:** Ícones da interface

## Conclusão

O sistema de login de cliente do Essenza oferece uma experiência de usuário moderna e segura, com interface intuitiva e integração completa com o backend. O design glassmorphism mantém a consistência visual do projeto, enquanto as funcionalidades de validação e autenticação garantem a segurança e usabilidade do sistema.

A integração com o sistema de profissionais permite uma experiência unificada, onde usuários podem facilmente alternar entre os dois tipos de conta, mantendo a simplicidade da interface e a robustez da autenticação.
