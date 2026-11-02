const products = [
 {id:1,name:"iPhone 16 Pro",category:"Smartfonlar",price:15499000,oldPrice:16499000,rating:"4.9",reviews:128,tag:"TOP",emoji:"📱",kind:"phone"},
 {id:2,name:"Samsung Galaxy S25",category:"Smartfonlar",price:12999000,oldPrice:13999000,rating:"4.8",reviews:96,tag:"YANGI",emoji:"📱",kind:"phone"},
 {id:3,name:"MacBook Air M4",category:"Noutbuklar",price:17999000,oldPrice:0,rating:"5.0",reviews:74,tag:"PREMIUM",emoji:"💻",kind:"laptop"},
 {id:4,name:"ASUS Zenbook 14",category:"Noutbuklar",price:13999000,oldPrice:14999000,rating:"4.8",reviews:52,tag:"-7%",emoji:"💻",kind:"laptop"},
 {id:5,name:"Sony WH-1000XM5",category:"Audio",price:4299000,oldPrice:4799000,rating:"4.9",reviews:84,tag:"HIT",emoji:"🎧",kind:"audio"},
 {id:6,name:"JBL Charge 5",category:"Audio",price:1899000,oldPrice:2199000,rating:"4.7",reviews:63,tag:"-14%",emoji:"🔊",kind:"audio"},
 {id:7,name:"Apple Watch Series 10",category:"Aqlli soatlar",price:5699000,oldPrice:0,rating:"4.9",reviews:45,tag:"YANGI",emoji:"⌚",kind:"watch"},
 {id:8,name:"Samsung Galaxy Buds3",category:"Audio",price:1599000,oldPrice:1799000,rating:"4.7",reviews:38,tag:"-11%",emoji:"🎧",kind:"audio"},
 {id:9,name:"Lenovo IdeaPad Slim",category:"Noutbuklar",price:7999000,oldPrice:8499000,rating:"4.6",reviews:41,tag:"QULAY",emoji:"💻",kind:"laptop"},
 {id:10,name:"Xiaomi Redmi Note 14",category:"Smartfonlar",price:2699000,oldPrice:2999000,rating:"4.7",reviews:110,tag:"-10%",emoji:"📱",kind:"phone"},
 {id:11,name:"Anker Soundcore",category:"Audio",price:899000,oldPrice:0,rating:"4.6",reviews:29,tag:"VALUE",emoji:"🎧",kind:"audio"},
 {id:12,name:"Galaxy Watch 7",category:"Aqlli soatlar",price:2999000,oldPrice:3299000,rating:"4.8",reviews:33,tag:"-9%",emoji:"⌚",kind:"watch"}
];
const money = n => new Intl.NumberFormat('uz-UZ').format(n) + " so‘m";
let cart = JSON.parse(localStorage.getItem('technovaCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('technovaWishlist') || '[]');
let activeFilter = 'Barchasi', searchTerm = '', showAll = false;
const grid = document.getElementById('productGrid');
const toast = document.getElementById('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
function renderProducts(){
 let list=products.filter(p=>(activeFilter==='Barchasi'||p.category===activeFilter)&&p.name.toLowerCase().includes(searchTerm.toLowerCase()));
 if(!showAll && activeFilter==='Barchasi' && !searchTerm) list=list.slice(0,8);
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-picture ${p.kind}"><span class="product-tag">${p.tag}</span><button class="wish-btn ${wishlist.includes(p.id)?'active':''}" data-wish="${p.id}" aria-label="Sevimlilarga qo‘shish">${wishlist.includes(p.id)?'♥':'♡'}</button><span class="product-emoji">${p.emoji}</span></div><div class="product-info"><div class="product-category">${p.category}</div><h3 class="product-name">${p.name}</h3><div class="product-rating">★ ★ ★ ★ ★ <span>(${p.reviews})</span></div><div class="price-row"><div><div class="price">${money(p.price)}</div>${p.oldPrice?`<div class="old-price">${money(p.oldPrice)}</div>`:''}</div><button class="add-cart" data-add="${p.id}" aria-label="Savatga qo‘shish">+</button></div></div></article>`).join(''):'<p style="grid-column:1/-1;text-align:center;padding:40px;color:#89919b">Bu so‘rov bo‘yicha mahsulot topilmadi.</p>';
 document.getElementById('showMore').style.display=(!searchTerm&&activeFilter==='Barchasi')?'inline-flex':'none';
 document.getElementById('showMore').innerHTML=showAll?'Kamroq ko‘rsatish <span>↑</span>':'Barcha mahsulotlar <span>↓</span>';
}
function persistCart(){localStorage.setItem('technovaCart',JSON.stringify(cart));renderCart()}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});persistCart();notify('Mahsulot savatga qo‘shildi ✓')}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);persistCart()}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
 document.getElementById('cartCount').textContent=count;document.getElementById('drawerCount').textContent=`(${count})`;document.getElementById('cartTotal').textContent=money(total);
 document.getElementById('cartItems').innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-item"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="O‘chirish">✕</button></div>`}).join(''):'<div class="empty-cart"><div style="font-size:38px;margin-bottom:12px">🛒</div>Savatingiz hozircha bo‘sh.<br>O‘zingizga yoqqan texnikani tanlang.</div>';
}
grid.addEventListener('click',e=>{const add=e.target.closest('[data-add]'),wish=e.target.closest('[data-wish]');if(add)addToCart(Number(add.dataset.add));if(wish){const id=Number(wish.dataset.wish);wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];localStorage.setItem('technovaWishlist',JSON.stringify(wishlist));renderProducts();notify(wishlist.includes(id)?'Sevimlilarga qo‘shildi ♥':'Sevimlilardan olib tashlandi')}});
document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');activeFilter=btn.dataset.filter;showAll=true;renderProducts()}));
document.querySelectorAll('.category-card').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.category;showAll=true;document.querySelectorAll('.filter-btn').forEach(b=>b.classList.toggle('selected',b.dataset.filter===activeFilter));renderProducts();document.getElementById('products').scrollIntoView({behavior:'smooth'})}));
document.getElementById('showMore').addEventListener('click',()=>{showAll=!showAll;renderProducts()});
const backdrop=document.getElementById('cartBackdrop');
document.getElementById('cartOpen').addEventListener('click',()=>backdrop.classList.add('open'));
document.getElementById('cartClose').addEventListener('click',()=>backdrop.classList.remove('open'));
backdrop.addEventListener('click',e=>{if(e.target===backdrop)backdrop.classList.remove('open')});
document.getElementById('cartItems').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q)changeQty(Number(q.dataset.qty),Number(q.dataset.delta));if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));persistCart();notify('Mahsulot savatdan olib tashlandi')}});
document.getElementById('checkoutBtn').addEventListener('click',()=>{if(!cart.length){notify('Avval savatga mahsulot qo‘shing');return}notify('Demo do‘kon: buyurtma qabul qilish uchun backend kerak');});
const searchPanel=document.getElementById('searchPanel'),searchInput=document.getElementById('searchInput');
document.querySelector('.search-open').addEventListener('click',()=>{searchPanel.classList.add('open');searchInput.focus()});
document.getElementById('searchClose').addEventListener('click',()=>{searchPanel.classList.remove('open');searchInput.value='';searchTerm='';renderProducts()});
searchInput.addEventListener('input',()=>{searchTerm=searchInput.value.trim();showAll=true;renderProducts();if(searchTerm)document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'})});
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();notify('Rahmat! Obunangiz demo tarzida qabul qilindi.');e.target.reset()});
const menuToggle=document.getElementById('menuToggle'),mainNav=document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainNav.classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){searchPanel.classList.remove('open');backdrop.classList.remove('open')}});
renderProducts();renderCart();
