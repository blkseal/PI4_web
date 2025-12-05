
export default function(sequelize, DataTypes) {
  return sequelize.define('tipos_planos_tratamento', {
    id_t_p_tratamento: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    numero_consultas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    informacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tipos_planos_tratamento',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipos_planos_tratamento",
        unique: true,
        fields: [
          { name: "id_t_p_tratamento" },
        ]
      },
    ]
  });
};
