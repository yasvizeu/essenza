# Essenza - App Mobile

App Flutter para clientes da clínica de estética Essenza, desenvolvido para integração com o sistema de gestão existente.

## Funcionalidades

### 🔐 Autenticação
- Login para clientes e profissionais
- Gerenciamento de sessão com JWT
- Refresh token automático

### 🏠 Home
- Dashboard personalizado para clientes
- Próximos agendamentos
- Serviços recomendados
- Navegação intuitiva

### 🧴 Serviços
- Lista completa de serviços da clínica
- Filtros por categoria
- Busca de serviços
- Paginação
- Detalhes e preços

### 📅 Agendamentos
- Visualização de agendamentos por período
- Próximos agendamentos
- Agendamentos de hoje
- Histórico de agendamentos
- Status de pagamento

### 👤 Perfil
- Informações pessoais
- Estatísticas de uso
- Ficha de anamnese
- Configurações de conta

## Estrutura do Projeto

```
lib/
├── models/           # Modelos de dados
│   ├── user.dart
│   ├── servico.dart
│   ├── agendamento.dart
│   └── ficha_anamnese.dart
├── services/         # Serviços de API
│   ├── api_service.dart
│   ├── auth_service.dart
│   ├── servicos_service.dart
│   ├── agendamentos_service.dart
│   └── ficha_anamnese_service.dart
├── providers/        # Gerenciamento de estado
│   ├── auth_provider.dart
│   ├── servicos_provider.dart
│   └── agendamentos_provider.dart
├── screens/          # Telas do app
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── servicos_screen.dart
│   ├── agendamentos_screen.dart
│   └── perfil_screen.dart
├── widgets/          # Componentes reutilizáveis
│   ├── custom_text_field.dart
│   ├── loading_button.dart
│   ├── agendamento_card.dart
│   └── servico_card.dart
└── main.dart         # Ponto de entrada
```

## Tecnologias Utilizadas

- **Flutter** 3.9.2+
- **Provider** - Gerenciamento de estado
- **HTTP** - Requisições à API
- **SharedPreferences** - Armazenamento local
- **CachedNetworkImage** - Cache de imagens
- **Intl** - Formatação de datas

## Configuração

### 1. Instalar dependências
```bash
flutter pub get
```

### 2. Configurar backend
Certifique-se de que o backend NestJS está rodando na porta 3000:
```bash
cd back_essenza
npm install
npm run start:dev
```

### 3. Executar o app
```bash
flutter run
```

## API Endpoints

O app se conecta com os seguintes endpoints do backend:

### Autenticação
- `POST /auth/login` - Login de cliente
- `POST /auth/login-profissional` - Login de profissional
- `POST /auth/register` - Registro de usuário
- `POST /auth/refresh` - Renovar token

### Serviços
- `GET /servicos` - Listar serviços
- `GET /servicos/:id` - Detalhes do serviço
- `GET /servicos/categorias` - Listar categorias

### Agendamentos
- `GET /agendamentos/cliente/:id` - Agendamentos do cliente
- `GET /agendamentos/servicos-pagos/:id` - Serviços pagos não agendados
- `POST /agendamentos` - Criar agendamento
- `PUT /agendamentos/:id` - Atualizar agendamento
- `POST /agendamentos/:id/cancelar` - Cancelar agendamento
- `POST /agendamentos/:id/confirmar` - Confirmar agendamento

### Ficha de Anamnese
- `GET /ficha-anamnese/cliente/:id` - Buscar ficha
- `POST /ficha-anamnese` - Criar ficha
- `PUT /ficha-anamnese/:id` - Atualizar ficha

## Design System

### Cores
- **Primária**: Verde (#4CAF50)
- **Secundária**: Verde claro (#E8F5E8)
- **Texto**: Preto (#212121)
- **Cinza**: #757575

### Componentes
- Cards com sombra sutil
- Botões arredondados
- Campos de texto com bordas verdes
- Ícones Material Design

## Funcionalidades Futuras

- [ ] Notificações push
- [ ] Agendamento online
- [ ] Pagamento integrado
- [ ] Chat com profissionais
- [ ] Avaliações e comentários
- [ ] Programa de fidelidade

## Desenvolvimento

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
```

### Padrões de Código
- Nomenclatura em inglês para arquivos e variáveis
- Comentários em português
- Widgets reutilizáveis
- Separação de responsabilidades
- Tratamento de erros consistente

## Licença

Este projeto é propriedade da Essenza Clínica de Estética.