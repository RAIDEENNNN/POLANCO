const fallbackVehicles = [
  {id:1,type:'sports',name:'2024 Porsche 911 Carrera',price:185000000,detail:'3.0L · Automatic · 2,100 km',image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'2,100 km',engine:'3.0L Twin-Turbo',drive:'Rear-wheel'},
  {id:2,type:'suv',name:'2023 Range Rover Autobiography',price:240000000,detail:'4.4L · Automatic · 8,400 km',image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=85',year:'2023',mileage:'8,400 km',engine:'4.4L V8',drive:'All-wheel'},
  {id:3,type:'sedan',name:'2024 Mercedes-Benz S 580',price:198000000,detail:'4.0L · Automatic · 3,200 km',image:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'3,200 km',engine:'4.0L Bi-Turbo',drive:'All-wheel'},
  {id:4,type:'suv',name:'2023 Lamborghini Urus S',price:390000000,detail:'4.0L · Automatic · 6,700 km',image:'https://images.unsplash.com/photo-1662944549715-b08d4f58c6da?auto=format&fit=crop&w=1200&q=85',year:'2023',mileage:'6,700 km',engine:'4.0L V8',drive:'All-wheel'},
  {id:5,type:'sports',name:'2022 Ferrari Roma',price:350000000,detail:'3.9L · Automatic · 4,900 km',image:'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=85',year:'2022',mileage:'4,900 km',engine:'3.9L Twin-Turbo',drive:'Rear-wheel'},
  {id:6,type:'suv',name:'2024 Lexus LX 600 F Sport',price:175000000,detail:'3.5L · Automatic · 1,800 km',image:'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'1,800 km',engine:'3.5L Twin-Turbo',drive:'All-wheel'},
  {id:7,type:'sports',name:'2024 BMW M4 Competition',price:142000000,detail:'3.0L · Automatic · 900 km',image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'900 km',engine:'3.0L Twin-Turbo',drive:'All-wheel'},
  {id:8,type:'suv',name:'2024 Mercedes-AMG G 63',price:310000000,detail:'4.0L · Automatic · 1,200 km',image:'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'1,200 km',engine:'4.0L Bi-Turbo',drive:'All-wheel'},
  {id:9,type:'sedan',name:'2023 Bentley Flying Spur',price:295000000,detail:'4.0L · Automatic · 5,600 km',image:'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=85',year:'2023',mileage:'5,600 km',engine:'4.0L V8',drive:'All-wheel'},
  {id:10,type:'sports',name:'2023 Audi R8 V10',price:265000000,detail:'5.2L · Automatic · 3,900 km',image:'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=85',year:'2023',mileage:'3,900 km',engine:'5.2L V10',drive:'All-wheel'},
  {id:11,type:'suv',name:'2024 Cadillac Escalade Sport',price:180000000,detail:'6.2L · Automatic · 2,700 km',image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'2,700 km',engine:'6.2L V8',drive:'All-wheel'},
  {id:12,type:'sedan',name:'2024 Porsche Panamera 4',price:205000000,detail:'2.9L · Automatic · 1,100 km',image:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=85',year:'2024',mileage:'1,100 km',engine:'2.9L Twin-Turbo',drive:'All-wheel'}
];

const fallbackPromotions = [
  {id:'finance',tag:'FINANCE',title:'Drive now. Pay smarter.',description:'Enjoy a reduced 13.5% annual rate on selected 2024 vehicles with terms up to 48 months.',cta:'Estimate your payment',target:'#finance',tone:'acid'},
  {id:'trade',tag:'TRADE-IN BONUS',title:'More value for your current car.',description:'Receive an additional ₦5,000,000 trade-in value when upgrading to a Polanco Select SUV.',cta:'Value my car',target:'#contact',tone:'dark'},
  {id:'service',tag:'OWNERSHIP',title:'One year of care, included.',description:'Complimentary scheduled servicing for 12 months on all vehicles purchased this season.',cta:'See eligible cars',target:'#inventory',tone:'image'}
];

let vehicles = fallbackVehicles;
let promotions = fallbackPromotions;
let whatsappNumber = '2348020007626';
const money = value => `₦${Math.round(value).toLocaleString('en-NG')}`;
const grid = document.querySelector('#vehicleGrid');
const status = document.querySelector('#inventoryStatus');

async function api(path, options={}){
  const response = await fetch(path,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
  if(!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function updateFilterCounts(){
  document.querySelectorAll('.filter').forEach(button=>{
    const filter=button.dataset.filter;
    const count=filter==='all'?vehicles.length:vehicles.filter(v=>v.type===filter).length;
    button.querySelector('sup').textContent=count;
  });
}

function renderVehicles(filter='all'){
  const visible=vehicles.filter(v=>filter==='all'||v.type===filter);
  grid.innerHTML=visible.map(v=>`<article class="vehicle-card fade-in" data-type="${v.type}" data-id="${v.id}" tabindex="0" role="button" aria-label="View ${v.name}"><div class="vehicle-image" role="img" aria-label="${v.name}" style="background-image:url('${v.image}')">${v.badge?`<span class="car-badge">${v.badge}</span>`:''}</div><div class="vehicle-meta"><div class="vehicle-top"><h3>${v.name}</h3><strong>${money(v.price)}</strong></div><p>${v.detail}</p></div></article>`).join('');
  grid.setAttribute('aria-label',`${filter==='all'?'All':filter} vehicles, ${visible.length} results`);
  status.textContent=`Showing ${visible.length} ${visible.length===1?'vehicle':'vehicles'}`;
}

function renderPromotions(){
  document.querySelector('#promoGrid').innerHTML=promotions.map(p=>`<article class="promo-card promo-${p.tone}"><span>${p.tag}</span><h3>${p.title}</h3><p>${p.description}</p><a href="${p.target}" class="promo-link">${p.cta} <b>→</b></a></article>`).join('');
}

async function hydrateFromApi(){
  try{
    const [vehicleData,promoData,config]=await Promise.all([api('/api/vehicles'),api('/api/promotions'),api('/api/config')]);
    vehicles=vehicleData.data; promotions=promoData.data;
    configureWhatsApp(config.whatsapp); renderSocials(config.socials);
    document.documentElement.dataset.api='connected';
  }catch(error){
    document.documentElement.dataset.api='offline';
  }
  updateFilterCounts();renderVehicles();renderPromotions();
}

function renderSocials(socials){
  const labels={instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',x:'X / Twitter',youtube:'YouTube'};
  const links=Object.entries(socials||{}).filter(([,url])=>url).map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${labels[name]||name} ↗</a>`);
  links.push(`<a href="${document.querySelector('#whatsappSupport').href}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`);
  document.querySelector('#socialLinks').innerHTML=links.join('');
}

function configureWhatsApp(number){
  if(!number)return;
  whatsappNumber=number.replace(/\D/g,'');
  const message=encodeURIComponent("Hello Polanco Motors, I'd like help finding a vehicle.");
  document.querySelector('#whatsappSupport').href=`https://wa.me/${whatsappNumber}?text=${message}`;
}

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
  button.classList.add('active');button.setAttribute('aria-pressed','true');renderVehicles(button.dataset.filter);
}));

const vehicleDialog=document.querySelector('#vehicleDialog');
function openVehicle(id){
  const v=vehicles.find(car=>String(car.id)===String(id));if(!v)return;
  document.querySelector('#vehicleDialogContent').innerHTML=`<div class="dialog-grid"><div class="dialog-image" role="img" aria-label="${v.name}" style="background-image:url('${v.image}')"></div><div class="dialog-copy"><p class="eyebrow">POLANCO SELECT</p><h2 id="vehicleDialogTitle">${v.name}</h2><p class="dialog-price">${money(v.price)}</p><div class="specs"><div><small>Year</small><strong>${v.year}</strong></div><div><small>Mileage</small><strong>${v.mileage}</strong></div><div><small>Engine</small><strong>${v.engine}</strong></div><div><small>Drivetrain</small><strong>${v.drive}</strong></div></div><button class="button button-dark" data-enquire>Enquire about this car <span>→</span></button></div></div>`;
  vehicleDialog.showModal();document.querySelector('[data-enquire]').onclick=()=>{vehicleDialog.close();openConcierge(v.name)};
}
grid.addEventListener('click',e=>{const card=e.target.closest('.vehicle-card');if(card)openVehicle(card.dataset.id)});
grid.addEventListener('keydown',e=>{const card=e.target.closest('.vehicle-card');if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openVehicle(card.dataset.id)}});
document.querySelectorAll('.close-dialog').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()}));

const concierge=document.querySelector('#conciergeDialog');
function openConcierge(vehicle=''){
  const form=document.querySelector('#conciergeForm'),success=document.querySelector('.form-success');
  form.hidden=false;success.hidden=true;form.reset();if(vehicle)form.elements.message.value=`I'm interested in the ${vehicle}.`;concierge.showModal();
}
document.querySelectorAll('[data-open-concierge]').forEach(btn=>btn.addEventListener('click',()=>openConcierge()));
document.querySelector('#conciergeForm').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.target,button=form.querySelector('[type="submit"]'),success=document.querySelector('.form-success');
  const payload=Object.fromEntries(new FormData(form).entries());button.disabled=true;button.firstChild.textContent='Sending... ';
  try{await api('/api/leads',{method:'POST',body:JSON.stringify(payload)});success.textContent='Thank you — your request has been received. A Polanco specialist will contact you shortly.'}
  catch(error){success.innerHTML=`Your browser is viewing the offline version. Please reach us directly on <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.`}
  form.hidden=true;success.hidden=false;button.disabled=false;button.firstChild.textContent='Request a callback ';
});

const price=document.querySelector('#price'),deposit=document.querySelector('#deposit');let term=36;
function calculate(){const principal=Number(price.value)*(1-Number(deposit.value)/100),monthlyRate=.15/12,payment=principal*(monthlyRate*Math.pow(1+monthlyRate,term))/(Math.pow(1+monthlyRate,term)-1);document.querySelector('#priceOutput').textContent=money(price.value);document.querySelector('#depositOutput').textContent=`${money(Number(price.value)*Number(deposit.value)/100)} · ${deposit.value}%`;document.querySelector('#monthlyOutput').innerHTML=`${money(payment)}<small>/mo</small>`}
[price,deposit].forEach(input=>input.addEventListener('input',calculate));
document.querySelectorAll('[data-months]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-months]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');term=Number(btn.dataset.months);calculate()}));calculate();

const menuButton=document.querySelector('.menu-button'),mobileNav=document.querySelector('.mobile-nav');
menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu')});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileNav.classList.contains('open')){mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');menuButton.focus()}});

hydrateFromApi();
