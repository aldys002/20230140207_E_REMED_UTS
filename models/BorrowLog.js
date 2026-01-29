const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BorrowLog extends Model {
    static associate(models) {
      BorrowLog.belongsTo(models.Book, { 
        foreignKey: "bookId", 
        as: "book" 
      });
    }
  }

  BorrowLog.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      borrowDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      latitude: {
        type: DataTypes.FLOAT, 
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT, 
      },
    },
    {
      sequelize,
      modelName: "BorrowLog",
      tableName: "BorrowLogs",
      timestamps: false,
    }
  );

  return BorrowLog;
};