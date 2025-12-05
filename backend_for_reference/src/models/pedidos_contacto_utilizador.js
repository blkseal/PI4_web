
export default function(sequelize, DataTypes) {
  return sequelize.define('pedidos_contacto_utilizador', {
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utente',
        key: 'id_utente'
      }
    },
    id_pedido: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    horario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pedidos_contacto_utilizador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_pedidos_contacto_utilizador",
        unique: true,
        fields: [
          { name: "id_pedido" },
        ]
      },
    ]
  });
};
