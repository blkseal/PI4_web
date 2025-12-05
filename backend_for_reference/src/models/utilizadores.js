
export default function(sequelize, DataTypes) {
  return sequelize.define('utilizadores', {
    id_tipo_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipos_utilizador',
        key: 'id_tipo_utilizador'
      }
    },
    id_utilizador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pin_utilizador: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
    // Nota: O email NÃO está nesta tabela. Está nas tabelas utente/gestor.
  }, {
    sequelize,
    tableName: 'utilizadores',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_utilizadores",
        unique: true,
        fields: [
          { name: "id_utilizador" },
        ]
      },
    ]
  });
};
