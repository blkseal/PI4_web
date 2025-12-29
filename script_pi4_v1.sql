/*==============================================================*/
/* DBMS name:      PostgreSQL 14.x                              */
/* Created on:     26/11/2025                                   */
/*==============================================================*/

/* 
   Apagar as tabelas se elas já existirem.
   O CASCADE serve para apagar também as ligações (chaves estrangeiras) que dependem destas tabelas.
   Assim evitamos erros de "tabela já existe" ou "dependência encontrada" ao correr o script de novo.
*/

drop table if exists AGENDA cascade;
drop table if exists CONSULTAS cascade;
drop table if exists CONTACTOS_CLINICA cascade;
drop table if exists DECLARACOES cascade;
drop table if exists ENTIDADE_MEDICA cascade;
drop table if exists ESTADOS cascade;
drop table if exists ESTADO_CIVIL cascade;
drop table if exists EXAMES cascade;
drop table if exists GENERO cascade;
drop table if exists GESTOR cascade;
drop table if exists HABITOS cascade;
drop table if exists HISTORICO_DENTARIO cascade;
drop table if exists HISTORICO_MEDICO cascade;
drop table if exists MORADAS cascade;
drop table if exists NOTIFICACOES cascade;
drop table if exists PEDIDOS_CONTACTO_NAO_UTILIZADOR cascade;
drop table if exists PEDIDOS_CONTACTO_UTILIZADOR cascade;
drop table if exists PLANOS_TRATAMENTO cascade;
drop table if exists TIPOS_PLANOS_TRATAMENTO cascade;
drop table if exists TIPOS_UTILIZADOR cascade;
drop table if exists TIPO_UTENTE cascade;
drop table if exists UTENTE cascade;
drop table if exists UTILIZADORES cascade;
drop table if exists UTILIZADORES_NOTIFICACOES cascade;

/*==============================================================*/
/* Tabela: AGENDA                                               */
/* Serve para guardar os horários disponíveis ou marcados.      */
/*==============================================================*/
create table AGENDA (
   ID_ENTIDADE_MEDICA   integer,
   ID_AGENDA            serial               not null, /* Serial para o ID aumentar sozinho */
   HORA                 time,
   DATA                 date,
   DURACAO              integer,
   constraint PK_AGENDA primary key (ID_AGENDA)
);

/*==============================================================*/
/* Tabela: CONSULTAS                                            */
/* Guarda a informação de cada consulta marcada.                */
/*==============================================================*/
create table CONSULTAS (
   ID_ENTIDADE_MEDICA   integer,
   ID_CONSULTA          serial               not null,
   ID_ESTADO            integer,
   ID_UTENTE            integer,
   DATA                 date,
   HORA                 time,
   NOTAS                text,
   DURACAO              integer,
   constraint PK_CONSULTAS primary key (ID_CONSULTA)
);

/*==============================================================*/
/* Tabela: CONTACTOS_CLINICA                                    */
/* Informação geral da clínica para mostrar no rodapé ou contactos */
/*==============================================================*/
create table CONTACTOS_CLINICA (
   TELEFONE             text,
   EMAIL                text,
   TELEMOVEL            text,
   FACEBOOK             text,
   INSTAGRAM            text,
   TIKTOK               text,
   LINKEDIN             text,
   LINK_GOOGLE_MAPS     text,
   MORADA               text,
   ID_CONTACTOS_CLINICA serial               not null,
   constraint PK_CONTACTOS_CLINICA primary key (ID_CONTACTOS_CLINICA)
);

/*==============================================================*/
/* Tabela: DECLARACOES                                          */
/* Documentos gerados a partir das consultas (ex: justificativos)*/
/*==============================================================*/
create table DECLARACOES (
   ID_CONSULTA          integer,
   ANEXO                text, /* Caminho para o ficheiro */
   ID_DECLARACAO        serial               not null,
   constraint PK_DECLARACOES primary key (ID_DECLARACAO)
);

/*==============================================================*/
/* Tabela: ENTIDADE_MEDICA                                      */
/* Representa os médicos ou entidades que dão consultas.        */
/*==============================================================*/
create table ENTIDADE_MEDICA (
   OMD                  text, /* Ordem dos Médicos Dentistas */
   ID_ENTIDADE_MEDICA   serial               not null,
   constraint PK_ENTIDADE_MEDICA primary key (ID_ENTIDADE_MEDICA)
);

/*==============================================================*/
/* Tabela: ESTADOS                                              */
/* Estados possíveis para uma consulta (ex: Agendada, Concluída)*/
/*==============================================================*/
create table ESTADOS (
   ID_ESTADO            serial               not null,
   VALOR_ESTADO         text,
   constraint PK_ESTADOS primary key (ID_ESTADO)
);

/*==============================================================*/
/* Tabela: ESTADO_CIVIL                                         */
/* Lista de estados civis (Solteiro, Casado, etc.)              */
/*==============================================================*/
create table ESTADO_CIVIL (
   ID_ESTADO_CIVIL      serial               not null,
   DESIGNACAO_ESTADO_CIVIL text,
   constraint PK_ESTADO_CIVIL primary key (ID_ESTADO_CIVIL)
);

/*==============================================================*/
/* Tabela: EXAMES                                               */
/* Exames associados a um utente.                               */
/*==============================================================*/
create table EXAMES (
   ID_UTENTE            integer,
   ANEXO                text,
   ID_EXAME             serial               not null,
   constraint PK_EXAMES primary key (ID_EXAME)
);

/*==============================================================*/
/* Tabela: GENERO                                               */
/* Masculino, Feminino, etc.                                    */
/*==============================================================*/
create table GENERO (
   ID_GENERO            serial               not null,
   DESIGNACAO_GENERO    text,
   constraint PK_GENERO primary key (ID_GENERO)
);

/*==============================================================*/
/* Tabela: GESTOR                                               */
/* Utilizadores que gerem a clínica (Backoffice).               */
/*==============================================================*/
create table GESTOR (
   ID_UTILIZADOR        integer,
   ID_ENTIDADE_MEDICA   integer,
   ID_GESTOR            serial               not null,
   NOME                 text,
   EMAIL                text,
   constraint PK_GESTOR primary key (ID_GESTOR)
);

/*==============================================================*/
/* Tabela: HABITOS                                              */
/* Informação sobre hábitos do utente (Fumar, Escovagem, etc.)  */
/*==============================================================*/
create table HABITOS (
   ESCOVAGEM            text,
   ALIMENTACAO          text,
   CONSUMO_SUBSTANCIAS  text,
   BRUXISMO             text,
   ATIVIDADE_FISICA     text,
   ID_HABITOS           serial               not null,
   constraint PK_HABITOS primary key (ID_HABITOS)
);

/*==============================================================*/
/* Tabela: HISTORICO_DENTARIO                                   */
/* Histórico específico de tratamentos dentários.               */
/*==============================================================*/
create table HISTORICO_DENTARIO (
   MOTIVO_PRIMEIRA_CONSULTA text,
   CONDICOES_DENTARIAS  text,
   TRATAMENTOS_PASSADOS text,
   EXP_ANESTESIA        text,
   HISTORICO_DOR        text,
   ID_HISTORICO_DENTARIO serial               not null,
   constraint PK_HISTORICO_DENTARIO primary key (ID_HISTORICO_DENTARIO)
);

/*==============================================================*/
/* Tabela: HISTORICO_MEDICO                                     */
/* Histórico geral de saúde (Alergias, Doenças, etc.)           */
/*==============================================================*/
create table HISTORICO_MEDICO (
   CONDICOES_SAUDE      text,
   OMD                  text,
   ALERGIAS             text,
   CIRURGIAS_REALIZADAS text,
   INTERNACOES          text,
   GRAVIDEZ             text,
   ID_HISTORICO_MEDICO  serial               not null,
   constraint PK_HISTORICO_MEDICO primary key (ID_HISTORICO_MEDICO)
);

/*==============================================================*/
/* Tabela: MORADAS                                              */
/* Guardamos as moradas aqui.                                   */
/* Removi o ID_UTENTE daqui para evitar ciclo. O Utente é que aponta para a Morada. */
/*==============================================================*/
create table MORADAS (
   CODIGO_POSTAL        text,
   MORADA               text,
   ID_MORADA            serial               not null,
   constraint PK_MORADAS primary key (ID_MORADA)
);

/*==============================================================*/
/* Tabela: NOTIFICACOES                                         */
/* Mensagens enviadas aos utilizadores.                         */
/*==============================================================*/
create table NOTIFICACOES (
   HORARIO              date,
   CONTEUDO             text,
   ID_NOTIFICACAO       serial               not null,
   TITULO               text,
   constraint PK_NOTIFICACOES primary key (ID_NOTIFICACAO)
);

/*==============================================================*/
/* Tabela: PEDIDOS_CONTACTO_NAO_UTILIZADOR                      */
/* Pedidos de contacto feitos pelo site público (quem não tem login) */
/*==============================================================*/
create table PEDIDOS_CONTACTO_NAO_UTILIZADOR (
   NOME                 text,
   TELEMOVEL            text,
   MOTIVO               text,
   ID_PEDIDO_CONTACTO   serial               not null,
   constraint PK_PEDIDOS_CONTACTO_NAO_UTILIZ primary key (ID_PEDIDO_CONTACTO)
);

/*==============================================================*/
/* Tabela: PEDIDOS_CONTACTO_UTILIZADOR                          */
/* Pedidos de contacto feitos por utilizadores logados.         */
/*==============================================================*/
create table PEDIDOS_CONTACTO_UTILIZADOR (
   ID_UTENTE            integer,
   ID_PEDIDO            serial               not null,
   HORARIO              text,
   MOTIVO               text,
   constraint PK_PEDIDOS_CONTACTO_UTILIZADOR primary key (ID_PEDIDO)
);

/*==============================================================*/
/* Tabela: PLANOS_TRATAMENTO                                    */
/* Planos definidos pelo médico para o utente.                  */
/*==============================================================*/
create table PLANOS_TRATAMENTO (
   ID_UTENTE            integer,
   DATA_INICIO          date,
   OBSERVACOES          text,
   ANEXOS               text,
   ID_T_P_TRATAMENTO    integer,
   ID_P_TRATAMENTO      serial               not null,
   constraint PK_PLANOS_TRATAMENTO primary key (ID_P_TRATAMENTO)
);

/*==============================================================*/
/* Tabela: TIPOS_PLANOS_TRATAMENTO                              */
/* Tipos de planos predefinidos (ex: Ortodontia, Branqueamento) */
/*==============================================================*/
create table TIPOS_PLANOS_TRATAMENTO (
   ID_T_P_TRATAMENTO    serial               not null,
   NOME                 text,
   DURACAO              text,
   NUMERO_CONSULTAS     integer,
   INFORMACOES          text,
   constraint PK_TIPOS_PLANOS_TRATAMENTO primary key (ID_T_P_TRATAMENTO)
);

/*==============================================================*/
/* Tabela: TIPOS_UTILIZADOR                                     */
/* Define se é Admin, Médico, Utente, etc.                      */
/*==============================================================*/
create table TIPOS_UTILIZADOR (
   DESIGNACAO_TIPO_UTILIZADOR text,
   ID_TIPO_UTILIZADOR   serial               not null,
   constraint PK_TIPOS_UTILIZADOR primary key (ID_TIPO_UTILIZADOR)
);

/*==============================================================*/
/* Tabela: TIPO_UTENTE                                          */
/* Categoria do utente (ex: Particular, Seguradora X)           */
/*==============================================================*/
create table TIPO_UTENTE (
   DESIGNACAO_TIPO_UTENTE text,
   ID_TIPO_UTENTE       serial               not null,
   constraint PK_TIPO_UTENTE primary key (ID_TIPO_UTENTE)
);

/*==============================================================*/
/* Tabela: UTENTE                                               */
/* Tabela principal com os dados dos pacientes.                 */
/* ID_UTENTE_RESPONSAVEL: Auto-referência para dependentes.     */
/* Se preenchido, este utente é dependente de outro.            */
/*==============================================================*/
create table UTENTE (
   ID_HABITOS           integer,
   ID_HISTORICO_DENTARIO integer,
   ID_HISTORICO_MEDICO  integer,
   ID_UTILIZADOR        integer,
   ID_UTENTE            serial               not null,
   ID_TIPO_UTENTE       integer,
   ID_MORADA            integer,
   ID_ESTADO_CIVIL      integer,
   ID_GENERO            integer,
   ID_UTENTE_RESPONSAVEL integer,  /* FK para o utente responsável (se for dependente) */
   NOME_COMPLETO        text,
   NIF                  text,
   NUS                  text,
   EMAIL                text,
   TELEMOVEL            text,
   DATA_NASC            date,
   constraint PK_UTENTE primary key (ID_UTENTE)
);

/*==============================================================*/
/* Tabela: UTILIZADORES                                         */
/* Tabela para Login. O ID_TIPO_UTILIZADOR agora é integer.     */
/*==============================================================*/
create table UTILIZADORES (
   ID_TIPO_UTILIZADOR   integer, /* Corrigido de char(10) para integer */
   ID_UTILIZADOR        serial               not null,
   PIN_UTILIZADOR       varchar(255), /* Corrigido para varchar para guardar a hash */
   constraint PK_UTILIZADORES primary key (ID_UTILIZADOR)
);

/*==============================================================*/
/* Tabela: UTILIZADORES_NOTIFICACOES                            */
/* Tabela de ligação N:N entre Utilizadores e Notificações.     */
/*==============================================================*/
create table UTILIZADORES_NOTIFICACOES (
   ID_UTILIZADOR        integer, /* Corrigido de char(10) para integer */
   ID_NOTIFICACAO       integer, /* Corrigido de char(10) para integer */
   LIDA                 boolean default false /* Indica se a notificação foi lida */
);

/*==============================================================*/
/* Criação das Chaves Estrangeiras (Foreign Keys)               */
/* Aqui ligamos as tabelas umas às outras.                      */
/*==============================================================*/

alter table AGENDA
   add constraint FK_AGENDA_RELATIONS_ENTIDADE foreign key (ID_ENTIDADE_MEDICA)
      references ENTIDADE_MEDICA (ID_ENTIDADE_MEDICA)
      on delete restrict on update restrict;

alter table CONSULTAS
   add constraint FK_CONSULTA_RELATIONS_UTENTE foreign key (ID_UTENTE)
      references UTENTE (ID_UTENTE)
      on delete restrict on update restrict;

alter table CONSULTAS
   add constraint FK_CONSULTA_RELATIONS_ESTADOS foreign key (ID_ESTADO)
      references ESTADOS (ID_ESTADO)
      on delete restrict on update restrict;

alter table CONSULTAS
   add constraint FK_CONSULTA_RELATIONS_ENTIDADE foreign key (ID_ENTIDADE_MEDICA)
      references ENTIDADE_MEDICA (ID_ENTIDADE_MEDICA)
      on delete restrict on update restrict;

alter table DECLARACOES
   add constraint FK_DECLARAC_RELATIONS_CONSULTA foreign key (ID_CONSULTA)
      references CONSULTAS (ID_CONSULTA)
      on delete restrict on update restrict;

alter table EXAMES
   add constraint FK_EXAMES_RELATIONS_UTENTE foreign key (ID_UTENTE)
      references UTENTE (ID_UTENTE)
      on delete restrict on update restrict;

alter table GESTOR
   add constraint FK_GESTOR_RELATIONS_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADORES (ID_UTILIZADOR)
      on delete restrict on update restrict;

alter table GESTOR
   add constraint FK_GESTOR_RELATIONS_ENTIDADE foreign key (ID_ENTIDADE_MEDICA)
      references ENTIDADE_MEDICA (ID_ENTIDADE_MEDICA)
      on delete restrict on update restrict;

/* 
   Nota: A tabela MORADAS já não tem chave estrangeira para UTENTE 
   porque invertemos a relação para evitar o ciclo.
*/

alter table PEDIDOS_CONTACTO_UTILIZADOR
   add constraint FK_PEDIDOS__RELATIONS_UTENTE foreign key (ID_UTENTE)
      references UTENTE (ID_UTENTE)
      on delete restrict on update restrict;

alter table PLANOS_TRATAMENTO
   add constraint FK_PLANOS_T_RELATIONS_UTENTE foreign key (ID_UTENTE)
      references UTENTE (ID_UTENTE)
      on delete restrict on update restrict;

alter table PLANOS_TRATAMENTO
   add constraint FK_PLANOS_T_RELATIONS_TIPOS_PL foreign key (ID_T_P_TRATAMENTO)
      references TIPOS_PLANOS_TRATAMENTO (ID_T_P_TRATAMENTO)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_REFERENCE_ESTADO_C foreign key (ID_ESTADO_CIVIL)
      references ESTADO_CIVIL (ID_ESTADO_CIVIL)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_REFERENCE_GENERO foreign key (ID_GENERO)
      references GENERO (ID_GENERO)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADORES (ID_UTILIZADOR)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_TIPO_UTE foreign key (ID_TIPO_UTENTE)
      references TIPO_UTENTE (ID_TIPO_UTENTE)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_HABITOS foreign key (ID_HABITOS)
      references HABITOS (ID_HABITOS)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_MORADAS foreign key (ID_MORADA)
      references MORADAS (ID_MORADA)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_HISTORIC foreign key (ID_HISTORICO_MEDICO)
      references HISTORICO_MEDICO (ID_HISTORICO_MEDICO)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_UTENTE_HI_HISTORIC foreign key (ID_HISTORICO_DENTARIO)
      references HISTORICO_DENTARIO (ID_HISTORICO_DENTARIO)
      on delete restrict on update restrict;

alter table UTENTE
   add constraint FK_UTENTE_RELATIONS_RESPONSAVEL foreign key (ID_UTENTE_RESPONSAVEL)
      references UTENTE (ID_UTENTE)
      on delete set null on update restrict;

alter table UTILIZADORES
   add constraint FK_UTILIZAD_RELATIONS_TIPOS_UT foreign key (ID_TIPO_UTILIZADOR)
      references TIPOS_UTILIZADOR (ID_TIPO_UTILIZADOR)
      on delete restrict on update restrict;

alter table UTILIZADORES_NOTIFICACOES
   add constraint FK_UTILIZAD_RELATIONS_UTILIZAD foreign key (ID_UTILIZADOR)
      references UTILIZADORES (ID_UTILIZADOR)
      on delete restrict on update restrict;

alter table UTILIZADORES_NOTIFICACOES
   add constraint FK_UTILIZAD_RELATIONS_NOTIFICA foreign key (ID_NOTIFICACAO)
      references NOTIFICACOES (ID_NOTIFICACAO)
      on delete restrict on update restrict;
