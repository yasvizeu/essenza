# Página Home do Cliente - Essenza

## Visão Geral

A página home do cliente é uma interface personalizada que aparece quando um cliente está logado no sistema Essenza. Esta página oferece uma experiência completa e intuitiva para gerenciar agendamentos, visualizar histórico e explorar serviços.

## Funcionalidades

### 🏠 Dashboard Personalizado
- **Boas-vindas personalizadas**: Exibe o nome do cliente logado
- **Próximos agendamentos**: Lista os agendamentos confirmados e pendentes
- **Histórico recente**: Mostra os tratamentos realizados recentemente
- **Ações rápidas**: Botões para funcionalidades principais

### 📅 Gestão de Agendamentos
- Visualização de agendamentos próximos
- Status dos agendamentos (confirmado, pendente, concluído)
- Informações detalhadas (data, horário, profissional)
- Navegação para área completa de agendamentos

### 🛒 Carrinho de Compras
- Integração com o sistema de carrinho existente
- Contador de itens no carrinho
- Adição de serviços ao carrinho
- Modal lateral para detalhes do serviço

### ❤️ Serviços Favoritos
- Lista de serviços favoritos do cliente
- Acesso rápido aos tratamentos preferidos
- Visualização de todos os serviços disponíveis

### 🎨 Interface Moderna
- Design responsivo para todos os dispositivos
- Animações suaves e transições
- Cores e gradientes personalizados
- Ícones Bootstrap Icons

## Estrutura de Arquivos

```
cliente-home/
├── cliente-home.ts          # Lógica do componente
├── cliente-home.html        # Template HTML
├── cliente-home.scss        # Estilos personalizados
└── README.md               # Documentação
```

## Integração com o Sistema

### Autenticação
- Verifica se o usuário está autenticado
- Redireciona para login se não estiver logado
- Verifica se é um cliente (não profissional)

### Serviços Utilizados
- `AuthService`: Gerenciamento de autenticação
- `ServicosService`: Carregamento de serviços
- `CartService`: Gerenciamento do carrinho

### Rotas
- Rota: `/cliente-home`
- Redirecionamento automático após login de cliente
- Proteção de rota (requer autenticação)

## Responsividade

A página é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout em colunas com cards lado a lado
- **Tablet**: Layout adaptado com cards empilhados
- **Mobile**: Layout vertical otimizado para toque

## Estados da Interface

### Loading
- Spinners durante carregamento de dados
- Mensagens de feedback para o usuário

### Vazio
- Estados vazios com ícones e mensagens explicativas
- Call-to-actions para preencher dados

### Erro
- Tratamento de erros de carregamento
- Mensagens de erro amigáveis

## Personalização

### Cores
```scss
:root {
  --primary-gradient: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  --success-gradient: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  --card-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --card-shadow-hover: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
```

### Animações
- Fade in up para cards
- Hover effects com transform
- Transições suaves em todos os elementos

## Próximos Passos

### Funcionalidades Futuras
- [ ] Integração com API de agendamentos
- [ ] Sistema de favoritos persistente
- [ ] Notificações push
- [ ] Histórico detalhado de tratamentos
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade

### Melhorias Técnicas
- [ ] Lazy loading para imagens
- [ ] Cache de dados
- [ ] PWA capabilities
- [ ] Offline support

## Como Usar

1. **Login**: Faça login como cliente no sistema
2. **Redirecionamento**: Será automaticamente redirecionado para `/cliente-home`
3. **Navegação**: Use os botões de ação rápida para navegar
4. **Serviços**: Clique nos serviços para ver detalhes e adicionar ao carrinho
5. **Logout**: Use o menu dropdown no header para sair

## Dependências

- Angular 17+
- Bootstrap 5
- Bootstrap Icons
- RxJS
- Angular Router
- Angular Common

## Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.
