
export default function(sequelize, DataTypes) {
  return sequelize.define('pedidos_contacto_nao_utilizador', {
    nome: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telemovel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_pedido_contacto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'pedidos_contacto_nao_utilizador',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_pedidos_contacto_nao_utiliz",
        unique: true,
        fields: [
          { name: "id_pedido_contacto" },
        ]
      },
    ]
  });
};
