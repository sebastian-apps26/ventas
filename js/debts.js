const Debts={cl:null,
 owed:()=>DB.d.sales.filter(s=>s.store==Dev.get()&&!s.void&&s.owed>0),
 pay(sid){const s=DB.d.sales.find(x=>x.id==sid);UI.form('Cobrar deuda',[{k:'m',l:'Método',o:[['cash','Efectivo'],['qr','QR']]},{k:'a',l:'Monto (máximo '+s.owed+')',t:'number'}],o=>{const a=+o.a;if(!a||a>s.owed)return UI.toast('Monto inválido');
  s.owed=+(s.owed-a).toFixed(2);DB.d.pays.push({id:DB.uid(),store:s.store,date:UI.today(),ts:Date.now(),client:s.client,m:o.m,amt:a,sid});DB.save();App.go()})},
 html(){const by={};this.owed().forEach(s=>(by[s.client]??=[]).push(s));const sum=a=>a.reduce((t,s)=>t+s.owed,0);
  if(this.cl&&by[this.cl])return `<button class="ghost" onclick="Debts.cl=null;App.go()">← Clientes</button><h3>${UI.cn(this.cl)}</h3>${by[this.cl].map(s=>`<div class="card row sp"><span>${s.date} · ${s.items.map(i=>i.q+'x '+i.n).join(', ')}<br><small class="m">Venta ${UI.money(s.total)} · pagó ${UI.money(s.total-s.owed)} · debe <b>${UI.money(s.owed)}</b></small></span><button onclick="Debts.pay('${s.id}')">Cobrar</button></div>`).join('')}`;
  return Object.keys(by).map(c=>`<button class="ghost card" style="width:100%;text-align:left" onclick="Debts.cl='${c}';App.go()">${UI.cn(c)} — debe <b>${UI.money(sum(by[c]))}</b></button>`).join('')||'<p class="m">No hay cobros pendientes.</p>'}
};
