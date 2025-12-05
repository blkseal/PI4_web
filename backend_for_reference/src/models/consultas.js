
export default function(sequelize, DataTypes) {
  return sequelize.define('consultas', {
    id_entidade_medica: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entidade_medica',
        key: 'id_entidade_medica'
      }
    },
    id_consulta: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estados',
        key: 'id_estado'
      }
    },
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utente',
        key: 'id_utente'
      }
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: true
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'consultas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_consultas",
        unique: true,
        fields: [
          { name: "id_consulta" },
        ]
      },
    ]
  });
};
