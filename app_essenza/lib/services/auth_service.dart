import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../config/app_config.dart';
import 'api_service.dart';

class AuthService {
  static const String baseUrl = AppConfig.apiBaseUrl;

  static Future<Map<String, dynamic>> loginCliente({
    required String email,
    required String senha,
  }) async {
    try {
      print('🔍 Flutter - Tentando login com email: $email');
      print('🔍 Flutter - URL: $baseUrl/auth/login');
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'senha': senha,
          'userType': 'cliente',
        }),
      );

      print('🔍 Flutter - Status Code: ${response.statusCode}');
      print('🔍 Flutter - Response Body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        
        print('🔍 Flutter - Dados recebidos: $data');
        
        // Salvar dados de autenticação
        await ApiService.saveAuthData(
          data['access_token'],
          data['refresh_token'],
          data['user'],
        );
        
        print('🔍 Flutter - Dados salvos com sucesso');
        
        return {
          'success': true,
          'user': User.fromJson(data['user']),
          'access_token': data['access_token'],
          'refresh_token': data['refresh_token'],
        };
      } else {
        final error = jsonDecode(response.body);
        print('🔍 Flutter - Erro: ${error['message']}');
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao fazer login',
        };
      }
    } catch (e) {
      print('🔍 Flutter - Exceção: $e');
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> loginProfissional({
    required String email,
    required String senha,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login-profissional'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'senha': senha,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        
        // Salvar dados de autenticação
        await ApiService.saveAuthData(
          data['access_token'],
          data['refresh_token'],
          data['user'],
        );
        
        return {
          'success': true,
          'user': User.fromJson(data['user']),
          'access_token': data['access_token'],
          'refresh_token': data['refresh_token'],
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao fazer login',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> register({
    required String email,
    required String nome,
    required String senha,
    required String tipo,
    required String cpf,
    String? birthDate,
    String? cell,
    String? address,
    String? especialidade,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'nome': nome,
          'senha': senha,
          'tipo': tipo,
          'cpf': cpf,
          'birthDate': birthDate,
          'cell': cell,
          'address': address,
          'especialidade': especialidade,
        }),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        
        // Salvar dados de autenticação
        await ApiService.saveAuthData(
          data['access_token'],
          data['refresh_token'],
          data['user'],
        );
        
        return {
          'success': true,
          'user': User.fromJson(data['user']),
          'access_token': data['access_token'],
          'refresh_token': data['refresh_token'],
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao criar conta',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<void> logout() async {
    await ApiService.clearAuthData();
  }

  static Future<User?> getCurrentUser() async {
    final userData = await ApiService.getCurrentUser();
    if (userData != null) {
      return User.fromJson(userData);
    }
    return null;
  }

  static Future<bool> isAuthenticated() async {
    return await ApiService.isAuthenticated();
  }

  static Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await ApiService.get('/auth/profile');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'user': User.fromJson(data),
        };
      } else {
        return {
          'success': false,
          'message': 'Erro ao buscar perfil',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> updates) async {
    try {
      final response = await ApiService.put('/auth/profile', updates);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'user': User.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao atualizar perfil',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }
}
