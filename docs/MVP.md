🎯 MVP – Essenza v1.0
📋 Visão Geral do MVP

O MVP (Minimum Viable Product) do Essenza v1.0 concentra-se nas funcionalidades essenciais para garantir o funcionamento básico de uma clínica de estética, com foco em:

Agendamento de clientes simples e confiável

Dashboard para profissionais com controle da rotina

Gestão mínima de estoque e protocolos

Registro clínico por meio da Ficha de Anamnese

🎯 Objetivos do MVP

Agendamento Online – Facilitar marcações de clientes

Dashboard Profissional – Acompanhar agenda e operações

Gestão Básica – Cadastro de clientes, profissionais, serviços e produtos

Controle de Estoque – Movimentações básicas (entrada/saída)

Protocolos de Tratamento – Criar e aplicar protocolos personalizados

Fichas de Anamnese – Registrar histórico clínico dos clientes

🚀 Funcionalidades Implementadas
✅ Para Clientes
Cadastro e Autenticação

Registro de conta com validação de dados

Login seguro com JWT

Validação de CPF com cpf-cnpj-validator

Estrutura para recuperação de senha (próxima versão)

Agendamento de Serviços

Visualização de serviços disponíveis

Seleção de data, horário e profissional

Confirmação com resumo do agendamento

Histórico pessoal de agendamentos

Gestão de Perfil

Atualização de dados pessoais

Histórico de atendimentos realizados

Associação da Ficha de Anamnese ao perfil

✅ Para Profissionais
Dashboard Administrativo

Visão geral de clientes, serviços e estoque

Estatísticas rápidas:

nº de clientes cadastrados

nº de produtos em estoque

nº de serviços ativos

movimentações do dia

Gestão de Agenda

Visualização da agenda diária/semana

Confirmação/cancelamento de agendamentos

Filtros por profissional e data

Status de pagamento vinculado

Controle de Estoque

Cadastro de produtos por categoria

Movimentações (entrada/saída) registradas

Alertas de baixo estoque (< 10 unidades)

Baixa automática ao realizar serviço

Gestão de Serviços

Cadastro com nome, categoria e preço

Associação de produtos (BOM – Bill of Materials)

Cálculo automático de custos

Protocolos de Tratamento

Criação de protocolos personalizados

Associação de serviços em sequência

Observações específicas por protocolo

Fichas de Anamnese

Cadastro obrigatório após o registro do cliente

Registro de histórico clínico

Campos para alergias, medicamentos, cirurgias, estilo de vida

Dados vinculados ao cliente e consultáveis antes de cada atendimento

Base para definição de protocolos personalizados

📊 Fluxo de Uso
Fluxo do Cliente
graph TD
    A[Cliente acessa o site] --> B[Cadastra conta]
    B --> C[Preenche ficha de anamnese]
    C --> D[Faz login]
    D --> E[Visualiza serviços]
    E --> F[Escolhe data e horário]
    F --> G[Confirma agendamento]
    G --> H[Recebe confirmação]
    H --> I[Consulta histórico]

Fluxo do Profissional
graph TD
    A[Profissional faz login] --> B[Acessa dashboard]
    B --> C[Visualiza agenda]
    C --> D[Acessa ficha de anamnese do cliente]
    D --> E[Confirma agendamentos]
    E --> F[Executa serviços com base nos protocolos]
    F --> G[Atualiza estoque]
    G --> H[Atualiza ficha de anamnese se necessário]

📈 Métricas do MVP

Nº de fichas de anamnese preenchidas no cadastro

% de atendimentos com ficha atualizada

Correlação entre ficha e protocolos aplicados

Evolução clínica registrada ao longo dos atendimentos

📌 Resumo: Agora o MVP não é só administrativo, mas também clínico → todo cliente precisa ter uma ficha de anamnese vinculada ao seu cadastro, garantindo segurança e personalização dos protocolos.