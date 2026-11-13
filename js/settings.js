const Settings={adv:false,
 unlock(){UI.pass(DB.d.cfg.pAdv,()=>{this.adv=true;App.render()})},
 pw(id){UI.form('Nueva contraseña',[{k:'p',l:'Contraseña',t:'password'}],o=>{if(!o.p)return;const d=DB.d;
  if(id=='a')d.cfg.pAdmin=o.p;else if(id=='v')d.cfg.pAdv=o.p;else d.stores.find(s=>s.id==id).pass=o.p;DB.save();UI.toast('Contraseña cambiada')})},
 addMaple(){UI.form('Nuevo maple',[{k:'n',l:'Nombre (ej. Maple grande)'},{k:'q',l:'Huevos por maple',t:'number'}],o=>{if(!o.n||!+o.q)return;DB.d.maples.push({id:DB.uid(),name:o.n,qty:+o.q});DB.save();App.render()})},
 delMaple(id){DB.d.maples=DB.d.maples.filter(m=>m.id!=id);DB.save();App.render()},
 brand(){const c=DB.d.cfg;UI.form('Empresa',[{k:'n',l:'Nombre',v:c.name},{k:'l',l:'Logo (emoji)',v:c.logo}],o=>{c.name=o.n||c.name;c.logo=o.l||c.logo;DB.save();App.render()})},
 html(){const d=DB.d;
  if(!this.adv)return `<div class="card"><b>Cuenta</b><p class="m">Cambia de tienda.</p><button onclick="App.change()">Cambiar tienda</button></div><div class="card"><b>Configuración avanzada</b><p class="m">Contraseñas, maples, empresa.</p><button onclick="Settings.unlock()">Entrar</button></div>`;
  return `<div class="card"><b>Contraseñas</b>${[['Jefe (crear tiendas)','a'],['Configuración avanzada','v'],...d.stores.map(s=>['Tienda: '+s.name,s.id])].map(x=>`<div class="row sp" style="margin:8px 0"><span>${x[0]}</span><button class="ghost" onclick="Settings.pw('${x[1]}')">Cambiar</button></div>`).join('')}</div>
  <div class="card"><b>Maples</b>${d.maples.map(m=>`<div class="row sp" style="margin:8px 0"><span>${m.name}: ${m.qty} huevos</span><button class="ghost" onclick="Settings.delMaple('${m.id}')">Quitar</button></div>`).join('')}<button onclick="Settings.addMaple()">+ Agregar maple</button></div>
  <div class="card"><b>Empresa</b><p class="m">${d.cfg.logo} ${d.cfg.name}</p><button class="ghost" onclick="Settings.brand()">Editar nombre y logo</button></div><button class="ghost" onclick="Settings.adv=false;App.render()">Salir de avanzada</button>`}
};
