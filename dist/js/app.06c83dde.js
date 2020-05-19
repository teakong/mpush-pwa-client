(function(e){function t(t){for(var a,i,n=t[0],l=t[1],c=t[2],d=0,h=[];d<n.length;d++)i=n[d],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&h.push(o[i][0]),o[i]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);u&&u(t);while(h.length)h.shift()();return r.push.apply(r,c||[]),s()}function s(){for(var e,t=0;t<r.length;t++){for(var s=r[t],a=!0,n=1;n<s.length;n++){var l=s[n];0!==o[l]&&(a=!1)}a&&(r.splice(t--,1),e=i(i.s=s[0]))}return e}var a={},o={app:0},r=[];function i(t){if(a[t])return a[t].exports;var s=a[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=e,i.c=a,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(s,a,function(t){return e[t]}.bind(null,a));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var n=window["webpackJsonp"]=window["webpackJsonp"]||[],l=n.push.bind(n);n.push=t,n=n.slice();for(var c=0;c<n.length;c++)t(n[c]);var u=l;r.push([0,"chunk-vendors"]),s()})({0:function(e,t,s){e.exports=s("56d7")},1:function(e,t){},2:function(e,t){},"369e":function(e,t,s){"use strict";var a=s("7885"),o=s.n(a);o.a},"56d7":function(e,t,s){"use strict";s.r(t);var a=s("2b0e"),o=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},r=[];class i{constructor(e,t){this.config=e,this.ebus=t,this.isAuth=!1,this.isAuthError=!1,this.isOffline=!1,this.ws=null,this.registration=this.ebus.$registration,this.applicationServerKey="",this.connect(),this.ebus.$on("refreshConfig",e=>{this.isAuthError=!1,this.config=e,this.connect()}),this.ebus.$on("offline",()=>{this.isOffline=!0}),setInterval(()=>{this.send({cmd:"PING"})},3e4)}connect(){if(this.config.url&&this.config.name&&!this.isAuthError&&!this.isOffline)try{if(this.ws)try{this.ws.onclose=null,this.ws.close()}catch(e){}this.ws=new WebSocket(this.config.url),this.ws.onopen=()=>{this.ws.send(JSON.stringify({cmd:"AUTH",data:{token:this.config.token,name:this.config.name,group:this.config.group}}))},this.ws.onclose=()=>{setTimeout(()=>{this.connect()},this.config.retryWait||3e3)},this.ws.onerror=()=>{this.toast("error","websocket连接失败")},this.ws.onmessage=this.onmessage.bind(this)}catch(e){this.toast("error",`websocket连接出错:${e.message}`)}}onmessage(e){const t=this.decodePacket(e.data);switch(t.cmd){case"AUTH":200===t.data.code?(this.isAuth=!0,localStorage.setItem("auth",t.data.auth),this.ebus.$emit("worker-set-data",{auth:t.data.auth,token:this.config.token,httpurl:this.config.httpurl,basehref:`${location.origin}${location.pathname}`}),this.applicationServerKey=t.data.fcmServerKey,this.toast("success","websocket连接成功"),this.registerFCM()):(this.isAuthError=!0,this.toast("error",t.data.msg));break;case"MESSAGE":this.send({cmd:"MESSAGE_CALLBACK",data:{mid:t.data.mid}});break;case"INFO":this.toast("info",t.data)}this.ebus.$emit(t.cmd,t.data)}decodePacket(e){return JSON.parse(e)}encodePacket(e){return JSON.stringify(e)}send(e){this.ws.send(this.encodePacket(e))}toast(e,t){this.ebus.$Toast.show({type:e,text:t})}async registerFCM(){try{if(null==window.PushManager||null==navigator.serviceWorker)return void this.toast("error",`当前浏览器不支持消息通知:${typeof window.PushManager} ${typeof navigator.serviceWorker}`);let e=await this.registration.pushManager.getSubscription();if(this.config.fcm){if(e){let t=l(e.options.applicationServerKey),s=this.applicationServerKey.replace(/-/g,"+").replace(/_/g,"/")+"=";if(t===s&&this.config.name===localStorage.getItem("fcm-name"))return;this.toast("info","重新注册FCM"),e&&await e.unsubscribe()}const t=await this.registration.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:n(this.applicationServerKey)});localStorage.setItem("fcm-name",this.config.name),this.send({cmd:"REGISTER_FCM",data:t})}else e&&e.unsubscribe()}catch(e){this.toast("error",`注册FCM出错: ${e}`),console.log(e)}}}function n(e){let t="=".repeat((4-e.length%4)%4);const s=(e+t).replace(/-/g,"+").replace(/_/g,"/");let a=atob(s),o=new Uint8Array(a.length);for(let r=0;r<a.length;r++)o[r]=a.charCodeAt(r);return o}function l(e){return btoa(String.fromCharCode.apply(null,new Uint8Array(e)))}var c={name:"App",methods:{createMpushClient(){new i({url:localStorage.getItem("url")||"",token:localStorage.getItem("token")||"",name:localStorage.getItem("name")||"",group:localStorage.getItem("group")||"",fcm:"true"===localStorage.getItem("fcm"),httpurl:localStorage.getItem("httpurl")||""},this.$ebus)}},beforeCreate(){const e=location.search.slice(1),t=e.split("&");for(const s of t){const[e,t]=s.split("=");if("scheme"===e)return void(location.href=decodeURI(t))}},async created(){const e=[];this.$messagesdb.createReadStream().on("data",t=>{e.push(t.value)}).on("end",()=>{this.$store.commit({type:"initMessages",messages:e.reverse()}),this.createMpushClient()}),this.$ebus.$on("MESSAGE",e=>{(!this.$store.state.messages[0]||this.$store.state.messages[0]&&e.mid!==this.$store.state.messages[0].mid)&&(this.$messagesdb.put(e.mid,e),this.$store.commit({type:"putMessage",message:e}))}),this.$ebus.$on("worker-set-data",e=>{navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({cmd:"set-data",data:e})})}},u=c,d=(s("5c0b"),s("2877")),h=Object(d["a"])(u,o,r,!1,null,null,null),f=h.exports,m=s("9483");function p(e){Object(m["a"])("service-worker.js",{ready(e){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(t){e.$emit("swregistered",t),console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){e.$Toast.show({type:"info",text:"Page is updated; please refresh."})},offline(){e.$emit("offline"),e.$Toast.show({type:"warning",text:"No internet connection found."})},error(e){console.error("Error during service worker registration:",e)}})}var g=s("8c4f"),b=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"home"},[s("div",{staticClass:"nav"},[s("zi-input",{staticClass:"search",class:{"search-blur":!e.focusSearch},attrs:{clearable:"",placeholder:"search"},on:{focus:function(t){e.focusSearch=!0},blur:function(t){e.focusSearch=!1}},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}},[s("searchIcon",{attrs:{slot:"prefixIcon"},slot:"prefixIcon"})],1),s("zi-checkbox",{staticClass:"fold",model:{value:e.fold,callback:function(t){e.fold=t},expression:"fold"}},[e._v("收起同类消息")]),s("router-link",{attrs:{to:"settings"}},[s("settings",{staticClass:"setting"})],1)],1),e.search||!e.fold||e.focusSearch?s("ul",{staticClass:"list"},e._l(e.showList,(function(t){return s("li",{key:t.mid,staticClass:"list-item",on:{click:function(s){e.expend=t.mid}}},[s("div",{staticClass:"title",class:{"title-expend":e.expend===t.mid}},[s("span",{staticClass:"text"},[e._v(e._s(t.message.text||e.date(Number(t.mid))))]),s("span",{staticClass:"time"},[e._v(e._s(e._f("date")(Number(t.mid))))])]),s("div",{staticClass:"desp"},[e.expend!==t.mid?s("div",{staticClass:"markdown-body"},[e._v(e._s(t.message.desp))]):s("div",{staticClass:"markdown-body expend",domProps:{innerHTML:e._s(e.markdown(t.message.desp))}}),e.expend===t.mid?s("zi-row",{staticClass:"footer"},[s("div",{staticClass:"handle"},[s("copy",{on:{click:function(s){return e.copyHandle(t.message)}}}),t.message.extra.scheme?s("a",{attrs:{href:t.message.extra.scheme}},[s("linkIcon")],1):e._e(),s("zi-tooltip",[s("alertCircle",{attrs:{Click:"",Trigger:""}}),s("div",{staticStyle:{"text-align":"left"},attrs:{slot:"content"},slot:"content"},[s("p",[e._v("from: "+e._s(t.from.method)+" "+e._s(t.from.name))]),s("p",[e._v("target: "+e._s("personal"===t.sendType?"":"Group ")+e._s(t.target))])])],1),s("trash",{on:{click:function(s){return e.trash(t)}}})],1)]):e._e()],1)])})),0):s("ul",{staticClass:"list-fold"},e._l(e.showListFold,(function(t,a){return s("li",{key:t.key,staticClass:"list-fold-group"},[s("div",{staticClass:"title",on:{click:function(s){e.foldExpend===t.key?e.foldExpend=null:e.foldExpend=t.key}}},[s("span",{staticClass:"text"},[e._v(e._s(t.key))])]),e.foldExpend===t.key?s("ul",{staticClass:"list-fold-item-ul"},e._l(t.data,(function(t,a){return s("li",{key:t.mid,staticClass:"list-fold-item-li",on:{click:function(s){e.expend=t.mid}}},[s("div",{staticClass:"desp"},[e.expend!==t.mid?s("div",{staticClass:"markdown-body list-fold-item-desp"},[e._v(e._s(t.message.desp||"无正文"))]):s("div",{staticClass:"markdown-body list-fold-item-desp expend",domProps:{innerHTML:e._s(e.markdown(t.message.desp)||"无正文")}}),s("span",{staticClass:"list-fold-item-time"},[e._v(e._s(e._f("date")(Number(t.mid))))]),s("div",{staticStyle:{clear:"both"}})]),e.expend===t.mid?s("zi-row",{staticClass:"footer"},[s("div",{staticClass:"handle"},[s("copy",{on:{click:function(s){return e.copyHandle(t.message)}}}),t.message.extra.scheme?s("a",{attrs:{href:t.message.extra.scheme}},[s("linkIcon")],1):e._e(),s("zi-tooltip",[s("alertCircle",{attrs:{Click:"",Trigger:""}}),s("div",{staticStyle:{"text-align":"left"},attrs:{slot:"content"},slot:"content"},[s("p",[e._v("from: "+e._s(t.from.method)+" "+e._s(t.from.name))]),s("p",[e._v("target: "+e._s("personal"===t.sendType?"":"Group ")+e._s(t.target))])])],1),s("trash",{on:{click:function(s){return e.trash(t)}}})],1)]):e._e()],1)})),0):e._e()])})),0),s("zi-dialog",{attrs:{title:e.dialogTitle,beforeDone:e.dialogDone,done:"确认",cancel:"取消"},model:{value:e.dialogVisible,callback:function(t){e.dialogVisible=t},expression:"dialogVisible"}})],1)},v=[],y=s("173a"),w=s("9ef9"),k=s("899b"),x=s("cc4f"),S=s("184d"),C=s("ef13"),_={name:"Home",components:{searchIcon:y["a"],settings:w["a"],copy:k["a"],linkIcon:x["a"],alertCircle:S["a"],trash:C["a"]},data(){return{expend:"",dialogVisible:!1,dialogTitle:"",dialogDone:()=>{},search:"",focusSearch:!1,fold:!1,foldExpend:""}},computed:{messageList(){return this.$store.state.messages},showList(){return this.search?this.messageList.filter(e=>e.message.text.indexOf(this.search)>-1||e.message.desp.indexOf(this.search)>-1):this.messageList},showListFold(){const e={};for(const s of this.messageList){s.message.text&&s.message.text;e[s.message.text]||(e[s.message.text]={data:[],hasNew:!1}),e[s.message.text].data.push(s),e[s.message.text].hasNew=!!s.isNew||e[s.message.text].hasNew}const t=[];for(let s in e)t.push({key:s,...e[s]});return t.sort((e,t)=>t.data[0].mid-e.data[0].mid)}},methods:{markdown(e){return this.$options.filters.markdown(e)},date(e){return this.$options.filters.date(e)},copyHandle(e){if(e.desp){let t=document.createElement("textarea");t.value=e.desp,document.body.appendChild(t),t.select(),document.execCommand("copy"),this.$Toast.show({type:"success",text:"复制成功"}),document.body.removeChild(t)}else this.$Toast.show({type:"error",text:"复制失败,内容为空"})},trash(e){this.comfirm("确认要删除?",()=>{this.$store.commit({type:"deleteMessage",message:e}),this.$messagesdb.del(e.mid)})},comfirm(e,t){this.dialogTitle=e,this.dialogVisible=!0,this.dialogDone=()=>{this.dialogVisible=!1,t()}}},watch:{fold(e){localStorage.setItem("fold",e)}},created(){this.fold="true"===localStorage.getItem("fold")}},$=_,M=(s("8e8a"),Object(d["a"])($,b,v,!1,null,"3387c9e8",null)),I=M.exports,T=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"settings"},[s("div",{staticClass:"nav"},[s("router-link",{attrs:{to:"/"}},[s("arrowLeft",{staticClass:"arrowLeft"})],1)],1),s("div",{staticClass:"handles"},[s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"WebsocketURL"},model:{value:e.url,callback:function(t){e.url=t},expression:"url"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Token"},model:{value:e.token,callback:function(t){e.token=t},expression:"token"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Name"},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Group"},model:{value:e.group,callback:function(t){e.group=t},expression:"group"}})],1),s("zi-row",[e._v(" FCM推送 "),s("zi-toggle",{model:{value:e.fcm,callback:function(t){e.fcm=t},expression:"fcm"}})],1),e.fcm?s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{placeholder:"如果服务端打开了fcm.comfirmMode则这项必填","prefix-label":"HttpURL"},model:{value:e.httpurl,callback:function(t){e.httpurl=t},expression:"httpurl"}})],1):e._e(),s("zi-button",{staticClass:"save",attrs:{shadow:"",type:"success"},on:{click:function(t){return e.save()}}},[e._v("应用")])],1)])},O=[],E=s("fae9"),P={name:"Settings",components:{arrowLeft:E["a"]},data(){return{url:"",token:"",name:"",group:"",fcm:!1,httpurl:""}},methods:{async save(){if(this.httpurl){const e=await this.testHTTPurl();if(!0!==e)return void this.$Toast.show({type:"error",text:`http接口无法访问:${e.message}`})}this.url&&this.name?(localStorage.setItem("url",this.url),localStorage.setItem("token",this.token),localStorage.setItem("name",this.name),localStorage.setItem("group",this.group),localStorage.setItem("fcm",this.fcm?"true":"false"),localStorage.setItem("httpurl",this.httpurl),this.$Toast.show({type:"success",text:"保存成功"}),this.$ebus.$emit("refreshConfig",{url:this.url,token:this.token,name:this.name,group:this.group,fcm:this.fcm,httpurl:this.httpurl})):this.$Toast.show({type:"error",text:`[${this.url?"name":"url"}]不能为空`})},testHTTPurl(){return new Promise(e=>{fetch(this.httpurl,{body:JSON.stringify({cmd:"TEST_HTTP"}),method:"POST",headers:{"content-type":"application/json"}}).then(()=>{e(!0)}).catch(t=>{e(t)})})}},created(){this.url=localStorage.getItem("url")||"",this.token=localStorage.getItem("token")||"",this.name=localStorage.getItem("name")||"",this.group=localStorage.getItem("group")||"",this.fcm="true"===localStorage.getItem("fcm"),this.httpurl=localStorage.getItem("httpurl")||""}},z=P,H=(s("369e"),Object(d["a"])(z,T,O,!1,null,"78e968b3",null)),A=H.exports;a["default"].use(g["a"]);const L=[{path:"/",name:"Home",component:I},{path:"/settings",name:"Settings",component:A}],j=new g["a"]({routes:L});var N=j,F=s("2f62");a["default"].use(F["a"]);var G=new F["a"].Store({state:{messages:[]},mutations:{initMessages(e,t){this.state.messages=t.messages},putMessage(e,t){this.state.messages.unshift(t.message)},deleteMessage(e,t){this.state.messages.splice(this.state.messages.indexOf(t.message),1)}},actions:{},modules:{}}),K=s("5353"),W=s.n(K),R=s("46fd"),U=s.n(R),V=s("ddc3"),D=s.n(V),J=s("e0c1"),B=s.n(J);s("e4cb");const q=new B.a.Renderer;function Y(e,t){let s=new Date(e),a=function(e){return(e<10?"0":"")+e};return t.replace(/yyyy|MM|dd|HH|mm|ss/g,(function(e){switch(e){case"yyyy":return a(s.getFullYear());case"MM":return a(s.getMonth()+1);case"mm":return a(s.getMinutes());case"dd":return a(s.getDate());case"HH":return a(s.getHours());case"ss":return a(s.getSeconds())}}))}q.link=function(e,t,s){return`<a title="${t}" target="_blank" href="${e}">${s}</a>`},B.a.setOptions({gfm:!0,tables:!0,breaks:!0,sanitize:!0,smartLists:!0,smartypants:!0}),a["default"].filter("markdown",(function(e){return B()(e)})),a["default"].filter("date",(function(e){return Y(e,"yyyy-MM-dd HH:mm:ss")}));var Q=s("f64e"),X=s.n(Q),Z=(s("f8c4"),s("34ec"),s("7980"),s("05f7"));a["default"].use(X.a),Object(Z["a"])(a["default"]);const ee=new a["default"];a["default"].config.productionTip=!1,a["default"].prototype.$ebus=ee,a["default"].prototype.$messagesdb=W()(U()(D()("messages",{prefix:""}),{valueEncoding:"json"})),null==window.PushManager||null==navigator.serviceWorker?new a["default"]({router:N,store:G,render:function(e){return e(f)}}).$mount("#app"):(ee.$on("swregistered",e=>{a["default"].prototype.$registration=e,new a["default"]({router:N,store:G,render:function(e){return e(f)}}).$mount("#app")}),p(ee))},"5c0b":function(e,t,s){"use strict";var a=s("9c0c"),o=s.n(a);o.a},7885:function(e,t,s){},"8e8a":function(e,t,s){"use strict";var a=s("dd04"),o=s.n(a);o.a},"9c0c":function(e,t,s){},dd04:function(e,t,s){}});