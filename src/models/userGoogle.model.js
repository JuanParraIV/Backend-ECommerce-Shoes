const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "UserGoogle",
    {
      dni: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: true,
      },
      given_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      family_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: DataTypes.BIGINT,
        allowNull: true,
        validate: {
          len: [0, 20],
        },
      },
      email: {
        type: DataTypes.STRING(319),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      nickname: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      buyerAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rol: {
        type: DataTypes.ENUM("user", "banned"),
        defaultValue: "user",
      },
      history:{
        type:DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true,
      }
    },
    { timestamps: false }
  );
};
