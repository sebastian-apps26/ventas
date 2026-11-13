const Prod={
 pres:()=>[{id:'u',name:'Unidad',eggs:1},...DB.d.maples.map(m=>({id:m.id,name:m.name,eggs:m.qty}))],
 price:(pid,r)=>DB.d.prices[pid+'|'+r]||{},
 stock:pid=>(DB.d.stock[Dev.get()]||{})[pid]||0,
 fmt(n){const m=DB.d.maples[0];return m?`${Math.floor(n/m.qty)} ${m.name} + ${n%m.qty} sueltos`:n+' huevos'},
 add(){UI.form('Nuevo producto',[{k:'n',l:'Nombre (ej. Huevo A)'}],o=>{if(!o.n.trim())return;DB.d.products.push({id:DB.uid(),name:o.n.trim()});DB.save();App.go()})},
 addStock(pid){const ms=DB.d.maples;if(!ms.length)return UI.toast('Crea un maple en Configuración avanzada');
  UI.form('Agregar stock',[{k:'m',l:'Tipo de maple',o:ms.map(m=>[m.id,`${m.name} (${m.qty})`])},{k:'c',l:'Cantidad de maples',t:'number',v:0},{k:'s',l:'Huevos sueltos',t:'number',v:0}],o=>{
   const m=ms.find(x=>x.id==o.m),st=DB.d.stock[Dev.get()]??={};st[pid]=(st[pid]||0)+(+o.c||0)*m.qty+(+o.s||0);DB.save();App.go()})},
 prices(pid){UI.pass(DB.d.cfg.pAdv,()=>{const f=[];Prod.pres().forEach(p=>{const c=Prod.price(pid,p.id);
   f.push({k:p.id+'_r',l:p.name+' · precio minorista',t:'number',v:c.r??''},{k:p.id+'_w',l:p.name+' · precio mayorista',t:'number',v:c.w??''},{k:p.id+'_m',l:p.name+' · cantidad mínima mayorista',t:'number',v:c.min??1})});
  UI.form('Precios',f,o=>{const n=v=>v===''?null:+v;Prod.pres().forEach(p=>DB.d.prices[pid+'|'+p.id]={r:n(o[p.id+'_r']),w:n(o[p.id+'_w']),min:+o[p.id+'_m']||1});DB.save();UI.toast('Precios guardados');App.go()})})},
 html(){return `<button onclick="Prod.add()">+ Añadir producto</button><div class="grid" style="margin-top:12px">${DB.d.products.map(p=>`<div class="card"><b>${p.name}</b><div class="m">${Prod.stock(p.id)} huevos<br>${Prod.fmt(Prod.stock(p.id))}</div><div class="row" style="margin-top:8px"><button onclick="Prod.addStock('${p.id}')">+ Stock</button><button class="ghost" onclick="Prod.prices('${p.id}')">Precios</button></div></div>`).join('')}</div>`}
};
