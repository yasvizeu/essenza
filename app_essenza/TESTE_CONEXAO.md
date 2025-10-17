# Teste de Conexão - Flutter com Backend

## Status da Conexão

### ✅ Backend (NestJS)
- **URL:** http://localhost:3000
- **Status:** Funcionando
- **Teste de Login:** ✅ Sucesso

### 🔧 Flutter App
- **URL Configurada:** http://10.0.2.2:3000 (para emulador Android)
- **Status:** Em execução
- **Logs:** Adicionados para debug

## Credenciais de Teste
```
Email: cliente@teste.com
Senha: 123456
```

## Como Testar
1. Execute o backend: `cd back_essenza && npm run start:dev`
2. Execute o Flutter: `cd app_essenza && flutter run`
3. Use as credenciais acima
4. Verifique os logs no console do Flutter

## Logs Esperados
```
🔍 Flutter - Tentando login com email: cliente@teste.com
🔍 Flutter - URL: http://10.0.2.2:3000/auth/login
🔍 Flutter - Status Code: 201
🔍 Flutter - Response Body: {"access_token":"...","refresh_token":"...","user":{...}}
🔍 Flutter - Dados recebidos: {...}
🔍 Flutter - Dados salvos com sucesso
```

## Possíveis Problemas
1. **Emulador não consegue acessar localhost** - Use 10.0.2.2:3000
2. **Backend não está rodando** - Verifique se está na porta 3000
3. **CORS** - Backend já configurado para aceitar requisições
4. **Firewall** - Pode estar bloqueando a conexão

## URLs Testadas
- ✅ POST /auth/login - Login de cliente
- ✅ GET /servico - Lista de serviços
- ✅ POST /auth/register - Registro de usuário
