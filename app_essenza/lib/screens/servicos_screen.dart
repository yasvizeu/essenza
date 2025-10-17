import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/servicos_provider.dart';
import '../widgets/servico_card.dart';
import '../widgets/loading_button.dart';

class ServicosScreen extends StatefulWidget {
  const ServicosScreen({super.key});

  @override
  State<ServicosScreen> createState() => _ServicosScreenState();
}

class _ServicosScreenState extends State<ServicosScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategoria;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final servicosProvider = Provider.of<ServicosProvider>(context, listen: false);
      servicosProvider.loadServicos();
      servicosProvider.loadCategorias();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _filterServicos() {
    final servicosProvider = Provider.of<ServicosProvider>(context, listen: false);
    servicosProvider.loadServicos(
      categoria: _selectedCategoria,
      refresh: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFf8f9fa),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF28a745),
                    Color(0xFF20c997),
                  ],
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Nossos Serviços',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Descubra tratamentos profissionais que transformam sua beleza',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Campo de busca
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Buscar serviços...',
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, color: Colors.grey),
                              onPressed: () {
                                _searchController.clear();
                                setState(() {});
                              },
                            )
                          : null,
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {});
                      // TODO: Implementar busca em tempo real
                    },
                  ),
                ],
              ),
            ),

            // Filtros
            Consumer<ServicosProvider>(
              builder: (context, servicosProvider, child) {
                if (servicosProvider.categorias.isEmpty) {
                  return const SizedBox.shrink();
                }

                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildCategoriaFilter('Todos', null),
                        const SizedBox(width: 12),
                        ...servicosProvider.categorias.map(
                          (categoria) => Padding(
                            padding: const EdgeInsets.only(right: 12),
                            child: _buildCategoriaFilter(categoria, categoria),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            // Lista de serviços
            Expanded(
              child: Consumer<ServicosProvider>(
                builder: (context, servicosProvider, child) {
                  if (servicosProvider.isLoading && servicosProvider.servicos.isEmpty) {
                    return const Center(
                      child: CircularProgressIndicator(color: Colors.green),
                    );
                  }

                  if (servicosProvider.error != null) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 64,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            servicosProvider.error!,
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 16,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () => servicosProvider.refresh(),
                            child: const Text('Tentar Novamente'),
                          ),
                        ],
                      ),
                    );
                  }

                  if (servicosProvider.servicos.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.spa_outlined,
                            size: 64,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Nenhum serviço disponível',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Em breve teremos novos serviços para você!',
                            style: TextStyle(
                              color: Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: () async => servicosProvider.refresh(),
                    color: Colors.green,
                    child: GridView.builder(
                      padding: const EdgeInsets.all(24),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: servicosProvider.servicos.length,
                      itemBuilder: (context, index) {
                        return ServicoCard(servico: servicosProvider.servicos[index]);
                      },
                    ),
                  );
                },
              ),
            ),

            // Paginação
            Consumer<ServicosProvider>(
              builder: (context, servicosProvider, child) {
                if (servicosProvider.totalPages <= 1) {
                  return const SizedBox.shrink();
                }

                return Container(
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      LoadingButton(
                        onPressed: servicosProvider.hasPrevPage
                            ? () => servicosProvider.prevPage()
                            : null,
                        isLoading: false,
                        text: 'Anterior',
                        width: 100,
                        backgroundColor: Colors.grey.shade300,
                        textColor: Colors.black87,
                      ),
                      Text(
                        'Página ${servicosProvider.currentPage} de ${servicosProvider.totalPages}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      LoadingButton(
                        onPressed: servicosProvider.hasNextPage
                            ? () => servicosProvider.nextPage()
                            : null,
                        isLoading: false,
                        text: 'Próxima',
                        width: 100,
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoriaFilter(String label, String? categoria) {
    final isSelected = _selectedCategoria == categoria;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategoria = categoria;
        });
        _filterServicos();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.green : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? Colors.green : Colors.grey.shade300,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey.shade700,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}
