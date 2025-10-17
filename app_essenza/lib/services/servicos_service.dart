import 'dart:convert';
import '../models/servico.dart';
import 'api_service.dart';

class ServicosService {
  static Future<List<Servico>> getServicos({
    int page = 1,
    int limit = 20,
    String? categoria,
  }) async {
    try {
      String endpoint = '/servico?page=$page&limit=$limit';
      if (categoria != null) {
        endpoint += '&categoria=$categoria';
      }
      
      final response = await ApiService.get(endpoint);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> servicosJson = data['data'] ?? [];
        return servicosJson.map((json) => Servico.fromJson(json)).toList();
      } else {
        throw Exception('Erro ao carregar serviços');
      }
    } catch (e) {
      throw Exception('Erro de conexão: $e');
    }
  }

  static Future<Servico?> getServico(int id) async {
    try {
      final response = await ApiService.get('/servico/$id');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Servico.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  static Future<List<String>> getCategorias() async {
    try {
      final response = await ApiService.get('/servicos/categorias');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<String>.from(data);
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }

  static String formatPrice(double price) {
    return 'R\$ ${price.toStringAsFixed(2).replaceAll('.', ',')}';
  }

  static String formatDuration(int minutes) {
    final hours = minutes ~/ 60;
    final remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return remainingMinutes > 0 ? '${hours}h ${remainingMinutes}min' : '${hours}h';
    }
    return '${remainingMinutes}min';
  }
}
