const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define(
    "Brand",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      isBanned:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    },
    { timestamps: false }
  );
};
