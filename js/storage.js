// Datos: hoy en localStorage. Para pasar a base de datos solo se cambia este archivo.
const DB={k:'ventas_db',d:null,
 load(){try{this.d=JSON.parse(localStorage.getItem(this.k))}catch(e){}
  this.d=this.d||{cfg:{name:'Mi Empresa',logo:'🥚',pAdmin:'1234',pAdv:'1234'},stores:[],maples:[{id:'m1',name:'Maple',qty:30}],products:[],prices:{},stock:{},sales:[]}},
 save(){localStorage.setItem(this.k,JSON.stringify(this.d))},
 uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}};
DB.load();
const Dev={get:()=>localStorage.getItem('ventas_store'),set:v=>v?localStorage.setItem('ventas_store',v):localStorage.removeItem('ventas_store')};
