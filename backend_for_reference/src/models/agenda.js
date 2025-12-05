
export default function(sequelize, DataTypes) {
  return sequelize.define('agenda', {
    id_entidade_medica: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entidade_medica',
        key: 'id_entidade_medica'
      }
    },
    id_agenda: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: true
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agenda',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_agenda",
        unique: true,
        fields: [
          { name: "id_agenda" },
        ]
      },
    ]
  });
};
