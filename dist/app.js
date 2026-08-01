"use strict";(()=>{var hn=Object.create;var tt=Object.defineProperty;var gn=Object.getOwnPropertyDescriptor;var vn=Object.getOwnPropertyNames;var yn=Object.getPrototypeOf,bn=Object.prototype.hasOwnProperty;var m=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var wn=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of vn(e))!bn.call(r,i)&&i!==t&&tt(r,i,{get:()=>e[i],enumerable:!(n=gn(e,i))||n.enumerable});return r};var In=(r,e,t)=>(t=r!=null?hn(yn(r)):{},wn(e||!r||!r.__esModule?tt(t,"default",{value:r,enumerable:!0}):t,r));var ct=m((Rr,dt)=>{dt.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var $=m(F=>{var Ae,En=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];F.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};F.getSymbolTotalCodewords=function(e){return En[e]};F.getBCHDigit=function(r){let e=0;for(;r!==0;)e++,r>>>=1;return e};F.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');Ae=e};F.isKanjiModeEnabled=function(){return typeof Ae<"u"};F.toSJIS=function(e){return Ae(e)}});var oe=m(I=>{I.L={bit:1};I.M={bit:0};I.Q={bit:3};I.H={bit:2};function xn(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return I.L;case"m":case"medium":return I.M;case"q":case"quartile":return I.Q;case"h":case"high":return I.H;default:throw new Error("Unknown EC Level: "+r)}}I.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4};I.from=function(e,t){if(I.isValid(e))return e;try{return xn(e)}catch{return t}}});var ft=m((kr,mt)=>{function ut(){this.buffer=[],this.length=0}ut.prototype={get:function(r){let e=Math.floor(r/8);return(this.buffer[e]>>>7-r%8&1)===1},put:function(r,e){for(let t=0;t<e;t++)this.putBit((r>>>e-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(r){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),r&&(this.buffer[e]|=128>>>this.length%8),this.length++}};mt.exports=ut});var ht=m((Fr,pt)=>{function j(r){if(!r||r<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=r,this.data=new Uint8Array(r*r),this.reservedBit=new Uint8Array(r*r)}j.prototype.set=function(r,e,t,n){let i=r*this.size+e;this.data[i]=t,n&&(this.reservedBit[i]=!0)};j.prototype.get=function(r,e){return this.data[r*this.size+e]};j.prototype.xor=function(r,e,t){this.data[r*this.size+e]^=t};j.prototype.isReserved=function(r,e){return this.reservedBit[r*this.size+e]};pt.exports=j});var gt=m(ae=>{var Sn=$().getSymbolSize;ae.getRowColCoords=function(e){if(e===1)return[];let t=Math.floor(e/7)+2,n=Sn(e),i=n===145?26:Math.ceil((n-13)/(2*t-2))*2,s=[n-7];for(let o=1;o<t-1;o++)s[o]=s[o-1]-i;return s.push(6),s.reverse()};ae.getPositions=function(e){let t=[],n=ae.getRowColCoords(e),i=n.length;for(let s=0;s<i;s++)for(let o=0;o<i;o++)s===0&&o===0||s===0&&o===i-1||s===i-1&&o===0||t.push([n[s],n[o]]);return t}});var bt=m(yt=>{var Cn=$().getSymbolSize,vt=7;yt.getPositions=function(e){let t=Cn(e);return[[0,0],[t-vt,0],[0,t-vt]]}});var wt=m(p=>{p.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var z={N1:3,N2:3,N3:40,N4:10};p.isValid=function(e){return e!=null&&e!==""&&!isNaN(e)&&e>=0&&e<=7};p.from=function(e){return p.isValid(e)?parseInt(e,10):void 0};p.getPenaltyN1=function(e){let t=e.size,n=0,i=0,s=0,o=null,a=null;for(let l=0;l<t;l++){i=s=0,o=a=null;for(let c=0;c<t;c++){let d=e.get(l,c);d===o?i++:(i>=5&&(n+=z.N1+(i-5)),o=d,i=1),d=e.get(c,l),d===a?s++:(s>=5&&(n+=z.N1+(s-5)),a=d,s=1)}i>=5&&(n+=z.N1+(i-5)),s>=5&&(n+=z.N1+(s-5))}return n};p.getPenaltyN2=function(e){let t=e.size,n=0;for(let i=0;i<t-1;i++)for(let s=0;s<t-1;s++){let o=e.get(i,s)+e.get(i,s+1)+e.get(i+1,s)+e.get(i+1,s+1);(o===4||o===0)&&n++}return n*z.N2};p.getPenaltyN3=function(e){let t=e.size,n=0,i=0,s=0;for(let o=0;o<t;o++){i=s=0;for(let a=0;a<t;a++)i=i<<1&2047|e.get(o,a),a>=10&&(i===1488||i===93)&&n++,s=s<<1&2047|e.get(a,o),a>=10&&(s===1488||s===93)&&n++}return n*z.N3};p.getPenaltyN4=function(e){let t=0,n=e.data.length;for(let s=0;s<n;s++)t+=e.data[s];return Math.abs(Math.ceil(t*100/n/5)-10)*z.N4};function Bn(r,e,t){switch(r){case p.Patterns.PATTERN000:return(e+t)%2===0;case p.Patterns.PATTERN001:return e%2===0;case p.Patterns.PATTERN010:return t%3===0;case p.Patterns.PATTERN011:return(e+t)%3===0;case p.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(t/3))%2===0;case p.Patterns.PATTERN101:return e*t%2+e*t%3===0;case p.Patterns.PATTERN110:return(e*t%2+e*t%3)%2===0;case p.Patterns.PATTERN111:return(e*t%3+(e+t)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}p.applyMask=function(e,t){let n=t.size;for(let i=0;i<n;i++)for(let s=0;s<n;s++)t.isReserved(s,i)||t.xor(s,i,Bn(e,s,i))};p.getBestMask=function(e,t){let n=Object.keys(p.Patterns).length,i=0,s=1/0;for(let o=0;o<n;o++){t(o),p.applyMask(o,e);let a=p.getPenaltyN1(e)+p.getPenaltyN2(e)+p.getPenaltyN3(e)+p.getPenaltyN4(e);p.applyMask(o,e),a<s&&(s=a,i=o)}return i}});var Re=m($e=>{var R=oe(),le=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],de=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];$e.getBlocksCount=function(e,t){switch(t){case R.L:return le[(e-1)*4+0];case R.M:return le[(e-1)*4+1];case R.Q:return le[(e-1)*4+2];case R.H:return le[(e-1)*4+3];default:return}};$e.getTotalCodewordsCount=function(e,t){switch(t){case R.L:return de[(e-1)*4+0];case R.M:return de[(e-1)*4+1];case R.Q:return de[(e-1)*4+2];case R.H:return de[(e-1)*4+3];default:return}}});var It=m(ue=>{var Y=new Uint8Array(512),ce=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)Y[t]=e,ce[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)Y[t]=Y[t-255]})();ue.log=function(e){if(e<1)throw new Error("log("+e+")");return ce[e]};ue.exp=function(e){return Y[e]};ue.mul=function(e,t){return e===0||t===0?0:Y[ce[e]+ce[t]]}});var Et=m(Q=>{var Pe=It();Q.mul=function(e,t){let n=new Uint8Array(e.length+t.length-1);for(let i=0;i<e.length;i++)for(let s=0;s<t.length;s++)n[i+s]^=Pe.mul(e[i],t[s]);return n};Q.mod=function(e,t){let n=new Uint8Array(e);for(;n.length-t.length>=0;){let i=n[0];for(let o=0;o<t.length;o++)n[o]^=Pe.mul(t[o],i);let s=0;for(;s<n.length&&n[s]===0;)s++;n=n.slice(s)}return n};Q.generateECPolynomial=function(e){let t=new Uint8Array([1]);for(let n=0;n<e;n++)t=Q.mul(t,new Uint8Array([1,Pe.exp(n)]));return t}});var Ct=m((Or,St)=>{var xt=Et();function Ne(r){this.genPoly=void 0,this.degree=r,this.degree&&this.initialize(this.degree)}Ne.prototype.initialize=function(e){this.degree=e,this.genPoly=xt.generateECPolynomial(this.degree)};Ne.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let n=xt.mod(t,this.genPoly),i=this.degree-n.length;if(i>0){let s=new Uint8Array(this.degree);return s.set(n,i),s}return n};St.exports=Ne});var ke=m(Bt=>{Bt.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}});var Fe=m(C=>{var Tt="[0-9]+",Tn="[A-Z $%*+\\-./:]+",W="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";W=W.replace(/u/g,"\\u");var Ln="(?:(?![A-Z0-9 $%*+\\-./:]|"+W+`)(?:.|[\r
]))+`;C.KANJI=new RegExp(W,"g");C.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");C.BYTE=new RegExp(Ln,"g");C.NUMERIC=new RegExp(Tt,"g");C.ALPHANUMERIC=new RegExp(Tn,"g");var Mn=new RegExp("^"+W+"$"),An=new RegExp("^"+Tt+"$"),$n=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");C.testKanji=function(e){return Mn.test(e)};C.testNumeric=function(e){return An.test(e)};C.testAlphanumeric=function(e){return $n.test(e)}});var P=m(v=>{var Rn=ke(),ze=Fe();v.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};v.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};v.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};v.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};v.MIXED={bit:-1};v.getCharCountIndicator=function(e,t){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!Rn.isValid(t))throw new Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]};v.getBestModeForData=function(e){return ze.testNumeric(e)?v.NUMERIC:ze.testAlphanumeric(e)?v.ALPHANUMERIC:ze.testKanji(e)?v.KANJI:v.BYTE};v.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")};v.isValid=function(e){return e&&e.bit&&e.ccBits};function Pn(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"numeric":return v.NUMERIC;case"alphanumeric":return v.ALPHANUMERIC;case"kanji":return v.KANJI;case"byte":return v.BYTE;default:throw new Error("Unknown mode: "+r)}}v.from=function(e,t){if(v.isValid(e))return e;try{return Pn(e)}catch{return t}}});var Rt=m(D=>{var me=$(),Nn=Re(),Lt=oe(),N=P(),De=ke(),At=7973,Mt=me.getBCHDigit(At);function kn(r,e,t){for(let n=1;n<=40;n++)if(e<=D.getCapacity(n,t,r))return n}function $t(r,e){return N.getCharCountIndicator(r,e)+4}function Fn(r,e){let t=0;return r.forEach(function(n){let i=$t(n.mode,e);t+=i+n.getBitsLength()}),t}function zn(r,e){for(let t=1;t<=40;t++)if(Fn(r,t)<=D.getCapacity(t,e,N.MIXED))return t}D.from=function(e,t){return De.isValid(e)?parseInt(e,10):t};D.getCapacity=function(e,t,n){if(!De.isValid(e))throw new Error("Invalid QR Code version");typeof n>"u"&&(n=N.BYTE);let i=me.getSymbolTotalCodewords(e),s=Nn.getTotalCodewordsCount(e,t),o=(i-s)*8;if(n===N.MIXED)return o;let a=o-$t(n,e);switch(n){case N.NUMERIC:return Math.floor(a/10*3);case N.ALPHANUMERIC:return Math.floor(a/11*2);case N.KANJI:return Math.floor(a/13);case N.BYTE:default:return Math.floor(a/8)}};D.getBestVersionForData=function(e,t){let n,i=Lt.from(t,Lt.M);if(Array.isArray(e)){if(e.length>1)return zn(e,i);if(e.length===0)return 1;n=e[0]}else n=e;return kn(n.mode,n.getLength(),i)};D.getEncodedBits=function(e){if(!De.isValid(e)||e<7)throw new Error("Invalid QR Code version");let t=e<<12;for(;me.getBCHDigit(t)-Mt>=0;)t^=At<<me.getBCHDigit(t)-Mt;return e<<12|t}});var Ft=m(kt=>{var He=$(),Nt=1335,Dn=21522,Pt=He.getBCHDigit(Nt);kt.getEncodedBits=function(e,t){let n=e.bit<<3|t,i=n<<10;for(;He.getBCHDigit(i)-Pt>=0;)i^=Nt<<He.getBCHDigit(i)-Pt;return(n<<10|i)^Dn}});var Dt=m((Yr,zt)=>{var Hn=P();function U(r){this.mode=Hn.NUMERIC,this.data=r.toString()}U.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};U.prototype.getLength=function(){return this.data.length};U.prototype.getBitsLength=function(){return U.getBitsLength(this.data.length)};U.prototype.write=function(e){let t,n,i;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),i=parseInt(n,10),e.put(i,10);let s=this.data.length-t;s>0&&(n=this.data.substr(t),i=parseInt(n,10),e.put(i,s*3+1))};zt.exports=U});var _t=m((Qr,Ht)=>{var _n=P(),_e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function O(r){this.mode=_n.ALPHANUMERIC,this.data=r}O.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};O.prototype.getLength=function(){return this.data.length};O.prototype.getBitsLength=function(){return O.getBitsLength(this.data.length)};O.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let n=_e.indexOf(this.data[t])*45;n+=_e.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(_e.indexOf(this.data[t]),6)};Ht.exports=O});var Ut=m((Wr,qt)=>{var qn=P();function V(r){this.mode=qn.BYTE,typeof r=="string"?this.data=new TextEncoder().encode(r):this.data=new Uint8Array(r)}V.getBitsLength=function(e){return e*8};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(r){for(let e=0,t=this.data.length;e<t;e++)r.put(this.data[e],8)};qt.exports=V});var Vt=m((Xr,Ot)=>{var Un=P(),On=$();function J(r){this.mode=Un.KANJI,this.data=r}J.getBitsLength=function(e){return e*13};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(r){let e;for(e=0;e<this.data.length;e++){let t=On.toSJIS(this.data[e]);if(t>=33088&&t<=40956)t-=33088;else if(t>=57408&&t<=60351)t-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);t=(t>>>8&255)*192+(t&255),r.put(t,13)}};Ot.exports=J});var Jt=m((Zr,qe)=>{"use strict";var X={single_source_shortest_paths:function(r,e,t){var n={},i={};i[e]=0;var s=X.PriorityQueue.make();s.push(e,0);for(var o,a,l,c,d,g,h,E,B;!s.empty();){o=s.pop(),a=o.value,c=o.cost,d=r[a]||{};for(l in d)d.hasOwnProperty(l)&&(g=d[l],h=c+g,E=i[l],B=typeof i[l]>"u",(B||E>h)&&(i[l]=h,s.push(l,h),n[l]=a))}if(typeof t<"u"&&typeof i[t]>"u"){var T=["Could not find a path from ",e," to ",t,"."].join("");throw new Error(T)}return n},extract_shortest_path_from_predecessor_list:function(r,e){for(var t=[],n=e,i;n;)t.push(n),i=r[n],n=r[n];return t.reverse(),t},find_path:function(r,e,t){var n=X.single_source_shortest_paths(r,e,t);return X.extract_shortest_path_from_predecessor_list(n,t)},PriorityQueue:{make:function(r){var e=X.PriorityQueue,t={},n;r=r||{};for(n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t.queue=[],t.sorter=r.sorter||e.default_sorter,t},default_sorter:function(r,e){return r.cost-e.cost},push:function(r,e){var t={value:r,cost:e};this.queue.push(t),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof qe<"u"&&(qe.exports=X)});var Zt=m(G=>{var u=P(),jt=Dt(),Yt=_t(),Qt=Ut(),Wt=Vt(),Z=Fe(),fe=$(),Vn=Jt();function Gt(r){return unescape(encodeURIComponent(r)).length}function ee(r,e,t){let n=[],i;for(;(i=r.exec(t))!==null;)n.push({data:i[0],index:i.index,mode:e,length:i[0].length});return n}function Xt(r){let e=ee(Z.NUMERIC,u.NUMERIC,r),t=ee(Z.ALPHANUMERIC,u.ALPHANUMERIC,r),n,i;return fe.isKanjiModeEnabled()?(n=ee(Z.BYTE,u.BYTE,r),i=ee(Z.KANJI,u.KANJI,r)):(n=ee(Z.BYTE_KANJI,u.BYTE,r),i=[]),e.concat(t,n,i).sort(function(o,a){return o.index-a.index}).map(function(o){return{data:o.data,mode:o.mode,length:o.length}})}function Ue(r,e){switch(e){case u.NUMERIC:return jt.getBitsLength(r);case u.ALPHANUMERIC:return Yt.getBitsLength(r);case u.KANJI:return Wt.getBitsLength(r);case u.BYTE:return Qt.getBitsLength(r)}}function Jn(r){return r.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function Gn(r){let e=[];for(let t=0;t<r.length;t++){let n=r[t];switch(n.mode){case u.NUMERIC:e.push([n,{data:n.data,mode:u.ALPHANUMERIC,length:n.length},{data:n.data,mode:u.BYTE,length:n.length}]);break;case u.ALPHANUMERIC:e.push([n,{data:n.data,mode:u.BYTE,length:n.length}]);break;case u.KANJI:e.push([n,{data:n.data,mode:u.BYTE,length:Gt(n.data)}]);break;case u.BYTE:e.push([{data:n.data,mode:u.BYTE,length:Gt(n.data)}])}}return e}function Kn(r,e){let t={},n={start:{}},i=["start"];for(let s=0;s<r.length;s++){let o=r[s],a=[];for(let l=0;l<o.length;l++){let c=o[l],d=""+s+l;a.push(d),t[d]={node:c,lastCount:0},n[d]={};for(let g=0;g<i.length;g++){let h=i[g];t[h]&&t[h].node.mode===c.mode?(n[h][d]=Ue(t[h].lastCount+c.length,c.mode)-Ue(t[h].lastCount,c.mode),t[h].lastCount+=c.length):(t[h]&&(t[h].lastCount=c.length),n[h][d]=Ue(c.length,c.mode)+4+u.getCharCountIndicator(c.mode,e))}}i=a}for(let s=0;s<i.length;s++)n[i[s]].end=0;return{map:n,table:t}}function Kt(r,e){let t,n=u.getBestModeForData(r);if(t=u.from(e,n),t!==u.BYTE&&t.bit<n.bit)throw new Error('"'+r+'" cannot be encoded with mode '+u.toString(t)+`.
 Suggested mode is: `+u.toString(n));switch(t===u.KANJI&&!fe.isKanjiModeEnabled()&&(t=u.BYTE),t){case u.NUMERIC:return new jt(r);case u.ALPHANUMERIC:return new Yt(r);case u.KANJI:return new Wt(r);case u.BYTE:return new Qt(r)}}G.fromArray=function(e){return e.reduce(function(t,n){return typeof n=="string"?t.push(Kt(n,null)):n.data&&t.push(Kt(n.data,n.mode)),t},[])};G.fromString=function(e,t){let n=Xt(e,fe.isKanjiModeEnabled()),i=Gn(n),s=Kn(i,t),o=Vn.find_path(s.map,"start","end"),a=[];for(let l=1;l<o.length-1;l++)a.push(s.table[o[l]].node);return G.fromArray(Jn(a))};G.rawSplit=function(e){return G.fromArray(Xt(e,fe.isKanjiModeEnabled()))}});var tn=m(en=>{var he=$(),Oe=oe(),jn=ft(),Yn=ht(),Qn=gt(),Wn=bt(),Ge=wt(),Ke=Re(),Xn=Ct(),pe=Rt(),Zn=Ft(),er=P(),Ve=Zt();function tr(r,e){let t=r.size,n=Wn.getPositions(e);for(let i=0;i<n.length;i++){let s=n[i][0],o=n[i][1];for(let a=-1;a<=7;a++)if(!(s+a<=-1||t<=s+a))for(let l=-1;l<=7;l++)o+l<=-1||t<=o+l||(a>=0&&a<=6&&(l===0||l===6)||l>=0&&l<=6&&(a===0||a===6)||a>=2&&a<=4&&l>=2&&l<=4?r.set(s+a,o+l,!0,!0):r.set(s+a,o+l,!1,!0))}}function nr(r){let e=r.size;for(let t=8;t<e-8;t++){let n=t%2===0;r.set(t,6,n,!0),r.set(6,t,n,!0)}}function rr(r,e){let t=Qn.getPositions(e);for(let n=0;n<t.length;n++){let i=t[n][0],s=t[n][1];for(let o=-2;o<=2;o++)for(let a=-2;a<=2;a++)o===-2||o===2||a===-2||a===2||o===0&&a===0?r.set(i+o,s+a,!0,!0):r.set(i+o,s+a,!1,!0)}}function ir(r,e){let t=r.size,n=pe.getEncodedBits(e),i,s,o;for(let a=0;a<18;a++)i=Math.floor(a/3),s=a%3+t-8-3,o=(n>>a&1)===1,r.set(i,s,o,!0),r.set(s,i,o,!0)}function Je(r,e,t){let n=r.size,i=Zn.getEncodedBits(e,t),s,o;for(s=0;s<15;s++)o=(i>>s&1)===1,s<6?r.set(s,8,o,!0):s<8?r.set(s+1,8,o,!0):r.set(n-15+s,8,o,!0),s<8?r.set(8,n-s-1,o,!0):s<9?r.set(8,15-s-1+1,o,!0):r.set(8,15-s-1,o,!0);r.set(n-8,8,1,!0)}function sr(r,e){let t=r.size,n=-1,i=t-1,s=7,o=0;for(let a=t-1;a>0;a-=2)for(a===6&&a--;;){for(let l=0;l<2;l++)if(!r.isReserved(i,a-l)){let c=!1;o<e.length&&(c=(e[o]>>>s&1)===1),r.set(i,a-l,c),s--,s===-1&&(o++,s=7)}if(i+=n,i<0||t<=i){i-=n,n=-n;break}}}function or(r,e,t){let n=new jn;t.forEach(function(l){n.put(l.mode.bit,4),n.put(l.getLength(),er.getCharCountIndicator(l.mode,r)),l.write(n)});let i=he.getSymbolTotalCodewords(r),s=Ke.getTotalCodewordsCount(r,e),o=(i-s)*8;for(n.getLengthInBits()+4<=o&&n.put(0,4);n.getLengthInBits()%8!==0;)n.putBit(0);let a=(o-n.getLengthInBits())/8;for(let l=0;l<a;l++)n.put(l%2?17:236,8);return ar(n,r,e)}function ar(r,e,t){let n=he.getSymbolTotalCodewords(e),i=Ke.getTotalCodewordsCount(e,t),s=n-i,o=Ke.getBlocksCount(e,t),a=n%o,l=o-a,c=Math.floor(n/o),d=Math.floor(s/o),g=d+1,h=c-d,E=new Xn(h),B=0,T=new Array(o),Ze=new Array(o),Se=0,pn=new Uint8Array(r.buffer);for(let _=0;_<o;_++){let Be=_<l?d:g;T[_]=pn.slice(B,B+Be),Ze[_]=E.encode(T[_]),B+=Be,Se=Math.max(Se,Be)}let Ce=new Uint8Array(n),et=0,x,S;for(x=0;x<Se;x++)for(S=0;S<o;S++)x<T[S].length&&(Ce[et++]=T[S][x]);for(x=0;x<h;x++)for(S=0;S<o;S++)Ce[et++]=Ze[S][x];return Ce}function lr(r,e,t,n){let i;if(Array.isArray(r))i=Ve.fromArray(r);else if(typeof r=="string"){let c=e;if(!c){let d=Ve.rawSplit(r);c=pe.getBestVersionForData(d,t)}i=Ve.fromString(r,c||40)}else throw new Error("Invalid data");let s=pe.getBestVersionForData(i,t);if(!s)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=s;else if(e<s)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+s+`.
`);let o=or(e,t,i),a=he.getSymbolSize(e),l=new Yn(a);return tr(l,e),nr(l),rr(l,e),Je(l,t,0),e>=7&&ir(l,e),sr(l,o),isNaN(n)&&(n=Ge.getBestMask(l,Je.bind(null,l,t))),Ge.applyMask(n,l),Je(l,t,n),{modules:l,version:e,errorCorrectionLevel:t,maskPattern:n,segments:i}}en.create=function(e,t){if(typeof e>"u"||e==="")throw new Error("No input text");let n=Oe.M,i,s;return typeof t<"u"&&(n=Oe.from(t.errorCorrectionLevel,Oe.M),i=pe.from(t.version),s=Ge.from(t.maskPattern),t.toSJISFunc&&he.setToSJISFunction(t.toSJISFunc)),lr(e,i,n,s)}});var je=m(H=>{function nn(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let e=r.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+r);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(n){return[n,n]}))),e.length===6&&e.push("F","F");let t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:t&255,hex:"#"+e.slice(0,6).join("")}}H.getOptions=function(e){e||(e={}),e.color||(e.color={});let t=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,n=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:n,scale:n?4:i,margin:t,color:{dark:nn(e.color.dark||"#000000ff"),light:nn(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}};H.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale};H.getImageWidth=function(e,t){let n=H.getScale(e,t);return Math.floor((e+t.margin*2)*n)};H.qrToImageData=function(e,t,n){let i=t.modules.size,s=t.modules.data,o=H.getScale(i,n),a=Math.floor((i+n.margin*2)*o),l=n.margin*o,c=[n.color.light,n.color.dark];for(let d=0;d<a;d++)for(let g=0;g<a;g++){let h=(d*a+g)*4,E=n.color.light;if(d>=l&&g>=l&&d<a-l&&g<a-l){let B=Math.floor((d-l)/o),T=Math.floor((g-l)/o);E=c[s[B*i+T]?1:0]}e[h++]=E.r,e[h++]=E.g,e[h++]=E.b,e[h]=E.a}}});var rn=m(ge=>{var Ye=je();function dr(r,e,t){r.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=t,e.width=t,e.style.height=t+"px",e.style.width=t+"px"}function cr(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}ge.render=function(e,t,n){let i=n,s=t;typeof i>"u"&&(!t||!t.getContext)&&(i=t,t=void 0),t||(s=cr()),i=Ye.getOptions(i);let o=Ye.getImageWidth(e.modules.size,i),a=s.getContext("2d"),l=a.createImageData(o,o);return Ye.qrToImageData(l.data,e,i),dr(a,s,o),a.putImageData(l,0,0),s};ge.renderToDataURL=function(e,t,n){let i=n;typeof i>"u"&&(!t||!t.getContext)&&(i=t,t=void 0),i||(i={});let s=ge.render(e,t,i),o=i.type||"image/png",a=i.rendererOpts||{};return s.toDataURL(o,a.quality)}});var an=m(on=>{var ur=je();function sn(r,e){let t=r.a/255,n=e+'="'+r.hex+'"';return t<1?n+" "+e+'-opacity="'+t.toFixed(2).slice(1)+'"':n}function Qe(r,e,t){let n=r+e;return typeof t<"u"&&(n+=" "+t),n}function mr(r,e,t){let n="",i=0,s=!1,o=0;for(let a=0;a<r.length;a++){let l=Math.floor(a%e),c=Math.floor(a/e);!l&&!s&&(s=!0),r[a]?(o++,a>0&&l>0&&r[a-1]||(n+=s?Qe("M",l+t,.5+c+t):Qe("m",i,0),i=0,s=!1),l+1<e&&r[a+1]||(n+=Qe("h",o),o=0)):i++}return n}on.render=function(e,t,n){let i=ur.getOptions(t),s=e.modules.size,o=e.modules.data,a=s+i.margin*2,l=i.color.light.a?"<path "+sn(i.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",c="<path "+sn(i.color.dark,"stroke")+' d="'+mr(o,s,i.margin)+'"/>',d='viewBox="0 0 '+a+" "+a+'"',h='<svg xmlns="http://www.w3.org/2000/svg" '+(i.width?'width="'+i.width+'" height="'+i.width+'" ':"")+d+' shape-rendering="crispEdges">'+l+c+`</svg>
`;return typeof n=="function"&&n(null,h),h}});var dn=m(te=>{var fr=ct(),We=tn(),ln=rn(),pr=an();function Xe(r,e,t,n,i){let s=[].slice.call(arguments,1),o=s.length,a=typeof s[o-1]=="function";if(!a&&!fr())throw new Error("Callback required as last argument");if(a){if(o<2)throw new Error("Too few arguments provided");o===2?(i=t,t=e,e=n=void 0):o===3&&(e.getContext&&typeof i>"u"?(i=n,n=void 0):(i=n,n=t,t=e,e=void 0))}else{if(o<1)throw new Error("Too few arguments provided");return o===1?(t=e,e=n=void 0):o===2&&!e.getContext&&(n=t,t=e,e=void 0),new Promise(function(l,c){try{let d=We.create(t,n);l(r(d,e,n))}catch(d){c(d)}})}try{let l=We.create(t,n);i(null,r(l,e,n))}catch(l){i(l)}}te.create=We.create;te.toCanvas=Xe.bind(null,ln.render);te.toDataURL=Xe.bind(null,ln.renderToDataURL);te.toString=Xe.bind(null,function(r,e,t){return pr.render(r,t)})});var nt={shelfCount:4};var rt="fi_items_v1",it="fi_settings_v1",Te="fi_recent_v1";function Le(r,e){if(!r)return e;try{return JSON.parse(r)}catch{return e}}var ne=class{async getItems(){return Le(localStorage.getItem(rt),[])}async setItems(e){localStorage.setItem(rt,JSON.stringify(e))}async saveItem(e){let t=await this.getItems();t.push(e),await this.setItems(t)}async updateItem(e){let t=await this.getItems(),n=t.findIndex(i=>i.id===e.id);n>=0&&(t[n]=e,await this.setItems(t))}async removeItem(e){let t=await this.getItems();await this.setItems(t.filter(n=>n.id!==e))}async getSettings(){return{...nt,...Le(localStorage.getItem(it),{})}}async saveSettings(e){localStorage.setItem(it,JSON.stringify(e))}async getRecentlyRemoved(){return Le(localStorage.getItem(Te),null)}async saveRecentlyRemoved(e){e===null?localStorage.removeItem(Te):localStorage.setItem(Te,JSON.stringify(e))}};function st(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,r=>{let e=Math.random()*16|0;return(r==="x"?e:e&3|8).toString(16)})}var ot=["Meat & Poultry","Seafood","Vegetables","Fruits","Prepared Meals","Dairy","Bread & Baked Goods","Soups & Stocks","Desserts","Other"];function k(r){let e=new Date(r+"T00:00:00"),t=new Date;return t.setHours(0,0,0,0),Math.ceil((e.getTime()-t.getTime())/(1e3*60*60*24))}function y(r){let e=k(r);return e<0?"expired":e<=3?"danger":e<=14?"warning":"ok"}function L(r){return new Date(r).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function M(r){return new Date(r+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function f(r){let e=document.createElement("div");return e.textContent=r,e.innerHTML}function b(r,e,t='<div class="header-spacer"></div>'){return`
    <header class="app-header">
      ${e.canGoBack()?`<button class="back-btn" id="back-btn" aria-label="Go back">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
             </button>`:'<div class="header-spacer"></div>'}
      <h1 class="header-title">${f(r)}</h1>
      ${t}
    </header>
  `}function w(r){document.getElementById("back-btn")?.addEventListener("click",()=>{r.goBack()})}function q(r,e=!1){let t=document.createElement("div");return t.className="modal-overlay"+(e?" center":""),t.innerHTML=r,document.body.appendChild(t),t}function A(r){r.style.opacity="0",r.style.transition="opacity 0.2s ease",setTimeout(()=>r.remove(),200)}var at=`
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
             a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
             A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
             l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
             A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
             l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
             a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
             l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
             a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>`,lt=`
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`,Me=`
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5l-5 5-5-5"></path>
    <path d="M17 19l-5-5-5 5"></path>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M5 7l5 5-5 5"></path>
    <path d="M19 7l-5 5 5 5"></path>
  </svg>`;var re=8,K=class{constructor(e,t){this.container=e;this.app=t}async render(){let[e,t,n]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings(),this.app.storage.getRecentlyRemoved()]),i=Array(t.shelfCount).fill(0);for(let a of e){let l=a.shelf-1;l>=0&&l<t.shelfCount&&i[l]++}let s=e.filter(a=>{if(!a.expirationDate)return!1;let l=y(a.expirationDate);return l==="expired"||l==="danger"||l==="warning"}).length,o=`
      <button class="icon-btn" id="settings-btn" aria-label="Settings">
        ${at}
      </button>`;this.container.innerHTML=`
      <div class="view home-view">
        ${b("",this.app,o)}

        <div class="scroll-view home-scroll">
          <!-- Logo area -->
          <div class="home-logo">
            <span class="home-logo-icon">${Me}</span>
            <span class="home-logo-text">Freezer</span>
          </div>

          <!-- Freezer visualization -->
          <div class="freezer-outer" role="list" aria-label="Freezer shelves">
            <div class="freezer-label-bar">
              <span class="freezer-title-text">
                ${Me} INVENTORY
              </span>
              <span class="total-count">${e.length} item${e.length!==1?"s":""}</span>
            </div>

            <div class="shelf-list">
              ${i.map((a,l)=>this.renderShelf(l+1,a)).join("")}
            </div>
          </div>

          <!-- Recently removed banner -->
          ${n?`<div class="banner" id="recent-banner">
                   <span class="banner-text">
                     Recently removed: <strong>${f(n.name)}</strong>
                   </span>
                   <button class="btn-link" id="reStore-btn">Re-store</button>
                 </div>`:""}
        </div>

        <!-- Bottom action bar -->
        <div class="bottom-bar">
          <button class="bottom-btn" id="find-btn">
            <span class="btn-icon-lg">\u{1F50D}</span>
            Find
          </button>
          <button class="bottom-btn primary" id="store-btn">
            <span class="btn-icon-lg">\uFF0B</span>
            Store
          </button>
          <button class="bottom-btn ${s>0?"warning":""}" id="expiring-btn">
            <span class="btn-icon-lg">\u23F3</span>
            Expiring
            ${s>0?`<span class="count-badge">${s}</span>`:""}
          </button>
        </div>
      </div>
    `,w(this.app),document.getElementById("settings-btn").addEventListener("click",()=>{this.app.navigate("settings")}),document.getElementById("find-btn").addEventListener("click",()=>{this.app.navigate("find")}),document.getElementById("store-btn").addEventListener("click",()=>{this.app.navigate("store")}),document.getElementById("expiring-btn").addEventListener("click",()=>{this.app.navigate("expiring")});for(let a=1;a<=t.shelfCount;a++)document.getElementById(`shelf-row-${a}`)?.addEventListener("click",()=>{this.app.navigate("shelf",{shelfNumber:a})});n&&document.getElementById("reStore-btn")?.addEventListener("click",()=>{this.app.navigate("store",{prefillItem:n})})}renderShelf(e,t){let n=Math.min(t,re),i=t>re?t-re:0,s=Array.from({length:re},(o,a)=>a<n?'<div class="dot filled" aria-hidden="true"></div>':'<div class="dot empty" aria-hidden="true"></div>').join("");return`
      <div class="shelf-row"
           id="shelf-row-${e}"
           role="listitem button"
           tabindex="0"
           aria-label="Shelf ${e}, ${t} item${t!==1?"s":""}">
        <span class="shelf-number">Shelf ${e}</span>
        <div class="shelf-indicator">
          ${t===0?'<span class="shelf-empty-label">empty</span>':s}
          ${i>0?`<span class="dot-overflow">+${i}</span>`:""}
        </div>
        <span class="shelf-chevron">\u203A</span>
      </div>
    `}destroy(){}};var ie=class{constructor(e,t,n){this.container=e;this.app=t;this.shelfNumber=n;this.selectedId=null;this.items=[];this.shelfCount=4}async render(){let[e,t]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings()]);this.shelfCount=t.shelfCount,this.items=e.filter(n=>n.shelf===this.shelfNumber).sort((n,i)=>new Date(n.storedAt).getTime()-new Date(i.storedAt).getTime()),this.container.innerHTML=`
      <div class="view shelf-view">
        ${b(`Shelf ${this.shelfNumber}`,this.app)}
        <div class="scroll-view">
          ${this.items.length===0?`<div class="empty-state">
                   <div class="empty-icon">\u{1F9CA}</div>
                   <div class="empty-title">This shelf is empty</div>
                   <div class="empty-description">
                     Tap <strong>Store</strong> on the home screen to add items.
                   </div>
                 </div>`:`<div class="section-header">
                   ${this.items.length} item${this.items.length!==1?"s":""} \u2014 oldest first
                 </div>
                 <div class="item-list" id="item-list">
                   ${this.items.map(n=>this.renderItemCard(n)).join("")}
                 </div>`}
        </div>
      </div>
    `,w(this.app),this.bindItemListeners()}renderItemCard(e,t=!1){let n=this.selectedId===e.id,i=e.expirationDate?this.renderExpiryTag(e.expirationDate):"",s=e.category?`<span class="tag category-tag">${f(e.category)}</span>`:"",o=e.brand?`<span class="tag">${f(e.brand)}</span>`:"",a=`<span class="tag date-tag">Stored ${L(e.storedAt)}</span>`,l=t&&n?this.renderExpanded(e):"";return`
      <div class="item-card ${n?"selected":""} ${this.expiryCardClass(e)}"
           id="card-${e.id}"
           data-id="${e.id}"
           role="button"
           tabindex="0"
           aria-expanded="${n}">
        <div class="item-name">${f(e.name)}</div>
        <div class="item-meta">
          ${s}${o}${a}${i}
        </div>
        ${l}
      </div>
    `}renderExpanded(e){return`
      <div class="item-actions" id="actions-${e.id}">
        <div class="action-row">
          <button class="btn btn-danger btn-sm" id="remove-btn-${e.id}">
            Remove
          </button>
          ${this.shelfCount>1?`<button class="btn btn-secondary btn-sm" id="move-btn-${e.id}">
                   Move to Shelf\u2026
                 </button>`:""}
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${e.id}">
          <span class="confirm-inline-text">Remove from freezer?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${e.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${e.id}">Cancel</button>
        </div>
      </div>
    `}renderExpiryTag(e){let t=y(e),n=k(e),i=M(e),s="tag",o=`Exp ${i}`;return t==="expired"?(s="tag expiry-danger",o=`Expired ${i}`):t==="danger"?(s="tag expiry-danger",o=`Exp in ${n}d`):t==="warning"&&(s="tag expiry-warning",o=`Exp in ${n}d`),`<span class="${s}">${o}</span>`}expiryCardClass(e){if(!e.expirationDate)return"";let t=y(e.expirationDate);return t==="expired"||t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}bindItemListeners(){let e=document.getElementById("item-list");e&&(e.addEventListener("click",t=>{let n=t.target.closest(".item-card");if(!n)return;let i=n.dataset.id;i&&(t.target.closest("button")||(this.selectedId=this.selectedId===i?null:i,this.rerenderList()))}),e.addEventListener("click",t=>{let i=t.target.closest("button");if(!i)return;let s=i.id;if(s.startsWith("remove-btn-")){let o=s.replace("remove-btn-","");this.showInlineConfirm(o);return}if(s.startsWith("confirm-yes-")){let o=s.replace("confirm-yes-","");this.removeItem(o);return}if(s.startsWith("confirm-no-")){let o=s.replace("confirm-no-","");this.hideInlineConfirm(o);return}if(s.startsWith("move-btn-")){let o=s.replace("move-btn-","");this.showMoveModal(o);return}}))}rerenderList(){let e=document.getElementById("item-list");e&&(e.innerHTML=this.items.map(t=>this.renderItemCard(t,!0)).join(""))}showInlineConfirm(e){let t=document.getElementById(`actions-${e}`)?.querySelector(".action-row"),n=document.getElementById(`confirm-${e}`);t&&t.classList.add("hidden"),n&&n.classList.remove("hidden")}hideInlineConfirm(e){let t=document.getElementById(`actions-${e}`)?.querySelector(".action-row"),n=document.getElementById(`confirm-${e}`);t&&t.classList.remove("hidden"),n&&n.classList.add("hidden")}async removeItem(e){let t=this.items.find(n=>n.id===e);t&&(await this.app.storage.removeItem(e),await this.app.storage.saveRecentlyRemoved(t),this.selectedId=null,await this.render())}async showMoveModal(e){let t=this.items.find(s=>s.id===e);if(!t)return;let n=Array.from({length:this.shelfCount},(s,o)=>o+1).filter(s=>s!==this.shelfNumber),i=q(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${f(t.name)}" to\u2026</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list" id="shelf-select-list">
            ${n.map(s=>`<button class="shelf-option" data-shelf="${s}">
                     Shelf ${s}
                     <span>\u203A</span>
                   </button>`).join("")}
          </div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">
            Cancel
          </button>
        </div>
      </div>
    `);i.addEventListener("click",s=>{let o=s.target.closest("button");if(!o)return;if(o.id==="modal-cancel"){A(i);return}let a=o.dataset.shelf;if(a){let l=parseInt(a,10);this.moveItem(t,l,i)}})}async moveItem(e,t,n){A(n),await this.app.storage.updateItem({...e,shelf:t}),this.selectedId=null,await this.render()}destroy(){}};var se=class{constructor(e,t){this.container=e;this.app=t;this.allItems=[];this.shelfCount=4;this.selectedId=null;this.query=""}async render(){let[e,t]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings()]);this.allItems=e,this.shelfCount=t.shelfCount,this.container.innerHTML=`
      <div class="view find-view">
        ${b("Find Item",this.app)}

        <div class="search-container">
          <div class="search-input-wrapper">
            <span class="search-icon">${lt}</span>
            <input
              type="search"
              class="search-input"
              id="search-input"
              placeholder="Search by name, brand, category\u2026"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
            >
          </div>
        </div>

        <div class="scroll-view" id="results-wrapper">
          ${this.renderResults()}
        </div>
      </div>
    `,w(this.app);let n=document.getElementById("search-input");n.focus(),n.addEventListener("input",()=>{this.query=n.value.trim().toLowerCase(),this.selectedId=null,this.refreshResults()}),this.bindResultListeners()}filterItems(){return this.query?this.allItems.filter(e=>[e.name,e.brand??"",e.category??"",e.notes??""].join(" ").toLowerCase().includes(this.query)):[...this.allItems]}renderResults(){let e=this.filterItems();return this.allItems.length===0?`<div class="empty-state">
        <div class="empty-icon">\u{1F9CA}</div>
        <div class="empty-title">Freezer is empty</div>
        <div class="empty-description">
          Use <strong>Store</strong> to add items first.
        </div>
      </div>`:e.length===0?`<div class="empty-state">
        <div class="empty-icon">\u{1F50D}</div>
        <div class="empty-title">No items found</div>
        <div class="empty-description">Try a different search term.</div>
      </div>`:`<div class="item-list" id="find-results">
      ${e.map(t=>this.renderCard(t)).join("")}
    </div>`}renderCard(e){let t=this.selectedId===e.id,n=e.expirationDate?this.renderExpiryTag(e.expirationDate):"",i=e.category?`<span class="tag category-tag">${f(e.category)}</span>`:"",s=`<span class="tag shelf-tag">Shelf ${e.shelf}</span>`,o=`<span class="tag date-tag">Stored ${L(e.storedAt)}</span>`;return`
      <div class="item-card ${t?"selected":""} ${this.expiryCardClass(e)}"
           id="card-${e.id}"
           data-id="${e.id}"
           role="button"
           tabindex="0">
        <div class="item-name">${f(e.name)}</div>
        <div class="item-meta">
          ${s}${i}${o}${n}
        </div>
        ${t?this.renderExpanded(e):""}
      </div>
    `}renderExpanded(e){return`
      <div class="item-actions">
        <div class="action-row" id="action-row-${e.id}">
          <button class="btn btn-danger btn-sm" id="remove-btn-${e.id}">
            Remove
          </button>
          ${this.shelfCount>1?`<button class="btn btn-secondary btn-sm" id="move-btn-${e.id}">
                   Move to Shelf\u2026
                 </button>`:""}
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${e.id}">
          <span class="confirm-inline-text">Remove from freezer?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${e.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${e.id}">Cancel</button>
        </div>
      </div>
    `}renderExpiryTag(e){let t=y(e),n=k(e),i=M(e);return t==="expired"?`<span class="tag expiry-danger">Expired ${i}</span>`:t==="danger"?`<span class="tag expiry-danger">Exp in ${n}d</span>`:t==="warning"?`<span class="tag expiry-warning">Exp in ${n}d</span>`:`<span class="tag date-tag">Exp ${i}</span>`}expiryCardClass(e){if(!e.expirationDate)return"";let t=y(e.expirationDate);return t==="expired"||t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}refreshResults(){let e=document.getElementById("results-wrapper");e&&(e.innerHTML=this.renderResults(),this.bindResultListeners())}bindResultListeners(){let e=document.getElementById("find-results");e&&e.addEventListener("click",t=>{let n=t.target,i=n.closest("button");if(i){this.handleButtonClick(i);return}let s=n.closest("[data-id]");if(s){let o=s.dataset.id??"";this.selectedId=this.selectedId===o?null:o,this.refreshResults()}})}handleButtonClick(e){let{id:t}=e;if(t.startsWith("remove-btn-")){let n=t.replace("remove-btn-",""),i=document.getElementById(`action-row-${n}`),s=document.getElementById(`confirm-${n}`);i?.classList.add("hidden"),s?.classList.remove("hidden");return}if(t.startsWith("confirm-yes-")){let n=t.replace("confirm-yes-","");this.removeItem(n);return}if(t.startsWith("confirm-no-")){let n=t.replace("confirm-no-",""),i=document.getElementById(`action-row-${n}`),s=document.getElementById(`confirm-${n}`);i?.classList.remove("hidden"),s?.classList.add("hidden");return}if(t.startsWith("move-btn-")){let n=t.replace("move-btn-","");this.showMoveModal(n)}}async removeItem(e){let t=this.allItems.find(n=>n.id===e);t&&(await this.app.storage.removeItem(e),await this.app.storage.saveRecentlyRemoved(t),this.allItems=this.allItems.filter(n=>n.id!==e),this.selectedId=null,this.refreshResults())}async showMoveModal(e){let t=this.allItems.find(s=>s.id===e);if(!t)return;let n=Array.from({length:this.shelfCount},(s,o)=>o+1).filter(s=>s!==t.shelf),i=q(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${f(t.name)}" to\u2026</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list">
            ${n.map(s=>`<button class="shelf-option" data-shelf="${s}">
                     Shelf ${s} <span>\u203A</span>
                   </button>`).join("")}
          </div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">
            Cancel
          </button>
        </div>
      </div>
    `);i.addEventListener("click",s=>{let o=s.target.closest("button");if(!o)return;if(o.id==="modal-cancel"){A(i);return}let a=o.dataset.shelf;if(a){let l=parseInt(a,10);this.moveItem(t,l,i)}})}async moveItem(e,t,n){A(n),await this.app.storage.updateItem({...e,shelf:t});let i=this.allItems.findIndex(s=>s.id===e.id);i>=0&&(this.allItems[i]={...e,shelf:t}),this.selectedId=null,this.refreshResults()}destroy(){}};var cn=In(dn());async function un(r){return cn.default.toString(r,{type:"svg",width:220,margin:1,color:{dark:"#0a1020",light:"#f0f7ff"}})}function mn(r){return`${(window.location.origin+window.location.pathname).split("?")[0]}?action=remove&id=${encodeURIComponent(r)}`}function fn(r,e,t){let n=window.open("","_blank","width=420,height=480,menubar=no");if(!n){alert("Please allow pop-ups for this site to print labels.");return}let i=e.replace(/</g,"&lt;").replace(/>/g,"&gt;");n.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Freezer Label \u2014 ${i}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
      text-align: center;
      background: #fff;
      color: #111;
    }
    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 12px;
    }
    .qr-wrap {
      display: inline-block;
      padding: 8px;
      background: #f0f7ff;
      border-radius: 8px;
    }
    .qr-wrap svg { display: block; }
    .item-id {
      margin-top: 10px;
      font-size: 9px;
      color: #666;
      font-family: monospace;
      word-break: break-all;
    }
    .scan-hint {
      margin-top: 6px;
      font-size: 11px;
      color: #888;
    }
    @media print {
      @page { margin: 0.5cm; }
    }
  </style>
</head>
<body>
  <h2>${i}</h2>
  <div class="qr-wrap">${r}</div>
  <p class="scan-hint">Scan to remove from inventory</p>
  <p class="item-id">ID: ${t}</p>
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`),n.document.close()}var ve=class{constructor(e,t,n){this.container=e;this.app=t;this.prefillItem=n;this.shelfCount=4;this.selectedCategory="";this.selectedShelf=1}async render(){let e=await this.app.storage.getSettings();this.shelfCount=e.shelfCount,this.prefillItem&&(this.selectedCategory=this.prefillItem.category??"",this.selectedShelf=Math.min(this.prefillItem.shelf,this.shelfCount));let t=this.prefillItem?"Re-store Item":"Store Item";this.container.innerHTML=`
      <div class="view store-view">
        ${b(t,this.app)}
        <div class="scroll-view">
          <form class="form-container" id="store-form" novalidate>

            <!-- Name -->
            <div class="form-group">
              <label class="form-label required" for="f-name">Name</label>
              <input
                type="text"
                id="f-name"
                class="form-input"
                placeholder="e.g. Ground Beef"
                value="${f(this.prefillItem?.name??"")}"
                required
                autocomplete="off"
              >
            </div>

            <!-- Shelf -->
            <div class="form-group">
              <label class="form-label required">Shelf</label>
              <div class="shelf-chip-group" id="shelf-chips">
                ${Array.from({length:this.shelfCount},(n,i)=>i+1).map(n=>`<button type="button"
                               class="chip ${n===this.selectedShelf?"selected":""}"
                               id="shelf-chip-${n}"
                               data-shelf="${n}">
                         Shelf ${n}
                       </button>`).join("")}
              </div>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <div class="chip-group" id="category-chips">
                ${ot.map(n=>`<button type="button"
                             class="chip ${n===this.selectedCategory?"selected":""}"
                             data-category="${f(n)}">
                       ${f(n)}
                     </button>`).join("")}
              </div>
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label" for="f-brand">Brand</label>
              <input
                type="text"
                id="f-brand"
                class="form-input"
                placeholder="e.g. Kirkland"
                value="${f(this.prefillItem?.brand??"")}"
                autocomplete="off"
              >
            </div>

            <!-- Weight & Volume -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="f-weight">Weight (oz)</label>
                <input
                  type="number"
                  id="f-weight"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value="${this.prefillItem?.weightOz!=null?this.prefillItem.weightOz:""}"
                >
              </div>
              <div class="form-group">
                <label class="form-label" for="f-volume">Volume (fl oz)</label>
                <input
                  type="number"
                  id="f-volume"
                  class="form-input"
                  placeholder="0"
                  min="0"
                  step="0.1"
                  value="${this.prefillItem?.volumeOz!=null?this.prefillItem.volumeOz:""}"
                >
              </div>
            </div>

            <!-- Expiration Date -->
            <div class="form-group">
              <label class="form-label" for="f-expiry">Expiration Date</label>
              <input
                type="date"
                id="f-expiry"
                class="form-input"
                value="${f(this.prefillItem?.expirationDate??"")}"
              >
              <span class="form-hint">Used by the Expiring Soon filter</span>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label" for="f-notes">Notes</label>
              <textarea
                id="f-notes"
                class="form-input"
                placeholder="Any additional details\u2026"
                rows="3"
              >${f(this.prefillItem?.notes??"")}</textarea>
            </div>

            <!-- Error message -->
            <div class="form-error hidden" id="form-error"></div>

            <!-- Submit -->
            <button type="submit" class="btn btn-primary btn-lg" id="save-btn">
              Save &amp; Generate QR Code
            </button>
          </form>
        </div>
      </div>
    `,w(this.app),this.bindFormListeners()}bindFormListeners(){document.getElementById("shelf-chips")?.addEventListener("click",e=>{let t=e.target.closest("[data-shelf]");t&&(this.selectedShelf=parseInt(t.dataset.shelf??"1",10),document.querySelectorAll("#shelf-chips .chip").forEach(n=>{n.classList.toggle("selected",n===t)}))}),document.getElementById("category-chips")?.addEventListener("click",e=>{let t=e.target.closest("[data-category]");if(!t)return;let n=t.dataset.category??"";this.selectedCategory===n?(this.selectedCategory="",t.classList.remove("selected")):(this.selectedCategory=n,document.querySelectorAll("#category-chips .chip").forEach(i=>{i.classList.toggle("selected",i===t)}))}),document.getElementById("store-form")?.addEventListener("submit",e=>{e.preventDefault(),this.handleSubmit()})}async handleSubmit(){let e=document.getElementById("f-name"),t=document.getElementById("f-brand"),n=document.getElementById("f-weight"),i=document.getElementById("f-volume"),s=document.getElementById("f-expiry"),o=document.getElementById("f-notes"),a=document.getElementById("form-error"),l=document.getElementById("save-btn"),c=e.value.trim();if(!c){a.textContent="Please enter an item name.",a.classList.remove("hidden"),e.focus();return}a.classList.add("hidden"),l.disabled=!0,l.textContent="Saving\u2026";let d={id:st(),name:c,shelf:this.selectedShelf,storedAt:new Date().toISOString(),brand:t.value.trim()||void 0,category:this.selectedCategory||void 0,weightOz:n.value!==""?parseFloat(n.value):void 0,volumeOz:i.value!==""?parseFloat(i.value):void 0,expirationDate:s.value||void 0,notes:o.value.trim()||void 0};try{await this.app.storage.saveItem(d);let g=await this.app.storage.getRecentlyRemoved();g&&g.name===d.name&&await this.app.storage.saveRecentlyRemoved(null),await this.showQRModal(d)}catch(g){l.disabled=!1,l.textContent="Save & Generate QR Code",a.textContent=`Failed to save: ${g instanceof Error?g.message:"Unknown error"}`,a.classList.remove("hidden")}}async showQRModal(e){let t=mn(e.id),n;try{n=await un(t)}catch{n='<p style="color:#f87171">QR generation failed</p>'}let i=q(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">\u2705 Stored!</div>
        </div>
        <div class="modal-body">
          <div class="qr-container">
            <div class="qr-item-name">${f(e.name)}</div>
            <div class="qr-shelf-label">Shelf ${e.shelf}</div>
            <div class="qr-frame" id="qr-frame">
              ${n}
            </div>
            <p class="qr-hint">Scan this label to remove the item when you take it out of the freezer.</p>
            <div class="qr-id">ID: ${e.id}</div>
            <div class="qr-actions">
              <button class="btn btn-secondary" id="qr-print-btn">
                \u{1F5A8} Print Label
              </button>
              <button class="btn btn-primary" id="qr-done-btn">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    `);document.getElementById("qr-print-btn")?.addEventListener("click",()=>{fn(n,e.name,e.id)}),document.getElementById("qr-done-btn")?.addEventListener("click",()=>{A(i),this.app.showHome()})}destroy(){}};var ye=class{constructor(e,t){this.container=e;this.app=t}async render(){let t=(await this.app.storage.getItems()).filter(a=>!!a.expirationDate).sort((a,l)=>{let c=new Date(a.expirationDate+"T00:00:00").getTime(),d=new Date(l.expirationDate+"T00:00:00").getTime();return c-d}),n=t.filter(a=>y(a.expirationDate)==="expired"),i=t.filter(a=>y(a.expirationDate)==="danger"),s=t.filter(a=>y(a.expirationDate)==="warning"),o=t.filter(a=>y(a.expirationDate)==="ok");this.container.innerHTML=`
      <div class="view expiring-view">
        ${b("Expiring Soon",this.app)}
        <div class="scroll-view">
          ${t.length===0?`<div class="empty-state">
                   <div class="empty-icon">\u{1F4C5}</div>
                   <div class="empty-title">No expiration dates set</div>
                   <div class="empty-description">
                     Add an expiration date when storing items to track them here.
                   </div>
                 </div>`:`
                ${this.renderSection("\u{1F534} Expired",n,"danger")}
                ${this.renderSection("\u{1F7E0} Expiring Within 3 Days",i,"danger")}
                ${this.renderSection("\u{1F7E1} Expiring Within 14 Days",s,"warning")}
                ${this.renderSection("\u2705 Coming Up",o,"ok")}
              `}
        </div>
      </div>
    `,w(this.app)}renderSection(e,t,n){return t.length===0?"":`
      <div class="section-header">${e}</div>
      <div class="item-list">
        ${t.map(i=>this.renderCard(i,n)).join("")}
      </div>
    `}renderCard(e,t){let n=k(e.expirationDate),i=M(e.expirationDate),s,o;return n<0?(s=`Expired ${Math.abs(n)} day${Math.abs(n)!==1?"s":""} ago`,o="tag expiry-danger"):n===0?(s="Expires today!",o="tag expiry-danger"):(s=`Expires in ${n} day${n!==1?"s":""} (${i})`,o=t==="danger"?"tag expiry-danger":"tag expiry-warning"),`
      <div class="item-card ${t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}">
        <div class="item-name">${f(e.name)}</div>
        <div class="item-meta">
          <span class="tag shelf-tag">Shelf ${e.shelf}</span>
          ${e.category?`<span class="tag category-tag">${f(e.category)}</span>`:""}
          <span class="${o}">${s}</span>
          <span class="tag date-tag">Stored ${L(e.storedAt)}</span>
        </div>
      </div>
    `}destroy(){}};var be=1,we=20,Ie=class{constructor(e,t){this.container=e;this.app=t;this.shelfCount=4}async render(){let e=await this.app.storage.getSettings();this.shelfCount=e.shelfCount,this.container.innerHTML=`
      <div class="view settings-view">
        ${b("Settings",this.app)}

        <div class="scroll-view">
          <div class="settings-section">
            <div class="settings-label">Freezer Configuration</div>

            <div class="settings-row">
              <div>
                <div class="settings-description">Number of Shelves</div>
                <div class="form-hint" style="margin-top:2px">
                  ${be}\u2013${we} shelves supported
                </div>
              </div>
              <div class="number-stepper">
                <button
                  class="stepper-btn"
                  id="dec-btn"
                  aria-label="Decrease shelf count"
                  ${this.shelfCount<=be?"disabled":""}
                >\u2212</button>
                <span class="stepper-value" id="shelf-value">${this.shelfCount}</span>
                <button
                  class="stepper-btn"
                  id="inc-btn"
                  aria-label="Increase shelf count"
                  ${this.shelfCount>=we?"disabled":""}
                >+</button>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <div class="settings-label">About</div>
            <p class="form-hint" style="line-height:1.6">
              Freezer Inventory tracks what's in your freezer using browser
              storage or a local network server. Scan the QR code on a stored
              item to remove it instantly.
            </p>
          </div>

          <div style="padding:20px 16px">
            <button class="btn btn-primary btn-lg" id="save-btn">
              Save Settings
            </button>
          </div>

          <div class="save-feedback hidden" id="save-feedback">
            \u2705 Settings saved!
          </div>
        </div>
      </div>
    `,w(this.app),this.bindListeners()}bindListeners(){let e=document.getElementById("shelf-value"),t=document.getElementById("dec-btn"),n=document.getElementById("inc-btn"),i=()=>{e.textContent=String(this.shelfCount),t.disabled=this.shelfCount<=be,n.disabled=this.shelfCount>=we};t.addEventListener("click",()=>{this.shelfCount>be&&(this.shelfCount--,i())}),n.addEventListener("click",()=>{this.shelfCount<we&&(this.shelfCount++,i())}),document.getElementById("save-btn")?.addEventListener("click",()=>{this.save()})}async save(){await this.app.storage.saveSettings({shelfCount:this.shelfCount});let e=document.getElementById("save-feedback");e&&(e.classList.remove("hidden"),setTimeout(()=>e.classList.add("hidden"),2e3))}destroy(){}};var Ee=class{constructor(e,t,n){this.container=e;this.app=t;this.itemId=n}async render(){let t=(await this.app.storage.getItems()).find(n=>n.id===this.itemId);if(!t){this.renderNotFound();return}this.renderConfirm(t)}renderNotFound(){this.container.innerHTML=`
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Remove Item</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="confirm-view">
            <div class="confirm-icon">\u{1F914}</div>
            <div class="confirm-title">Item Not Found</div>
            <div class="confirm-subtitle">
              This item may have already been removed, or the QR code
              is from a different device or storage session.
            </div>
            <button class="btn btn-primary" id="home-btn" style="margin-top:16px">
              Go Home
            </button>
          </div>
        </div>
      </div>
    `,document.getElementById("home-btn")?.addEventListener("click",()=>{this.app.showHome()})}renderConfirm(e){let t=[["Name",e.name],["Shelf",`Shelf ${e.shelf}`],["Category",e.category??"\u2014"],["Brand",e.brand??"\u2014"],["Stored",L(e.storedAt)],...e.expirationDate?[["Expires",M(e.expirationDate)]]:[]];this.container.innerHTML=`
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Remove Item</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="confirm-view">
            <div class="confirm-icon">\u{1F9CA}</div>
            <div class="confirm-title">Remove from Freezer?</div>
            <div class="confirm-subtitle">
              Confirm that you are removing this item from your freezer inventory.
            </div>

            <div class="confirm-details">
              ${t.map(([n,i])=>`
                    <div class="confirm-detail-row">
                      <span class="confirm-detail-label">${f(String(n))}</span>
                      <span class="confirm-detail-value">${f(String(i))}</span>
                    </div>`).join("")}
            </div>

            <div style="display:flex;gap:10px;width:100%;margin-top:8px">
              <button class="btn btn-secondary" id="cancel-btn" style="flex:1">
                Cancel
              </button>
              <button class="btn btn-danger" id="confirm-btn" style="flex:2">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    `,document.getElementById("cancel-btn")?.addEventListener("click",()=>{this.app.showHome()}),document.getElementById("confirm-btn")?.addEventListener("click",()=>{this.doRemove(e)})}async doRemove(e){let t=document.getElementById("confirm-btn");t.disabled=!0,t.textContent="Removing\u2026",await this.app.storage.removeItem(e.id),await this.app.storage.saveRecentlyRemoved(e),this.renderSuccess(e)}renderSuccess(e){this.container.innerHTML=`
      <div class="view remove-confirm-view">
        <header class="app-header">
          <div class="header-spacer"></div>
          <h1 class="header-title">Removed</h1>
          <div class="header-spacer"></div>
        </header>
        <div class="scroll-view">
          <div class="success-screen">
            <div class="success-icon">\u2705</div>
            <div class="confirm-title">Removed!</div>
            <div class="confirm-subtitle">
              <strong>${f(e.name)}</strong> has been removed from
              your freezer inventory.
            </div>

            <div class="success-actions">
              <button class="btn btn-secondary" id="reStore-btn">
                Re-store this item
              </button>
              <button class="btn btn-primary" id="home-btn">
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    `,document.getElementById("home-btn")?.addEventListener("click",()=>{this.app.showHome()}),document.getElementById("reStore-btn")?.addEventListener("click",()=>{this.app.navigate("store",{prefillItem:e},!0)})}destroy(){}};var xe=class{constructor(e,t){this.history=[];this.container=e,this.storage=t}async showHome(){await this.navigate("home",{},!0)}async navigate(e,t={},n=!1){n&&(this.history=[]),this.history.push({view:e,params:t}),await this.mountView(e,t)}async goBack(){if(this.history.length>1){this.history.pop();let e=this.history[this.history.length-1];await this.mountView(e.view,e.params)}else await this.navigate("home",{},!0)}canGoBack(){return this.history.length>1}async handleQRRemove(e){await this.navigate("remove-confirm",{itemId:e},!0)}async mountView(e,t){this.container.innerHTML="",this.container.className="view-container";let n;switch(e){case"home":n=new K(this.container,this);break;case"shelf":n=new ie(this.container,this,t.shelfNumber??1);break;case"find":n=new se(this.container,this);break;case"store":n=new ve(this.container,this,t.prefillItem);break;case"expiring":n=new ye(this.container,this);break;case"settings":n=new Ie(this.container,this);break;case"remove-confirm":n=new Ee(this.container,this,t.itemId??"");break;default:n=new K(this.container,this)}await n.render()}};async function hr(){let r=document.getElementById("app");if(!r)throw new Error("#app element not found");let e=new ne,t=new xe(r,e),n=new URLSearchParams(window.location.search),i=n.get("action"),s=n.get("id");i==="remove"&&s?await t.handleQRRemove(s):await t.showHome()}document.addEventListener("DOMContentLoaded",()=>{hr().catch(r=>{console.error("Failed to initialise Freezer Inventory:",r);let e=document.getElementById("app");e&&(e.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:100vh;gap:12px;padding:24px;text-align:center;">
          <div style="font-size:40px">\u26A0\uFE0F</div>
          <div style="font-size:16px;font-weight:600;color:#f0f6ff;">
            Failed to load Freezer Inventory
          </div>
          <div style="font-size:13px;color:rgba(180,215,255,0.6);">
            ${r instanceof Error?r.message:"Unknown error"}
          </div>
        </div>`)})});})();
//# sourceMappingURL=app.js.map
