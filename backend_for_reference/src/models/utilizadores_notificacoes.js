
export default function(sequelize, DataTypes) {
  return sequelize.define('utilizadores_notificacoes', {
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizadores',
        key: 'id_utilizador'
      }
    },
    id_notificacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notificacoes',
        key: 'id_notificacao'
      }
    }
  }, {
    sequelize,
    tableName: 'utilizadores_notificacoes',
    schema: 'public',
    timestamps: false
  });
};
