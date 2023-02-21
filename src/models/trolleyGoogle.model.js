const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "TrolleyGoogle",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    { timestamps: false }
  );
};
