
export default function(sequelize, DataTypes) {
  return sequelize.define('habitos', {
    escovagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    alimentacao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    consumo_substancias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bruxismo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    atividade_fisica: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_habitos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'habitos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_habitos",
        unique: true,
        fields: [
          { name: "id_habitos" },
        ]
      },
    ]
  });
};
