import 'dart:convert';
import '../models/agendamento.dart';
import 'api_service.dart';

class AgendamentosService {
  static Future<List<Agendamento>> getAgendamentosCliente(int clienteId) async {
    try {
      final response = await ApiService.get('/agendamentos/cliente/$clienteId');
      
      if (response.statusCode == 200) {
        final List<dynamic> agendamentosJson = jsonDecode(response.body);
        return agendamentosJson.map((json) => Agendamento.fromJson(json)).toList();
      } else {
        throw Exception('Erro ao carregar agendamentos');
      }
    } catch (e) {
      throw Exception('Erro de conexão: $e');
    }
  }

  static Future<List<Agendamento>> getServicosPagosNaoAgendados(int clienteId) async {
    try {
      final response = await ApiService.get('/agendamentos/servicos-pagos/$clienteId');
      
      if (response.statusCode == 200) {
        final List<dynamic> agendamentosJson = jsonDecode(response.body);
        return agendamentosJson.map((json) => Agendamento.fromJson(json)).toList();
      } else {
        throw Exception('Erro ao carregar serviços pagos');
      }
    } catch (e) {
      throw Exception('Erro de conexão: $e');
    }
  }

  static Future<Agendamento?> getAgendamento(int id) async {
    try {
      final response = await ApiService.get('/agendamentos/$id');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Agendamento.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  static Future<Map<String, dynamic>> criarAgendamento(Map<String, dynamic> agendamento) async {
    try {
      final response = await ApiService.post('/agendamentos', agendamento);
      
      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'agendamento': Agendamento.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao criar agendamento',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> atualizarAgendamento(int id, Map<String, dynamic> updates) async {
    try {
      final response = await ApiService.put('/agendamentos/$id', updates);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'agendamento': Agendamento.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao atualizar agendamento',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> cancelarAgendamento(int id, {String? motivo}) async {
    try {
      final response = await ApiService.post('/agendamentos/$id/cancelar', {
        if (motivo != null) 'motivo': motivo,
      });
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'agendamento': Agendamento.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao cancelar agendamento',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> confirmarAgendamento(int id) async {
    try {
      final response = await ApiService.post('/agendamentos/$id/confirmar', {});
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'agendamento': Agendamento.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao confirmar agendamento',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<Map<String, dynamic>> confirmarAgendamentoPago(
    int id,
    String startDateTime,
    String endDateTime,
    int profissionalId,
  ) async {
    try {
      final response = await ApiService.post('/agendamentos/$id/confirmar-pago', {
        'startDateTime': startDateTime,
        'endDateTime': endDateTime,
        'profissionalId': profissionalId,
      });
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'success': true,
          'agendamento': Agendamento.fromJson(data),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Erro ao confirmar agendamento pago',
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Erro de conexão: $e',
      };
    }
  }

  static Future<bool> verificarDisponibilidade(
    int profissionalId,
    String startDateTime,
    String endDateTime, {
    int? agendamentoId,
  }) async {
    try {
      String endpoint = '/agendamentos/disponibilidade?profissionalId=$profissionalId&startDateTime=$startDateTime&endDateTime=$endDateTime';
      if (agendamentoId != null) {
        endpoint += '&agendamentoId=$agendamentoId';
      }
      
      final response = await ApiService.get(endpoint);
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['disponivel'] ?? false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  static String formatarData(DateTime data) {
    return '${data.day.toString().padLeft(2, '0')}/${data.month.toString().padLeft(2, '0')}/${data.year}';
  }

  static String formatarHora(DateTime data) {
    return '${data.hour.toString().padLeft(2, '0')}:${data.minute.toString().padLeft(2, '0')}';
  }

  static String formatarDataHorario(DateTime data) {
    return '${formatarData(data)} às ${formatarHora(data)}';
  }
}
