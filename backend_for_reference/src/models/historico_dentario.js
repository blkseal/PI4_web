
export default function(sequelize, DataTypes) {
  return sequelize.define('historico_dentario', {
    motivo_primeira_consulta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    condicoes_dentarias: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tratamentos_passados: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exp_anestesia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    historico_dor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_historico_dentario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'historico_dentario',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_historico_dentario",
        unique: true,
        fields: [
          { name: "id_historico_dentario" },
        ]
      },
    ]
  });
};
