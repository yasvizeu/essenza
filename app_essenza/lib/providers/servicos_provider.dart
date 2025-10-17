import 'package:flutter/foundation.dart';
import '../models/servico.dart';
import '../services/servicos_service.dart';

class ServicosProvider with ChangeNotifier {
  List<Servico> _servicos = [];
  List<String> _categorias = [];
  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  final int _totalPages = 1;
  bool _hasNextPage = false;
  bool _hasPrevPage = false;

  List<Servico> get servicos => _servicos;
  List<String> get categorias => _categorias;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  bool get hasNextPage => _hasNextPage;
  bool get hasPrevPage => _hasPrevPage;

  Future<void> loadServicos({
    int page = 1,
    int limit = 20,
    String? categoria,
    bool refresh = false,
  }) async {
    if (refresh) {
      _servicos.clear();
      _currentPage = 1;
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final servicos = await ServicosService.getServicos(
        page: page,
        limit: limit,
        categoria: categoria,
      );

      if (refresh || page == 1) {
        _servicos = servicos;
      } else {
        _servicos.addAll(servicos);
      }

      _currentPage = page;
      _hasNextPage = servicos.length == limit;
      _hasPrevPage = page > 1;
      _error = null;
    } catch (e) {
      _error = 'Erro ao carregar serviços: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadCategorias() async {
    try {
      _categorias = await ServicosService.getCategorias();
      notifyListeners();
    } catch (e) {
      _error = 'Erro ao carregar categorias: $e';
      notifyListeners();
    }
  }

  Future<Servico?> getServico(int id) async {
    try {
      return await ServicosService.getServico(id);
    } catch (e) {
      _error = 'Erro ao carregar serviço: $e';
      notifyListeners();
      return null;
    }
  }

  void nextPage() {
    if (_hasNextPage && !_isLoading) {
      loadServicos(page: _currentPage + 1);
    }
  }

  void prevPage() {
    if (_hasPrevPage && !_isLoading) {
      loadServicos(page: _currentPage - 1);
    }
  }

  void goToPage(int page) {
    if (page >= 1 && page <= _totalPages && !_isLoading) {
      loadServicos(page: page);
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void refresh() {
    loadServicos(refresh: true);
  }
}
