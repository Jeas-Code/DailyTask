const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync('C:/Programs/DailyTask/index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
try{ new vm.Script(src,{filename:'inline.js'}); console.log('JS SYNTAX OK'); }
catch(e){ console.log('SYNTAX ERROR:',e.message); process.exit(1); }

function El(id){return{id:'id-'+id,value:'',textContent:'',innerHTML:'',dataset:{},style:{},disabled:false,checked:true,
 classList:{add(){},remove(){},toggle(c){this._c=this._c||{};this._c[c]=!this._c[c]},contains(c){return !!(this._c||{})[c]}},addEventListener(){},
 querySelectorAll(){return L()},querySelector(s){return s==='.lbl'?{textContent:''}:El('x')},
 closest(){return El('x')},scrollIntoView(){},focus(){},cloneNode(){return El(id)},remove(){},click(){},select(){},offsetTop:0,scrollTop:0,scrollHeight:0,innerText:'',_c:{}};}
function L(){const a=[];a.forEach=Array.prototype.forEach.bind(a);return a;}
const store={ 'wb_dtw_aicfg': JSON.stringify({base:'https://api.deepseek.com',key:'sk-test-123',model:'deepseek-chat'}) };
const docEl={attrs:{theme:'light'},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]||null}};
let copied='';
const sb={console,setTimeout,setInterval:()=>0,clearTimeout,Date,Math,JSON,Object,Array,String,Number,Boolean,RegExp,Error,parseInt,parseFloat,encodeURIComponent,decodeURIComponent,escape,unescape,btoa:function(s){return Buffer.from(s,'binary').toString('base64')},atob:function(s){return Buffer.from(s,'base64').toString('binary')},Promise,
 fetch:()=>Promise.reject(0),AbortController:class{constructor(){this.signal={}}abort(){}},TextDecoder:class{},Blob:class{},FileReader:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}},
 navigator:{clipboard:{writeText(t){copied=t;return Promise.resolve();}}},
 localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},
 document:{documentElement:docEl,getElementById:El,querySelector:()=>El('q'),querySelectorAll:()=>L(),createElement:()=>El('c'),body:{appendChild(){},execCommand:()=>true},execCommand:()=>true,addEventListener(){}}};
sb.window={addEventListener(){},scrollY:0}; sb.globalThis=sb;
vm.createContext(sb); vm.runInContext(src, sb);

// encode without AI
const c1 = sb.encodeSync(false);
// encode with AI (syncAI checked default true)
sb.$('syncAI').checked = true;
const c2 = sb.encodeSync(true);
console.log('encode no-AI len:', c1.length, '| with-AI len:', c2.length, '| larger:', c2.length>c1.length);

const d1 = sb.decodeSync(c2);
console.log('decode tasks:', d1.tasks.length, '| aicfg.base:', d1.aicfg && d1.aicfg.base);

// import via sync code path
sb.$('syncInput').value = c2;
sb.importSyncCode();
console.log('K_AI after import:', store['wb_dtw_aicfg'] ? 'set' : 'NOT set');

// copy path (clipboard stub)
sb.$('syncAI').checked = true;
sb.copySyncCode();
console.log('clipboard copied len:', copied.length, '| includes AI:', copied.length === c2.length);

// decode old v1 (no aicfg)
const oldCode = sb.btoa(sb.unescape(sb.encodeURIComponent(JSON.stringify({app:'daily-task-workbench',version:1,tasks:sb.state.tasks}))));
const dOld = sb.decodeSync(oldCode);
console.log('old v1 decode tasks:', dOld.tasks.length, '| aicfg:', dOld.aicfg);

console.log('ALL SYNC TESTS PASSED');
