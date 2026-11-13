const Hist={from:UI.today(),to:UI.today(),
 list:()=>DB.d.sales.filter(s=>s.store==Dev.get()&&s.date>=Hist.from&&s.date<=Hist.to).sort((a,b)=>b.ts-a.ts),
 set(k,v){this[k]=v;App.go()},
 exp(){const r=['Fecha,Hora,Tipo,Detalle,Total',...this.list().map(s=>[s.date,new Date(s.ts).toLocaleTimeString(),s.mode=='w'?'Mayorista':'Minorista','"'+s.items.map(i=>i.q+'x '+i.n).join('; ')+'"',s.total].join(','))].join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+r],{type:'text/csv'}));a.download=`historial_${this.from}_${this.to}.csv`;a.click()},
 html(){const l=this.list(),days={};l.forEach(s=>(days[s.date]??=[]).push(s));
  return `<div class="card row"><label>Desde<input type="date" value="${this.from}" onchange="Hist.set('from',this.value)"></label><label>Hasta<input type="date" value="${this.to}" onchange="Hist.set('to',this.value)"></label><button onclick="Hist.exp()">Exportar CSV</button></div>
  <div class="card"><b>Total: ${UI.money(l.reduce((s,x)=>s+x.total,0))}</b> <span class="m">· ${l.length} ventas</span></div>
  ${Object.keys(days).map(d=>`<div class="card"><b>${d}</b> <span class="m">${UI.money(days[d].reduce((s,x)=>s+x.total,0))}</span>${days[d].map(s=>`<div class="row sp" style="margin-top:8px"><span class="m">${new Date(s.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} · ${s.mode=='w'?'May.':'Min.'} · ${s.items.map(i=>i.q+'x '+i.n).join(', ')}</span><b>${UI.money(s.total)}</b></div>`).join('')}</div>`).join('')||'<p class="m">Sin ventas en este rango.</p>'}`}
};
