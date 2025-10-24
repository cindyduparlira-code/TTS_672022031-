const menuData = [
  { nama: "🍔 Burger Keju", harga: 25000, gambar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
  { nama: "☕ Kopi Latte", harga: 18000, gambar: "https://images.unsplash.com/photo-1511920170033-f8396924c348" },
  { nama: "🍩 Donat Cokelat", harga: 12000, gambar: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
  { nama: "🥤 Jus Alpukat", harga: 15000, gambar: "https://images.unsplash.com/photo-1604908812046-7630cb639fd3" },
  { nama: "🍌 Pisang Goreng", harga: 10000, gambar: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3" }
];

const menuContainer = document.getElementById('menu');
const cartItems = document.getElementById('cart-items');
const totalDisplay = document.getElementById('total');
let cart = [];

menuData.forEach(item => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.gambar}" alt="${item.nama}">
    <h3>${item.nama}</h3>
    <p>Rp${item.harga.toLocaleString()}</p>
    <button>Tambah ke Keranjang</button>
  `;
  card.querySelector('button').addEventListener('click', () => addToCart(item));
  menuContainer.appendChild(card);
});

function addToCart(item) {
  cart.push(item);
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.textContent = `${item.nama} - Rp${item.harga.toLocaleString()}`;
    cartItems.appendChild(li);
    total += item.harga;
  });
  totalDisplay.textContent = `Total: Rp${total.toLocaleString()}`;
}

document.getElementById('order-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
  } else {
    const success = Math.random() > 0.5;
    alert(success ? '✅ Pesanan Berhasil!' : '❌ Pesanan Gagal, coba lagi!');
  }
});
