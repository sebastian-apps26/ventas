const Data={from:UI.today(),to:UI.today(),
 set(k,v){this[k]=v;App.go()},
 rng(a){return a.filter(x=>x.store==Dev.get()&&x.date>=this.from&&x.date<=this.to)},
 tables(){const S=this.rng(DB.d.sales),P=this.rng(DB.d.pays),W=this.rng(DB.d.waste),L=this.rng(DB.d.log),V=S.filter(s=>!s.void),X=S.filter(s=>s.void),sum=(a,f)=>a.reduce((t,x)=>t+f(x),0),tm=x=>new Date(x.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),M=UI.money;
  const T=(h,r)=>`<table border="1" cellpadding="4" style="border-collapse:collapse;width:100%"><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.map(x=>`<tr>${x.map(y=>`<td>${y}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${h.length}">—</td></tr>`}</table>`;
  const it=a=>a.items.map(i=>i.q+'x '+i.n).join('; '),dsc=s=>s.items.reduce((t,i)=>t+((i.o??i.p)-i.p)*i.q,0);
  const o={};V.forEach(s=>s.items.forEach(i=>{const e=o[i.pn||i.n]??={r:0,w:0,d:0};e[s.mode]+=i.e||0}));W.forEach(w=>(o[w.pn]??={r:0,w:0,d:0}).d+=w.eggs);
  const pc=P.filter(p=>p.m=='cash'),pq=P.filter(p=>p.m=='qr'),dl=[];V.forEach(s=>s.items.forEach(i=>{if((i.o??i.p)>i.p)dl.push([s.date,tm(s),i.n,i.q,M(i.o),M(i.p),M(((i.o)-i.p)*i.q)])}));
  return `<h3>Resumen</h3>`+T(['Efectivo','QR','Por cobrar','Descuentos','Total ventas','Ventas eliminadas'],[[M(sum(V,s=>s.cash)+sum(pc,p=>p.amt)),M(sum(V,s=>s.qr)+sum(pq,p=>p.amt)),M(sum(V,s=>s.owed)),M(sum(V,dsc)),M(sum(V,s=>s.total)),X.length]])
  +`<h3>Ventas</h3>`+T(['Fecha','Hora','Tipo','Cliente','Detalle','Efectivo','QR','Por cobrar','Total'],V.map(s=>[s.date,tm(s),s.mode=='w'?'Mayorista':'Minorista',UI.cn(s.client),it(s),M(s.cash||0),M(s.qr||0),M(s.owed||0),M(s.total)]))
  +`<h3>Cobros de deuda</h3>`+T(['Fecha','Hora','Cliente','Método','Monto'],P.map(p=>[p.date,tm(p),UI.cn(p.client),p.m=='cash'?'Efectivo':'QR',M(p.amt)]))
  +`<h3>Ventas eliminadas</h3>`+T(['Fecha','Hora venta','Eliminada a las','Detalle','Total'],X.map(s=>[s.date,tm(s),s.voidTs?tm({ts:s.voidTs}):'',it(s),M(s.total)]))
  +`<h3>Descuentos y precios modificados</h3>`+T(['Fecha','Hora','Producto','Cant.','Precio original','Precio final','Descuento'],dl)
  +`<h3>Salida de productos</h3>`+T(['Producto','Minorista','Mayorista','Desechado'],Object.entries(o).map(([k,v])=>[k,Prod.fmt(v.r),Prod.fmt(v.w),Prod.fmt(v.d)]))
  +`<h3>Productos desechados</h3>`+T(['Fecha','Hora','Producto','Cantidad','Motivo'],W.map(w=>[w.date,tm(w),w.pn,Prod.fmt(w.eggs),w.d||'']))
  +`<h3>Cambios y movimientos (stock, precios, productos)</h3>`+T(['Fecha','Hora','Evento','Detalle'],L.map(l=>[l.date,tm(l),l.t,l.x]))},
 report(){const c=DB.d.cfg;return `<html><head><meta charset="utf-8"><title>Informe</title><style>body{font:12px Arial,sans-serif;margin:20px}h1{font-size:20px;margin:0}h3{margin:18px 0 6px;font-size:14px}th{background:#eee;text-align:left}td,th{font-size:11px}</style></head><body><h1>${c.name}</h1><p>${App.store().name} · Informe del ${this.from} al ${this.to}</p>${this.tables()}</body></html>`},
 pdf(){const f=document.createElement('iframe');f.style.cssText='position:fixed;width:0;height:0;border:0';document.body.append(f);f.contentDocument.write(this.report());f.contentDocument.close();setTimeout(()=>{f.contentWindow.focus();f.contentWindow.print()},300)},
 html(){return `<div class="card row"><label>Desde<input type="date" value="${this.from}" onchange="Data.set('from',this.value)"></label><label>Hasta<input type="date" value="${this.to}" onchange="Data.set('to',this.value)"></label><button onclick="Data.pdf()">Exportar informe PDF</button></div><p class="m">Se abre la ventana de impresión: elige "Guardar como PDF".</p><div style="overflow-x:auto">${this.tables()}</div>`}
};
