
export default function(sequelize, DataTypes) {
  return sequelize.define('moradas', {
    codigo_postal: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    morada: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_morada: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'moradas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_moradas",
        unique: true,
        fields: [
          { name: "id_morada" },
        ]
      },
    ]
  });
};
