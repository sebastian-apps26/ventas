const App={view:'sales',open:false,mini:false,started:false,
 store:()=>DB.d.stores.find(s=>s.id==Dev.get()),
 go(v){if(v){this.view=v;this.open=false;Settings.adv=false}this.render()},
 tog(){innerWidth<=800?this.open=!this.open:this.mini=!this.mini;this.render()},
 change(){Dev.set(null);this.started=true;this.render()},
 render(){const s=this.store(),c=DB.d.cfg,a=$('#app');
  if(!s){a.innerHTML=this.started?Stores.html():Stores.splash();return}
  const nav=[['sales','🛒','Nueva venta',Sales],['products','🥚','Productos',Prod],['history','🧾','Historial',Hist],['debts','💳','Cobros pendientes',Debts],['data','📊','Datos del día',Data],['settings','⚙️','Configuración',Settings]];
  a.innerHTML=`<div class="shell"><aside class="${this.open?'open':''} ${this.mini?'mini':''}"><div class="row" style="margin-bottom:8px">${UI.logo(32)}<b class="lb">${c.name}</b></div>${nav.map(n=>`<button class="${this.view==n[0]?'on':''}" onclick="App.go('${n[0]}')"><span>${n[1]}</span><span class="lb">${n[2]}</span></button>`).join('')}<button style="margin-top:auto" onclick="App.change()"><span>🔄</span><span class="lb">Cambiar tienda</span></button></aside><div class="ov ${this.open?'on':''}" onclick="App.tog()"></div><main><div class="top"><button class="ghost" onclick="App.tog()">☰</button><h2>${s.name}</h2></div>${nav.find(n=>n[0]==this.view)[3].html()}</main></div>`}
};
let x0=null;
addEventListener('touchstart',e=>x0=e.touches[0].clientX<25?e.touches[0].clientX:null);
addEventListener('touchmove',e=>{if(x0!=null&&e.touches[0].clientX-x0>60){x0=null;App.open=true;App.render()}});
UI.icon();App.render();
