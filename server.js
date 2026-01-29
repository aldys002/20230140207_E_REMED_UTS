const express = require("express");
const { sequelize } = require("./models"); 
const bookRoutes = require("./routes/bookRoutes");


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); 
app.use("/api/books", bookRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("✅ Database & Tables synchronized successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🌐 Akses Frontend di: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

startServer();