const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model
db.Book = require("./Book")(sequelize);
db.BorrowLog = require("./BorrowLog")(sequelize);

// Jalankan relasi jika ada
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;