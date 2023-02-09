const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { ENV } = require('./config');
let sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize({
      database: ENV.database,
      dialect: "postgres",
      host: ENV.host,
      port: ENV.port,
      username: ENV.username,
      password: ENV.password,
      pool: {
        max: 3,
        min: 1,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
      },
      ssl: true,
    })
    : new Sequelize(`postgres://${ENV.username}:${ENV.password}@${ENV.host}/${ENV.database}`,
      { logging: false, native: false }
    );

/* const sequelize = new Sequelize(`postgres://${ENV.user}:${ENV.password}@${ENV.host}/${ENV.database}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
}); */
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '../models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '../models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Category, Sneaker, Brand, Admin, Cart, Payment,User,Trolley,Transactions, Favorite} = sequelize.models;

// Aca vendrian las relaciones
/* Admin.hasMany(Sneaker);
Sneaker.belongsTo(Admin); */

User.hasOne(Favorite);
Favorite.belongsTo(User, {
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
})

Transactions.hasOne(User);
User.belongsTo(Transactions,{
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
})

User.belongsToMany(Sneaker, {
  through: Trolley,
});
Sneaker.belongsToMany(User, {
  through: Trolley,
});


Payment.belongsToMany(Cart, {
  through: "Transaction",
});
Cart.belongsToMany(Payment, {
  through: "Transaction",
});
Brand.hasMany(Sneaker, { onDelete: 'cascade', onUpdate: 'cascade', hooks: true });
Sneaker.belongsTo(Brand);
Category.hasMany(Sneaker, { onDelete: 'cascade', onUpdate: 'cascade', hooks: true });
Sneaker.belongsTo(Category);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
