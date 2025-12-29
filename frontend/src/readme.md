# Documentação de Chamadas de API

Este ficheiro documenta as chamadas de API realizadas por cada componente e página do projeto.

---

## 👤 Páginas de Utente

### Home.jsx
- **GET `/home`**: Obtém os dados do utilizador e a lista de próximas consultas filtradas.

### Consultas.jsx
- **GET `/home`**: Obtém as próximas consultas para este utilizador (usa o mesmo endpoint que a Home).

### ConsultaDetalheUtente.jsx
- **GET `/admin/consultas`**: Procura os detalhes da consulta específica na lista geral (emulando um detalhe individual).

### HistoricoConsultasUtente.jsx
- **GET `/admin/consultas`**: Obtém todas as consultas e filtra localmente pelas que estão concluídas/canceladas/anuladas.

### PedidosConsultaUtente.jsx
- **POST `/pedidos-consulta`**: Envia uma nova solicitação de agendamento de consulta.

### Documentacao.jsx
- **GET `/documentacao/exames`**: Lista exames do utente atual.
- **GET `/documentacao/justificacoes`**: Lista justificações do utente atual.
- **GET `/documentacao/utente/:id/exames`**: Lista exames de um dependente (visão gestor/responsável).
- **GET `/documentacao/utente/:id/justificacoes`**: Lista justificações de um dependente.

### Perfil & Dados
- **GET `/perfil`**: Resumo do perfil (Página principal do Perfil).
- **GET `/perfil/meus-dados`**: Dados detalhados do utente.
- **PUT `/perfil/credenciais`**: Atualiza o PIN de acesso.
- **GET `/perfil/dependentes`**: Lista de dependentes associados.
- **POST `/perfil/switch`**: Alterna o perfil ativo para um dependente.
- **GET `/perfil/historico-dentario`**: Histórico clínico/dentário do utente.

---

## 🛠️ Páginas de Gestor

### AgendarConsulta.jsx
- **GET `/pacientes`**: Lista todos os pacientes para seleção.
- **GET `/medicos`**: Lista todos os médicos e entidades médicas.
- **GET `/tratamentos/tipos`**: Lista os tipos de tratamento disponíveis.
- **POST `/admin/consultas`**: Cria um novo agendamento (inclui `id_estado: 1` para Pendente).

### EditarConsulta.jsx
- **GET `/medicos`**: Lista médicos para edição.
- **GET `/tratamentos/tipos`**: Lista tipos de tratamento.
- **GET `/admin/consultas`**: Obtém dados atuais para preenchimento.
- **PUT `/admin/consultas/:id`**: Guarda as alterações.

### ConsultasGestor.jsx
- **GET `/admin/consultas`**: Lista todas as consultas (filtradas localmente por "pendente").

### ConsultaDetalhes.jsx
- **GET `/admin/consultas`**: Obtém detalhes da consulta.
- **PUT `/admin/consultas/:id`**: Atualiza o estado (`id_estado`: 1=Pendente, 2=Concluída, 3=Cancelada).

### Gestores.jsx
- **GET `/admin/gestores`**: Lista médicos/gestores.
- **POST `/admin/gestores`**: Regista novo gestor.

### Pacientes & Fichas
- **GET `/pacientes`**: Lista e pesquisa de utentes.
- **POST `/pacientes`**: Cria novo utente/paciente.
- **GET `/pacientes/:id`**: Ficha detalhada do paciente.
- **POST `/pacientes/:id/enviar-credenciais`**: Envia PIN por email.
