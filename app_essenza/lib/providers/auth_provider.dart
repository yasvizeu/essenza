import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isCliente => _user?.isCliente ?? false;
  bool get isProfissional => _user?.isProfissional ?? false;

  AuthProvider() {
    loadUserFromStorage();
  }

  Future<void> loadUserFromStorage() async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await AuthService.getCurrentUser();
      if (user != null) {
        _user = user;
        _error = null;
      }
    } catch (e) {
      _error = 'Erro ao carregar usuário: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> loginCliente({
    required String email,
    required String senha,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AuthService.loginCliente(
        email: email,
        senha: senha,
      );

      if (result['success']) {
        _user = result['user'];
        _error = null;
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro de conexão: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> loginProfissional({
    required String email,
    required String senha,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AuthService.loginProfissional(
        email: email,
        senha: senha,
      );

      if (result['success']) {
        _user = result['user'];
        _error = null;
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro de conexão: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> register({
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
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final result = await AuthService.register(
        email: email,
        nome: nome,
        senha: senha,
        tipo: tipo,
        cpf: cpf,
        birthDate: birthDate,
        cell: cell,
        address: address,
        especialidade: especialidade,
      );

      if (result['success']) {
        _user = result['user'];
        _error = null;
        notifyListeners();
        return true;
      } else {
        _error = result['message'];
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Erro de conexão: $e';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await AuthService.logout();
      _user = null;
      _error = null;
    } catch (e) {
      _error = 'Erro ao fazer logout: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshUser() async {
    if (_user == null) return;

    try {
      final result = await AuthService.getProfile();
      if (result['success']) {
        _user = result['user'];
        notifyListeners();
      }
    } catch (e) {
      _error = 'Erro ao atualizar perfil: $e';
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
