# Documentação de Chamadas de API

Este ficheiro documenta as chamadas de API realizadas por cada componente e página do projeto.

## Páginas de Gestão de Consultas

### AgendarConsulta.jsx
- **GET `/pacientes`**: Lista todos os pacientes para seleção.
- **GET `/medicos`**: Lista todos os médicos e entidades médicas.
- **GET `/tratamentos/tipos`**: Lista os tipos de tratamento disponíveis.
- **POST `/admin/consultas`**: Cria um novo agendamento de consulta.

### EditarConsulta.jsx
- **GET `/medicos`**: Lista todos os médicos e entidades médicas.
- **GET `/tratamentos/tipos`**: Lista os tipos de tratamento disponíveis.
- **GET `/admin/consultas`**: Procura a consulta específica pelo ID para preencher os dados iniciais do formulário.
- **PUT `/admin/consultas/:id`**: Guarda as alterações feitas na consulta.

### ConsultasGestor.jsx
- **GET `/admin/consultas`**: Lista todas as consultas com estado "pendente" para visualização do gestor.

### ConsultaDetalhes.jsx
- **GET `/admin/consultas`**: Procura a consulta específica na lista para exibir os detalhes.
- **PUT `/admin/consultas/:id`**: Atualiza o estado da consulta (Concluída/Cancelada).

### ListaTratamentos.jsx
- **GET `/tratamentos/tipos`**: Lista detalhada de todos os tipos de tratamento oferecidos pela clínica.
