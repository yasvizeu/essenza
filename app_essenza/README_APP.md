# Essenza - App Mobile

## 📱 Sobre o App

O **Essenza** é um aplicativo mobile para clientes da clínica de estética, desenvolvido em Flutter. O app permite que os clientes façam login e visualizem suas informações pessoais, agendamentos e serviços disponíveis.

## 🎯 Funcionalidades

### ✅ **Login de Cliente**
- Login seguro com email e senha
- Integração com o mesmo banco de dados do backend
- Validação de credenciais em tempo real

### ✅ **Visualização de Dados**
- **Perfil do Cliente:** Informações pessoais e ficha de anamnese
- **Agendamentos:** Lista de agendamentos confirmados e futuros
- **Serviços:** Catálogo completo de serviços da clínica

### ✅ **Design Moderno**
- Interface limpa e intuitiva
- Cores da marca (verde #28a745)
- Experiência de usuário otimizada

## 🔧 Configuração Técnica

### **Backend Integration**
- **URL:** `http://10.0.2.2:3000` (emulador Android)
- **Banco:** MySQL (mesmo do frontend Angular)
- **APIs:** NestJS com JWT authentication

### **Arquitetura**
- **State Management:** Provider
- **HTTP Client:** http package
- **Local Storage:** SharedPreferences
- **Navigation:** Material Navigation

## 🚀 Como Executar

### **1. Backend (NestJS)**
```bash
cd back_essenza
npm install
npm run start:dev
```

### **2. Flutter App**
```bash
cd app_essenza
flutter pub get
flutter run
```

## 📋 Credenciais de Teste

```
Email: cliente@teste.com
Senha: 123456
```

## 🗄️ Banco de Dados

O app usa o **mesmo banco de dados** do frontend Angular:
- **MySQL** com TypeORM
- **Tabelas:** clientes, agendamentos, servicos, ficha_anamnese
- **Autenticação:** JWT com refresh tokens

## 📱 Telas do App

### **1. Login Screen**
- Interface moderna com gradiente
- Campos de email e senha
- Informação sobre cadastro pelo site

### **2. Home Screen**
- Dashboard com próximos agendamentos
- Serviços recomendados
- Navegação por abas

### **3. Serviços Screen**
- Lista completa de serviços
- Filtros por categoria
- Detalhes de cada serviço

### **4. Agendamentos Screen**
- Lista de agendamentos do cliente
- Status dos agendamentos
- Informações detalhadas

### **5. Perfil Screen**
- Dados pessoais do cliente
- Ficha de anamnese
- Estatísticas de agendamentos

## 🔐 Segurança

- **JWT Authentication** com refresh tokens
- **Validação** de dados no frontend e backend
- **CORS** configurado para desenvolvimento
- **Armazenamento seguro** de tokens

## 📊 APIs Utilizadas

- `POST /auth/login` - Login de cliente
- `GET /servico` - Lista de serviços
- `GET /agendamentos/cliente/:id` - Agendamentos do cliente
- `GET /auth/profile` - Perfil do usuário
- `GET /ficha-anamnese/:id` - Ficha de anamnese

## 🎨 Design System

### **Cores**
- **Primária:** #28a745 (Verde)
- **Secundária:** #20c997 (Verde claro)
- **Background:** #f8f9fa (Cinza claro)
- **Texto:** #212529 (Preto)

### **Componentes**
- Cards com sombra e bordas arredondadas
- Botões com gradiente verde
- Inputs com validação visual
- Loading states e feedback

## 📝 Notas Importantes

1. **Cadastro:** Os clientes se cadastram pelo site, não pelo app
2. **Banco Único:** App e site usam o mesmo banco de dados
3. **Emulador:** Use `10.0.2.2:3000` para acessar localhost
4. **Logs:** Logs de debug habilitados para desenvolvimento

## 🐛 Troubleshooting

### **Erro de Conexão**
- Verifique se o backend está rodando na porta 3000
- Confirme se o emulador está usando `10.0.2.2:3000`

### **Login Falha**
- Verifique as credenciais de teste
- Confirme se o usuário existe no banco
- Verifique os logs no console

### **Dados Não Carregam**
- Verifique a conexão com o backend
- Confirme se as APIs estão funcionando
- Verifique os logs de erro
