const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Trolley",
    {
      userId:{
        type:DataTypes.INTEGER(),
        allownull:false
      },
      sneakerId:{
        type:DataTypes.INTEGER(),
        allownull:false
      },
      userStock:{
        type:DataTypes.INTEGER(),
        allownull:false,
        defaultValue:1
      }

    },
    { timestamps: false }
  );
};
