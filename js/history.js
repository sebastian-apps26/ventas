const Hist={from:UI.today(),to:UI.today(),
 set(k,v){this[k]=v;App.go()},
 del(id){UI.pass(DB.d.cfg.pAdv,()=>{if(!confirm('¿Eliminar esta venta? Quedará marcada en rojo y el stock se devuelve.'))return;const s=DB.d.sales.find(x=>x.id==id),st=DB.d.stock[s.store]??={};s.void=true;s.voidTs=Date.now();s.items.forEach(i=>st[i.pid]=(st[i.pid]||0)+(i.e||0));DB.save();App.go()})},
 ver(id){const s=DB.d.sales.find(x=>x.id==id),o=s.items.reduce((t,i)=>t+(i.o??i.p)*i.q,0);
  UI.view(`<h3>Pedido ${s.date} ${new Date(s.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</h3><p class="m">${s.mode=='w'?'Mayorista':'Minorista'}${s.client?' · Cliente: '+UI.cn(s.client):''}${s.void?' · <b style="color:#dc2626">ELIMINADA</b>':''}</p>
  <table><tr><th>Cant.</th><th>Producto</th><th>Precio</th><th>Subtotal</th></tr>${s.items.map(i=>`<tr><td>${i.q}</td><td>${i.n}</td><td>${UI.money(i.p)}</td><td>${UI.money(i.p*i.q)}</td></tr>`).join('')}</table>
  ${o>s.total?`<p class="m">Descuento: ${UI.money(o-s.total)}</p>`:''}<h3>Total ${UI.money(s.total)}</h3><p class="m">Efectivo ${UI.money(s.cash||0)} · QR ${UI.money(s.qr||0)}${s.owed?' · <b>Debe '+UI.money(s.owed)+'</b>':''}</p>`)},
 html(){const f=this.from,t=this.to,ok=x=>x.store==Dev.get()&&x.date>=f&&x.date<=t;
  const r=[...DB.d.sales.filter(ok).map(x=>({...x,k:'s'})),...DB.d.pays.filter(ok).map(x=>({...x,k:'p'}))].sort((a,b)=>b.ts-a.ts),tm=x=>new Date(x.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  return `<div class="card row"><label>Desde<input type="date" value="${f}" onchange="Hist.set('from',this.value)"></label><label>Hasta<input type="date" value="${t}" onchange="Hist.set('to',this.value)"></label></div>
  ${r.map(x=>x.k=='p'?`<div class="card row sp"><span>${x.date} ${tm(x)} · <b>(Cobro de deuda)</b> ${UI.cn(x.client)} · ${x.m=='cash'?'Efectivo':'QR'}</span><b>${UI.money(x.amt)}</b></div>`
   :`<div class="card row sp" style="${x.void?'border-color:#dc2626;color:#dc2626':''}"><span>${x.date} ${tm(x)} · ${x.mode=='w'?'Mayorista':'Minorista'}${x.client?' · '+UI.cn(x.client):''}${x.owed?' · debe '+UI.money(x.owed):''}${x.void?' · ELIMINADA':''}<br><small>${x.items.map(i=>i.q+'x '+i.n).join(', ')}</small></span><span class="row"><b>${UI.money(x.total)}</b><button class="ghost" onclick="Hist.ver('${x.id}')">Ver pedido</button>${x.void?'':`<button class="ghost" onclick="Hist.del('${x.id}')">🗑</button>`}</span></div>`).join('')||'<p class="m">Sin movimientos.</p>'}`}
};
