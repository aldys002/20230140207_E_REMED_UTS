const { Book, BorrowLog, sequelize } = require("../models");

exports.borrowBook = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { bookId, latitude, longitude } = req.body;
    const userId = req.headers['x-user-id'];

    const book = await Book.findByPk(bookId);

    // FIX: Rollback dulu baru return respon
    if (!book) {
      await t.rollback(); 
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    // FIX: Rollback dulu baru return respon
    if (book.stock <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Maaf, stok buku ini sedang habis" });
    }

    // Update stok
    await book.update({ stock: book.stock - 1 }, { transaction: t });

    // Catat log
    const log = await BorrowLog.create({
      userId: userId,
      bookId: bookId,
      latitude: latitude,
      longitude: longitude,
      borrowDate: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Berhasil meminjam buku",
      data: log
    });

  } catch (err) {
    // Pastikan transaksi dibatalkan jika ada error sistem/database
    if (t) await t.rollback(); 
    console.error("DETEKSI ERROR:", err.message); 
    res.status(500).json({ 
      message: "Terjadi kesalahan saat proses peminjaman",
      error: err.message 
    });
  }
};