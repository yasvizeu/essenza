import 'dart:convert';
import '../models/ficha_anamnese.dart';
import 'api_service.dart';

class FichaAnamneseService {
  static Future<FichaAnamnese?> getFichaAnamnese(int clienteId) async {
    try {
      final response = await ApiService.get('/ficha-anamnese/cliente/$clienteId');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return FichaAnamnese.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  static Future<Map<String, dynamic>> criarFichaAnamnese({
    required int clienteId,
    required String healthProblems,
    required String medications,
    required String allergies,
    required String surgeries,
    required String lifestyle,
  }) async {
    try {
      final response = await ApiService.post('/ficha-anamnese', {
        'clienteId': clienteId,
        'healthProblems': healthProblems,
        'medications': medications,
        'allergies': allergies,
        'surgeries': surgeries,
        'lifestyle': lifestyle,
      });
      
      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'fichaAnamnese': FichaAnamnese.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao criar ficha de anamnese',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> atualizarFichaAnamnese(
    int id, {
    required String healthProblems,
    required String medications,
    required String allergies,
    required String surgeries,
    required String lifestyle,
  }) async {
    try {
      final response = await ApiService.put('/ficha-anamnese/$id', {
        'healthProblems': healthProblems,
        'medications': medications,
        'allergies': allergies,
        'surgeries': surgeries,
        'lifestyle': lifestyle,
      });
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'fichaAnamnese': FichaAnamnese.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao atualizar ficha de anamnese',
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
