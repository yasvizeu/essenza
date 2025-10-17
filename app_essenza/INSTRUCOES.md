# Instruções de Instalação e Execução

## Pré-requisitos

1. **Flutter SDK** (versão 3.9.2 ou superior)
   - Baixe em: https://flutter.dev/docs/get-started/install
   - Configure o PATH do Flutter

2. **Android Studio** ou **VS Code** com extensão Flutter
   - Para desenvolvimento Android/iOS

3. **Backend Essenza** rodando
   - Certifique-se de que o backend NestJS está executando na porta 3000

## Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd essenza/app_essenza
```

### 2. Instale as dependências
```bash
flutter pub get
```

### 3. Verifique a configuração
- Abra `lib/config/app_config.dart`
- Confirme que `apiBaseUrl` está apontando para o backend correto

## Execução

### 1. Inicie o backend
```bash
cd ../back_essenza
npm install
npm run start:dev
```

### 2. Execute o app Flutter
```bash
cd ../app_essenza
flutter run
```

### 3. Para Android
```bash
flutter run -d android
```

### 4. Para iOS (apenas no macOS)
```bash
flutter run -d ios
```

## Configuração do Emulador/Dispositivo

### Android
1. Abra o Android Studio
2. Vá em Tools > AVD Manager
3. Crie um novo emulador Android
4. Inicie o emulador

### iOS (apenas no macOS)
1. Abra o Xcode
2. Configure um simulador iOS
3. Inicie o simulador

## Testando o App

### 1. Login
- Use as credenciais de um cliente existente no backend
- Ou crie uma nova conta através do frontend Angular

### 2. Funcionalidades
- **Home**: Visualize próximos agendamentos e serviços
- **Serviços**: Explore todos os serviços disponíveis
- **Agendamentos**: Veja seus agendamentos por período
- **Perfil**: Acesse suas informações e ficha de anamnese

## Solução de Problemas

### Erro de Conexão com API
- Verifique se o backend está rodando na porta 3000
- Confirme a URL em `lib/config/app_config.dart`
- Teste a API no navegador: http://localhost:3000

### Erro de Dependências
```bash
flutter clean
flutter pub get
```

### Erro de Build
```bash
flutter clean
flutter pub get
flutter run
```

### Problemas de Emulador
- Reinicie o emulador
- Verifique se o ADB está funcionando (Android)
- Para iOS, verifique o Xcode

## Estrutura de Desenvolvimento

### Adicionando Novas Telas
1. Crie o arquivo em `lib/screens/`
2. Adicione a navegação em `lib/main.dart`
3. Implemente os providers necessários

### Adicionando Novos Serviços
1. Crie o arquivo em `lib/services/`
2. Implemente os métodos de API
3. Crie o provider correspondente

### Modificando Modelos
1. Atualize o modelo em `lib/models/`
2. Atualize os serviços que usam o modelo
3. Atualize os providers

## Comandos Úteis

```bash
# Limpar cache
flutter clean

# Atualizar dependências
flutter pub upgrade

# Verificar problemas
flutter doctor

# Executar testes
flutter test

# Build para release
flutter build apk --release
flutter build ios --release
```

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Flutter
2. Consulte a documentação do Flutter
3. Verifique se o backend está funcionando
4. Entre em contato com a equipe de desenvolvimento
