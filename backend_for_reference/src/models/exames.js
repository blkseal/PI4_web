
export default function(sequelize, DataTypes) {
  return sequelize.define('exames', {
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utente',
        key: 'id_utente'
      }
    },
    anexo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_exame: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'exames',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_exames",
        unique: true,
        fields: [
          { name: "id_exame" },
        ]
      },
    ]
  });
};
