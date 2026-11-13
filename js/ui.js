const $=(s,r=document)=>r.querySelector(s);
const UI={
 money:n=>'Bs '+(+n).toFixed(2),
 today(){const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)},
 toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2200)},
 form(title,fields,ok){const d=document.createElement('dialog');
  d.innerHTML=`<form method="dialog"><h3>${title}</h3>${fields.map(f=>`<label>${f.l}${f.o?`<select name="${f.k}">${f.o.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join('')}</select>`:`<input name="${f.k}" type="${f.t||'text'}" value="${f.v??''}" ${f.t=='number'?'step="any" min="0"':''}>`}</label>`).join('')}<div class="row"><button value="ok">Aceptar</button><button value="x" class="ghost">Cancelar</button></div></form>`;
  document.body.append(d);d.showModal();
  d.onclose=()=>{if(d.returnValue=='ok'){const o={};new FormData($('form',d)).forEach((v,k)=>o[k]=v);ok(o)}d.remove()}},
 pass(exp,ok){UI.form('Contraseña',[{k:'p',l:'Ingresa la contraseña',t:'password'}],o=>o.p===exp?ok():UI.toast('Contraseña incorrecta'))}
};
