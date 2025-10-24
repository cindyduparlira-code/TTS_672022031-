// ===== script.js =====
// Data menu (menggunakan gambar online agar ZIP kecil)
const menuData = [
  {id:1,name:'Burger Keju',cat:'Makanan',price:25000,img:'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=60'},
  {id:2,name:'Kopi Latte',cat:'Minuman',price:18000,img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=60'},
  {id:3,name:'Donat Cokelat',cat:'Snack',price:10000,img:'https://images.unsplash.com/photo-1572448862528-4c1d2d3f7a79?w=800&q=60'},
  {id:4,name:'Mie Pedas',cat:'Makanan',price:22000,img:'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&q=60'},
  {id:5,name:'Jus Alpukat',cat:'Minuman',price:15000,img:'https://images.unsplash.com/photo-1532634896-26909d0d2b1f?w=800&q=60'},
  {id:6,name:'Pisang Goreng',cat:'Snack',price:10000,img:'https://images.unsplash.com/photo-1617191512273-5b9d0b3f1f28?w=800&q=60'},
];

// state
let cart = [];

// utilities
const formatRp = v => 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const showToast = (msg, autoHide=true) => {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  t.classList.remove('pulse');
  void t.offsetWidth;
  t.classList.add('pulse');
  if(autoHide) setTimeout(()=>{ t.style.display='none'; }, 2200);
}

// render menu
function renderMenu(){
  const container = document.getElementById('menu');
  const cat = document.getElementById('category').value;
  const q = document.getElementById('search').value.trim().toLowerCase();
  container.innerHTML = '';
  const items = menuData.filter(it=>{
    if(cat && it.cat !== cat) return false;
    if(q && !it.name.toLowerCase().includes(q)) return false;
    return true;
  });
  if(items.length===0){
    container.innerHTML = '<div style="grid-column:1/-1;padding:20px;text-align:center;color:#777">Menu tidak ditemukan</div>';
    return;
  }
  items.forEach(it=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <a class="thumb" href="#" onclick="return false"><img src="${it.img}" alt="${it.name}"></a>
      <h3>${it.name}</h3>
      <div class="meta">${it.cat}</div>
      <div class="row">
        <div class="price">${formatRp(it.price)}</div>
        <button class="btn" onclick="addToCart(${it.id}, this)">Tambah</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// cart functions
function addToCart(id, btn){
  const item = menuData.find(m=>m.id===id);
  const found = cart.find(c=>c.id===id);
  if(found) found.qty += 1;
  else cart.push({...item, qty:1});
  renderCart();
  // animasi tombol
  if(btn){ btn.classList.add('pulse'); setTimeout(()=>btn.classList.remove('pulse'),400); }
  showToast(item.name + ' ditambahkan ke keranjang');
}

function removeItem(id){
  cart = cart.filter(c=>c.id !== id);
  renderCart();
  showToast('Item dihapus');
}

function changeQty(id, delta){
  const it = cart.find(c=>c.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty < 1) it.qty = 1;
  renderCart();
}

function calcTotal(){ return cart.reduce((s,i)=>s + i.price * i.qty, 0); }

function renderCart(){
  const list = document.getElementById('cartList');
  const empty = document.getElementById('empty');
  const totalRow = document.getElementById('totalRow');
  const checkoutBtn = document.getElementById('checkoutBtn');
  list.innerHTML = '';
  if(cart.length === 0){
    empty.style.display = 'block';
    totalRow.style.display = 'none';
    checkoutBtn.style.display = 'none';
    return;
  }
  empty.style.display='none';
  cart.forEach(c=>{
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="width:56px;height:44px;background:#fff;border-radius:6px;overflow:hidden;flex-shrink:0"><img src="${c.img}" alt="${c.name}" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="info">
        <div style="font-weight:700">${c.name}</div>
        <div class="small">${formatRp(c.price)} x ${c.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <div style="display:flex;gap:6px">
          <button class="btn" style="background:#fff;color:#111;padding:6px;border-radius:8px" onclick="changeQty(${c.id},-1)">-</button>
          <div style="min-width:28px;text-align:center;padding:6px 6px;background:transparent;border-radius:6px">${c.qty}</div>
          <button class="btn" style="background:#fff;color:#111;padding:6px;border-radius:8px" onclick="changeQty(${c.id},1)">+</button>
        </div>
        <button style="background:transparent;color:#ff6b6b;border:0;cursor:pointer" onclick="removeItem(${c.id})">Hapus</button>
      </div>
    `;
    list.appendChild(row);
  });
  document.getElementById('totalPrice').textContent = formatRp(calcTotal());
  totalRow.style.display='flex';
  checkoutBtn.style.display='block';
}

// checkout flow
document.addEventListener('click', function (e) {
  if(e.target && e.target.id === 'checkoutBtn'){
    openCheckout();
  }
});

function openCheckout(){
  const name = prompt('Nama pemesan:');
  if(!name){ showToast('Checkout dibatalkan', true); return; }
  const phone = prompt('No. HP:');
  if(!phone){ showToast('Checkout dibatalkan', true); return; }
  const address = prompt('Alamat pengiriman:');
  if(!address){ showToast('Checkout dibatalkan', true); return; }
  const total = calcTotal();
  // buat struk sebagai file teks untuk diunduh
  const lines = [];
  lines.push('--- STRUK PESANAN ---');
  lines.push('Nama: ' + name);
  lines.push('HP: ' + phone);
  lines.push('Alamat: ' + address);
  lines.push('');
  lines.push('Item:');
  cart.forEach(c=> lines.push(c.name + ' x ' + c.qty + ' = ' + formatRp(c.price * c.qty)));
  lines.push('');
  lines.push('Total: ' + formatRp(total));
  lines.push('Terima kasih telah memesan!');
  const blob = new Blob([lines.join('\n')], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'struk_pesanan.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('Pesanan dikonfirmasi — struk terunduh');
  cart = [];
  renderCart();
}

// search & filter handlers
document.getElementById('search').addEventListener('input', renderMenu);
document.getElementById('category').addEventListener('change', renderMenu);

// theme toggle & auto detect
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t){
  if(t === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
}
// detect prefers-color-scheme
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(prefersDark ? 'dark' : 'light');
themeBtn.addEventListener('click', ()=>{
  const isDark = document.documentElement.hasAttribute('data-theme');
  applyTheme(isDark ? 'light' : 'dark');
});

// init
renderMenu();
renderCart();
