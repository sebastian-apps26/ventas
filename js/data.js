const Data={from:UI.today(),to:UI.today(),
 set(k,v){this[k]=v;App.go()},
 rng(a){return a.filter(x=>x.store==Dev.get()&&x.date>=this.from&&x.date<=this.to)},
 tables(){const S=this.rng(DB.d.sales),P=this.rng(DB.d.pays),W=this.rng(DB.d.waste),V=S.filter(s=>!s.void),sum=(a,f)=>a.reduce((t,x)=>t+f(x),0),tm=x=>new Date(x.ts).toLocaleTimeString();
  const T=(h,r)=>`<table border="1" cellpadding="4" style="border-collapse:collapse;width:100%"><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${r.map(x=>`<tr>${x.map(y=>`<td>${y}</td>`).join('')}</tr>`).join('')}</table>`;
  const o={};V.forEach(s=>s.items.forEach(i=>{const e=o[i.pn||i.n]??={r:0,w:0,d:0};e[s.mode]+=i.e||0}));W.forEach(w=>(o[w.pn]??={r:0,w:0,d:0}).d+=w.eggs);
  const pc=P.filter(p=>p.m=='cash'),pq=P.filter(p=>p.m=='qr');
  return `<h3>Resumen</h3>`+T(['Efectivo','QR','Por cobrar','Total ventas'],[[sum(V,s=>s.cash)+sum(pc,p=>p.amt),sum(V,s=>s.qr)+sum(pq,p=>p.amt),sum(V,s=>s.owed),sum(V,s=>s.total)].map(UI.money)])
  +`<h3>Ventas</h3>`+T(['Fecha','Hora','Tipo','Cliente','Detalle','Efectivo','QR','Por cobrar','Total','Estado'],S.map(s=>[s.date,tm(s),s.mode=='w'?'Mayorista':'Minorista',UI.cn(s.client),s.items.map(i=>i.q+'x '+i.n).join('; '),s.cash||0,s.qr||0,s.owed||0,s.total,s.void?'ELIMINADA':'OK']))
  +`<h3>Cobros de deuda</h3>`+T(['Fecha','Hora','Cliente','Método','Monto'],P.map(p=>[p.date,tm(p),UI.cn(p.client),p.m=='cash'?'Efectivo':'QR',p.amt]))
  +`<h3>Salida de productos</h3>`+T(['Producto','Minorista','Mayorista','Desechado'],Object.entries(o).map(([k,v])=>[k,Prod.fmt(v.r),Prod.fmt(v.w),Prod.fmt(v.d)]))
  +`<h3>Desechados</h3>`+T(['Fecha','Hora','Producto','Cantidad'],W.map(w=>[w.date,tm(w),w.pn,Prod.fmt(w.eggs)]))},
 exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['<html><head><meta charset="utf-8"></head><body>'+this.tables()+'</body></html>'],{type:'application/vnd.ms-excel'}));a.download=`datos_${this.from}_${this.to}.xls`;a.click()},
 html(){return `<div class="card row"><label>Desde<input type="date" value="${this.from}" onchange="Data.set('from',this.value)"></label><label>Hasta<input type="date" value="${this.to}" onchange="Data.set('to',this.value)"></label><button onclick="Data.exp()">Exportar Excel</button></div><div style="overflow-x:auto">${this.tables()}</div>`}
};
