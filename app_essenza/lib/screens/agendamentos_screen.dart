import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/agendamentos_provider.dart';
import '../widgets/agendamento_card.dart';

class AgendamentosScreen extends StatefulWidget {
  const AgendamentosScreen({super.key});

  @override
  State<AgendamentosScreen> createState() => _AgendamentosScreenState();
}

class _AgendamentosScreenState extends State<AgendamentosScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final agendamentosProvider = Provider.of<AgendamentosProvider>(context, listen: false);

    if (authProvider.user != null && authProvider.isCliente) {
      await agendamentosProvider.loadAgendamentosCliente(authProvider.user!.id);
      await agendamentosProvider.loadServicosPagosNaoAgendados(authProvider.user!.id);
    }
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
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Meus Agendamentos',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Gerencie seus agendamentos e tratamentos',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            // Tabs
            Container(
              color: Colors.white,
              child: TabBar(
                controller: _tabController,
                labelColor: Colors.green,
                unselectedLabelColor: Colors.grey,
                indicatorColor: Colors.green,
                tabs: const [
                  Tab(text: 'Próximos'),
                  Tab(text: 'Hoje'),
                  Tab(text: 'Histórico'),
                ],
              ),
            ),

            // Conteúdo das tabs
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildProximosTab(),
                  _buildHojeTab(),
                  _buildHistoricoTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProximosTab() {
    return Consumer<AgendamentosProvider>(
      builder: (context, agendamentosProvider, child) {
        if (agendamentosProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(color: Colors.green),
          );
        }

        final proximosAgendamentos = agendamentosProvider.proximosAgendamentos;

        if (proximosAgendamentos.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.calendar_today_outlined,
                  size: 64,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'Nenhum agendamento próximo',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Que tal agendar um novo tratamento?',
                  style: TextStyle(
                    color: Colors.grey.shade500,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: () {
                    // Navegar para serviços
                    // TODO: Implementar navegação para serviços
                  },
                  icon: const Icon(Icons.spa),
                  label: const Text('Ver Serviços'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadData,
          color: Colors.green,
          child: ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: proximosAgendamentos.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: AgendamentoCard(
                  agendamento: proximosAgendamentos[index],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildHojeTab() {
    return Consumer<AgendamentosProvider>(
      builder: (context, agendamentosProvider, child) {
        if (agendamentosProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(color: Colors.green),
          );
        }

        final agendamentosHoje = agendamentosProvider.agendamentosHoje;

        if (agendamentosHoje.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.today_outlined,
                  size: 64,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'Nenhum agendamento hoje',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Aproveite o dia para relaxar!',
                  style: TextStyle(
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadData,
          color: Colors.green,
          child: ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: agendamentosHoje.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: AgendamentoCard(
                  agendamento: agendamentosHoje[index],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildHistoricoTab() {
    return Consumer<AgendamentosProvider>(
      builder: (context, agendamentosProvider, child) {
        if (agendamentosProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(color: Colors.green),
          );
        }

        final agendamentosPassados = agendamentosProvider.agendamentosPassados;

        if (agendamentosPassados.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.history,
                  size: 64,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 16),
                Text(
                  'Nenhum agendamento no histórico',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Seus agendamentos passados aparecerão aqui',
                  style: TextStyle(
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _loadData,
          color: Colors.green,
          child: ListView.builder(
            padding: const EdgeInsets.all(24),
            itemCount: agendamentosPassados.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: AgendamentoCard(
                  agendamento: agendamentosPassados[index],
                ),
              );
            },
          ),
        );
      },
    );
  }
}
