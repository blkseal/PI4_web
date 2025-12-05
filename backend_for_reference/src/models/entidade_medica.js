
export default function(sequelize, DataTypes) {
  return sequelize.define('entidade_medica', {
    omd: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_entidade_medica: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'entidade_medica',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_entidade_medica",
        unique: true,
        fields: [
          { name: "id_entidade_medica" },
        ]
      },
    ]
  });
};
