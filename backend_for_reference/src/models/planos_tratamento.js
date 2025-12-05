
export default function(sequelize, DataTypes) {
  return sequelize.define('planos_tratamento', {
    id_utente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utente',
        key: 'id_utente'
      }
    },
    data_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    anexos: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_t_p_tratamento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipos_planos_tratamento',
        key: 'id_t_p_tratamento'
      }
    },
    id_p_tratamento: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'planos_tratamento',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_planos_tratamento",
        unique: true,
        fields: [
          { name: "id_p_tratamento" },
        ]
      },
    ]
  });
};
