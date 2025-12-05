
export default function(sequelize, DataTypes) {
  return sequelize.define('estados', {
    id_estado: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    valor_estado: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'estados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_estados",
        unique: true,
        fields: [
          { name: "id_estado" },
        ]
      },
    ]
  });
};
