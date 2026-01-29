const { Book } = require("../models");

// 1. GET ALL BOOKS (Public)
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server saat mengambil buku" });
  }
};

// 2. GET DETAIL BOOK (Public)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id); 
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// 3. CREATE BOOK (Admin Mode)
exports.addBook = async (req, res) => {
  try {
    const { title, author, stock } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title dan Author wajib diisi" });
    }

    const newBook = await Book.create({ title, author, stock }); 
    res.status(201).json({
      message: "Buku berhasil ditambahkan",
      data: newBook
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah buku", error: err.message });
  }
};

// 4. UPDATE BOOK (Admin Mode)
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, stock } = req.body;

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    await book.update({ title, author, stock });
    res.json({ message: "Buku berhasil diperbarui", data: book });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui buku" });
  }
};

// 5. DELETE BOOK (Admin Mode)
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });

    await book.destroy(); 
    res.json({ message: "Buku berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus buku" });
  }
};