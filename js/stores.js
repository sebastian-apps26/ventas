const Stores={
 splash(){const c=DB.d.cfg;return `<div class="center"><div class="logo">${c.logo}</div><h1>${c.name}</h1><button onclick="App.started=true;App.render()">Comenzar</button></div>`},
 pick(id){const s=DB.d.stores.find(x=>x.id==id);UI.pass(s.pass,()=>{Dev.set(id);App.view='sales';App.render()})},
 create(){UI.pass(DB.d.cfg.pAdmin,()=>UI.form('Nueva tienda',[{k:'n',l:'Nombre'},{k:'p',l:'Contraseña de la tienda',v:'1234'}],o=>{if(!o.n.trim())return;DB.d.stores.push({id:DB.uid(),name:o.n.trim(),pass:o.p||'1234'});DB.save();App.render()}))},
 html(){const s=DB.d.stores;return `<div class="center"><h2>Selecciona tu tienda</h2>${s.map(x=>`<button class="ghost" onclick="Stores.pick('${x.id}')">🏪 ${x.name}</button>`).join('')||'<p class="m">Aún no hay tiendas.</p>'}<button onclick="Stores.create()">+ Crear tienda</button></div>`}
};
