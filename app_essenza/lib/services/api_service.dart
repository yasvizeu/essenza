import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_config.dart';

class ApiService {
  static const String baseUrl = AppConfig.apiBaseUrl;
  static const String tokenKey = AppConfig.tokenKey;
  static const String refreshTokenKey = AppConfig.refreshTokenKey;
  static const String userKey = AppConfig.userKey;

  static Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(tokenKey);
    
    final headers = {
      'Content-Type': 'application/json',
    };
    
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }

  static Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
    
    if (response.statusCode == 401) {
      // Token expirado, tentar refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        final newHeaders = await _getHeaders();
        return await http.get(
          Uri.parse('$baseUrl$endpoint'),
          headers: newHeaders,
        );
      }
    }
    
    return response;
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
    
    if (response.statusCode == 401) {
      // Token expirado, tentar refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        final newHeaders = await _getHeaders();
        return await http.post(
          Uri.parse('$baseUrl$endpoint'),
          headers: newHeaders,
          body: jsonEncode(body),
        );
      }
    }
    
    return response;
  }

  static Future<http.Response> put(String endpoint, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    final response = await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    );
    
    if (response.statusCode == 401) {
      // Token expirado, tentar refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        final newHeaders = await _getHeaders();
        return await http.put(
          Uri.parse('$baseUrl$endpoint'),
          headers: newHeaders,
          body: jsonEncode(body),
        );
      }
    }
    
    return response;
  }

  static Future<http.Response> delete(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );
    
    if (response.statusCode == 401) {
      // Token expirado, tentar refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        final newHeaders = await _getHeaders();
        return await http.delete(
          Uri.parse('$baseUrl$endpoint'),
          headers: newHeaders,
        );
      }
    }
    
    return response;
  }

  static Future<bool> _refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString(refreshTokenKey);
      
      if (refreshToken == null) return false;
      
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await prefs.setString(tokenKey, data['token']);
        return true;
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  static Future<void> saveAuthData(String accessToken, String refreshToken, Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, accessToken);
    await prefs.setString(refreshTokenKey, refreshToken);
    await prefs.setString(userKey, jsonEncode(user));
  }

  static Future<void> clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    await prefs.remove(refreshTokenKey);
    await prefs.remove(userKey);
  }

  static Future<String?> getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  static Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(userKey);
    if (userJson != null) {
      return jsonDecode(userJson);
    }
    return null;
  }

  static Future<bool> isAuthenticated() async {
    final token = await getAccessToken();
    final user = await getCurrentUser();
    return token != null && user != null;
  }
}
