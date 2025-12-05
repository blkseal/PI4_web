
export default function(sequelize, DataTypes) {
  return sequelize.define('gestor', {
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizadores',
        key: 'id_utilizador'
      }
    },
    id_entidade_medica: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entidade_medica',
        key: 'id_entidade_medica'
      }
    },
    id_gestor: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'gestor',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_gestor",
        unique: true,
        fields: [
          { name: "id_gestor" },
        ]
      },
    ]
  });
};
