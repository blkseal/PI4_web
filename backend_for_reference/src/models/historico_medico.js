
export default function(sequelize, DataTypes) {
  return sequelize.define('historico_medico', {
    condicoes_saude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    omd: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    alergias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cirurgias_realizadas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    internacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gravidez: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_historico_medico: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'historico_medico',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_historico_medico",
        unique: true,
        fields: [
          { name: "id_historico_medico" },
        ]
      },
    ]
  });
};
