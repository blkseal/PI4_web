
export default function(sequelize, DataTypes) {
  return sequelize.define('declaracoes', {
    id_consulta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consultas',
        key: 'id_consulta'
      }
    },
    anexo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_declaracao: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'declaracoes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_declaracoes",
        unique: true,
        fields: [
          { name: "id_declaracao" },
        ]
      },
    ]
  });
};
