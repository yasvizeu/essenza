import 'package:flutter/foundation.dart';
import '../models/agendamento.dart';
import '../services/agendamentos_service.dart';

class AgendamentosProvider with ChangeNotifier {
  List<Agendamento> _agendamentos = [];
  List<Agendamento> _servicosPagos = [];
  bool _isLoading = false;
  String? _error;

  List<Agendamento> get agendamentos => _agendamentos;
  List<Agendamento> get servicosPagos => _servicosPagos;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Agendamentos confirmados e futuros
  List<Agendamento> get proximosAgendamentos {
    return _agendamentos
        .where((ag) => ag.isConfirmado && ag.startDateTime.isAfter(DateTime.now()))
        .toList()
      ..sort((a, b) => a.startDateTime.compareTo(b.startDateTime));
  }

  // Agendamentos de hoje
  List<Agendamento> get agendamentosHoje {
    return _agendamentos
        .where((ag) => ag.isHoje && ag.isConfirmado)
        .toList()
      ..sort((a, b) => a.startDateTime.compareTo(b.startDateTime));
  }

  // Agendamentos passados
  List<Agendamento> get agendamentosPassados {
    return _agendamentos
        .where((ag) => ag.isPassado)
        .toList()
      ..sort((a, b) => b.startDateTime.compareTo(a.startDateTime));
  }

  Future<void> loadAgendamentosCliente(int clienteId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _agendamentos = await AgendamentosService.getAgendamentosCliente(clienteId);
      _error = null;
    } catch (e) {
      _error = 'Erro ao carregar agendamentos: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadServicosPagosNaoAgendados(int clienteId) async {
    try {
      _servicosPagos = await AgendamentosService.getServicosPagosNaoAgendados(clienteId);
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao carregar serviços pagos: $e';
      notifyListeners();
    }
  }

  Future<Agendamento?> getAgendamento(int id) async {
    try {
      return await AgendamentosService.getAgendamento(id);
    } catch (e) {
      _error = 'Erro ao carregar agendamento: $e';
      notifyListeners();
      return null;
    }
  }

  Future<bool> criarAgendamento(Map<String, dynamic> agendamento) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AgendamentosService.criarAgendamento(agendamento);
      
      if (result['success']) {
        // Recarregar lista de agendamentos
        if (_agendamentos.isNotEmpty) {
          final clienteId = _agendamentos.first.clienteId;
          await loadAgendamentosCliente(clienteId);
        }
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao criar agendamento: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> atualizarAgendamento(int id, Map<String, dynamic> updates) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AgendamentosService.atualizarAgendamento(id, updates);
      
      if (result['success']) {
        // Atualizar agendamento na lista local
        final index = _agendamentos.indexWhere((ag) => ag.id == id);
        if (index != -1) {
          _agendamentos[index] = result['agendamento'];
        }
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao atualizar agendamento: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> cancelarAgendamento(int id, {String? motivo}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AgendamentosService.cancelarAgendamento(id, motivo: motivo);
      
      if (result['success']) {
        // Atualizar agendamento na lista local
        final index = _agendamentos.indexWhere((ag) => ag.id == id);
        if (index != -1) {
          _agendamentos[index] = result['agendamento'];
        }
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao cancelar agendamento: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> confirmarAgendamento(int id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AgendamentosService.confirmarAgendamento(id);
      
      if (result['success']) {
        // Atualizar agendamento na lista local
        final index = _agendamentos.indexWhere((ag) => ag.id == id);
        if (index != -1) {
          _agendamentos[index] = result['agendamento'];
        }
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao confirmar agendamento: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> confirmarAgendamentoPago(
    int id,
    String startDateTime,
    String endDateTime,
    int profissionalId,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AgendamentosService.confirmarAgendamentoPago(
        id,
        startDateTime,
        endDateTime,
        profissionalId,
      );
      
      if (result['success']) {
        // Atualizar agendamento na lista local
        final index = _agendamentos.indexWhere((ag) => ag.id == id);
        if (index != -1) {
          _agendamentos[index] = result['agendamento'];
        }
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro ao confirmar agendamento pago: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void refresh(int clienteId) {
    loadAgendamentosCliente(clienteId);
    loadServicosPagosNaoAgendados(clienteId);
  }
}
