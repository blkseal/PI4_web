
export default function(sequelize, DataTypes) {
  return sequelize.define('notificacoes', {
    horario: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_notificacao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titutlo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notificacoes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_notificacoes",
        unique: true,
        fields: [
          { name: "id_notificacao" },
        ]
      },
    ]
  });
};
