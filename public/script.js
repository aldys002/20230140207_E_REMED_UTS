const userView = document.getElementById('userView');
const adminView = document.getElementById('adminView');
const userRole = document.getElementById('userRole');

// 1. Ambil Data Buku dari Server
async function fetchBooks() {
    try {
        const res = await fetch('/api/books');
        const books = await res.json();
        
        const listUser = document.getElementById('bookListUser');
        const listAdmin = document.getElementById('bookListAdmin');
        
        if (listUser) listUser.innerHTML = '';
        if (listAdmin) listAdmin.innerHTML = '';

        books.forEach(book => {
            // Tampilan User
            if (listUser) {
                listUser.innerHTML += `
                    <tr>
                        <td>${book.id}</td>
                        <td><strong>${book.title}</strong></td>
                        <td>${book.author}</td>
                        <td><span class="badge ${book.stock > 0 ? 'bg-success' : 'bg-danger'}">${book.stock}</span></td>
                        <td><button class="btn btn-sm btn-primary" onclick="borrowBook(${book.id})">Pinjam</button></td>
                    </tr>`;
            }
            // Tampilan Admin
            if (listAdmin) {
                listAdmin.innerHTML += `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.stock}</td>
                        <td class="text-center">
                            <button class="btn btn-xs btn-warning" onclick="prepareEdit(${book.id}, '${book.title}', '${book.author}', ${book.stock})">✏️ Edit</button>
                            <button class="btn btn-xs btn-danger" onclick="deleteBook(${book.id})">🗑️ Hapus</button>
                            <button class="btn btn-xs btn-info text-white" onclick="viewDetail(${book.id})">👁️ Detail</button>
                        </td>
                    </tr>`;
            }
        });
    } catch (e) { console.error("Error Fetch:", e); }
}

// 2. Login/Logout Admin
function checkAdminLogin(val) {
    if (val === 'admin') {
        const pass = prompt("Password Admin:");
        if (pass === "admin123") {
            userView.style.display = 'none';
            adminView.style.display = 'block';
            fetchBooks();
        } else {
            alert("Password Salah!");
            userRole.value = 'user';
        }
    }
}

function logoutAdmin() {
    userView.style.display = 'block';
    adminView.style.display = 'none';
    userRole.value = 'user';
    resetForm();
}

// 3. PREPARE EDIT: Masukkan data ke form di kiri
function prepareEdit(id, title, author, stock) {
    document.getElementById('editBookId').value = id;
    document.getElementById('newTitle').value = title;
    document.getElementById('newAuthor').value = author;
    document.getElementById('newStock').value = stock;

    document.getElementById('formHeader').innerText = "✏️ Edit Buku";
    document.getElementById('formHeader').className = "card-header bg-warning text-dark fw-bold";
    document.getElementById('btnSave').innerText = "Simpan Perubahan";
    document.getElementById('btnSave').className = "btn btn-warning w-100 fw-bold";
    document.getElementById('btnCancel').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. RESET FORM: Kembalikan form ke mode Tambah
function resetForm() {
    document.getElementById('editBookId').value = '';
    document.getElementById('newTitle').value = '';
    document.getElementById('newAuthor').value = '';
    document.getElementById('newStock').value = '1';
    
    document.getElementById('formHeader').innerText = "Tambah Buku Baru";
    document.getElementById('formHeader').className = "card-header bg-success text-white fw-bold";
    document.getElementById('btnSave').innerText = "Simpan ke Database";
    document.getElementById('btnSave').className = "btn btn-success w-100";
    document.getElementById('btnCancel').style.display = 'none';
}

// 5. HANDLE SAVE: Fungsi untuk POST (Tambah) atau PUT (Update)
async function handleSave() {
    const id = document.getElementById('editBookId').value;
    const title = document.getElementById('newTitle').value;
    const author = document.getElementById('newAuthor').value;
    const stock = document.getElementById('newStock').value;

    if (!title || !author) return alert("Harap isi semua field!");

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/books/${id}` : '/api/books';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
            body: JSON.stringify({ title, author, stock: parseInt(stock) })
        });

        if (res.ok) {
            alert(id ? "✅ Berhasil Update!" : "✅ Berhasil Tambah!");
            resetForm();
            fetchBooks();
        }
    } catch (e) { alert("Gagal koneksi ke server"); }
}

// 6. Delete & Detail & Borrow
async function deleteBook(id) {
    if (confirm("Hapus buku ini?")) {
        await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { 'x-user-role': 'admin' } });
        fetchBooks();
    }
}

async function viewDetail(id) {
    const res = await fetch(`/api/books/${id}`);
    const b = await res.json();
    alert(`DETAIL BUKU:\nJudul: ${b.title}\nPenulis: ${b.author}\nStok: ${b.stock}`);
}

async function borrowBook(id) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const res = await fetch('/api/books/borrow', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'x-user-role': 'user', 
                'x-user-id': document.getElementById('userId').value 
            },
            body: JSON.stringify({ bookId: id, latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        });
        const d = await res.json();
        alert(d.message);
        fetchBooks();
    });
}

fetchBooks();