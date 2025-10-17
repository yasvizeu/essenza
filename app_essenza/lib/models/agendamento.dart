import 'servico.dart';
import 'user.dart';

class Agendamento {
  final int id;
  final String title;
  final String? description;
  final DateTime startDateTime;
  final DateTime endDateTime;
  final String timeZone;
  final String? location;
  final String status; // 'confirmed', 'tentative', 'cancelled'
  final String statusPagamento; // 'pendente', 'pago', 'cancelado'
  final double? valor;
  final String? observacoes;
  final String? googleEventId;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  // Relacionamentos
  final User? cliente;
  final User? profissional;
  final Servico? servico;
  
  // IDs
  final int clienteId;
  final int profissionalId;
  final int servicoId;

  Agendamento({
    required this.id,
    required this.title,
    this.description,
    required this.startDateTime,
    required this.endDateTime,
    this.timeZone = 'America/Sao_Paulo',
    this.location,
    required this.status,
    required this.statusPagamento,
    this.valor,
    this.observacoes,
    this.googleEventId,
    required this.createdAt,
    required this.updatedAt,
    this.cliente,
    this.profissional,
    this.servico,
    required this.clienteId,
    required this.profissionalId,
    required this.servicoId,
  });

  factory Agendamento.fromJson(Map<String, dynamic> json) {
    return Agendamento(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      startDateTime: DateTime.parse(json['startDateTime']),
      endDateTime: DateTime.parse(json['endDateTime']),
      timeZone: json['timeZone'] ?? 'America/Sao_Paulo',
      location: json['location'],
      status: json['status'],
      statusPagamento: json['statusPagamento'],
      valor: json['valor']?.toDouble(),
      observacoes: json['observacoes'],
      googleEventId: json['googleEventId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      cliente: json['cliente'] != null ? User.fromJson(json['cliente']) : null,
      profissional: json['profissional'] != null ? User.fromJson(json['profissional']) : null,
      servico: json['servico'] != null ? Servico.fromJson(json['servico']) : null,
      clienteId: json['clienteId'],
      profissionalId: json['profissionalId'],
      servicoId: json['servicoId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'startDateTime': startDateTime.toIso8601String(),
      'endDateTime': endDateTime.toIso8601String(),
      'timeZone': timeZone,
      'location': location,
      'status': status,
      'statusPagamento': statusPagamento,
      'valor': valor,
      'observacoes': observacoes,
      'googleEventId': googleEventId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'cliente': cliente?.toJson(),
      'profissional': profissional?.toJson(),
      'servico': servico?.toJson(),
      'clienteId': clienteId,
      'profissionalId': profissionalId,
      'servicoId': servicoId,
    };
  }

  String get dataFormatada {
    return '${startDateTime.day.toString().padLeft(2, '0')}/${startDateTime.month.toString().padLeft(2, '0')}/${startDateTime.year}';
  }

  String get horaFormatada {
    return '${startDateTime.hour.toString().padLeft(2, '0')}:${startDateTime.minute.toString().padLeft(2, '0')}';
  }

  String get statusText {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'tentative':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  String get statusPagamentoText {
    switch (statusPagamento) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return statusPagamento;
    }
  }

  bool get isConfirmado => status == 'confirmed';
  bool get isPendente => status == 'tentative';
  bool get isCancelado => status == 'cancelled';
  bool get isPago => statusPagamento == 'pago';
  bool get isPendentePagamento => statusPagamento == 'pendente';

  bool get isHoje {
    final hoje = DateTime.now();
    return startDateTime.year == hoje.year &&
           startDateTime.month == hoje.month &&
           startDateTime.day == hoje.day;
  }

  bool get isAmanha {
    final amanha = DateTime.now().add(const Duration(days: 1));
    return startDateTime.year == amanha.year &&
           startDateTime.month == amanha.month &&
           startDateTime.day == amanha.day;
  }

  bool get isProximo {
    final hoje = DateTime.now();
    final proximaSemana = hoje.add(const Duration(days: 7));
    return startDateTime.isAfter(hoje) && startDateTime.isBefore(proximaSemana);
  }

  bool get isPassado {
    return startDateTime.isBefore(DateTime.now());
  }

  bool get podeEditar {
    final agora = DateTime.now();
    final diferencaHoras = startDateTime.difference(agora).inHours;
    return diferencaHoras >= 24;
  }
}
