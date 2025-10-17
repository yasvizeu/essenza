class AppConfig {
  // URLs da API
  static const String apiBaseUrl = 'http://127.0.0.1:3000'; // Para web e local
  
  // Configurações de desenvolvimento
  static const bool debugMode = true;
  
  // Timeouts
  static const int connectTimeout = 30000; // 30 segundos
  static const int receiveTimeout = 30000; // 30 segundos
  
  // Chaves de armazenamento local
  static const String tokenKey = 'essenza_access_token';
  static const String refreshTokenKey = 'essenza_refresh_token';
  static const String userKey = 'essenza_user';
}
