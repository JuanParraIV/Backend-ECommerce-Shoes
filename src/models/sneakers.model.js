const { DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define(
    "sneaker",
    {
      brand_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_name: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      retail_price_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      size_range: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: false,
      },
      grid_picture_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      original_picture_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      main_picture_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      has_stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("New", "Used"),
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
