
export default function(sequelize, DataTypes) {
  return sequelize.define('tipos_utilizador', {
    designacao_tipo_utilizador: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_tipo_utilizador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'tipos_utilizador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipos_utilizador",
        unique: true,
        fields: [
          { name: "id_tipo_utilizador" },
        ]
      },
    ]
  });
};
