const Prod={
 pres:()=>[{id:'u',name:'Unidad',eggs:1},...DB.d.maples.map(m=>({id:m.id,name:m.name,eggs:m.qty}))],
 price:(pid,r)=>DB.d.prices[pid+'|'+r]||{},
 stock:pid=>(DB.d.stock[Dev.get()]||{})[pid]||0,
 fmt(n){const m=DB.d.maples[0];return m?`${Math.floor(n/m.qty)} ${m.name} + ${n%m.qty} sueltos`:n+' huevos'},
 add(){UI.form('Nuevo producto',[{k:'n',l:'Nombre (ej. Huevo A)'}],o=>{if(!o.n.trim())return;DB.d.products.push({id:DB.uid(),name:o.n.trim()});DB.save();App.go()})},
 eggs(title,fn,x=[]){const ms=DB.d.maples;if(!ms.length)return UI.toast('Crea un maple en Configuración avanzada');
  UI.form(title,[{k:'m',l:'Tipo de maple',o:ms.map(m=>[m.id,`${m.name} (${m.qty})`])},{k:'c',l:'Cantidad de maples',t:'number',v:0},{k:'s',l:'Huevos sueltos',t:'number',v:0},...x],o=>fn((+o.c||0)*ms.find(x=>x.id==o.m).qty+(+o.s||0),o))},
 addStock(pid){this.eggs('Agregar stock',n=>{const st=DB.d.stock[Dev.get()]??={};st[pid]=(st[pid]||0)+n;DB.log('Stock agregado',DB.d.products.find(x=>x.id==pid).name+': '+Prod.fmt(n));DB.save();App.go()})},
 waste(pid){this.eggs('Desechar producto',(n,o)=>{const st=DB.d.stock[Dev.get()]??={};if((st[pid]||0)<n)return UI.toast('Stock insuficiente');st[pid]-=n;
  DB.d.waste.push({id:DB.uid(),store:Dev.get(),date:UI.today(),ts:Date.now(),pid,pn:DB.d.products.find(x=>x.id==pid).name,eggs:n,d:o.d});DB.save();App.go()},[{k:'d',l:'Motivo / descripción (robo, falla, vencido...)'}])},
 prices(pid){UI.pass(DB.d.cfg.pAdv,()=>{const f=[{k:'u_r',l:'UNIDAD · precio minorista',t:'number',v:Prod.price(pid,'u').r??''}];
  DB.d.maples.forEach(m=>{const c=Prod.price(pid,m.id),n=m.name.toUpperCase()+' · ';f.push({k:m.id+'_r',l:n+'precio minorista',t:'number',v:c.r??''},{k:m.id+'_w',l:n+'precio mayorista',t:'number',v:c.w??''},{k:m.id+'_m',l:n+'cantidad mínima mayorista',t:'number',v:c.min??1},{k:m.id+'_f',l:n+'precio mínimo mayorista',t:'number',v:c.floor??''})});
  UI.form('Precios',f,o=>{const n=v=>v===''||v==null?null:+v;DB.d.prices[pid+'|u']={r:n(o.u_r)};
   DB.d.maples.forEach(m=>DB.d.prices[pid+'|'+m.id]={r:n(o[m.id+'_r']),w:n(o[m.id+'_w']),min:+o[m.id+'_m']||1,floor:+o[m.id+'_f']||0});DB.log('Precios modificados',DB.d.products.find(x=>x.id==pid).name);DB.save();UI.toast('Precios guardados')})})},
 del(pid){UI.pass(DB.d.cfg.pAdv,()=>{if(!confirm('¿Eliminar este producto?'))return;const p=DB.d.products.find(x=>x.id==pid);DB.d.products=DB.d.products.filter(x=>x.id!=pid);DB.log('Producto eliminado',p.name);DB.save();App.go()})},
 html(){return `<button onclick="Prod.add()">+ Añadir producto</button><div class="grid" style="margin-top:12px">${DB.d.products.map(p=>`<div class="card"><b>${p.name}</b><div class="m">${Prod.stock(p.id)} huevos<br>${Prod.fmt(Prod.stock(p.id))}</div><div class="row" style="margin-top:8px"><button onclick="Prod.addStock('${p.id}')">+ Stock</button><button class="ghost" onclick="Prod.prices('${p.id}')">Precios</button><button class="ghost" onclick="Prod.waste('${p.id}')">Desechar</button><button class="ghost" onclick="Prod.del('${p.id}')">🗑 Eliminar</button></div></div>`).join('')}</div>`}
};
