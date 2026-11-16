const Sales={mode:'r',cart:[],sel:null,pm:null,recv:0,c0:0,q0:0,cl:'',holds:false,
 eff:i=>i.dp??i.price,
 reset(){Object.assign(this,{cart:[],pm:null,recv:0,c0:0,q0:0,cl:'',holds:false})},
 setMode(m){this.mode=m;this.reset();App.go()},
 pick(id){this.sel=id;App.go()},
 add(pid,pr){const p=DB.d.products.find(x=>x.id==pid),pp=Prod.pres().find(x=>x.id==pr),c=Prod.price(pid,pr),price=c[this.mode];
  if(price==null)return UI.toast('Sin precio');
  const min=this.mode=='w'?c.min||1:1,k=pid+'|'+pr,it=this.cart.find(i=>i.k==k);
  it?it.q++:this.cart.push({k,n:p.name+' · '+pp.name,pn:p.name,e:pp.eggs,pid,price,dp:null,floor:c.floor||0,q:min,min});App.go()},
 chg(k,d){const i=this.cart.findIndex(x=>x.k==k),it=this.cart[i];it.q+=d;if(it.q<it.min)this.cart.splice(i,1);App.go()},
 del(k){this.cart=this.cart.filter(x=>x.k!=k);App.go()},
 clear(){this.reset();App.go()},
 sub:()=>Sales.cart.reduce((s,i)=>s+i.price*i.q,0),
 total:()=>Sales.cart.reduce((s,i)=>s+Sales.eff(i)*i.q,0),
 disc(k){UI.pass(DB.d.cfg.pAdv,()=>UI.form('Descuento',[{k:'d',l:'Descuento %',t:'number'},{k:'p',l:'o nuevo precio unitario',t:'number'}],o=>{const it=this.cart.find(x=>x.k==k);
  let np=o.p!==''?+o.p:it.price*(1-(+o.d||0)/100);if(np<it.floor)return UI.toast('Mínimo permitido: '+UI.money(it.floor));if(np>=it.price)np=it.price;it.dp=np==it.price?null:+np.toFixed(2);App.go()}))},
 hold(){if(!this.cart.length)return;DB.d.holds.push({id:DB.uid(),store:Dev.get(),ts:Date.now(),mode:this.mode,cart:this.cart});DB.save();this.reset();UI.toast('Venta en espera');App.go()},
 resume(id){const h=DB.d.holds.find(x=>x.id==id);this.reset();this.mode=h.mode;this.cart=h.cart;DB.d.holds=DB.d.holds.filter(x=>x.id!=id);DB.save();App.go()},
 dropHold(id){DB.d.holds=DB.d.holds.filter(x=>x.id!=id);DB.save();App.go()},
 newClient(){UI.form('Nuevo cliente',[{k:'n',l:'Nombre completo'},{k:'t',l:'Teléfono'},{k:'d',l:'Descripción'}],o=>{if(!o.n.trim())return;const id=DB.uid();DB.d.clients.push({id,name:o.n.trim(),tel:o.t,desc:o.d});DB.save();this.cl=id;App.go()})},
 finish(){const t=this.total(),pm=this.pm;let cash=0,qr=0,owed=0,cl=null;
  if(pm=='c'){if(this.recv<t)return UI.toast('El monto recibido es menor al total');cash=t}
  else if(pm=='q')qr=t;
  else if(pm=='m'){cash=this.c0||0;if(cash<=0||cash>=t)return UI.toast('Efectivo debe ser mayor a 0 y menor al total');qr=+(t-cash).toFixed(2)}
  else{cash=this.c0||0;qr=this.q0||0;if(!this.cl)return UI.toast('Selecciona un cliente');if(cash+qr>t)return UI.toast('El anticipo supera el total');owed=+(t-cash-qr).toFixed(2);cl=this.cl}
  const st=DB.d.stock[Dev.get()]??={},need={};this.cart.forEach(i=>need[i.pid]=(need[i.pid]||0)+i.e*i.q);
  for(const p in need)if((st[p]||0)<need[p])return UI.toast('Stock insuficiente');
  for(const p in need)st[p]-=need[p];
  DB.d.sales.push({id:DB.uid(),store:Dev.get(),date:UI.today(),ts:Date.now(),mode:this.mode,items:this.cart.map(i=>({n:i.n,pn:i.pn,pid:i.pid,q:i.q,p:this.eff(i),o:i.price,e:i.e*i.q})),total:t,cash,qr,owed,client:cl,pm});
  DB.save();this.reset();UI.toast('Venta registrada');App.go()},
 payHtml(){const m=this.pm,t=this.total();
  return (m=='c'?`<label>Monto recibido<input type="number" oninput="Sales.recv=+this.value;$('#chg').textContent=UI.money(Math.max(0,this.value-Sales.total()))"></label><b>Cambio: <span id="chg">${UI.money(0)}</span></b>`
   :m=='q'?`<p>Monto a cobrar por QR: <b class="tt">${UI.money(t)}</b></p>`
   :m=='m'?`<label>Efectivo<input type="number" oninput="Sales.c0=+this.value;$('#rest').textContent=UI.money(Math.max(0,Sales.total()-this.value))"></label><p>QR (el resto): <b id="rest">${UI.money(t)}</b></p>`
   :`<label>Anticipo en efectivo (opcional)<input type="number" oninput="Sales.c0=+this.value"></label><label>Anticipo por QR (opcional)<input type="number" oninput="Sales.q0=+this.value"></label><div class="row"><select style="flex:1" onchange="Sales.cl=this.value"><option value="">— Cliente —</option>${DB.d.clients.map(c=>`<option value="${c.id}" ${c.id==this.cl?'selected':''}>${c.name}</option>`).join('')}</select><button class="ghost" onclick="Sales.newClient()">+ Cliente</button></div>`)
   +`<div class="row" style="margin-top:10px"><button onclick="Sales.finish()">Cobrar</button><button class="ghost" onclick="Sales.pm=null;App.go()">Cancelar</button></div>`},
 cartHtml(){const n=this.cart.length,hs=DB.d.holds.filter(h=>h.store==Dev.get());
  if(this.holds)return `<div class="row sp"><b>Ventas en espera</b><button class="ghost" onclick="Sales.holds=false;App.go()">Volver</button></div>${hs.map(h=>`<div class="card row sp" style="margin:8px 0"><span>${new Date(h.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} · ${h.cart.length} ítems<br><small class="m">${h.cart.map(i=>i.q+'x '+i.n).join(', ')}</small></span><span class="row"><button onclick="Sales.resume('${h.id}')">Retomar</button><button class="ghost" onclick="Sales.dropHold('${h.id}')">✕</button></span></div>`).join('')||'<p class="m">No hay ventas en espera.</p>'}`;
  return `<div class="row sp"><b style="font-size:18px">Venta actual</b><span class="row"><button class="ghost" onclick="Sales.hold()">Mandar a la cola</button><button class="ghost" style="color:#dc2626" onclick="Sales.clear()">Vaciar carrito</button></span></div>
  ${this.cart.map(i=>`<div class="card" style="margin:10px 0"><div class="row sp"><b>${i.n}</b><button class="ghost" onclick="Sales.del('${i.k}')">✕</button></div><div class="row sp" style="margin-top:6px"><span class="row"><button class="ghost" onclick="Sales.chg('${i.k}',-1)">−</button>${i.q}<button class="ghost" onclick="Sales.chg('${i.k}',1)">+</button></span><span>${i.dp!=null?`<span class="old">${UI.money(i.price*i.q)}</span> `:''}<b>${UI.money(this.eff(i)*i.q)}</b></span></div>${i.min>1?`<small class="m">Mínimo mayorista: ${i.min}</small><br>`:''}<button class="ghost" style="margin-top:6px" onclick="Sales.disc('${i.k}')">% Descuento</button></div>`).join('')}
  <div class="row sp m"><span>Subtotal</span><span>${UI.money(this.sub())}</span></div><div class="row sp m"><span>Descuento</span><span>${UI.money(this.sub()-this.total())}</span></div><div class="row sp"><b style="font-size:20px">Total</b><b style="font-size:20px" class="tt">${UI.money(this.total())}</b></div>
  ${this.pm?this.payHtml():`<div class="row" style="margin-top:10px">${[['c','Efectivo'],['q','QR'],['m','Mixto']].map(x=>`<button class="ghost" style="flex:1" ${n?'':'disabled'} onclick="Sales.pm='${x[0]}';App.go()">${x[1]}</button>`).join('')}</div><button class="big dash" ${n?'':'disabled'} onclick="Sales.pm='d';App.go()">Venta a deuda (fiado)</button><button class="big ghost" onclick="Sales.holds=true;App.go()">Ventas en espera (${hs.length})</button>`}`},
 html(){const m=this.mode,P=DB.d.products,sel=P.find(p=>p.id==this.sel),pres=Prod.pres().filter(r=>m=='r'||r.id!='u');
  return `<div class="pos"><section><div class="row" style="margin-bottom:12px"><button class="${m=='r'?'':'ghost'}" onclick="Sales.setMode('r')">Minorista</button><button class="${m=='w'?'':'ghost'}" onclick="Sales.setMode('w')">Mayorista</button></div>
  ${sel?`<div class="row"><button class="ghost" onclick="Sales.pick(null)">← Huevos</button><b>${sel.name}</b><span class="m">Stock: ${Prod.fmt(Prod.stock(sel.id))}</span></div><div class="grid" style="margin-top:12px">${pres.map(r=>{const c=Prod.price(sel.id,r.id)[m];return `<button class="pres" ${c==null?'disabled':''} onclick="Sales.add('${sel.id}','${r.id}')">${r.name}<br><small>${c==null?'—':UI.money(c)}</small></button>`}).join('')}</div>`
  :`<h2 style="margin-top:0">Productos</h2><div class="grid">${P.map(p=>`<button class="pres ghost" style="padding:22px;text-align:left" onclick="Sales.pick('${p.id}')"><b>${p.name}</b><br><small>${Prod.fmt(Prod.stock(p.id))}</small></button>`).join('')||'<p class="m">Primero agrega productos.</p>'}</div>`}</section>
  <div class="card cart">${this.cartHtml()}</div></div>`}
};
