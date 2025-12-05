
export default function(sequelize, DataTypes) {
  return sequelize.define('tipo_utente', {
    designacao_tipo_utente: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_tipo_utente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'tipo_utente',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_tipo_utente",
        unique: true,
        fields: [
          { name: "id_tipo_utente" },
        ]
      },
    ]
  });
};
