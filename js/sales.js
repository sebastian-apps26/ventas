const Sales={mode:'r',cart:[],sel:null,paying:false,pm:'c',edit:false,recv:0,c0:0,q0:0,cl:'',
 reset(){Object.assign(this,{cart:[],paying:false,edit:false,pm:'c',recv:0,c0:0,q0:0,cl:''})},
 setMode(m){this.mode=m;this.reset();App.go()},
 pick(id){this.sel=id;App.go()},
 add(pid,pr){const p=DB.d.products.find(x=>x.id==pid),pp=Prod.pres().find(x=>x.id==pr),c=Prod.price(pid,pr),price=c[this.mode];
  if(price==null)return UI.toast('Sin precio');
  const min=this.mode=='w'?c.min||1:1,k=pid+'|'+pr,it=this.cart.find(i=>i.k==k);
  it?it.q++:this.cart.push({k,n:p.name+' · '+pp.name,pn:p.name,e:pp.eggs,pid,price,floor:c.floor||0,q:min,min});App.go()},
 chg(k,d){const i=this.cart.findIndex(x=>x.k==k),it=this.cart[i];it.q+=d;if(it.q<it.min)this.cart.splice(i,1);App.go()},
 setPrice(k,v){const it=this.cart.find(x=>x.k==k);if(+v<it.floor)UI.toast('Mínimo permitido: '+UI.money(it.floor));else it.price=+v;App.go()},
 unlock(){UI.pass(DB.d.cfg.pAdv,()=>{this.edit=true;App.go()})},
 total:()=>Sales.cart.reduce((s,i)=>s+i.price*i.q,0),
 newClient(){UI.form('Nuevo cliente',[{k:'n',l:'Nombre completo'},{k:'t',l:'Teléfono'},{k:'d',l:'Descripción'}],o=>{if(!o.n.trim())return;const id=DB.uid();DB.d.clients.push({id,name:o.n.trim(),tel:o.t,desc:o.d});DB.save();this.cl=id;App.go()})},
 finish(){const t=this.total();let cash=0,qr=0,owed=0,cl=null;
  if(this.pm=='c'){if(this.recv<t)return UI.toast('El monto recibido es menor al total');cash=t}
  else if(this.pm=='q')qr=t;
  else{cash=this.c0||0;qr=this.q0||0;if(!this.cl)return UI.toast('Selecciona un cliente');if(cash+qr>t)return UI.toast('El anticipo supera el total');owed=+(t-cash-qr).toFixed(2);cl=this.cl}
  const st=DB.d.stock[Dev.get()]??={},need={};this.cart.forEach(i=>need[i.pid]=(need[i.pid]||0)+i.e*i.q);
  for(const p in need)if((st[p]||0)<need[p])return UI.toast('Stock insuficiente');
  for(const p in need)st[p]-=need[p];
  DB.d.sales.push({id:DB.uid(),store:Dev.get(),date:UI.today(),ts:Date.now(),mode:this.mode,items:this.cart.map(i=>({n:i.n,pn:i.pn,pid:i.pid,q:i.q,p:i.price,e:i.e*i.q})),total:t,cash,qr,owed,client:cl});
  DB.save();this.reset();UI.toast('Venta registrada');App.go()},
 payHtml(){const m=this.pm,t=this.total(),b=(k,l)=>`<button class="${m==k?'':'ghost'}" onclick="Sales.pm='${k}';App.go()">${l}</button>`;
  return `<div class="row">${b('c','Efectivo')}${b('q','QR')}${b('d','Por pagar')}</div>`+(m=='c'?`<label>Monto recibido<input type="number" oninput="Sales.recv=+this.value;$('#chg').textContent=UI.money(Math.max(0,this.value-${t}))"></label><b>Cambio: <span id="chg">${UI.money(0)}</span></b>`
   :m=='q'?`<p>Monto a cobrar por QR: <b>${UI.money(t)}</b></p>`
   :`<label>Anticipo en efectivo (opcional)<input type="number" oninput="Sales.c0=+this.value"></label><label>Anticipo por QR (opcional)<input type="number" oninput="Sales.q0=+this.value"></label><div class="row"><select style="flex:1" onchange="Sales.cl=this.value"><option value="">— Cliente —</option>${DB.d.clients.map(c=>`<option value="${c.id}" ${c.id==this.cl?'selected':''}>${c.name}</option>`).join('')}</select><button class="ghost" onclick="Sales.newClient()">+ Cliente</button></div>`)
   +`<div class="row" style="margin-top:10px"><button onclick="Sales.finish()">Cobrar</button>${this.mode=='w'&&!this.edit?`<button class="ghost" onclick="Sales.unlock()">Modificar monto</button>`:''}<button class="ghost" onclick="Sales.paying=false;App.go()">Volver</button></div>`},
 html(){const m=this.mode,P=DB.d.products,sel=P.find(p=>p.id==this.sel),pres=Prod.pres().filter(r=>m=='r'||r.id!='u');
  return `<div class="row" style="margin-bottom:12px"><button class="${m=='r'?'':'ghost'}" onclick="Sales.setMode('r')">Minorista</button><button class="${m=='w'?'':'ghost'}" onclick="Sales.setMode('w')">Mayorista</button></div>
  ${sel?`<div class="row"><button class="ghost" onclick="Sales.pick(null)">← Huevos</button><b>${sel.name}</b><span class="m">Stock: ${Prod.fmt(Prod.stock(sel.id))}</span></div><div class="grid" style="margin-top:12px">${pres.map(r=>{const c=Prod.price(sel.id,r.id)[m];return `<button class="pres" ${c==null?'disabled':''} onclick="Sales.add('${sel.id}','${r.id}')">${r.name}<br><small>${c==null?'—':UI.money(c)}</small></button>`}).join('')}</div>`
  :`<div class="grid">${P.map(p=>`<button class="pres" style="padding:22px" onclick="Sales.pick('${p.id}')">🥚 ${p.name}<br><small>${Prod.fmt(Prod.stock(p.id))}</small></button>`).join('')||'<p class="m">Primero agrega productos.</p>'}</div>`}
  <div class="card" style="margin-top:12px"><b>Venta actual</b>${this.cart.map(i=>`<div class="row sp" style="margin:8px 0"><span>${i.n}${i.min>1?` <small class="m">(mín ${i.min})</small>`:''}</span><span class="row"><button class="ghost" onclick="Sales.chg('${i.k}',-1)">−</button>${i.q}<button class="ghost" onclick="Sales.chg('${i.k}',1)">+</button>${this.edit?`<input type="number" style="width:90px" value="${i.price}" onchange="Sales.setPrice('${i.k}',this.value)">`:UI.money(i.price)}</span></div>`).join('')}
  <div class="row sp"><b>Total ${UI.money(this.total())}</b>${this.paying?'':`<button ${this.cart.length?'':'disabled'} onclick="Sales.paying=true;App.go()">Cobrar</button>`}</div>${this.paying?this.payHtml():''}</div>`}
};
