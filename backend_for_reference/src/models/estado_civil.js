
export default function(sequelize, DataTypes) {
  return sequelize.define('estado_civil', {
    id_estado_civil: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    designacao_estado_civil: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'estado_civil',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_estado_civil",
        unique: true,
        fields: [
          { name: "id_estado_civil" },
        ]
      },
    ]
  });
};
