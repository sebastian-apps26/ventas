const Sales={mode:'r',cart:[],
 setMode(m){this.mode=m;this.cart=[];App.go()},
 add(pid,pr){const p=DB.d.products.find(x=>x.id==pid),pp=Prod.pres().find(x=>x.id==pr),c=Prod.price(pid,pr),price=c[this.mode];
  if(price==null)return UI.toast('Sin precio');
  const min=this.mode=='w'?c.min||1:1,k=pid+'|'+pr,it=this.cart.find(i=>i.k==k);
  it?it.q++:this.cart.push({k,n:p.name+' · '+pp.name,e:pp.eggs,pid,price,q:min,min});App.go()},
 chg(k,d){const i=this.cart.findIndex(x=>x.k==k),it=this.cart[i];it.q+=d;if(it.q<it.min)this.cart.splice(i,1);App.go()},
 total:()=>Sales.cart.reduce((s,i)=>s+i.price*i.q,0),
 pay(){const st=DB.d.stock[Dev.get()]??={},need={};
  this.cart.forEach(i=>need[i.pid]=(need[i.pid]||0)+i.e*i.q);
  for(const p in need)if((st[p]||0)<need[p])return UI.toast('Stock insuficiente');
  for(const p in need)st[p]-=need[p];
  DB.d.sales.push({id:DB.uid(),store:Dev.get(),date:UI.today(),ts:Date.now(),mode:this.mode,items:this.cart.map(i=>({n:i.n,q:i.q,p:i.price})),total:this.total()});
  DB.save();this.cart=[];UI.toast('Venta registrada');App.go()},
 html(){const m=this.mode;
  return `<div class="row" style="margin-bottom:12px"><button class="${m=='r'?'':'ghost'}" onclick="Sales.setMode('r')">Minorista</button><button class="${m=='w'?'':'ghost'}" onclick="Sales.setMode('w')">Mayorista</button></div>
  <div class="grid">${DB.d.products.map(p=>`<div class="card"><b>${p.name}</b><div class="m">Stock: ${Prod.fmt(Prod.stock(p.id))}</div><div class="row" style="margin-top:8px">${Prod.pres().map(r=>{const c=Prod.price(p.id,r.id)[m];return `<button class="pres" ${c==null?'disabled':''} onclick="Sales.add('${p.id}','${r.id}')">${r.name}<br><small>${c==null?'—':UI.money(c)}</small></button>`}).join('')}</div></div>`).join('')||'<p class="m">Primero agrega productos.</p>'}</div>
  <div class="card"><b>Venta actual</b>${this.cart.map(i=>`<div class="row sp" style="margin:8px 0"><span>${i.n}${i.min>1?` <small class="m">(mín ${i.min})</small>`:''}</span><span class="row"><button class="ghost" onclick="Sales.chg('${i.k}',-1)">−</button>${i.q}<button class="ghost" onclick="Sales.chg('${i.k}',1)">+</button> ${UI.money(i.price*i.q)}</span></div>`).join('')}<div class="row sp"><b>Total ${UI.money(this.total())}</b><button ${this.cart.length?'':'disabled'} onclick="Sales.pay()">Cobrar</button></div></div>`}
};
