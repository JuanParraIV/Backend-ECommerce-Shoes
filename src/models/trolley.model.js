const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Trolley",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UserGoogleId:{
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    { timestamps: false }
  );
};
