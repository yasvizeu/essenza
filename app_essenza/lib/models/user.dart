class User {
  final int id;
  final String email;
  final String nome;
  final String tipo; // 'cliente' ou 'profissional'
  final String? cpf;
  final String? birthDate;
  final String? cell;
  final String? address;
  final String? especialidade;
  final bool? admin;
  final int? cnec;

  User({
    required this.id,
    required this.email,
    required this.nome,
    required this.tipo,
    this.cpf,
    this.birthDate,
    this.cell,
    this.address,
    this.especialidade,
    this.admin,
    this.cnec,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      nome: json['nome'],
      tipo: json['tipo'],
      cpf: json['cpf'],
      birthDate: json['birthDate'],
      cell: json['cell'],
      address: json['address'],
      especialidade: json['especialidade'],
      admin: json['admin'],
      cnec: json['cnec'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'nome': nome,
      'tipo': tipo,
      'cpf': cpf,
      'birthDate': birthDate,
      'cell': cell,
      'address': address,
      'especialidade': especialidade,
      'admin': admin,
      'cnec': cnec,
    };
  }

  bool get isCliente => tipo == 'cliente';
  bool get isProfissional => tipo == 'profissional';
  bool get isAdmin => admin == true;
}
