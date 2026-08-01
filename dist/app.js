"use strict";(()=>{var vr=Object.create;var tt=Object.defineProperty;var yr=Object.getOwnPropertyDescriptor;var br=Object.getOwnPropertyNames;var wr=Object.getPrototypeOf,Ir=Object.prototype.hasOwnProperty;var m=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var Er=(n,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of br(e))!Ir.call(n,i)&&i!==t&&tt(n,i,{get:()=>e[i],enumerable:!(r=yr(e,i))||r.enumerable});return n};var zr=(n,e,t)=>(t=n!=null?vr(wr(n)):{},Er(e||!n||!n.__esModule?tt(t,"default",{value:n,enumerable:!0}):t,n));var ut=m((Un,ct)=>{ct.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var F=m(P=>{var $e,Cr=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];P.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17};P.getSymbolTotalCodewords=function(e){return Cr[e]};P.getBCHDigit=function(n){let e=0;for(;n!==0;)e++,n>>>=1;return e};P.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');$e=e};P.isKanjiModeEnabled=function(){return typeof $e<"u"};P.toSJIS=function(e){return $e(e)}});var de=m(I=>{I.L={bit:1};I.M={bit:0};I.Q={bit:3};I.H={bit:2};function Tr(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"l":case"low":return I.L;case"m":case"medium":return I.M;case"q":case"quartile":return I.Q;case"h":case"high":return I.H;default:throw new Error("Unknown EC Level: "+n)}}I.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4};I.from=function(e,t){if(I.isValid(e))return e;try{return Tr(e)}catch{return t}}});var pt=m((Vn,mt)=>{function ft(){this.buffer=[],this.length=0}ft.prototype={get:function(n){let e=Math.floor(n/8);return(this.buffer[e]>>>7-n%8&1)===1},put:function(n,e){for(let t=0;t<e;t++)this.putBit((n>>>e-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(n){let e=Math.floor(this.length/8);this.buffer.length<=e&&this.buffer.push(0),n&&(this.buffer[e]|=128>>>this.length%8),this.length++}};mt.exports=ft});var gt=m((jn,ht)=>{function K(n){if(!n||n<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=n,this.data=new Uint8Array(n*n),this.reservedBit=new Uint8Array(n*n)}K.prototype.set=function(n,e,t,r){let i=n*this.size+e;this.data[i]=t,r&&(this.reservedBit[i]=!0)};K.prototype.get=function(n,e){return this.data[n*this.size+e]};K.prototype.xor=function(n,e,t){this.data[n*this.size+e]^=t};K.prototype.isReserved=function(n,e){return this.reservedBit[n*this.size+e]};ht.exports=K});var vt=m(le=>{var Lr=F().getSymbolSize;le.getRowColCoords=function(e){if(e===1)return[];let t=Math.floor(e/7)+2,r=Lr(e),i=r===145?26:Math.ceil((r-13)/(2*t-2))*2,s=[r-7];for(let o=1;o<t-1;o++)s[o]=s[o-1]-i;return s.push(6),s.reverse()};le.getPositions=function(e){let t=[],r=le.getRowColCoords(e),i=r.length;for(let s=0;s<i;s++)for(let o=0;o<i;o++)s===0&&o===0||s===0&&o===i-1||s===i-1&&o===0||t.push([r[s],r[o]]);return t}});var wt=m(bt=>{var Br=F().getSymbolSize,yt=7;bt.getPositions=function(e){let t=Br(e);return[[0,0],[t-yt,0],[0,t-yt]]}});var It=m(p=>{p.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var k={N1:3,N2:3,N3:40,N4:10};p.isValid=function(e){return e!=null&&e!==""&&!isNaN(e)&&e>=0&&e<=7};p.from=function(e){return p.isValid(e)?parseInt(e,10):void 0};p.getPenaltyN1=function(e){let t=e.size,r=0,i=0,s=0,o=null,a=null;for(let d=0;d<t;d++){i=s=0,o=a=null;for(let l=0;l<t;l++){let u=e.get(d,l);u===o?i++:(i>=5&&(r+=k.N1+(i-5)),o=u,i=1),u=e.get(l,d),u===a?s++:(s>=5&&(r+=k.N1+(s-5)),a=u,s=1)}i>=5&&(r+=k.N1+(i-5)),s>=5&&(r+=k.N1+(s-5))}return r};p.getPenaltyN2=function(e){let t=e.size,r=0;for(let i=0;i<t-1;i++)for(let s=0;s<t-1;s++){let o=e.get(i,s)+e.get(i,s+1)+e.get(i+1,s)+e.get(i+1,s+1);(o===4||o===0)&&r++}return r*k.N2};p.getPenaltyN3=function(e){let t=e.size,r=0,i=0,s=0;for(let o=0;o<t;o++){i=s=0;for(let a=0;a<t;a++)i=i<<1&2047|e.get(o,a),a>=10&&(i===1488||i===93)&&r++,s=s<<1&2047|e.get(a,o),a>=10&&(s===1488||s===93)&&r++}return r*k.N3};p.getPenaltyN4=function(e){let t=0,r=e.data.length;for(let s=0;s<r;s++)t+=e.data[s];return Math.abs(Math.ceil(t*100/r/5)-10)*k.N4};function $r(n,e,t){switch(n){case p.Patterns.PATTERN000:return(e+t)%2===0;case p.Patterns.PATTERN001:return e%2===0;case p.Patterns.PATTERN010:return t%3===0;case p.Patterns.PATTERN011:return(e+t)%3===0;case p.Patterns.PATTERN100:return(Math.floor(e/2)+Math.floor(t/3))%2===0;case p.Patterns.PATTERN101:return e*t%2+e*t%3===0;case p.Patterns.PATTERN110:return(e*t%2+e*t%3)%2===0;case p.Patterns.PATTERN111:return(e*t%3+(e+t)%2)%2===0;default:throw new Error("bad maskPattern:"+n)}}p.applyMask=function(e,t){let r=t.size;for(let i=0;i<r;i++)for(let s=0;s<r;s++)t.isReserved(s,i)||t.xor(s,i,$r(e,s,i))};p.getBestMask=function(e,t){let r=Object.keys(p.Patterns).length,i=0,s=1/0;for(let o=0;o<r;o++){t(o),p.applyMask(o,e);let a=p.getPenaltyN1(e)+p.getPenaltyN2(e)+p.getPenaltyN3(e)+p.getPenaltyN4(e);p.applyMask(o,e),a<s&&(s=a,i=o)}return i}});var Me=m(Fe=>{var M=de(),ce=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],ue=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];Fe.getBlocksCount=function(e,t){switch(t){case M.L:return ce[(e-1)*4+0];case M.M:return ce[(e-1)*4+1];case M.Q:return ce[(e-1)*4+2];case M.H:return ce[(e-1)*4+3];default:return}};Fe.getTotalCodewordsCount=function(e,t){switch(t){case M.L:return ue[(e-1)*4+0];case M.M:return ue[(e-1)*4+1];case M.Q:return ue[(e-1)*4+2];case M.H:return ue[(e-1)*4+3];default:return}}});var Et=m(me=>{var Q=new Uint8Array(512),fe=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)Q[t]=e,fe[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)Q[t]=Q[t-255]})();me.log=function(e){if(e<1)throw new Error("log("+e+")");return fe[e]};me.exp=function(e){return Q[e]};me.mul=function(e,t){return e===0||t===0?0:Q[fe[e]+fe[t]]}});var zt=m(Y=>{var Ae=Et();Y.mul=function(e,t){let r=new Uint8Array(e.length+t.length-1);for(let i=0;i<e.length;i++)for(let s=0;s<t.length;s++)r[i+s]^=Ae.mul(e[i],t[s]);return r};Y.mod=function(e,t){let r=new Uint8Array(e);for(;r.length-t.length>=0;){let i=r[0];for(let o=0;o<t.length;o++)r[o]^=Ae.mul(t[o],i);let s=0;for(;s<r.length&&r[s]===0;)s++;r=r.slice(s)}return r};Y.generateECPolynomial=function(e){let t=new Uint8Array([1]);for(let r=0;r<e;r++)t=Y.mul(t,new Uint8Array([1,Ae.exp(r)]));return t}});var Ct=m((Zn,St)=>{var xt=zt();function Re(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}Re.prototype.initialize=function(e){this.degree=e,this.genPoly=xt.generateECPolynomial(this.degree)};Re.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let r=xt.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){let s=new Uint8Array(this.degree);return s.set(r,i),s}return r};St.exports=Re});var Ne=m(Tt=>{Tt.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}});var Pe=m(S=>{var Lt="[0-9]+",Fr="[A-Z $%*+\\-./:]+",W="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";W=W.replace(/u/g,"\\u");var Mr="(?:(?![A-Z0-9 $%*+\\-./:]|"+W+`)(?:.|[\r
]))+`;S.KANJI=new RegExp(W,"g");S.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");S.BYTE=new RegExp(Mr,"g");S.NUMERIC=new RegExp(Lt,"g");S.ALPHANUMERIC=new RegExp(Fr,"g");var Ar=new RegExp("^"+W+"$"),Rr=new RegExp("^"+Lt+"$"),Nr=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");S.testKanji=function(e){return Ar.test(e)};S.testNumeric=function(e){return Rr.test(e)};S.testAlphanumeric=function(e){return Nr.test(e)}});var A=m(v=>{var Pr=Ne(),ke=Pe();v.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};v.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};v.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};v.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};v.MIXED={bit:-1};v.getCharCountIndicator=function(e,t){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!Pr.isValid(t))throw new Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]};v.getBestModeForData=function(e){return ke.testNumeric(e)?v.NUMERIC:ke.testAlphanumeric(e)?v.ALPHANUMERIC:ke.testKanji(e)?v.KANJI:v.BYTE};v.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")};v.isValid=function(e){return e&&e.bit&&e.ccBits};function kr(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return v.NUMERIC;case"alphanumeric":return v.ALPHANUMERIC;case"kanji":return v.KANJI;case"byte":return v.BYTE;default:throw new Error("Unknown mode: "+n)}}v.from=function(e,t){if(v.isValid(e))return e;try{return kr(e)}catch{return t}}});var At=m(D=>{var pe=F(),Dr=Me(),Bt=de(),R=A(),De=Ne(),Ft=7973,$t=pe.getBCHDigit(Ft);function Hr(n,e,t){for(let r=1;r<=40;r++)if(e<=D.getCapacity(r,t,n))return r}function Mt(n,e){return R.getCharCountIndicator(n,e)+4}function _r(n,e){let t=0;return n.forEach(function(r){let i=Mt(r.mode,e);t+=i+r.getBitsLength()}),t}function Ur(n,e){for(let t=1;t<=40;t++)if(_r(n,t)<=D.getCapacity(t,e,R.MIXED))return t}D.from=function(e,t){return De.isValid(e)?parseInt(e,10):t};D.getCapacity=function(e,t,r){if(!De.isValid(e))throw new Error("Invalid QR Code version");typeof r>"u"&&(r=R.BYTE);let i=pe.getSymbolTotalCodewords(e),s=Dr.getTotalCodewordsCount(e,t),o=(i-s)*8;if(r===R.MIXED)return o;let a=o-Mt(r,e);switch(r){case R.NUMERIC:return Math.floor(a/10*3);case R.ALPHANUMERIC:return Math.floor(a/11*2);case R.KANJI:return Math.floor(a/13);case R.BYTE:default:return Math.floor(a/8)}};D.getBestVersionForData=function(e,t){let r,i=Bt.from(t,Bt.M);if(Array.isArray(e)){if(e.length>1)return Ur(e,i);if(e.length===0)return 1;r=e[0]}else r=e;return Hr(r.mode,r.getLength(),i)};D.getEncodedBits=function(e){if(!De.isValid(e)||e<7)throw new Error("Invalid QR Code version");let t=e<<12;for(;pe.getBCHDigit(t)-$t>=0;)t^=Ft<<pe.getBCHDigit(t)-$t;return e<<12|t}});var kt=m(Pt=>{var He=F(),Nt=1335,qr=21522,Rt=He.getBCHDigit(Nt);Pt.getEncodedBits=function(e,t){let r=e.bit<<3|t,i=r<<10;for(;He.getBCHDigit(i)-Rt>=0;)i^=Nt<<He.getBCHDigit(i)-Rt;return(r<<10|i)^qr}});var Ht=m((ii,Dt)=>{var Or=A();function q(n){this.mode=Or.NUMERIC,this.data=n.toString()}q.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)};q.prototype.getLength=function(){return this.data.length};q.prototype.getBitsLength=function(){return q.getBitsLength(this.data.length)};q.prototype.write=function(e){let t,r,i;for(t=0;t+3<=this.data.length;t+=3)r=this.data.substr(t,3),i=parseInt(r,10),e.put(i,10);let s=this.data.length-t;s>0&&(r=this.data.substr(t),i=parseInt(r,10),e.put(i,s*3+1))};Dt.exports=q});var Ut=m((si,_t)=>{var Vr=A(),_e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function O(n){this.mode=Vr.ALPHANUMERIC,this.data=n}O.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)};O.prototype.getLength=function(){return this.data.length};O.prototype.getBitsLength=function(){return O.getBitsLength(this.data.length)};O.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let r=_e.indexOf(this.data[t])*45;r+=_e.indexOf(this.data[t+1]),e.put(r,11)}this.data.length%2&&e.put(_e.indexOf(this.data[t]),6)};_t.exports=O});var Ot=m((oi,qt)=>{var jr=A();function V(n){this.mode=jr.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}V.getBitsLength=function(e){return e*8};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(n){for(let e=0,t=this.data.length;e<t;e++)n.put(this.data[e],8)};qt.exports=V});var jt=m((ai,Vt)=>{var Gr=A(),Jr=F();function j(n){this.mode=Gr.KANJI,this.data=n}j.getBitsLength=function(e){return e*13};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(n){let e;for(e=0;e<this.data.length;e++){let t=Jr.toSJIS(this.data[e]);if(t>=33088&&t<=40956)t-=33088;else if(t>=57408&&t<=60351)t-=49472;else throw new Error("Invalid SJIS character: "+this.data[e]+`
Make sure your charset is UTF-8`);t=(t>>>8&255)*192+(t&255),n.put(t,13)}};Vt.exports=j});var Gt=m((di,Ue)=>{"use strict";var Z={single_source_shortest_paths:function(n,e,t){var r={},i={};i[e]=0;var s=Z.PriorityQueue.make();s.push(e,0);for(var o,a,d,l,u,g,h,E,C;!s.empty();){o=s.pop(),a=o.value,l=o.cost,u=n[a]||{};for(d in u)u.hasOwnProperty(d)&&(g=u[d],h=l+g,E=i[d],C=typeof i[d]>"u",(C||E>h)&&(i[d]=h,s.push(d,h),r[d]=a))}if(typeof t<"u"&&typeof i[t]>"u"){var T=["Could not find a path from ",e," to ",t,"."].join("");throw new Error(T)}return r},extract_shortest_path_from_predecessor_list:function(n,e){for(var t=[],r=e,i;r;)t.push(r),i=n[r],r=n[r];return t.reverse(),t},find_path:function(n,e,t){var r=Z.single_source_shortest_paths(n,e,t);return Z.extract_shortest_path_from_predecessor_list(r,t)},PriorityQueue:{make:function(n){var e=Z.PriorityQueue,t={},r;n=n||{};for(r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t.queue=[],t.sorter=n.sorter||e.default_sorter,t},default_sorter:function(n,e){return n.cost-e.cost},push:function(n,e){var t={value:n,cost:e};this.queue.push(t),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof Ue<"u"&&(Ue.exports=Z)});var er=m(G=>{var f=A(),Qt=Ht(),Yt=Ut(),Wt=Ot(),Zt=jt(),X=Pe(),he=F(),Kr=Gt();function Jt(n){return unescape(encodeURIComponent(n)).length}function ee(n,e,t){let r=[],i;for(;(i=n.exec(t))!==null;)r.push({data:i[0],index:i.index,mode:e,length:i[0].length});return r}function Xt(n){let e=ee(X.NUMERIC,f.NUMERIC,n),t=ee(X.ALPHANUMERIC,f.ALPHANUMERIC,n),r,i;return he.isKanjiModeEnabled()?(r=ee(X.BYTE,f.BYTE,n),i=ee(X.KANJI,f.KANJI,n)):(r=ee(X.BYTE_KANJI,f.BYTE,n),i=[]),e.concat(t,r,i).sort(function(o,a){return o.index-a.index}).map(function(o){return{data:o.data,mode:o.mode,length:o.length}})}function qe(n,e){switch(e){case f.NUMERIC:return Qt.getBitsLength(n);case f.ALPHANUMERIC:return Yt.getBitsLength(n);case f.KANJI:return Zt.getBitsLength(n);case f.BYTE:return Wt.getBitsLength(n)}}function Qr(n){return n.reduce(function(e,t){let r=e.length-1>=0?e[e.length-1]:null;return r&&r.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function Yr(n){let e=[];for(let t=0;t<n.length;t++){let r=n[t];switch(r.mode){case f.NUMERIC:e.push([r,{data:r.data,mode:f.ALPHANUMERIC,length:r.length},{data:r.data,mode:f.BYTE,length:r.length}]);break;case f.ALPHANUMERIC:e.push([r,{data:r.data,mode:f.BYTE,length:r.length}]);break;case f.KANJI:e.push([r,{data:r.data,mode:f.BYTE,length:Jt(r.data)}]);break;case f.BYTE:e.push([{data:r.data,mode:f.BYTE,length:Jt(r.data)}])}}return e}function Wr(n,e){let t={},r={start:{}},i=["start"];for(let s=0;s<n.length;s++){let o=n[s],a=[];for(let d=0;d<o.length;d++){let l=o[d],u=""+s+d;a.push(u),t[u]={node:l,lastCount:0},r[u]={};for(let g=0;g<i.length;g++){let h=i[g];t[h]&&t[h].node.mode===l.mode?(r[h][u]=qe(t[h].lastCount+l.length,l.mode)-qe(t[h].lastCount,l.mode),t[h].lastCount+=l.length):(t[h]&&(t[h].lastCount=l.length),r[h][u]=qe(l.length,l.mode)+4+f.getCharCountIndicator(l.mode,e))}}i=a}for(let s=0;s<i.length;s++)r[i[s]].end=0;return{map:r,table:t}}function Kt(n,e){let t,r=f.getBestModeForData(n);if(t=f.from(e,r),t!==f.BYTE&&t.bit<r.bit)throw new Error('"'+n+'" cannot be encoded with mode '+f.toString(t)+`.
 Suggested mode is: `+f.toString(r));switch(t===f.KANJI&&!he.isKanjiModeEnabled()&&(t=f.BYTE),t){case f.NUMERIC:return new Qt(n);case f.ALPHANUMERIC:return new Yt(n);case f.KANJI:return new Zt(n);case f.BYTE:return new Wt(n)}}G.fromArray=function(e){return e.reduce(function(t,r){return typeof r=="string"?t.push(Kt(r,null)):r.data&&t.push(Kt(r.data,r.mode)),t},[])};G.fromString=function(e,t){let r=Xt(e,he.isKanjiModeEnabled()),i=Yr(r),s=Wr(i,t),o=Kr.find_path(s.map,"start","end"),a=[];for(let d=1;d<o.length-1;d++)a.push(s.table[o[d]].node);return G.fromArray(Qr(a))};G.rawSplit=function(e){return G.fromArray(Xt(e,he.isKanjiModeEnabled()))}});var rr=m(tr=>{var ve=F(),Oe=de(),Zr=pt(),Xr=gt(),en=vt(),tn=wt(),Ge=It(),Je=Me(),rn=Ct(),ge=At(),nn=kt(),sn=A(),Ve=er();function on(n,e){let t=n.size,r=tn.getPositions(e);for(let i=0;i<r.length;i++){let s=r[i][0],o=r[i][1];for(let a=-1;a<=7;a++)if(!(s+a<=-1||t<=s+a))for(let d=-1;d<=7;d++)o+d<=-1||t<=o+d||(a>=0&&a<=6&&(d===0||d===6)||d>=0&&d<=6&&(a===0||a===6)||a>=2&&a<=4&&d>=2&&d<=4?n.set(s+a,o+d,!0,!0):n.set(s+a,o+d,!1,!0))}}function an(n){let e=n.size;for(let t=8;t<e-8;t++){let r=t%2===0;n.set(t,6,r,!0),n.set(6,t,r,!0)}}function dn(n,e){let t=en.getPositions(e);for(let r=0;r<t.length;r++){let i=t[r][0],s=t[r][1];for(let o=-2;o<=2;o++)for(let a=-2;a<=2;a++)o===-2||o===2||a===-2||a===2||o===0&&a===0?n.set(i+o,s+a,!0,!0):n.set(i+o,s+a,!1,!0)}}function ln(n,e){let t=n.size,r=ge.getEncodedBits(e),i,s,o;for(let a=0;a<18;a++)i=Math.floor(a/3),s=a%3+t-8-3,o=(r>>a&1)===1,n.set(i,s,o,!0),n.set(s,i,o,!0)}function je(n,e,t){let r=n.size,i=nn.getEncodedBits(e,t),s,o;for(s=0;s<15;s++)o=(i>>s&1)===1,s<6?n.set(s,8,o,!0):s<8?n.set(s+1,8,o,!0):n.set(r-15+s,8,o,!0),s<8?n.set(8,r-s-1,o,!0):s<9?n.set(8,15-s-1+1,o,!0):n.set(8,15-s-1,o,!0);n.set(r-8,8,1,!0)}function cn(n,e){let t=n.size,r=-1,i=t-1,s=7,o=0;for(let a=t-1;a>0;a-=2)for(a===6&&a--;;){for(let d=0;d<2;d++)if(!n.isReserved(i,a-d)){let l=!1;o<e.length&&(l=(e[o]>>>s&1)===1),n.set(i,a-d,l),s--,s===-1&&(o++,s=7)}if(i+=r,i<0||t<=i){i-=r,r=-r;break}}}function un(n,e,t){let r=new Zr;t.forEach(function(d){r.put(d.mode.bit,4),r.put(d.getLength(),sn.getCharCountIndicator(d.mode,n)),d.write(r)});let i=ve.getSymbolTotalCodewords(n),s=Je.getTotalCodewordsCount(n,e),o=(i-s)*8;for(r.getLengthInBits()+4<=o&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);let a=(o-r.getLengthInBits())/8;for(let d=0;d<a;d++)r.put(d%2?17:236,8);return fn(r,n,e)}function fn(n,e,t){let r=ve.getSymbolTotalCodewords(e),i=Je.getTotalCodewordsCount(e,t),s=r-i,o=Je.getBlocksCount(e,t),a=r%o,d=o-a,l=Math.floor(r/o),u=Math.floor(s/o),g=u+1,h=l-u,E=new rn(h),C=0,T=new Array(o),Xe=new Array(o),xe=0,gr=new Uint8Array(n.buffer);for(let _=0;_<o;_++){let Ce=_<d?u:g;T[_]=gr.slice(C,C+Ce),Xe[_]=E.encode(T[_]),C+=Ce,xe=Math.max(xe,Ce)}let Se=new Uint8Array(r),et=0,z,x;for(z=0;z<xe;z++)for(x=0;x<o;x++)z<T[x].length&&(Se[et++]=T[x][z]);for(z=0;z<h;z++)for(x=0;x<o;x++)Se[et++]=Xe[x][z];return Se}function mn(n,e,t,r){let i;if(Array.isArray(n))i=Ve.fromArray(n);else if(typeof n=="string"){let l=e;if(!l){let u=Ve.rawSplit(n);l=ge.getBestVersionForData(u,t)}i=Ve.fromString(n,l||40)}else throw new Error("Invalid data");let s=ge.getBestVersionForData(i,t);if(!s)throw new Error("The amount of data is too big to be stored in a QR Code");if(!e)e=s;else if(e<s)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+s+`.
`);let o=un(e,t,i),a=ve.getSymbolSize(e),d=new Xr(a);return on(d,e),an(d),dn(d,e),je(d,t,0),e>=7&&ln(d,e),cn(d,o),isNaN(r)&&(r=Ge.getBestMask(d,je.bind(null,d,t))),Ge.applyMask(r,d),je(d,t,r),{modules:d,version:e,errorCorrectionLevel:t,maskPattern:r,segments:i}}tr.create=function(e,t){if(typeof e>"u"||e==="")throw new Error("No input text");let r=Oe.M,i,s;return typeof t<"u"&&(r=Oe.from(t.errorCorrectionLevel,Oe.M),i=ge.from(t.version),s=Ge.from(t.maskPattern),t.toSJISFunc&&ve.setToSJISFunction(t.toSJISFunc)),mn(e,i,r,s)}});var Ke=m(H=>{function nr(n){if(typeof n=="number"&&(n=n.toString()),typeof n!="string")throw new Error("Color should be defined as hex string");let e=n.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+n);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(r){return[r,r]}))),e.length===6&&e.push("F","F");let t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:t&255,hex:"#"+e.slice(0,6).join("")}}H.getOptions=function(e){e||(e={}),e.color||(e.color={});let t=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:r,scale:r?4:i,margin:t,color:{dark:nr(e.color.dark||"#000000ff"),light:nr(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}};H.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale};H.getImageWidth=function(e,t){let r=H.getScale(e,t);return Math.floor((e+t.margin*2)*r)};H.qrToImageData=function(e,t,r){let i=t.modules.size,s=t.modules.data,o=H.getScale(i,r),a=Math.floor((i+r.margin*2)*o),d=r.margin*o,l=[r.color.light,r.color.dark];for(let u=0;u<a;u++)for(let g=0;g<a;g++){let h=(u*a+g)*4,E=r.color.light;if(u>=d&&g>=d&&u<a-d&&g<a-d){let C=Math.floor((u-d)/o),T=Math.floor((g-d)/o);E=l[s[C*i+T]?1:0]}e[h++]=E.r,e[h++]=E.g,e[h++]=E.b,e[h]=E.a}}});var ir=m(ye=>{var Qe=Ke();function pn(n,e,t){n.clearRect(0,0,e.width,e.height),e.style||(e.style={}),e.height=t,e.width=t,e.style.height=t+"px",e.style.width=t+"px"}function hn(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}ye.render=function(e,t,r){let i=r,s=t;typeof i>"u"&&(!t||!t.getContext)&&(i=t,t=void 0),t||(s=hn()),i=Qe.getOptions(i);let o=Qe.getImageWidth(e.modules.size,i),a=s.getContext("2d"),d=a.createImageData(o,o);return Qe.qrToImageData(d.data,e,i),pn(a,s,o),a.putImageData(d,0,0),s};ye.renderToDataURL=function(e,t,r){let i=r;typeof i>"u"&&(!t||!t.getContext)&&(i=t,t=void 0),i||(i={});let s=ye.render(e,t,i),o=i.type||"image/png",a=i.rendererOpts||{};return s.toDataURL(o,a.quality)}});var ar=m(or=>{var gn=Ke();function sr(n,e){let t=n.a/255,r=e+'="'+n.hex+'"';return t<1?r+" "+e+'-opacity="'+t.toFixed(2).slice(1)+'"':r}function Ye(n,e,t){let r=n+e;return typeof t<"u"&&(r+=" "+t),r}function vn(n,e,t){let r="",i=0,s=!1,o=0;for(let a=0;a<n.length;a++){let d=Math.floor(a%e),l=Math.floor(a/e);!d&&!s&&(s=!0),n[a]?(o++,a>0&&d>0&&n[a-1]||(r+=s?Ye("M",d+t,.5+l+t):Ye("m",i,0),i=0,s=!1),d+1<e&&n[a+1]||(r+=Ye("h",o),o=0)):i++}return r}or.render=function(e,t,r){let i=gn.getOptions(t),s=e.modules.size,o=e.modules.data,a=s+i.margin*2,d=i.color.light.a?"<path "+sr(i.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",l="<path "+sr(i.color.dark,"stroke")+' d="'+vn(o,s,i.margin)+'"/>',u='viewBox="0 0 '+a+" "+a+'"',h='<svg xmlns="http://www.w3.org/2000/svg" '+(i.width?'width="'+i.width+'" height="'+i.width+'" ':"")+u+' shape-rendering="crispEdges">'+d+l+`</svg>
`;return typeof r=="function"&&r(null,h),h}});var lr=m(te=>{var yn=ut(),We=rr(),dr=ir(),bn=ar();function Ze(n,e,t,r,i){let s=[].slice.call(arguments,1),o=s.length,a=typeof s[o-1]=="function";if(!a&&!yn())throw new Error("Callback required as last argument");if(a){if(o<2)throw new Error("Too few arguments provided");o===2?(i=t,t=e,e=r=void 0):o===3&&(e.getContext&&typeof i>"u"?(i=r,r=void 0):(i=r,r=t,t=e,e=void 0))}else{if(o<1)throw new Error("Too few arguments provided");return o===1?(t=e,e=r=void 0):o===2&&!e.getContext&&(r=t,t=e,e=void 0),new Promise(function(d,l){try{let u=We.create(t,r);d(n(u,e,r))}catch(u){l(u)}})}try{let d=We.create(t,r);i(null,n(d,e,r))}catch(d){i(d)}}te.create=We.create;te.toCanvas=Ze.bind(null,dr.render);te.toDataURL=Ze.bind(null,dr.renderToDataURL);te.toString=Ze.bind(null,function(n,e,t){return bn.render(n,t)})});var re="freezer-default";function rt(n,e=4){let t=Math.random().toString(36).slice(2,7);return{id:`freezer-${Date.now()}-${t}`,name:n,shelfCount:e}}var ne={id:re,name:"My Freezer",shelfCount:4};var nt={freezers:[ne]};var it="fi_items_v1",st="fi_settings_v1",Te="fi_recent_v1";function Le(n,e){if(!n)return e;try{return JSON.parse(n)}catch{return e}}function xr(n){if(Array.isArray(n.freezers)&&n.freezers.length>0)return{freezers:n.freezers};let e=typeof n.shelfCount=="number"?n.shelfCount:4;return{freezers:[{...ne,shelfCount:e}]}}function Sr(n,e){return{...n,freezerId:n.freezerId??e}}var ie=class{async getItems(){let t=(await this.getSettings()).freezers[0]?.id??re;return Le(localStorage.getItem(it),[]).map(i=>Sr(i,t))}async setItems(e){localStorage.setItem(it,JSON.stringify(e))}async saveItem(e){let t=await this.getItems();t.push(e),await this.setItems(t)}async updateItem(e){let t=await this.getItems(),r=t.findIndex(i=>i.id===e.id);r>=0&&(t[r]=e,await this.setItems(t))}async removeItem(e){let t=await this.getItems();await this.setItems(t.filter(r=>r.id!==e))}async getSettings(){let e=Le(localStorage.getItem(st),{});return Object.keys(e).length===0?{...nt}:xr(e)}async saveSettings(e){localStorage.setItem(st,JSON.stringify(e))}async getRecentlyRemoved(){return Le(localStorage.getItem(Te),null)}async saveRecentlyRemoved(e){e===null?localStorage.removeItem(Te):localStorage.setItem(Te,JSON.stringify(e))}};function ot(){return typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,n=>{let e=Math.random()*16|0;return(n==="x"?e:e&3|8).toString(16)})}var at=["Meat & Poultry","Seafood","Vegetables","Fruits","Prepared Meals","Dairy","Bread & Baked Goods","Soups & Stocks","Desserts","Other"];function N(n){let e=new Date(n+"T00:00:00"),t=new Date;return t.setHours(0,0,0,0),Math.ceil((e.getTime()-t.getTime())/(1e3*60*60*24))}function y(n){let e=N(n);return e<0?"expired":e<=3?"danger":e<=14?"warning":"ok"}function L(n){return new Date(n).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function B(n){return new Date(n+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function c(n){let e=document.createElement("div");return e.textContent=n,e.innerHTML}function b(n,e,t='<div class="header-spacer"></div>'){return`
    <header class="app-header">
      ${e.canGoBack()?`<button class="back-btn" id="back-btn" aria-label="Go back">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
             </button>`:'<div class="header-spacer"></div>'}
      <h1 class="header-title">${c(n)}</h1>
      ${t}
    </header>
  `}function w(n){document.getElementById("back-btn")?.addEventListener("click",()=>{n.goBack()})}function U(n,e=!1){let t=document.createElement("div");return t.className="modal-overlay"+(e?" center":""),t.innerHTML=n,document.body.appendChild(t),t}function $(n){n.style.opacity="0",n.style.transition="opacity 0.2s ease",setTimeout(()=>n.remove(),200)}var dt=`
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
  </svg>`,Be=`
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5l-5 5-5-5"></path>
    <path d="M17 19l-5-5-5 5"></path>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M5 7l5 5-5 5"></path>
    <path d="M19 7l-5 5 5 5"></path>
  </svg>`;var se=8,J=class{constructor(e,t){this.container=e;this.app=t}async render(){let[e,t,r]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings(),this.app.storage.getRecentlyRemoved()]),{freezers:i}=t,s=new Map;for(let d of i)s.set(d.id,Array(d.shelfCount).fill(0));for(let d of e){let l=s.get(d.freezerId);l&&d.shelf>=1&&d.shelf<=l.length&&l[d.shelf-1]++}let o=e.filter(d=>{if(!d.expirationDate)return!1;let l=y(d.expirationDate);return l==="expired"||l==="danger"||l==="warning"}).length,a=`
      <button class="icon-btn" id="settings-btn" aria-label="Settings">
        ${dt}
      </button>`;this.container.innerHTML=`
      <div class="view home-view">
        ${b("",this.app,a)}

        <div class="scroll-view home-scroll">
          <div class="home-logo">
            <span class="home-logo-icon">${Be}</span>
            <span class="home-logo-text">Freezer Inventory</span>
          </div>

          ${i.map(d=>this.renderFreezerCard(d,e.filter(l=>l.freezerId===d.id),s.get(d.id)??[])).join("")}

          <div class="add-freezer-row">
            <button class="btn btn-secondary" id="add-freezer-btn">
              \uFF0B Add Freezer
            </button>
          </div>

          ${r?`
            <div class="banner" id="recent-banner">
              <span class="banner-text">
                Recently removed: <strong>${c(r.name)}</strong>
                ${this.freezerNameFor(r.freezerId,i)?`<span class="text-muted"> \u2014 ${c(this.freezerNameFor(r.freezerId,i))}</span>`:""}
              </span>
              <button class="btn-link" id="reStore-btn">Re-store</button>
            </div>`:""}
        </div>

        <div class="bottom-bar">
          <button class="bottom-btn" id="find-btn">
            <span class="btn-icon-lg">\u{1F50D}</span>
            Find
          </button>
          <button class="bottom-btn primary" id="store-btn">
            <span class="btn-icon-lg">\uFF0B</span>
            Store
          </button>
          <button class="bottom-btn ${o>0?"warning":""}" id="expiring-btn">
            <span class="btn-icon-lg">\u23F3</span>
            Expiring
            ${o>0?`<span class="count-badge">${o}</span>`:""}
          </button>
        </div>
      </div>
    `,w(this.app),document.getElementById("settings-btn").addEventListener("click",()=>void this.app.navigate("settings")),document.getElementById("find-btn").addEventListener("click",()=>void this.app.navigate("find")),document.getElementById("store-btn").addEventListener("click",()=>void this.app.navigate("store")),document.getElementById("expiring-btn").addEventListener("click",()=>void this.app.navigate("expiring")),document.getElementById("add-freezer-btn")?.addEventListener("click",()=>void this.app.navigate("settings"));for(let d of i)for(let l=1;l<=d.shelfCount;l++)document.getElementById(`shelf-row-${d.id}-${l}`)?.addEventListener("click",()=>{this.app.navigate("shelf",{freezerId:d.id,shelfNumber:l})});r&&document.getElementById("reStore-btn")?.addEventListener("click",()=>void this.app.navigate("store",{prefillItem:r,freezerId:r.freezerId}))}renderFreezerCard(e,t,r){return`
      <div class="freezer-outer" role="list" aria-label="${c(e.name)} shelves">
        <div class="freezer-label-bar">
          <span class="freezer-title-text">
            ${Be} ${c(e.name)}
          </span>
          <span class="total-count">
            ${t.length} item${t.length!==1?"s":""}
          </span>
        </div>
        <div class="shelf-list">
          ${r.map((i,s)=>this.renderShelf(e.id,s+1,i)).join("")}
        </div>
      </div>
    `}renderShelf(e,t,r){let i=Math.min(r,se),s=r>se?r-se:0,o=Array.from({length:se},(a,d)=>d<i?'<div class="dot filled" aria-hidden="true"></div>':'<div class="dot empty"  aria-hidden="true"></div>').join("");return`
      <div class="shelf-row"
           id="shelf-row-${c(e)}-${t}"
           role="listitem button"
           tabindex="0"
           aria-label="Shelf ${t}, ${r} item${r!==1?"s":""}">
        <span class="shelf-number">Shelf ${t}</span>
        <div class="shelf-indicator">
          ${r===0?'<span class="shelf-empty-label">empty</span>':o}
          ${s>0?`<span class="dot-overflow">+${s}</span>`:""}
        </div>
        <span class="shelf-chevron">\u203A</span>
      </div>
    `}freezerNameFor(e,t){return t.find(r=>r.id===e)?.name??""}destroy(){}};var oe=class{constructor(e,t,r,i){this.container=e;this.app=t;this.freezerId=r;this.shelfNumber=i;this.items=[];this.freezer=null;this.allFreezersList=[];this.selectedId=null}async render(){let[e,t]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings()]);this.allFreezersList=t.freezers,this.freezer=t.freezers.find(s=>s.id===this.freezerId)??null,this.items=e.filter(s=>s.freezerId===this.freezerId&&s.shelf===this.shelfNumber).sort((s,o)=>new Date(s.storedAt).getTime()-new Date(o.storedAt).getTime());let i=`${this.freezer?.name??"Freezer"} \u2014 Shelf ${this.shelfNumber}`;this.container.innerHTML=`
      <div class="view shelf-view">
        ${b(i,this.app)}
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
                   ${this.items.map(s=>this.renderCard(s)).join("")}
                 </div>`}
        </div>
      </div>
    `,w(this.app),this.bindListeners()}renderCard(e,t=!1){let r=this.selectedId===e.id&&t,i=e.expirationDate?this.renderExpiryTag(e.expirationDate):"",s=e.category?`<span class="tag category-tag">${c(e.category)}</span>`:"",o=e.brand?`<span class="tag">${c(e.brand)}</span>`:"",a=`<span class="tag date-tag">Stored ${L(e.storedAt)}</span>`;return`
      <div class="item-card ${r?"selected":""} ${this.expiryCardClass(e)}"
           id="card-${e.id}" data-id="${e.id}"
           role="button" tabindex="0" aria-expanded="${r}">
        <div class="item-name">${c(e.name)}</div>
        <div class="item-meta">${s}${o}${a}${i}</div>
        ${r?this.renderExpanded(e):""}
      </div>
    `}renderExpanded(e){let r=this.allFreezersList.flatMap(i=>Array.from({length:i.shelfCount},(s,o)=>({freezerId:i.id,freezerName:i.name,shelf:o+1,isCurrent:i.id===this.freezerId&&o+1===this.shelfNumber}))).filter(i=>!i.isCurrent).length>0;return`
      <div class="item-actions">
        <div class="action-row" id="action-row-${e.id}">
          <button class="btn btn-danger btn-sm" id="remove-btn-${e.id}">Remove</button>
          ${r?`<button class="btn btn-secondary btn-sm" id="move-btn-${e.id}">Move\u2026</button>`:""}
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${e.id}">
          <span class="confirm-inline-text">Remove from freezer?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${e.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${e.id}">Cancel</button>
        </div>
      </div>
    `}renderExpiryTag(e){let t=y(e),r=N(e),i=B(e);return t==="expired"?`<span class="tag expiry-danger">Expired ${i}</span>`:t==="danger"?`<span class="tag expiry-danger">Exp in ${r}d</span>`:t==="warning"?`<span class="tag expiry-warning">Exp in ${r}d</span>`:`<span class="tag date-tag">Exp ${i}</span>`}expiryCardClass(e){if(!e.expirationDate)return"";let t=y(e.expirationDate);return t==="expired"||t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}bindListeners(){let e=document.getElementById("item-list");e&&e.addEventListener("click",t=>{let r=t.target,i=r.closest("button");if(i){this.handleButton(i);return}let s=r.closest("[data-id]");if(s){let o=s.dataset.id??"";this.selectedId=this.selectedId===o?null:o,this.rerenderList()}})}handleButton(e){let{id:t}=e;if(t.startsWith("remove-btn-")){let r=t.replace("remove-btn-","");document.getElementById(`action-row-${r}`)?.classList.add("hidden"),document.getElementById(`confirm-${r}`)?.classList.remove("hidden");return}if(t.startsWith("confirm-yes-")){this.removeItem(t.replace("confirm-yes-",""));return}if(t.startsWith("confirm-no-")){let r=t.replace("confirm-no-","");document.getElementById(`action-row-${r}`)?.classList.remove("hidden"),document.getElementById(`confirm-${r}`)?.classList.add("hidden");return}t.startsWith("move-btn-")&&this.showMoveModal(t.replace("move-btn-",""))}rerenderList(){let e=document.getElementById("item-list");e&&(e.innerHTML=this.items.map(t=>this.renderCard(t,!0)).join(""))}async removeItem(e){let t=this.items.find(r=>r.id===e);t&&(await this.app.storage.removeItem(e),await this.app.storage.saveRecentlyRemoved(t),this.selectedId=null,await this.render())}async showMoveModal(e){let t=this.items.find(o=>o.id===e);if(!t)return;let i=this.allFreezersList.map(o=>({freezer:o,shelves:Array.from({length:o.shelfCount},(a,d)=>d+1).filter(a=>!(o.id===this.freezerId&&a===this.shelfNumber))})).filter(o=>o.shelves.length>0).map(o=>`
      <div class="move-group">
        <div class="move-group-label">${c(o.freezer.name)}</div>
        ${o.shelves.map(a=>`
          <button class="shelf-option"
                  data-freezer="${c(o.freezer.id)}"
                  data-shelf="${a}">
            Shelf ${a} <span>\u203A</span>
          </button>`).join("")}
      </div>
    `).join(""),s=U(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${c(t.name)}" to\u2026</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list">${i}</div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">
            Cancel
          </button>
        </div>
      </div>
    `);s.addEventListener("click",o=>{let a=o.target.closest("button");if(!a)return;if(a.id==="modal-cancel"){$(s);return}let d=a.dataset.freezer,l=parseInt(a.dataset.shelf??"1",10);d&&this.moveItem(t,d,l,s)})}async moveItem(e,t,r,i){$(i),await this.app.storage.updateItem({...e,freezerId:t,shelf:r}),this.selectedId=null,await this.render()}destroy(){}};var ae=class{constructor(e,t){this.container=e;this.app=t;this.allItems=[];this.freezers=[];this.selectedId=null;this.query=""}async render(){let[e,t]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings()]);this.allItems=e,this.freezers=t.freezers,this.container.innerHTML=`
      <div class="view find-view">
        ${b("Find Item",this.app)}
        <div class="search-container">
          <div class="search-input-wrapper">
            <span class="search-icon">${lt}</span>
            <input type="search" class="search-input" id="search-input"
              placeholder="Search by name, brand, category\u2026"
              autocomplete="off" autocorrect="off" spellcheck="false">
          </div>
        </div>
        <div class="scroll-view" id="results-wrapper">
          ${this.renderResults()}
        </div>
      </div>
    `,w(this.app);let r=document.getElementById("search-input");r.focus(),r.addEventListener("input",()=>{this.query=r.value.trim().toLowerCase(),this.selectedId=null,this.refreshResults()}),this.bindResultListeners()}freezerName(e){return this.freezers.find(t=>t.id===e)?.name??"Unknown Freezer"}filterItems(){return this.query?this.allItems.filter(e=>[e.name,e.brand??"",e.category??"",e.notes??""].join(" ").toLowerCase().includes(this.query)):[...this.allItems]}renderResults(){let e=this.filterItems();return this.allItems.length===0?`<div class="empty-state">
        <div class="empty-icon">\u{1F9CA}</div>
        <div class="empty-title">All freezers are empty</div>
        <div class="empty-description">Use <strong>Store</strong> to add items first.</div>
      </div>`:e.length===0?`<div class="empty-state">
        <div class="empty-icon">\u{1F50D}</div>
        <div class="empty-title">No items found</div>
        <div class="empty-description">Try a different search term.</div>
      </div>`:`<div class="item-list" id="find-results">
      ${e.map(t=>this.renderCard(t)).join("")}
    </div>`}renderCard(e){let t=this.selectedId===e.id,r=e.expirationDate?this.renderExpiryTag(e.expirationDate):"",i=e.category?`<span class="tag category-tag">${c(e.category)}</span>`:"",s=`<span class="tag freezer-tag">${c(this.freezerName(e.freezerId))}</span>`,o=`<span class="tag shelf-tag">Shelf ${e.shelf}</span>`,a=`<span class="tag date-tag">Stored ${L(e.storedAt)}</span>`;return`
      <div class="item-card ${t?"selected":""} ${this.expiryCardClass(e)}"
           id="card-${e.id}" data-id="${e.id}" role="button" tabindex="0">
        <div class="item-name">${c(e.name)}</div>
        <div class="item-meta">${s}${o}${i}${a}${r}</div>
        ${t?this.renderExpanded(e):""}
      </div>
    `}renderExpanded(e){let t=this.freezers.some(r=>Array.from({length:r.shelfCount},(i,s)=>s+1).some(i=>!(r.id===e.freezerId&&i===e.shelf)));return`
      <div class="item-actions">
        <div class="action-row" id="action-row-${e.id}">
          <button class="btn btn-danger btn-sm" id="remove-btn-${e.id}">Remove</button>
          ${t?`<button class="btn btn-secondary btn-sm" id="move-btn-${e.id}">Move\u2026</button>`:""}
        </div>
        <div class="remove-confirm-inline hidden" id="confirm-${e.id}">
          <span class="confirm-inline-text">Remove from freezer?</span>
          <button class="btn btn-danger btn-sm" id="confirm-yes-${e.id}">Confirm</button>
          <button class="btn btn-secondary btn-sm" id="confirm-no-${e.id}">Cancel</button>
        </div>
      </div>
    `}renderExpiryTag(e){let t=y(e),r=N(e),i=B(e);return t==="expired"?`<span class="tag expiry-danger">Expired ${i}</span>`:t==="danger"?`<span class="tag expiry-danger">Exp in ${r}d</span>`:t==="warning"?`<span class="tag expiry-warning">Exp in ${r}d</span>`:`<span class="tag date-tag">Exp ${i}</span>`}expiryCardClass(e){if(!e.expirationDate)return"";let t=y(e.expirationDate);return t==="expired"||t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}refreshResults(){let e=document.getElementById("results-wrapper");e&&(e.innerHTML=this.renderResults(),this.bindResultListeners())}bindResultListeners(){let e=document.getElementById("find-results");e&&e.addEventListener("click",t=>{let r=t.target,i=r.closest("button");if(i){this.handleButton(i);return}let s=r.closest("[data-id]");if(s){let o=s.dataset.id??"";this.selectedId=this.selectedId===o?null:o,this.refreshResults()}})}handleButton(e){let{id:t}=e;if(t.startsWith("remove-btn-")){let r=t.replace("remove-btn-","");document.getElementById(`action-row-${r}`)?.classList.add("hidden"),document.getElementById(`confirm-${r}`)?.classList.remove("hidden");return}if(t.startsWith("confirm-yes-")){this.removeItem(t.replace("confirm-yes-",""));return}if(t.startsWith("confirm-no-")){let r=t.replace("confirm-no-","");document.getElementById(`action-row-${r}`)?.classList.remove("hidden"),document.getElementById(`confirm-${r}`)?.classList.add("hidden");return}t.startsWith("move-btn-")&&this.showMoveModal(t.replace("move-btn-",""))}async removeItem(e){let t=this.allItems.find(r=>r.id===e);t&&(await this.app.storage.removeItem(e),await this.app.storage.saveRecentlyRemoved(t),this.allItems=this.allItems.filter(r=>r.id!==e),this.selectedId=null,this.refreshResults())}async showMoveModal(e){let t=this.allItems.find(o=>o.id===e);if(!t)return;let i=this.freezers.map(o=>({freezer:o,shelves:Array.from({length:o.shelfCount},(a,d)=>d+1).filter(a=>!(o.id===t.freezerId&&a===t.shelf))})).filter(o=>o.shelves.length>0).map(o=>`
      <div class="move-group">
        <div class="move-group-label">${c(o.freezer.name)}</div>
        ${o.shelves.map(a=>`
          <button class="shelf-option"
                  data-freezer="${c(o.freezer.id)}"
                  data-shelf="${a}">
            Shelf ${a} <span>\u203A</span>
          </button>`).join("")}
      </div>
    `).join(""),s=U(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">Move "${c(t.name)}" to\u2026</div>
        </div>
        <div class="modal-body">
          <div class="shelf-select-list">${i}</div>
          <button class="btn btn-secondary" id="modal-cancel" style="width:100%;margin-top:12px">Cancel</button>
        </div>
      </div>
    `);s.addEventListener("click",o=>{let a=o.target.closest("button");if(!a)return;if(a.id==="modal-cancel"){$(s);return}let d=a.dataset.freezer,l=parseInt(a.dataset.shelf??"1",10);d&&this.moveItem(t,d,l,s)})}async moveItem(e,t,r,i){$(i);let s={...e,freezerId:t,shelf:r};await this.app.storage.updateItem(s);let o=this.allItems.findIndex(a=>a.id===e.id);o>=0&&(this.allItems[o]=s),this.selectedId=null,this.refreshResults()}destroy(){}};var cr=zr(lr());async function ur(n){return cr.default.toString(n,{type:"svg",width:220,margin:1,color:{dark:"#0a1020",light:"#f0f7ff"}})}function fr(n){return`${(window.location.origin+window.location.pathname).split("?")[0]}?action=remove&id=${encodeURIComponent(n)}`}function mr(n,e,t){let r=window.open("","_blank","width=420,height=480,menubar=no");if(!r){alert("Please allow pop-ups for this site to print labels.");return}let i=e.replace(/</g,"&lt;").replace(/>/g,"&gt;");r.document.write(`<!DOCTYPE html>
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
  <div class="qr-wrap">${n}</div>
  <p class="scan-hint">Scan to remove from inventory</p>
  <p class="item-id">ID: ${t}</p>
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`),r.document.close()}var be=class{constructor(e,t,r,i){this.container=e;this.app=t;this.prefillItem=r;this.initialFreezerId=i;this.freezers=[];this.selectedFreezerId="";this.selectedCategory="";this.selectedShelf=1}async render(){let e=await this.app.storage.getSettings();this.freezers=e.freezers;let t=this.freezers[0];if(!t)return;if(this.prefillItem){let i=this.freezers.find(s=>s.id===this.prefillItem.freezerId);this.selectedFreezerId=i?i.id:t.id,this.selectedCategory=this.prefillItem.category??"",this.selectedShelf=Math.min(this.prefillItem.shelf,this.currentFreezer()?.shelfCount??4)}else this.initialFreezerId&&this.freezers.some(i=>i.id===this.initialFreezerId)?this.selectedFreezerId=this.initialFreezerId:this.selectedFreezerId=t.id;let r=this.prefillItem?"Re-store Item":"Store Item";this.container.innerHTML=`
      <div class="view store-view">
        ${b(r,this.app)}
        <div class="scroll-view">
          <form class="form-container" id="store-form" novalidate>

            <!-- Name -->
            <div class="form-group">
              <label class="form-label required" for="f-name">Name</label>
              <input type="text" id="f-name" class="form-input"
                placeholder="e.g. Ground Beef"
                value="${c(this.prefillItem?.name??"")}"
                required autocomplete="off">
            </div>

            <!-- Freezer -->
            <div class="form-group">
              <label class="form-label required">Freezer</label>
              <div class="shelf-chip-group" id="freezer-chips">
                ${this.freezers.map(i=>`
                  <button type="button"
                          class="chip ${i.id===this.selectedFreezerId?"selected":""}"
                          data-freezer-id="${c(i.id)}">
                    ${c(i.name)}
                  </button>`).join("")}
              </div>
            </div>

            <!-- Shelf (rendered dynamically) -->
            <div class="form-group">
              <label class="form-label required">Shelf</label>
              <div class="shelf-chip-group" id="shelf-chips">
                ${this.renderShelfChips()}
              </div>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category</label>
              <div class="chip-group" id="category-chips">
                ${at.map(i=>`
                  <button type="button"
                          class="chip ${i===this.selectedCategory?"selected":""}"
                          data-category="${c(i)}">
                    ${c(i)}
                  </button>`).join("")}
              </div>
            </div>

            <!-- Brand -->
            <div class="form-group">
              <label class="form-label" for="f-brand">Brand</label>
              <input type="text" id="f-brand" class="form-input"
                placeholder="e.g. Kirkland"
                value="${c(this.prefillItem?.brand??"")}" autocomplete="off">
            </div>

            <!-- Weight & Volume -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="f-weight">Weight (oz)</label>
                <input type="number" id="f-weight" class="form-input"
                  placeholder="0" min="0" step="0.1"
                  value="${this.prefillItem?.weightOz!=null?this.prefillItem.weightOz:""}">
              </div>
              <div class="form-group">
                <label class="form-label" for="f-volume">Volume (fl oz)</label>
                <input type="number" id="f-volume" class="form-input"
                  placeholder="0" min="0" step="0.1"
                  value="${this.prefillItem?.volumeOz!=null?this.prefillItem.volumeOz:""}">
              </div>
            </div>

            <!-- Expiration Date -->
            <div class="form-group">
              <label class="form-label" for="f-expiry">Expiration Date</label>
              <input type="date" id="f-expiry" class="form-input"
                value="${c(this.prefillItem?.expirationDate??"")}">
              <span class="form-hint">Used by the Expiring Soon filter</span>
            </div>

            <!-- Notes -->
            <div class="form-group">
              <label class="form-label" for="f-notes">Notes</label>
              <textarea id="f-notes" class="form-input"
                placeholder="Any additional details\u2026" rows="3"
              >${c(this.prefillItem?.notes??"")}</textarea>
            </div>

            <div class="form-error hidden" id="form-error"></div>

            <button type="submit" class="btn btn-primary btn-lg" id="save-btn">
              Save &amp; Generate QR Code
            </button>
          </form>
        </div>
      </div>
    `,w(this.app),this.bindListeners()}currentFreezer(){return this.freezers.find(e=>e.id===this.selectedFreezerId)}renderShelfChips(){let e=this.currentFreezer();return e?(this.selectedShelf>e.shelfCount&&(this.selectedShelf=1),Array.from({length:e.shelfCount},(t,r)=>r+1).map(t=>`
        <button type="button"
                class="chip ${t===this.selectedShelf?"selected":""}"
                id="shelf-chip-${t}"
                data-shelf="${t}">
          Shelf ${t}
        </button>`).join("")):""}bindListeners(){document.getElementById("freezer-chips")?.addEventListener("click",e=>{let t=e.target.closest("[data-freezer-id]");if(!t)return;this.selectedFreezerId=t.dataset.freezerId??this.selectedFreezerId,this.selectedShelf=1,document.querySelectorAll("#freezer-chips .chip").forEach(i=>i.classList.toggle("selected",i===t));let r=document.getElementById("shelf-chips");r&&(r.innerHTML=this.renderShelfChips(),this.bindShelfChips())}),this.bindShelfChips(),document.getElementById("category-chips")?.addEventListener("click",e=>{let t=e.target.closest("[data-category]");if(!t)return;let r=t.dataset.category??"";this.selectedCategory===r?(this.selectedCategory="",t.classList.remove("selected")):(this.selectedCategory=r,document.querySelectorAll("#category-chips .chip").forEach(i=>i.classList.toggle("selected",i===t)))}),document.getElementById("store-form")?.addEventListener("submit",e=>{e.preventDefault(),this.handleSubmit()})}bindShelfChips(){document.getElementById("shelf-chips")?.addEventListener("click",e=>{let t=e.target.closest("[data-shelf]");t&&(this.selectedShelf=parseInt(t.dataset.shelf??"1",10),document.querySelectorAll("#shelf-chips .chip").forEach(r=>r.classList.toggle("selected",r===t)))})}async handleSubmit(){let e=document.getElementById("f-name"),t=document.getElementById("f-brand"),r=document.getElementById("f-weight"),i=document.getElementById("f-volume"),s=document.getElementById("f-expiry"),o=document.getElementById("f-notes"),a=document.getElementById("form-error"),d=document.getElementById("save-btn"),l=e.value.trim();if(!l){a.textContent="Please enter an item name.",a.classList.remove("hidden"),e.focus();return}a.classList.add("hidden"),d.disabled=!0,d.textContent="Saving\u2026";let u={id:ot(),name:l,freezerId:this.selectedFreezerId,shelf:this.selectedShelf,storedAt:new Date().toISOString(),brand:t.value.trim()||void 0,category:this.selectedCategory||void 0,weightOz:r.value!==""?parseFloat(r.value):void 0,volumeOz:i.value!==""?parseFloat(i.value):void 0,expirationDate:s.value||void 0,notes:o.value.trim()||void 0};try{await this.app.storage.saveItem(u);let g=await this.app.storage.getRecentlyRemoved();g&&g.name===u.name&&await this.app.storage.saveRecentlyRemoved(null),await this.showQRModal(u)}catch(g){d.disabled=!1,d.textContent="Save & Generate QR Code",a.textContent=`Failed to save: ${g instanceof Error?g.message:"Unknown error"}`,a.classList.remove("hidden")}}async showQRModal(e){let t=fr(e.id),r;try{r=await ur(t)}catch{r='<p style="color:#f87171">QR generation failed</p>'}let i=this.freezers.find(o=>o.id===e.freezerId)?.name??"",s=U(`
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-header"><div class="modal-title">\u2705 Stored!</div></div>
        <div class="modal-body">
          <div class="qr-container">
            <div class="qr-item-name">${c(e.name)}</div>
            <div class="qr-shelf-label">${c(i)} \u2014 Shelf ${e.shelf}</div>
            <div class="qr-frame">${r}</div>
            <p class="qr-hint">Scan this label to remove the item when you take it out.</p>
            <div class="qr-id">ID: ${e.id}</div>
            <div class="qr-actions">
              <button class="btn btn-secondary" id="qr-print-btn">\u{1F5A8} Print Label</button>
              <button class="btn btn-primary"   id="qr-done-btn">Done</button>
            </div>
          </div>
        </div>
      </div>
    `);document.getElementById("qr-print-btn")?.addEventListener("click",()=>mr(r,e.name,e.id)),document.getElementById("qr-done-btn")?.addEventListener("click",()=>{$(s),this.app.showHome()})}destroy(){}};var we=class{constructor(e,t){this.container=e;this.app=t;this.freezers=[]}async render(){let[e,t]=await Promise.all([this.app.storage.getItems(),this.app.storage.getSettings()]);this.freezers=t.freezers;let r=e.filter(d=>!!d.expirationDate).sort((d,l)=>{let u=new Date(d.expirationDate+"T00:00:00").getTime(),g=new Date(l.expirationDate+"T00:00:00").getTime();return u-g}),i=r.filter(d=>y(d.expirationDate)==="expired"),s=r.filter(d=>y(d.expirationDate)==="danger"),o=r.filter(d=>y(d.expirationDate)==="warning"),a=r.filter(d=>y(d.expirationDate)==="ok");this.container.innerHTML=`
      <div class="view expiring-view">
        ${b("Expiring Soon",this.app)}
        <div class="scroll-view">
          ${r.length===0?`<div class="empty-state">
                 <div class="empty-icon">\u{1F4C5}</div>
                 <div class="empty-title">No expiration dates set</div>
                 <div class="empty-description">
                   Add an expiration date when storing items to track them here.
                 </div>
               </div>`:`${this.renderSection("\u{1F534} Expired",i,"danger")}
               ${this.renderSection("\u{1F7E0} Expiring Within 3 Days",s,"danger")}
               ${this.renderSection("\u{1F7E1} Expiring Within 14 Days",o,"warning")}
               ${this.renderSection("\u2705 Coming Up",a,"ok")}`}
        </div>
      </div>
    `,w(this.app)}freezerName(e){return this.freezers.find(t=>t.id===e)?.name??"Freezer"}renderSection(e,t,r){return t.length===0?"":`
      <div class="section-header">${e}</div>
      <div class="item-list">
        ${t.map(i=>this.renderCard(i,r)).join("")}
      </div>
    `}renderCard(e,t){let r=N(e.expirationDate),i=B(e.expirationDate),s,o;return r<0?(s=`Expired ${Math.abs(r)} day${Math.abs(r)!==1?"s":""} ago`,o="tag expiry-danger"):r===0?(s="Expires today!",o="tag expiry-danger"):(s=`Expires in ${r} day${r!==1?"s":""} (${i})`,o=t==="danger"?"tag expiry-danger":"tag expiry-warning"),`
      <div class="item-card ${t==="danger"?"expiring-danger":t==="warning"?"expiring-warning":""}">
        <div class="item-name">${c(e.name)}</div>
        <div class="item-meta">
          <span class="tag freezer-tag">${c(this.freezerName(e.freezerId))}</span>
          <span class="tag shelf-tag">Shelf ${e.shelf}</span>
          ${e.category?`<span class="tag category-tag">${c(e.category)}</span>`:""}
          <span class="${o}">${s}</span>
          <span class="tag date-tag">Stored ${L(e.storedAt)}</span>
        </div>
      </div>
    `}destroy(){}};var pr=1,hr=20,Ie=class{constructor(e,t){this.container=e;this.app=t;this.freezers=[];this.itemCountMap=new Map}async render(){let[e,t]=await Promise.all([this.app.storage.getSettings(),this.app.storage.getItems()]);this.freezers=e.freezers.map(r=>({...r})),this.itemCountMap.clear();for(let r of t)this.itemCountMap.set(r.freezerId,(this.itemCountMap.get(r.freezerId)??0)+1);this.mount()}mount(){this.container.innerHTML=`
      <div class="view settings-view">
        ${b("Settings",this.app)}
        <div class="scroll-view">

          <!-- Freezer list -->
          <div class="settings-section">
            <div class="settings-label">Freezers</div>
            <div id="freezer-list">
              ${this.freezers.map((e,t)=>this.renderFreezerRow(e,t)).join("")}
            </div>
            <button class="btn btn-secondary" id="add-freezer-btn"
                    style="margin-top:12px;width:100%">
              \uFF0B Add Freezer
            </button>
          </div>

          <!-- About -->
          <div class="settings-section">
            <div class="settings-label">About</div>
            <p class="form-hint" style="line-height:1.6">
              Freezer Inventory tracks what's in your freezers using browser
              storage or a local network server. Scan the QR code on a stored
              item to remove it instantly.
            </p>
          </div>

          <div style="padding:20px 16px">
            <button class="btn btn-primary btn-lg" id="save-btn">
              Save Settings
            </button>
          </div>

          <div class="save-feedback hidden" id="save-feedback">\u2705 Settings saved!</div>
          <div class="form-error hidden" id="save-error" style="margin:0 16px 16px"></div>
        </div>
      </div>
    `,w(this.app),this.bindListeners()}renderFreezerRow(e,t){let r=this.itemCountMap.get(e.id)??0,i=this.freezers.length>1&&r===0,s=this.freezers.length<=1?"At least one freezer required":r>0?`${r} item${r!==1?"s":""} \u2014 remove them first`:"";return`
      <div class="freezer-settings-row" id="freezer-row-${t}">
        <div class="freezer-settings-name-row">
          <input type="text"
                 class="form-input freezer-name-input"
                 id="freezer-name-${t}"
                 value="${c(e.name)}"
                 placeholder="Freezer name"
                 aria-label="Freezer name">
          <button class="btn btn-danger btn-sm delete-freezer-btn"
                  id="delete-freezer-${t}"
                  data-idx="${t}"
                  ${i?"":"disabled"}
                  title="${c(s)}">
            \u2715
          </button>
        </div>
        <div class="settings-row" style="margin-top:8px">
          <div>
            <div class="settings-description">Shelves</div>
            ${s&&!i?`<div class="form-hint" style="margin-top:2px">${c(s)}</div>`:""}
          </div>
          <div class="number-stepper">
            <button class="stepper-btn dec-shelf-btn"
                    data-idx="${t}"
                    ${e.shelfCount<=pr?"disabled":""}>\u2212</button>
            <span class="stepper-value" id="shelf-val-${t}">${e.shelfCount}</span>
            <button class="stepper-btn inc-shelf-btn"
                    data-idx="${t}"
                    ${e.shelfCount>=hr?"disabled":""}>+</button>
          </div>
        </div>
      </div>
      ${t<this.freezers.length-1?'<hr class="freezer-divider">':""}
    `}bindListeners(){document.getElementById("add-freezer-btn")?.addEventListener("click",()=>{this.freezers.push(rt(`Freezer ${this.freezers.length+1}`)),this.remountList()}),document.getElementById("save-btn")?.addEventListener("click",()=>{this.save()}),this.bindListItemListeners()}bindListItemListeners(){let e=document.getElementById("freezer-list");e&&(e.querySelectorAll(".freezer-name-input").forEach((t,r)=>{t.addEventListener("input",()=>{this.freezers[r]&&(this.freezers[r].name=t.value)})}),e.querySelectorAll(".dec-shelf-btn").forEach(t=>{t.addEventListener("click",()=>{let r=parseInt(t.dataset.idx??"0",10),i=this.freezers[r];i&&i.shelfCount>pr&&(i.shelfCount--,this.remountList())})}),e.querySelectorAll(".inc-shelf-btn").forEach(t=>{t.addEventListener("click",()=>{let r=parseInt(t.dataset.idx??"0",10),i=this.freezers[r];i&&i.shelfCount<hr&&(i.shelfCount++,this.remountList())})}),e.querySelectorAll(".delete-freezer-btn").forEach(t=>{t.addEventListener("click",()=>{let r=parseInt(t.dataset.idx??"0",10);this.freezers.splice(r,1),this.remountList()})}))}remountList(){this.freezers.forEach((t,r)=>{let i=document.getElementById(`freezer-name-${r}`);i&&(t.name=i.value)});let e=document.getElementById("freezer-list");e&&(e.innerHTML=this.freezers.map((t,r)=>this.renderFreezerRow(t,r)).join(""),this.bindListItemListeners())}async save(){this.freezers.forEach((i,s)=>{let o=document.getElementById(`freezer-name-${s}`);o&&(i.name=o.value.trim()||i.name)});let e=document.getElementById("save-error"),t=document.getElementById("save-feedback"),r=this.freezers.findIndex(i=>!i.name.trim());if(r>=0){e.textContent=`Freezer ${r+1} needs a name.`,e.classList.remove("hidden");return}e.classList.add("hidden"),await this.app.storage.saveSettings({freezers:this.freezers}),t.classList.remove("hidden"),setTimeout(()=>t.classList.add("hidden"),2e3)}destroy(){}};var Ee=class{constructor(e,t,r){this.container=e;this.app=t;this.itemId=r}async render(){let t=(await this.app.storage.getItems()).find(r=>r.id===this.itemId);if(!t){this.renderNotFound();return}this.renderConfirm(t)}renderNotFound(){this.container.innerHTML=`
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
    `,document.getElementById("home-btn")?.addEventListener("click",()=>{this.app.showHome()})}renderConfirm(e){let t=[["Name",e.name],["Shelf",`Shelf ${e.shelf}`],["Category",e.category??"\u2014"],["Brand",e.brand??"\u2014"],["Stored",L(e.storedAt)],...e.expirationDate?[["Expires",B(e.expirationDate)]]:[]];this.container.innerHTML=`
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
              ${t.map(([r,i])=>`
                    <div class="confirm-detail-row">
                      <span class="confirm-detail-label">${c(String(r))}</span>
                      <span class="confirm-detail-value">${c(String(i))}</span>
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
              <strong>${c(e.name)}</strong> has been removed from
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
    `,document.getElementById("home-btn")?.addEventListener("click",()=>{this.app.showHome()}),document.getElementById("reStore-btn")?.addEventListener("click",()=>{this.app.navigate("store",{prefillItem:e},!0)})}destroy(){}};var ze=class{constructor(e,t){this.history=[];this.container=e,this.storage=t}async showHome(){await this.navigate("home",{},!0)}async navigate(e,t={},r=!1){r&&(this.history=[]),this.history.push({view:e,params:t}),await this.mountView(e,t)}async goBack(){if(this.history.length>1){this.history.pop();let e=this.history[this.history.length-1];await this.mountView(e.view,e.params)}else await this.navigate("home",{},!0)}canGoBack(){return this.history.length>1}async handleQRRemove(e){await this.navigate("remove-confirm",{itemId:e},!0)}async mountView(e,t){this.container.innerHTML="",this.container.className="view-container";let r;switch(e){case"home":r=new J(this.container,this);break;case"shelf":r=new oe(this.container,this,t.freezerId??"",t.shelfNumber??1);break;case"find":r=new ae(this.container,this);break;case"store":r=new be(this.container,this,t.prefillItem,t.freezerId);break;case"expiring":r=new we(this.container,this);break;case"settings":r=new Ie(this.container,this);break;case"remove-confirm":r=new Ee(this.container,this,t.itemId??"");break;default:r=new J(this.container,this)}await r.render()}};async function wn(){let n=document.getElementById("app");if(!n)throw new Error("#app element not found");let e=new ie,t=new ze(n,e),r=new URLSearchParams(window.location.search),i=r.get("action"),s=r.get("id");i==="remove"&&s?await t.handleQRRemove(s):await t.showHome()}document.addEventListener("DOMContentLoaded",()=>{wn().catch(n=>{console.error("Failed to initialise Freezer Inventory:",n);let e=document.getElementById("app");e&&(e.innerHTML=`
        <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:100vh;gap:12px;padding:24px;text-align:center;">
          <div style="font-size:40px">\u26A0\uFE0F</div>
          <div style="font-size:16px;font-weight:600;color:#f0f6ff;">
            Failed to load Freezer Inventory
          </div>
          <div style="font-size:13px;color:rgba(180,215,255,0.6);">
            ${n instanceof Error?n.message:"Unknown error"}
          </div>
        </div>`)})});})();
//# sourceMappingURL=app.js.map
