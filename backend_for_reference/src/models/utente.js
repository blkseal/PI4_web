
export default function(sequelize, DataTypes) {
  return sequelize.define('utente', {
    id_habitos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'habitos',
        key: 'id_habitos'
      }
    },
    id_historico_dentario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'historico_dentario',
        key: 'id_historico_dentario'
      }
    },
    id_historico_medico: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'historico_medico',
        key: 'id_historico_medico'
      }
    },
    id_utilizador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilizadores',
        key: 'id_utilizador'
      }
    },
    id_utente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_tipo_utente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_utente',
        key: 'id_tipo_utente'
      }
    },
    id_morada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moradas',
        key: 'id_morada'
      }
    },
    id_estado_civil: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estado_civil',
        key: 'id_estado_civil'
      }
    },
    id_genero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'genero',
        key: 'id_genero'
      }
    },
    nome_completo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nif: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nus: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telemovel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'utente',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_utente",
        unique: true,
        fields: [
          { name: "id_utente" },
        ]
      },
    ]
  });
};
