const { DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize) => {
    sequelize.define(
        "Transactions",
        {
            status: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cost:{
                type:DataTypes.STRING(),
                allowNull:false
            },
            userId:{
                type:DataTypes.INTEGER(),
                allowNull:false
            },
            cus_address: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_name: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_email: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_phone: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_city: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_country: {
                type: DataTypes.STRING(),
                allowNull: false,
            },
            cus_zip: {
                type: DataTypes.INTEGER(),
                allowNull: false,
            },
            instrument:{
                type:DataTypes.ARRAY(DataTypes.JSONB()),
                allowNull:false
            },

        },
        { timestamps: true }
    );
};
