class FichaAnamnese {
  final int id;
  final String healthProblems;
  final String medications;
  final String allergies;
  final String surgeries;
  final String lifestyle;

  FichaAnamnese({
    required this.id,
    required this.healthProblems,
    required this.medications,
    required this.allergies,
    required this.surgeries,
    required this.lifestyle,
  });

  factory FichaAnamnese.fromJson(Map<String, dynamic> json) {
    return FichaAnamnese(
      id: json['id'],
      healthProblems: json['healthProblems'] ?? '',
      medications: json['medications'] ?? '',
      allergies: json['allergies'] ?? '',
      surgeries: json['surgeries'] ?? '',
      lifestyle: json['lifestyle'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'healthProblems': healthProblems,
      'medications': medications,
      'allergies': allergies,
      'surgeries': surgeries,
      'lifestyle': lifestyle,
    };
  }

  bool get isEmpty {
    return healthProblems.isEmpty &&
           medications.isEmpty &&
           allergies.isEmpty &&
           surgeries.isEmpty &&
           lifestyle.isEmpty;
  }

  Map<String, String> get camposFormatados {
    return {
      'Problemas de Saúde': healthProblems,
      'Medicamentos': medications,
      'Alergias': allergies,
      'Cirurgias': surgeries,
      'Estilo de Vida': lifestyle,
    };
  }
}
