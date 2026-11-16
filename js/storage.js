// Datos: hoy en localStorage. Para pasar a base de datos solo se cambia este archivo.
const DB={k:'ventas_db',d:null,
 def:()=>({cfg:{name:'Mi Empresa',logo:'🥚',img:null,pAdmin:'1234',pAdv:'1234'},stores:[],maples:[{id:'m1',name:'Maple',qty:30}],products:[],prices:{},stock:{},sales:[],clients:[],pays:[],waste:[],log:[],holds:[]}),
 load(){let o=null;try{o=JSON.parse(localStorage.getItem(this.k))}catch(e){}
  if(!o||typeof o!='object')o={};const d=this.def();this.d=Object.assign(d,o);this.d.cfg=Object.assign(d.cfg,o.cfg||{});
  ['stores','maples','products','sales','clients','pays','waste','log','holds'].forEach(k=>{if(!Array.isArray(this.d[k]))this.d[k]=[]});['prices','stock'].forEach(k=>{if(!this.d[k]||typeof this.d[k]!='object')this.d[k]={}})},
 save(){localStorage.setItem(this.k,JSON.stringify(this.d))},
 log(t,x){this.d.log.push({id:this.uid(),store:Dev.get(),date:UI.today(),ts:Date.now(),t,x})},
 uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}};
const Dev={get:()=>localStorage.getItem('ventas_store'),set:v=>v?localStorage.setItem('ventas_store',v):localStorage.removeItem('ventas_store')};
DB.load();
