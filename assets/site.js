(function(){
var UI={
 en:{city:'Talas City Hall',sub:'Talas Shaar Meriyasy',home:'Home',waste:'Rubbish',bus:'Marshrutkas',park:'Parking fines',heat:'Heating',council:'City Council',about:'City Hall',
  foot1:'Talas City Hall',foot2:'Reception: Mon-Fri 9:00-18:00, Sat 9:00-13:00',foot3:'City services line 1-09 (24 h)'},
 ir:{city:'Talas Shaar Meriyasy',sub:'Talas City Hall',home:'Bashkı bet',waste:'Tazalık',bus:'Marshrutkalar',park:'Toktotuu aıyptarı',heat:'Jılıtuu',council:'Shaar Keñeshi',about:'Meriya',
  foot1:'Talas Shaar Meriyasy',foot2:'Kabıl aluu: Dsh-Jm 9:00-18:00, Ish 9:00-13:00',foot3:'Shaar kızmattarı 1-09 (24 saat)'},
 ru:{city:'Мэрия Таласа',sub:'Talas Shaar Meriyasy',home:'Главная',waste:'Вывоз мусора',bus:'Маршрутки',park:'Штрафы за парковку',heat:'Отопление',council:'Городской совет',about:'О мэрии',
  foot1:'Мэрия города Талас',foot2:'Приём: Пн-Пт 9:00-18:00, Сб 9:00-13:00',foot3:'Городская служба 1-09 (круглосуточно)'}
};
var lang='en';try{lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('talas_lang')||'en';}catch(e){}
if(!UI[lang])lang='en';
function u(k){return UI[lang][k]||UI.en[k];}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var page=document.body.getAttribute('data-page');
var nav=[['index.html','home'],['waste.html','waste'],['transport.html','bus'],['parking.html','park'],['heating.html','heat'],['council.html','council'],['about.html','about']];
var h=document.getElementById('hdr');
h.innerHTML='<div class="wrap"><a class="brand" href="index.html"><img src="assets/talas-mark.svg" alt=""><div><b>talas<i>.</i></b><span>'+esc(u('city'))+'</span></div></a>'+
 '<button class="burger" aria-label="Menu">&#9776;</button><nav class="main">'+nav.map(function(n){return '<a href="'+n[0]+'"'+(page===n[1]?' class="on"':'')+'>'+esc(u(n[1]))+'</a>';}).join('')+'</nav>'+
 '<div class="lang">'+['ir','ru','en'].map(function(l){return '<a href="#" data-l="'+l+'"'+(l===lang?' class="on"':'')+'>'+l.toUpperCase()+'</a>';}).join('')+'</div></div>';
h.querySelector('.burger').onclick=function(){h.querySelector('nav').classList.toggle('open');};
[].forEach.call(h.querySelectorAll('.lang a'),function(a){a.onclick=function(e){e.preventDefault();try{localStorage.setItem('talas_lang',a.getAttribute('data-l'));}catch(x){}location.reload();};});
document.getElementById('ftr').innerHTML='<div class="wrap cols"><div><b>'+esc(u('foot1'))+'</b><br>Meriya Square 1, Talas 724000<br>'+esc(u('foot2'))+'</div><div>'+esc(u('foot3'))+'<br>Talas Suu (water) 1-52 · Talas Jylu Tarmaktary (heat) 1-50<br><a href="mailto:info@talas.iradgov.org">info@talas.iradgov.org</a></div><div><a href="https://iradgov.org/">Office of the Governor</a><br><a href="https://maps.attelkom.net/">Attelkom Maps</a><br><a href="https://e-irad.org/">e-Irad services</a><br>&copy; 2026 Talas City Hall</div></div>';

function load(cb){fetch('data/city.json').then(function(r){return r.json();}).then(cb);}
function fmt(d){var p=d.split('-');return p[2]+'.'+p[1]+'.'+p[0];}
var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* weather and air from the government daily figures */
var wx=document.getElementById('wx');
if(wx){fetch('https://iradgov.org/data/today.json').then(function(r){return r.json();}).then(function(d){
 var p=d.weather.places.filter(function(x){return x.id==='talas';})[0];
 var a=(d.air&&d.air.places||[]).filter(function(x){return x.id==='talas';})[0];
 var col=a?(a.aqi<=50?'#2f9e5b':a.aqi<=100?'#c9a21a':a.aqi<=150?'#d9741a':'#c0392b'):'';
 wx.innerHTML='<h2>Talas today</h2><div class="t">'+p.high+'°</div><small>'+esc(p.label[lang]||p.label.en)+', night '+p.low+'°</small>'+
  (a?'<p>Air: <span class="aqi" style="background:'+col+';color:#fff">AQI '+a.aqi+'</span></p>':'')+
  (d.power?'<p style="font-size:14px;color:#5b6b78">'+esc(d.power.supply[lang]||d.power.supply.en)+'</p>':'');
}).catch(function(){wx.innerHTML='<h2>Talas today</h2><p>Weather data unavailable.</p>';});}

if(page==='home'){load(function(d){
 document.getElementById('news').innerHTML='<h2>City news</h2>'+d.news.map(function(n){return '<article><time>'+fmt(n.d)+'</time><h3>'+esc(n.t)+'</h3><p>'+esc(n.x)+'</p></article>';}).join('');
});
 var f=document.getElementById('sf');if(f)f.onsubmit=function(e){e.preventDefault();var q=f.q.value.toLowerCase();
  var map=[['rubbish waste bin garbage trash collection','waste.html'],['bus marshrutka route transport','transport.html'],['parking fine car plate','parking.html'],['heat heating radiator hot','heating.html'],['council minutes session deputy','council.html']];
  for(var i=0;i<map.length;i++){if(map[i][0].split(' ').some(function(w){return q.indexOf(w)>=0;})){location.href=map[i][1];return;}}location.href='about.html#contact';};
}
if(page==='waste'){load(function(d){
 var s=document.getElementById('dsel');s.innerHTML='<option value="">Choose your district…</option>'+d.districts.map(function(x){return '<option value="'+x.id+'">'+esc(x.name)+'</option>';}).join('');
 var saved='';try{saved=localStorage.getItem('talas_district')||'';}catch(e){}
 function show(){var x=d.districts.filter(function(y){return y.id===s.value;})[0],r=document.getElementById('dres');if(!x){r.innerHTML='';return;}
  try{localStorage.setItem('talas_district',x.id);}catch(e){}
  var now=new Date(),next=[];for(var i=0;i<14&&next.length<3;i++){var t=new Date(now.getTime()+i*864e5);if(x.days.indexOf(t.getDay())>=0)next.push(t);}
  r.innerHTML='<div class="card"><h2>'+esc(x.name)+'</h2><p>Collection days: '+(x.days.length===7?'every day':x.days.map(function(k){return '<span class="pill">'+DAYS[k]+'</span>';}).join(' '))+' · '+x.time+'</p><p><b>Next collections:</b> '+next.map(function(t){return (t.toDateString()===now.toDateString()?'today':DAYS[t.getDay()]+' '+t.getDate()+'.'+(t.getMonth()+1));}).join(', ')+'</p>'+(x.note?'<p>'+esc(x.note)+'</p>':'')+'</div>';}
 s.onchange=show;if(saved){s.value=saved;show();}
});}
if(page==='bus'){load(function(d){
 var all=[];d.routes.forEach(function(r){r.stops.forEach(function(st){if(all.indexOf(st)<0)all.push(st);});});all.sort();
 var a=document.getElementById('from'),b=document.getElementById('to'),o='<option value="">any stop</option>'+all.map(function(x){return '<option>'+esc(x)+'</option>';}).join('');a.innerHTML=o;b.innerHTML=o;
 function list(){var f=a.value,t=b.value,rs=d.routes.filter(function(r){return (!f||r.stops.indexOf(f)>=0)&&(!t||r.stops.indexOf(t)>=0);});
  document.getElementById('routes').innerHTML=(rs.length?rs.map(function(r){return '<div class="route"><div class="no'+(r.kind==='bus'?' bus':'')+'">'+r.no+'</div><div><b>'+(r.kind==='bus'?'City bus':'Marshrutka')+' '+r.no+'</b> · every '+r.every+' min<div class="st">'+r.stops.map(esc).join(' → ')+'</div></div></div>';}).join(''):'<p>No direct route. Change at Central Square.</p>');}
 a.onchange=b.onchange=list;list();
});}
if(page==='park'){
 var pf=document.getElementById('pform');pf.onsubmit=function(e){e.preventDefault();var v=pf.plate.value.toUpperCase().replace(/\s+/g,'');var r=document.getElementById('pres');
  if(v.length<5){r.innerHTML='<div class="note">Enter the full number as on the plate.</div>';return;}
  var hsh=0;for(var i=0;i<v.length;i++)hsh=(hsh*31+v.charCodeAt(i))>>>0;
  if(hsh%4){r.innerHTML='<div class="ok">No unpaid parking fines for <b>'+esc(v)+'</b> as of today.</div>';return;}
  var places=['Liberty Boulevard','Central Square (west side)','Bazar-i Kalan, Kök-Bel road','Regional Hospital car park','Central Post Office'];
  var dd=new Date(Date.now()-(hsh%20+3)*864e5);
  r.innerHTML='<div class="note"><b>1 unpaid fine</b> for '+esc(v)+'<br>'+dd.getDate()+'.'+(dd.getMonth()+1)+'.'+dd.getFullYear()+', '+places[hsh%5]+': parking in a paid zone without a ticket, <b>10 som</b> (20 som after 30 days).<br>Pay at any Talasbank branch or with Tulpar Pay (Services → City payments), reference TC-'+(100000+hsh%900000)+'.</div>';};
}
if(page==='council'){load(function(d){
 document.getElementById('min').innerHTML=d.council.map(function(c){return '<tr><td>'+fmt(c.d)+'</td><td>Session No. '+c.n+'</td><td><ul style="margin:0;padding-left:18px">'+c.items.map(function(i){return '<li>'+esc(i)+'</li>';}).join('')+'</ul></td><td>Minutes in the reading room, City Hall, room 104</td></tr>';}).join('');
});}
})();
