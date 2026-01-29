const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      // Relasi: Satu buku bisa punya banyak catatan peminjaman
      Book.hasMany(models.BorrowLog, { 
        foreignKey: "bookId", 
        as: "borrowLogs" 
      });
    }
  }

  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "Books",
      timestamps: false,
    }
  );

  return Book;
};