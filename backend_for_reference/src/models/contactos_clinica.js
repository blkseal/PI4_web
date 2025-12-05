
export default function(sequelize, DataTypes) {
  return sequelize.define('contactos_clinica', {
    telefone: {
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
    facebook: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instagram: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tiktok: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link_google_maps: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    morada: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_contactos_clinica: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'contactos_clinica',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "pk_contactos_clinica",
        unique: true,
        fields: [
          { name: "id_contactos_clinica" },
        ]
      },
    ]
  });
};
