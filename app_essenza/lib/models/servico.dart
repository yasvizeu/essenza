class Servico {
  final int id;
  final String nome;
  final String descricao;
  final double preco;
  final bool disponivel;
  final String categoria;
  final int? duracao; // em minutos
  final String? imagem;

  Servico({
    required this.id,
    required this.nome,
    required this.descricao,
    required this.preco,
    required this.disponivel,
    required this.categoria,
    this.duracao,
    this.imagem,
  });

  factory Servico.fromJson(Map<String, dynamic> json) {
    return Servico(
      id: json['id'],
      nome: json['nome'],
      descricao: json['descricao'],
      preco: double.parse(json['preco'].toString()),
      disponivel: json['disponivel'],
      categoria: json['categoria'],
      duracao: json['duracao'],
      imagem: json['imagem'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'descricao': descricao,
      'preco': preco,
      'disponivel': disponivel,
      'categoria': categoria,
      'duracao': duracao,
      'imagem': imagem,
    };
  }

  String get precoFormatado => 'R\$ ${preco.toStringAsFixed(2).replaceAll('.', ',')}';
  
  String get duracaoFormatada {
    if (duracao == null) return '';
    final horas = duracao! ~/ 60;
    final minutos = duracao! % 60;
    if (horas > 0) {
      return minutos > 0 ? '${horas}h ${minutos}min' : '${horas}h';
    }
    return '${minutos}min';
  }

  String get imagemUrl {
    if (imagem != null && imagem!.isNotEmpty) {
      return imagem!;
    }
    
    // Imagens padrão baseadas no nome do serviço
    final servicoImages = {
      'Limpeza de Pele': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Tratamento Anti-idade': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Hidratação': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Peeling': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'Acne': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    };

    for (final entry in servicoImages.entries) {
      if (nome.toLowerCase().contains(entry.key.toLowerCase())) {
        return entry.value;
      }
    }

    return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  }
}
