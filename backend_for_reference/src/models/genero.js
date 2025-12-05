
export default function(sequelize, DataTypes) {
  return sequelize.define('genero', {
    id_genero: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    designacao_genero: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'genero',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_genero",
        unique: true,
        fields: [
          { name: "id_genero" },
        ]
      },
    ]
  });
};
