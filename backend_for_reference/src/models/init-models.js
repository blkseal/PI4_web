import _sequelize from "sequelize";
const { DataTypes } = _sequelize;
import _agenda from "./agenda.js";
import _consultas from "./consultas.js";
import _contactos_clinica from "./contactos_clinica.js";
import _declaracoes from "./declaracoes.js";
import _entidade_medica from "./entidade_medica.js";
import _estado_civil from "./estado_civil.js";
import _estados from "./estados.js";
import _exames from "./exames.js";
import _genero from "./genero.js";
import _gestor from "./gestor.js";
import _habitos from "./habitos.js";
import _historico_dentario from "./historico_dentario.js";
import _historico_medico from "./historico_medico.js";
import _moradas from "./moradas.js";
import _notificacoes from "./notificacoes.js";
import _pedidos_contacto_nao_utilizador from "./pedidos_contacto_nao_utilizador.js";
import _pedidos_contacto_utilizador from "./pedidos_contacto_utilizador.js";
import _planos_tratamento from "./planos_tratamento.js";
import _tipo_utente from "./tipo_utente.js";
import _tipos_planos_tratamento from "./tipos_planos_tratamento.js";
import _tipos_utilizador from "./tipos_utilizador.js";
import _utente from "./utente.js";
import _utilizadores from "./utilizadores.js";
import _utilizadores_notificacoes from "./utilizadores_notificacoes.js";

function initModels(sequelize) {
  var agenda = _agenda(sequelize, DataTypes);
  var consultas = _consultas(sequelize, DataTypes);
  var contactos_clinica = _contactos_clinica(sequelize, DataTypes);
  var declaracoes = _declaracoes(sequelize, DataTypes);
  var entidade_medica = _entidade_medica(sequelize, DataTypes);
  var estado_civil = _estado_civil(sequelize, DataTypes);
  var estados = _estados(sequelize, DataTypes);
  var exames = _exames(sequelize, DataTypes);
  var genero = _genero(sequelize, DataTypes);
  var gestor = _gestor(sequelize, DataTypes);
  var habitos = _habitos(sequelize, DataTypes);
  var historico_dentario = _historico_dentario(sequelize, DataTypes);
  var historico_medico = _historico_medico(sequelize, DataTypes);
  var moradas = _moradas(sequelize, DataTypes);
  var notificacoes = _notificacoes(sequelize, DataTypes);
  var pedidos_contacto_nao_utilizador = _pedidos_contacto_nao_utilizador(sequelize, DataTypes);
  var pedidos_contacto_utilizador = _pedidos_contacto_utilizador(sequelize, DataTypes);
  var planos_tratamento = _planos_tratamento(sequelize, DataTypes);
  var tipo_utente = _tipo_utente(sequelize, DataTypes);
  var tipos_planos_tratamento = _tipos_planos_tratamento(sequelize, DataTypes);
  var tipos_utilizador = _tipos_utilizador(sequelize, DataTypes);
  var utente = _utente(sequelize, DataTypes);
  var utilizadores = _utilizadores(sequelize, DataTypes);
  var utilizadores_notificacoes = _utilizadores_notificacoes(sequelize, DataTypes);

  declaracoes.belongsTo(consultas, { as: "id_consulta_consulta", foreignKey: "id_consulta"});
  consultas.hasMany(declaracoes, { as: "declaracos", foreignKey: "id_consulta"});
  agenda.belongsTo(entidade_medica, { as: "id_entidade_medica_entidade_medica", foreignKey: "id_entidade_medica"});
  entidade_medica.hasMany(agenda, { as: "agendas", foreignKey: "id_entidade_medica"});
  consultas.belongsTo(entidade_medica, { as: "id_entidade_medica_entidade_medica", foreignKey: "id_entidade_medica"});
  entidade_medica.hasMany(consultas, { as: "consulta", foreignKey: "id_entidade_medica"});
  gestor.belongsTo(entidade_medica, { as: "id_entidade_medica_entidade_medica", foreignKey: "id_entidade_medica"});
  entidade_medica.hasMany(gestor, { as: "gestors", foreignKey: "id_entidade_medica"});
  utente.belongsTo(estado_civil, { as: "id_estado_civil_estado_civil", foreignKey: "id_estado_civil"});
  estado_civil.hasMany(utente, { as: "utentes", foreignKey: "id_estado_civil"});
  consultas.belongsTo(estados, { as: "id_estado_estado", foreignKey: "id_estado"});
  estados.hasMany(consultas, { as: "consulta", foreignKey: "id_estado"});
  utente.belongsTo(genero, { as: "id_genero_genero", foreignKey: "id_genero"});
  genero.hasMany(utente, { as: "utentes", foreignKey: "id_genero"});
  utente.belongsTo(habitos, { as: "id_habitos_habito", foreignKey: "id_habitos"});
  habitos.hasMany(utente, { as: "utentes", foreignKey: "id_habitos"});
  utente.belongsTo(historico_dentario, { as: "id_historico_dentario_historico_dentario", foreignKey: "id_historico_dentario"});
  historico_dentario.hasMany(utente, { as: "utentes", foreignKey: "id_historico_dentario"});
  utente.belongsTo(historico_medico, { as: "id_historico_medico_historico_medico", foreignKey: "id_historico_medico"});
  historico_medico.hasMany(utente, { as: "utentes", foreignKey: "id_historico_medico"});
  utente.belongsTo(moradas, { as: "id_morada_morada", foreignKey: "id_morada"});
  moradas.hasMany(utente, { as: "utentes", foreignKey: "id_morada"});
  utilizadores_notificacoes.belongsTo(notificacoes, { as: "id_notificacao_notificaco", foreignKey: "id_notificacao"});
  notificacoes.hasMany(utilizadores_notificacoes, { as: "utilizadores_notificacos", foreignKey: "id_notificacao"});
  utente.belongsTo(tipo_utente, { as: "id_tipo_utente_tipo_utente", foreignKey: "id_tipo_utente"});
  tipo_utente.hasMany(utente, { as: "utentes", foreignKey: "id_tipo_utente"});
  planos_tratamento.belongsTo(tipos_planos_tratamento, { as: "id_t_p_tratamento_tipos_planos_tratamento", foreignKey: "id_t_p_tratamento"});
  tipos_planos_tratamento.hasMany(planos_tratamento, { as: "planos_tratamentos", foreignKey: "id_t_p_tratamento"});
  utilizadores.belongsTo(tipos_utilizador, { as: "id_tipo_utilizador_tipos_utilizador", foreignKey: "id_tipo_utilizador"});
  tipos_utilizador.hasMany(utilizadores, { as: "utilizadores", foreignKey: "id_tipo_utilizador"});
  consultas.belongsTo(utente, { as: "id_utente_utente", foreignKey: "id_utente"});
  utente.hasMany(consultas, { as: "consulta", foreignKey: "id_utente"});
  exames.belongsTo(utente, { as: "id_utente_utente", foreignKey: "id_utente"});
  utente.hasMany(exames, { as: "exames", foreignKey: "id_utente"});
  pedidos_contacto_utilizador.belongsTo(utente, { as: "id_utente_utente", foreignKey: "id_utente"});
  utente.hasMany(pedidos_contacto_utilizador, { as: "pedidos_contacto_utilizadors", foreignKey: "id_utente"});
  planos_tratamento.belongsTo(utente, { as: "id_utente_utente", foreignKey: "id_utente"});
  utente.hasMany(planos_tratamento, { as: "planos_tratamentos", foreignKey: "id_utente"});
  gestor.belongsTo(utilizadores, { as: "id_utilizador_utilizadore", foreignKey: "id_utilizador"});
  utilizadores.hasMany(gestor, { as: "gestors", foreignKey: "id_utilizador"});
  utente.belongsTo(utilizadores, { as: "id_utilizador_utilizadore", foreignKey: "id_utilizador"});
  utilizadores.hasMany(utente, { as: "utentes", foreignKey: "id_utilizador"});
  utilizadores_notificacoes.belongsTo(utilizadores, { as: "id_utilizador_utilizadore", foreignKey: "id_utilizador"});
  utilizadores.hasMany(utilizadores_notificacoes, { as: "utilizadores_notificacos", foreignKey: "id_utilizador"});

  return {
    agenda,
    consultas,
    contactos_clinica,
    declaracoes,
    entidade_medica,
    estado_civil,
    estados,
    exames,
    genero,
    gestor,
    habitos,
    historico_dentario,
    historico_medico,
    moradas,
    notificacoes,
    pedidos_contacto_nao_utilizador,
    pedidos_contacto_utilizador,
    planos_tratamento,
    tipo_utente,
    tipos_planos_tratamento,
    tipos_utilizador,
    utente,
    utilizadores,
    utilizadores_notificacoes,
  };
}
export default initModels;
export { initModels };