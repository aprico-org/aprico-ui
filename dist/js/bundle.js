!function(){return function t(e,n,r){function i(o,a){if(!n[o]){if(!e[o]){var l="function"==typeof require&&require;if(!a&&l)return l(o,!0);if(s)return s(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var d=n[o]={exports:{}};e[o][0].call(d.exports,function(t){return i(e[o][1][t]||t)},d,d.exports,t,e,n,r)}return n[o].exports}for(var s="function"==typeof require&&require,o=0;o<r.length;o++)i(r[o]);return i}}()({1:[function(t,e,n){const r=(()=>{"use strict";const n=void 0!==e&&e.exports?t("scrypt-async"):window.scrypt;if("function"!=typeof n)throw new Error("aprico requires scrypt-async-js library.");const r={N:Math.pow(2,14),r:8,p:1,dkLen:32,encoding:"hex"},i={N:Math.pow(2,5),r:8,p:1,dkLen:32,encoding:"hex"},s="abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",o="123456789",a="_!$-+";let l={length:20,letters:!0,numbers:!0,symbols:!0,variant:!1};const c=(t,e,n)=>{const r=e.length,i=n.length;let s=0;for(let n=0,i=t.length;n<i;n++)s=s*r+e.indexOf(t.charAt(n));if(s<0)return 0;let o=s%i,a=n.charAt(o),l=Math.floor(s/i);for(;l;)o=l%i,l=Math.floor(l/i),a=n.charAt(o)+a;return a},d=t=>{let e="";l.symbols&&(e+=a),l.numbers&&(e+=o),l.letters&&(e+=s);let r="",d=t.match(/(.{1,7})/g);for(let s=0,o=d.length-1;s<o;s++)l.length>9&&n(t,d[o-s-1],i,t=>{d=t.match(/(.{1,7})/g)}),r+=c(d[s],"0123456789abcdef",e);if(r.length<=l.length)return".";let u=(r.length-l.length)/2|0,h=(r=r.substring(u,u+l.length)).charAt(0);return l.letters&&l.length>6&&!/[a-zA-Z]/.test(h)&&(r=r.replace(h,c(h,a+o,s))),r},u=t=>("http"==(t=t.trim().toLowerCase()).substring(0,4)&&(t=t.substring(t.indexOf("://")+3,t.length)),-1!==t.indexOf(".")&&-1!==t.indexOf("/")&&(t=(t=t.split("/"))[0]),t);return{getPassword:(t,e,s,o)=>{o&&(t=>{for(let e in l)t.hasOwnProperty(e)&&(l[e]=t[e]);if(l.letters=!!l.letters,l.numbers=!!l.numbers,l.symbols=!!l.symbols,!l.letters&&!l.symbols&&!l.numbers)throw new Error("At least one character set (letters, numbers, symbols) must be chosen.");if(l.length=+l.length,"number"!=typeof l.length||l.length<4||l.length>40)throw new Error("Password length must be a number between 4 and 40.")})(o);let a=t+"."+(e=u(e))+"."+l.length+ +l.letters+ +l.symbols+ +l.numbers;l.variant&&"string"==typeof l.variant&&(a+="."+l.variant);let c={};return n(a,s,r,t=>{c.hash=t,c.pass=d(t),c=(t=>{let e=!1;for(;!e;)e=!0,!l.letters||/[a-z]/.test(t.pass)&&/[A-Z]/.test(t.pass)&&!/([A-z])\1{2}/.test(t.pass)||(e=!1),e&&l.numbers&&(!/[\d]/.test(t.pass)||/([\d])\1{2}/.test(t.pass))&&(e=!1),e&&l.symbols&&(!/[!$\-+_]/.test(t.pass)||/([!$\-+_])\1{2}/.test(t.pass))&&(e=!1),e||n(t.hash,t.pass,i,e=>{t.hash=e,t.pass=d(e)});return t})(c)}),c},getHashId:t=>{let e="",i=Math.pow(t.length,(t.match(/[aeiou]/gi)||[0,0,0]).length)+"";return i=c(i,"0123456789.e+Infity",o+a+s)+"",n(t,i,r,t=>{e=t}),e},normalizeService:u,version:"1.1.0"}})();void 0!==e&&e.exports?e.exports=r:window.aprico=r},{"scrypt-async":6}],2:[function(t,e,n){},{}],3:[function(t,e,n){(function(n){!function(){var r;r=void 0!==e&&void 0!==e.exports?t("./pnglib"):window.PNGlib;var i=function(t,e){if("string"!=typeof t||t.length<15)throw"A hash of at least 15 characters is required.";this.defaults={background:[240,240,240,255],margin:.08,size:64,saturation:.7,brightness:.5,format:"png"},this.options="object"==typeof e?e:this.defaults,"number"==typeof arguments[1]&&(this.options.size=arguments[1]),arguments[2]&&(this.options.margin=arguments[2]),this.hash=t,this.background=this.options.background||this.defaults.background,this.size=this.options.size||this.defaults.size,this.format=this.options.format||this.defaults.format,this.margin=void 0!==this.options.margin?this.options.margin:this.defaults.margin;var n=parseInt(this.hash.substr(-7),16)/268435455,r=this.options.saturation||this.defaults.saturation,i=this.options.brightness||this.defaults.brightness;this.foreground=this.options.foreground||this.hsl2rgb(n,r,i)};i.prototype={background:null,foreground:null,hash:null,margin:null,size:null,format:null,image:function(){return this.isSvg()?new s(this.size,this.foreground,this.background):new r(this.size,this.size,256)},render:function(){var t,e,n=this.image(),r=this.size,i=Math.floor(r*this.margin),s=Math.floor((r-2*i)/5),o=Math.floor((r-5*s)/2),a=n.color.apply(n,this.background),l=n.color.apply(n,this.foreground);for(t=0;t<15;t++)e=parseInt(this.hash.charAt(t),16)%2?a:l,t<5?this.rectangle(2*s+o,t*s+o,s,s,e,n):t<10?(this.rectangle(1*s+o,(t-5)*s+o,s,s,e,n),this.rectangle(3*s+o,(t-5)*s+o,s,s,e,n)):t<15&&(this.rectangle(0*s+o,(t-10)*s+o,s,s,e,n),this.rectangle(4*s+o,(t-10)*s+o,s,s,e,n));return n},rectangle:function(t,e,n,r,i,s){var o,a;if(this.isSvg())s.rectangles.push({x:t,y:e,w:n,h:r,color:i});else for(o=t;o<t+n;o++)for(a=e;a<e+r;a++)s.buffer[s.index(o,a)]=i},hsl2rgb:function(t,e,n){return t*=6,[255*(e=[n+=e*=n<.5?n:1-n,n-t%1*e*2,n-=e*=2,n,n+t%1*e,n+e])[~~t%6],255*e[(16|t)%6],255*e[(8|t)%6]]},toString:function(t){return t?this.render().getDump():this.render().getBase64()},isSvg:function(){return this.format.match(/svg/i)}};var s=function(t,e,n){this.size=t,this.foreground=this.color.apply(this,e),this.background=this.color.apply(this,n),this.rectangles=[]};s.prototype={size:null,foreground:null,background:null,rectangles:null,color:function(t,e,n,r){var i=[t,e,n].map(Math.round);return i.push(r>=0&&r<=255?r/255:1),"rgba("+i.join(",")+")"},getDump:function(){var t,e,n,r=this.foreground,i=this.background,s=.005*this.size;for(e="<svg xmlns='http://www.w3.org/2000/svg' width='"+this.size+"' height='"+this.size+"' style='background-color:"+i+";'><g style='fill:"+r+"; stroke:"+r+"; stroke-width:"+s+";'>",t=0;t<this.rectangles.length;t++)(n=this.rectangles[t]).color!=i&&(e+="<rect  x='"+n.x+"' y='"+n.y+"' width='"+n.w+"' height='"+n.h+"'/>");return e+="</g></svg>"},getBase64:function(){if("function"==typeof btoa)return btoa(this.getDump());if(n)return new n(this.getDump(),"binary").toString("base64");throw"Cannot generate base64 output"}},void 0!==e&&void 0!==e.exports?e.exports=i:window.Identicon=i}()}).call(this,t("buffer").Buffer)},{"./pnglib":4,buffer:2}],4:[function(t,e,n){!function(){function t(t,e){for(var n=2;n<arguments.length;n++)for(var r=0;r<arguments[n].length;r++)t[e++]=arguments[n].charAt(r)}function n(t){return String.fromCharCode(t>>24&255,t>>16&255,t>>8&255,255&t)}function r(t){return String.fromCharCode(255&t,t>>8&255)}var i=function(e,i,s){this.width=e,this.height=i,this.depth=s,this.pix_size=i*(e+1),this.data_size=2+this.pix_size+5*Math.floor((65534+this.pix_size)/65535)+4,this.ihdr_offs=0,this.ihdr_size=25,this.plte_offs=this.ihdr_offs+this.ihdr_size,this.plte_size=8+3*s+4,this.trns_offs=this.plte_offs+this.plte_size,this.trns_size=8+s+4,this.idat_offs=this.trns_offs+this.trns_size,this.idat_size=8+this.data_size+4,this.iend_offs=this.idat_offs+this.idat_size,this.iend_size=12,this.buffer_size=this.iend_offs+this.iend_size,this.buffer=new Array,this.palette=new Object,this.pindex=0;for(var o=new Array,a=0;a<this.buffer_size;a++)this.buffer[a]="\0";t(this.buffer,this.ihdr_offs,n(this.ihdr_size-12),"IHDR",n(e),n(i),"\b"),t(this.buffer,this.plte_offs,n(this.plte_size-12),"PLTE"),t(this.buffer,this.trns_offs,n(this.trns_size-12),"tRNS"),t(this.buffer,this.idat_offs,n(this.idat_size-12),"IDAT"),t(this.buffer,this.iend_offs,n(this.iend_size-12),"IEND");var l,c=30912;c+=31-c%31,t(this.buffer,this.idat_offs+8,(l=c,String.fromCharCode(l>>8&255,255&l)));for(a=0;(a<<16)-1<this.pix_size;a++){var d,u;a+65535<this.pix_size?(d=65535,u="\0"):(d=this.pix_size-(a<<16)-a,u=""),t(this.buffer,this.idat_offs+8+2+(a<<16)+(a<<2),u,r(d),r(~d))}for(a=0;a<256;a++){for(var h=a,f=0;f<8;f++)h=1&h?-306674912^h>>1&2147483647:h>>1&2147483647;o[a]=h}this.index=function(t,e){var n=e*(this.width+1)+t+1;return this.idat_offs+8+2+5*Math.floor(n/65535+1)+n},this.color=function(t,e,n,r){var i=(((r=r>=0?r:255)<<8|t)<<8|e)<<8|n;if(void 0===this.palette[i]){if(this.pindex==this.depth)return"\0";var s=this.plte_offs+8+3*this.pindex;this.buffer[s+0]=String.fromCharCode(t),this.buffer[s+1]=String.fromCharCode(e),this.buffer[s+2]=String.fromCharCode(n),this.buffer[this.trns_offs+8+this.pindex]=String.fromCharCode(r),this.palette[i]=String.fromCharCode(this.pindex++)}return this.palette[i]},this.getBase64=function(){var t,e,n,r,i,s,o,a=this.getDump(),l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=a.length,d=0,u="";do{r=(t=a.charCodeAt(d))>>2,i=(3&t)<<4|(e=a.charCodeAt(d+1))>>4,n=a.charCodeAt(d+2),s=c<d+2?64:(15&e)<<2|n>>6,o=c<d+3?64:63&n,u+=l.charAt(r)+l.charAt(i)+l.charAt(s)+l.charAt(o)}while((d+=3)<c);return u},this.getDump=function(){for(var e=1,r=0,i=5552,s=0;s<this.height;s++)for(var a=-1;a<this.width;a++)r+=e+=this.buffer[this.index(a,s)].charCodeAt(0),0==(i-=1)&&(e%=65521,r%=65521,i=5552);function l(e,r,i){for(var s=-1,a=4;a<i-4;a+=1)s=o[255&(s^e[r+a].charCodeAt(0))]^s>>8&16777215;t(e,r+i-4,n(-1^s))}return e%=65521,r%=65521,t(this.buffer,this.idat_offs+this.idat_size-8,n(r<<16|e)),l(this.buffer,this.ihdr_offs,this.ihdr_size),l(this.buffer,this.plte_offs,this.plte_size),l(this.buffer,this.trns_offs,this.trns_size),l(this.buffer,this.idat_offs,this.idat_size),l(this.buffer,this.iend_offs,this.iend_size),"PNG\r\n\n"+this.buffer.join("")}};void 0!==e&&void 0!==e.exports?e.exports=i:window.PNGlib=i}()},{}],5:[function(t,e,n){var r,i,s=e.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function l(t){if(r===setTimeout)return setTimeout(t,0);if((r===o||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:o}catch(t){r=o}try{i="function"==typeof clearTimeout?clearTimeout:a}catch(t){i=a}}();var c,d=[],u=!1,h=-1;function f(){u&&c&&(u=!1,c.length?d=c.concat(d):h=-1,d.length&&p())}function p(){if(!u){var t=l(f);u=!0;for(var e=d.length;e;){for(c=d,d=[];++h<e;)c&&c[h].run();h=-1,e=d.length}c=null,u=!1,function(t){if(i===clearTimeout)return clearTimeout(t);if((i===a||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(t);try{i(t)}catch(e){try{return i.call(null,t)}catch(e){return i.call(this,t)}}}(t)}}function g(t,e){this.fun=t,this.array=e}function m(){}s.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];d.push(new g(t,e)),1!==d.length||u||l(p)},g.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=m,s.addListener=m,s.once=m,s.off=m,s.removeListener=m,s.removeAllListeners=m,s.emit=m,s.prependListener=m,s.prependOnceListener=m,s.listeners=function(t){return[]},s.binding=function(t){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(t){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},{}],6:[function(t,e,n){(function(t){void 0!==e&&(e.exports=function(e,n,r,i,s,o,a,l){"use strict";function c(t){var e=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],n=1779033703,r=3144134277,i=1013904242,s=2773480762,o=1359893119,a=2600822924,l=528734635,c=1541459225,d=new Array(64);function u(t){for(var u=0,h=t.length;h>=64;){var f,p,g,m,b,v=n,w=r,y=i,x=s,I=o,_=a,k=l,C=c;for(p=0;p<16;p++)g=u+4*p,d[p]=(255&t[g])<<24|(255&t[g+1])<<16|(255&t[g+2])<<8|255&t[g+3];for(p=16;p<64;p++)m=((f=d[p-2])>>>17|f<<15)^(f>>>19|f<<13)^f>>>10,b=((f=d[p-15])>>>7|f<<25)^(f>>>18|f<<14)^f>>>3,d[p]=(m+d[p-7]|0)+(b+d[p-16]|0)|0;for(p=0;p<64;p++)m=(((I>>>6|I<<26)^(I>>>11|I<<21)^(I>>>25|I<<7))+(I&_^~I&k)|0)+(C+(e[p]+d[p]|0)|0)|0,b=((v>>>2|v<<30)^(v>>>13|v<<19)^(v>>>22|v<<10))+(v&w^v&y^w&y)|0,C=k,k=_,_=I,I=x+m|0,x=y,y=w,w=v,v=m+b|0;n=n+v|0,r=r+w|0,i=i+y|0,s=s+x|0,o=o+I|0,a=a+_|0,l=l+k|0,c=c+C|0,u+=64,h-=64}}u(t);var h,f=t.length%64,p=t.length/536870912|0,g=t.length<<3,m=f<56?56:120,b=t.slice(t.length-f,t.length);for(b.push(128),h=f+1;h<m;h++)b.push(0);return b.push(p>>>24&255),b.push(p>>>16&255),b.push(p>>>8&255),b.push(p>>>0&255),b.push(g>>>24&255),b.push(g>>>16&255),b.push(g>>>8&255),b.push(g>>>0&255),u(b),[n>>>24&255,n>>>16&255,n>>>8&255,n>>>0&255,r>>>24&255,r>>>16&255,r>>>8&255,r>>>0&255,i>>>24&255,i>>>16&255,i>>>8&255,i>>>0&255,s>>>24&255,s>>>16&255,s>>>8&255,s>>>0&255,o>>>24&255,o>>>16&255,o>>>8&255,o>>>0&255,a>>>24&255,a>>>16&255,a>>>8&255,a>>>0&255,l>>>24&255,l>>>16&255,l>>>8&255,l>>>0&255,c>>>24&255,c>>>16&255,c>>>8&255,c>>>0&255]}function d(t,e,n){t.length>64&&(t=c(t.push?t:Array.prototype.slice.call(t,0)));var r,i=64+e.length+4,s=new Array(i),o=new Array(64),a=[];for(r=0;r<64;r++)s[r]=54;for(r=0;r<t.length;r++)s[r]^=t[r];for(r=0;r<e.length;r++)s[64+r]=e[r];for(r=i-4;r<i;r++)s[r]=0;for(r=0;r<64;r++)o[r]=92;for(r=0;r<t.length;r++)o[r]^=t[r];function l(){for(var t=i-1;t>=i-4;t--){if(s[t]++,s[t]<=255)return;s[t]=0}}for(;n>=32;)l(),a=a.concat(c(o.concat(c(s)))),n-=32;return n>0&&(l(),a=a.concat(c(o.concat(c(s))).slice(0,n))),a}function u(t,e,n,r){var i,s,o=t[0]^e[n++],a=t[1]^e[n++],l=t[2]^e[n++],c=t[3]^e[n++],d=t[4]^e[n++],u=t[5]^e[n++],h=t[6]^e[n++],f=t[7]^e[n++],p=t[8]^e[n++],g=t[9]^e[n++],m=t[10]^e[n++],b=t[11]^e[n++],v=t[12]^e[n++],w=t[13]^e[n++],y=t[14]^e[n++],x=t[15]^e[n++],I=o,_=a,k=l,C=c,L=d,A=u,z=h,T=f,E=p,S=g,j=m,P=b,D=v,N=w,M=y,O=x;for(s=0;s<8;s+=2)I^=(i=(D^=(i=(E^=(i=(L^=(i=I+D)<<7|i>>>25)+I)<<9|i>>>23)+L)<<13|i>>>19)+E)<<18|i>>>14,A^=(i=(_^=(i=(N^=(i=(S^=(i=A+_)<<7|i>>>25)+A)<<9|i>>>23)+S)<<13|i>>>19)+N)<<18|i>>>14,j^=(i=(z^=(i=(k^=(i=(M^=(i=j+z)<<7|i>>>25)+j)<<9|i>>>23)+M)<<13|i>>>19)+k)<<18|i>>>14,O^=(i=(P^=(i=(T^=(i=(C^=(i=O+P)<<7|i>>>25)+O)<<9|i>>>23)+C)<<13|i>>>19)+T)<<18|i>>>14,I^=(i=(C^=(i=(k^=(i=(_^=(i=I+C)<<7|i>>>25)+I)<<9|i>>>23)+_)<<13|i>>>19)+k)<<18|i>>>14,A^=(i=(L^=(i=(T^=(i=(z^=(i=A+L)<<7|i>>>25)+A)<<9|i>>>23)+z)<<13|i>>>19)+T)<<18|i>>>14,j^=(i=(S^=(i=(E^=(i=(P^=(i=j+S)<<7|i>>>25)+j)<<9|i>>>23)+P)<<13|i>>>19)+E)<<18|i>>>14,O^=(i=(M^=(i=(N^=(i=(D^=(i=O+M)<<7|i>>>25)+O)<<9|i>>>23)+D)<<13|i>>>19)+N)<<18|i>>>14;e[r++]=t[0]=I+o|0,e[r++]=t[1]=_+a|0,e[r++]=t[2]=k+l|0,e[r++]=t[3]=C+c|0,e[r++]=t[4]=L+d|0,e[r++]=t[5]=A+u|0,e[r++]=t[6]=z+h|0,e[r++]=t[7]=T+f|0,e[r++]=t[8]=E+p|0,e[r++]=t[9]=S+g|0,e[r++]=t[10]=j+m|0,e[r++]=t[11]=P+b|0,e[r++]=t[12]=D+v|0,e[r++]=t[13]=N+w|0,e[r++]=t[14]=M+y|0,e[r++]=t[15]=O+x|0}function h(t,e,n,r,i){for(;i--;)t[e++]=n[r++]}function f(t,e,n,r,i){for(;i--;)t[e++]^=n[r++]}function p(t,e,n,r,i){h(t,0,e,n+16*(2*i-1),16);for(var s=0;s<2*i;s+=2)u(t,e,n+16*s,r+8*s),u(t,e,n+16*s+16,r+8*s+16*i)}function g(t,e,n){return t[e+16*(2*n-1)]}function m(t){for(var e=[],n=0;n<t.length;n++){var r=t.charCodeAt(n);if(r<128)e.push(r);else if(r<2048)e.push(192|r>>6),e.push(128|63&r);else if(r<55296)e.push(224|r>>12),e.push(128|r>>6&63),e.push(128|63&r);else{if(n>=t.length-1)throw new Error("invalid string");n++,r=(1023&r)<<10,r|=1023&t.charCodeAt(n),r+=65536,e.push(240|r>>18),e.push(128|r>>12&63),e.push(128|r>>6&63),e.push(128|63&r)}}return e}var b=1;if("object"==typeof r){if(arguments.length>4)throw new Error("scrypt: incorrect number of arguments");var v=r;if(a=i,void 0===(r=v.logN)){if(void 0===v.N)throw new Error("scrypt: missing N parameter");if(v.N<2||v.N>-1>>>0)throw new Error("scrypt: N is out of range");if(0!=(v.N&v.N-1))throw new Error("scrypt: N is not a power of 2");r=Math.log(v.N)/Math.LN2}b=v.p||1,i=v.r,s=v.dkLen||32,o=v.interruptStep||0,l=v.encoding}if(b<1)throw new Error("scrypt: invalid p");if(i<=0)throw new Error("scrypt: invalid r");if(r<1||r>31)throw new Error("scrypt: logN must be between 1 and 31");var w,y,x,I,_=1<<r>>>0;if(i*b>=1<<30||i>(-1>>>0)/128/b||i>(-1>>>0)/256||_>(-1>>>0)/128/i)throw new Error("scrypt: parameters are too large");"string"==typeof e&&(e=m(e)),"string"==typeof n&&(n=m(n)),"undefined"!=typeof Int32Array?(w=new Int32Array(64*i),y=new Int32Array(32*_*i),I=new Int32Array(16)):(w=[],y=[],I=new Array(16)),x=d(e,n,128*b*i);var k=0,C=32*i;function L(t){for(var e=0;e<32*i;e++){var n=t+4*e;w[k+e]=(255&x[n+3])<<24|(255&x[n+2])<<16|(255&x[n+1])<<8|(255&x[n+0])<<0}}function A(t,e){for(var n=t;n<e;n+=2)h(y,n*(32*i),w,k,32*i),p(I,w,k,C,i),h(y,(n+1)*(32*i),w,C,32*i),p(I,w,C,k,i)}function z(t,e){for(var n=t;n<e;n+=2){var r=g(w,k,i)&_-1;f(w,k,y,r*(32*i),32*i),p(I,w,k,C,i),r=g(w,C,i)&_-1,f(w,C,y,r*(32*i),32*i),p(I,w,C,k,i)}}function T(t){for(var e=0;e<32*i;e++){var n=w[k+e];x[t+4*e+0]=n>>>0&255,x[t+4*e+1]=n>>>8&255,x[t+4*e+2]=n>>>16&255,x[t+4*e+3]=n>>>24&255}}var E=void 0!==t?t:setTimeout;function S(t,e,n,r,i){!function s(){E(function(){r(t,t+n<e?t+n:e),(t+=n)<e?s():i()})}()}function j(t){var n=d(e,x,s);return"base64"===t?function(t){for(var e,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),r=t.length,i=[],s=0;s<r;)e=((s<r?t[s++]:0)<<16)+((s<r?t[s++]:0)<<8)+(s<r?t[s++]:0),i.push(n[e>>>18&63]),i.push(n[e>>>12&63]),i.push(n[e>>>6&63]),i.push(n[e>>>0&63]);return r%3>0&&(i[i.length-1]="=",r%3==1&&(i[i.length-2]="=")),i.join("")}(n):"hex"===t?function(t){for(var e="0123456789abcdef".split(""),n=t.length,r=[],i=0;i<n;i++)r.push(e[t[i]>>>4&15]),r.push(e[t[i]>>>0&15]);return r.join("")}(n):"binary"===t?new Uint8Array(n):n}"function"==typeof o&&(l=a,a=o,o=1e3),o<=0?function(){for(var t=0;t<b;t++)L(128*t*i),A(0,_),z(0,_),T(128*t*i);a(j(l))}():function t(e){L(128*e*i),S(0,_,2*o,A,function(){S(0,_,2*o,z,function(){T(128*e*i),e+1<b?E(function(){t(e+1)}):a(j(l))})})}(0)})}).call(this,t("timers").setImmediate)},{timers:7}],7:[function(t,e,n){(function(e,r){var i=t("process/browser.js").nextTick,s=Function.prototype.apply,o=Array.prototype.slice,a={},l=0;function c(t,e){this._id=t,this._clearFn=e}n.setTimeout=function(){return new c(s.call(setTimeout,window,arguments),clearTimeout)},n.setInterval=function(){return new c(s.call(setInterval,window,arguments),clearInterval)},n.clearTimeout=n.clearInterval=function(t){t.close()},c.prototype.unref=c.prototype.ref=function(){},c.prototype.close=function(){this._clearFn.call(window,this._id)},n.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},n.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},n._unrefActive=n.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},n.setImmediate="function"==typeof e?e:function(t){var e=l++,r=!(arguments.length<2)&&o.call(arguments,1);return a[e]=!0,i(function(){a[e]&&(r?t.apply(null,r):t.call(null),n.clearImmediate(e))}),e},n.clearImmediate="function"==typeof r?r:function(t){delete a[t]}}).call(this,t("timers").setImmediate,t("timers").clearImmediate)},{"process/browser.js":5,timers:7}],8:[function(t,e,n){"use strict";const r=t("./version.js"),i=t("aprico-gen"),s={"aprico-gen":i.version,"aprico-ui":r},o=function t(e){function n(t,e){return t>>>e|t<<32-e}for(var r,i,s=Math.pow,o=s(2,32),a="length",l="",c=[],d=8*e[a],u=t.h=t.h||[],h=t.k=t.k||[],f=h[a],p={},g=2;64>f;g++)if(!p[g]){for(r=0;313>r;r+=g)p[r]=g;u[f]=s(g,.5)*o|0,h[f++]=s(g,1/3)*o|0}for(e+="";e[a]%64-56;)e+="\0";for(r=0;r<e[a];r++){if((i=e.charCodeAt(r))>>8)return;c[r>>2]|=i<<(3-r)%4*8}for(c[c[a]]=d/o|0,c[c[a]]=d,i=0;i<c[a];){var m=c.slice(i,i+=16),b=u;for(u=u.slice(0,8),r=0;64>r;r++){var v=m[r-15],w=m[r-2],y=u[0],x=u[4],I=u[7]+(n(x,6)^n(x,11)^n(x,25))+(x&u[5]^~x&u[6])+h[r]+(m[r]=16>r?m[r]:m[r-16]+(n(v,7)^n(v,18)^v>>>3)+m[r-7]+(n(w,17)^n(w,19)^w>>>10)|0);(u=[I+((n(y,2)^n(y,13)^n(y,22))+(y&u[1]^y&u[2]^u[1]&u[2]))|0].concat(u))[4]=u[4]+I|0}for(r=0;8>r;r++)u[r]=u[r]+b[r]|0}for(r=0;8>r;r++)for(i=3;i+1;i--){var _=u[r]>>8*i&255;l+=(16>_?0:"")+_.toString(16)}return l},a=t("identicon.js"),l=t("./templates.js"),c=t("./tips.js"),d=t("./utils.js"),u=d.detectPlatform();u.webext&&"undefined"==typeof chrome&&(window.chrome=browser);const h={foreground:[239,61,51,255],background:[255,255,255,255],margin:.24,size:41,format:"svg"};let f,p,g;s["aprico-gen"].replace(/\./g,"_");function m(){p=!1,u.webext?chrome.storage.local.set({hashId:""},v):(localStorage.setItem("hashId",""),v())}function b(t){t&&t.hashId?(p=t.hashId,w()):(p=!1,v())}function v(){let t=d.stringToDom(g.login);f.firstChild&&f.removeChild(f.firstChild),f.appendChild(t),function(){let t=d.getId("ap-hashid"),e=d.getId("ap-trigger-login");t.focus(),e.addEventListener("click",function(e){var n;e.preventDefault(),t.value?(p=i.getHashId(t.value),p=n=p,u.webext?chrome.storage.local.set({hashId:n},w):(localStorage.setItem("hashId",n),w())):t.focus()})}(),y()}function w(){let t=d.stringToDom(g.main);f.firstChild&&f.removeChild(f.firstChild),f.appendChild(t),function(){let t=d.getId("ap-pass"),e=d.getId("ap-service"),n=d.getId("ap-result"),r=d.getId("ap-trigger-gen"),s=d.getId("ap-variant"),l=d.getId("ap-letters"),f=d.getId("ap-numbers"),g=d.getId("ap-symbols"),b=d.getId("ap-length"),v=d.getId("ap-trigger-extra"),w=d.getId("a-pass-label"),y=d.getId("ap-copy"),x=d.getId("ap-show"),I=d.getId("aprico-extra"),_=d.getId("aprico-result"),k=d.getId("aprico-about");S(),u.webext?chrome.tabs.query({active:!0,currentWindow:!0},function(n){n[0].url.indexOf(".")>0?(e.value=i.normalizeService(n[0].url),t.focus()):e.focus()}):e.focus();function C(t){"aprico-about"==t.id&&S(),_.hidden=!0,k.hidden=!0,I.hidden=!0,t.hidden=!1}e.addEventListener("blur",function(t){this.value=i.normalizeService(this.value)}),t.addEventListener("input",function(e){if(this.value.length){let e=btoa(encodeURIComponent(this.value).replace(/%([0-9A-F]{2})/g,function(t,e){return String.fromCharCode(parseInt(e,16))})),n=new a(o(p+e),h).toString();t.style.backgroundImage="url(data:image/svg+xml;base64,"+n+")"}else t.style.backgroundImage=""}),v.addEventListener("click",function(t){t.preventDefault(),this.classList.contains("bg-gray-2")?(this.classList.remove("bg-gray-2"),C(k)):(this.classList.add("bg-gray-2"),C(I))}),n.addEventListener("focus",function(){this.type="text"}),n.addEventListener("blur",function(){this.type="password"}),y.addEventListener("click",function(t){let e=d.copyToClipboard(n);e?w.textContent="Password copied to clipboard.":alert("There was an error with the clipboard copy.")}),d.getId("ap-delete-hash").addEventListener("click",m),x.addEventListener("click",function(t){n.focus()});let L=document.querySelectorAll("input");Array.from(L).forEach(function(t){t.addEventListener("input",function(){1!=_.hidden&&C(k)})});let A=document.querySelectorAll(".switch-toggle");function z(){let t=Array.prototype.slice.call(A).some(t=>t.checked);t||(this.checked=!0),this.value=this.checked?1:0,v.classList.toggle("btn-mod-notify",E(T))}Array.from(A).forEach(t=>t.addEventListener("change",z)),d.getId("fake-form").addEventListener("submit",o=>{o.preventDefault(),async function(o){if(!e.value)return e.focus(),!1;if(!t.value)return t.focus(),!1;let a,c,u;await new Promise(function(t){return w.classList.remove("icon","icon-done","icon-alldone"),y.classList.add("hidden"),x.classList.add("hidden"),n.classList.remove("border-red"),v.classList.remove("bg-gray-2"),C(_),a=setInterval(function(){w.textContent+="."},50),w.classList.add("red"),w.textContent="Generating.",r.disabled=!0,v.disabled=!0,n.value="",setTimeout(t,100)}),await new Promise(function(r){(new Date).getTime();return c=i.getPassword(t.value,e.value,p,{length:+b.value,letters:+l.checked,numbers:+f.checked,symbols:+g.checked,variant:s.value}),n.value=c.pass,c=!1,u=d.copyToClipboard(n),setTimeout(r,100)}),await new Promise(function(t){return n.classList.add("border-red"),w.classList.remove("red"),clearInterval(a),u?(w.classList.add("icon","icon-alldone"),w.textContent="Password copied to clipboard."):(w.classList.add("icon","icon-done"),w.textContent="Password is ready.",y.classList.remove("hidden")),x.classList.remove("hidden"),r.disabled=!1,v.disabled=!1,t()})}()}),b.addEventListener("change",()=>{0==+b.value?b.value=20:+b.value<4?b.value=4:+b.value>40&&(b.value=40),v.classList.toggle("btn-mod-notify",E(T)),b.classList.toggle("border-red",b.dataset.origValue!==b.value)});let T=document.querySelectorAll("#aprico-extra input");function E(t){return Array.from(t).some(t=>"origValue"in t.dataset&&t.dataset.origValue!==t.value)}function S(){let t=c.common;u.webext&&(t=[...t,...c.webext]),u.mobile&&!u.standalone&&(t=[...t,...c.mobile]),u.mobile||u.webext||(t=[...t,...c.desktop]);let e=t[Math.random()*t.length|0],n=d.getId("aprico-tips");for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(d.stringToDom(e))}Array.from(T).forEach(t=>{t.dataset.origValue=t.value,t.addEventListener("input",e=>{v.classList.toggle("btn-mod-notify",E(T)),t.classList.toggle("border-red",t.dataset.origValue!==t.value)})})}(),y()}function y(){(u.webext||u.standalone)&&Array.from(document.querySelectorAll(".external-link")).forEach(t=>t.addEventListener("click",e=>{e.preventDefault(),window.open(t.getAttribute("href"))}))}e.exports=function(t,e){if(!(f=document.querySelector(t)))throw new Error("Root element is undefined.");g=e||l,d.setPlatformCSSClasses(u,f),u.webext?chrome.storage.local.get("hashId",b):b({hashId:localStorage.getItem("hashId")})},e.exports.version=s},{"./templates.js":10,"./tips.js":11,"./utils.js":12,"./version.js":13,"aprico-gen":1,"identicon.js":3}],9:[function(t,e,n){const r=t("./aprico-ui.js");r("#aprico");let i=JSON.stringify(r.version,(t,e)=>"string"==typeof e?" v"+e:e,"");i=i.replace(/{|}|"/g,""),document.getElementById("aprico-version")&&(document.getElementById("aprico-version").textContent=i.replace(/,/g,"\r\n"))},{"./aprico-ui.js":8}],10:[function(t,e,n){const r={login:'\n  <div id="aprico-login" class="p2 sm-p3 bg-white">\n\t<div class="mb2">\n      <label class="label" for="ap-hashid">ID</label>\n      <input class="sm-h3" type="text" id="ap-hashid" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">\n  \t</div>\n  \t<div class="mb2 h6">\n  \t\t<p class="h5"><strong>Please choose an ID:</strong> It can be your email address, your nickname or a longer passphrase.</p>\n      <p><strong>Important:</strong> The ID will be asked only once, <strong>make sure to remember it</strong>, since there is no way to recover it. Without your ID, all the generated passwords will be lost.</p>\n    </div>\n  \t<div class="mb2">\n      <button id="ap-trigger-login" class="btn btn-primary h6 caps white">Start using Aprico</button>\n  \t</div>\n    <div class="border-top border-gray pt2">\n      <p class="h6 m0"><strong>aprico</strong> is a deterministic password manager that works 100% in your browser. No data will ever be sent to any server or cloud. Read more in our user-friendly <a class="external-link" href="https://aprico.org/privacy.html">Privacy Policy</a>.</h6>\n    </div>\n    </div>\n  \t',main:'\n  <div id="aprico-main" class="flex flex-column col-12">\n  <div class="p2 sm-p3 bg-white">\n  \t<div class="mb2">\n      <label class="label">Service</label>\n      <input class="sm-h3 sm-mb2" type="text" placeholder="website.com or appname" id="ap-service" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">\n  \t</div>\n  \t<form id="fake-form" action="login">\n    <div class="mb2">\n      \n      <input id="fake-user-text-field" type="hidden" autocomplete="username" value="aprico master password">\n      <label class="label">Master Password</label>\n      <input id="ap-pass" class="sm-h3 sm-mb2 bg-identicon" type="password" autocomplete="password">\n      \n  \t</div>\n  \t<div class="sm-mb2">\n    \t<div class="flex">\n      \t<button type="submit" id="ap-trigger-gen" class="btn btn-primary white h6 caps" style="margin-left:1px">Get Password</button>\n      \t<span class="flex-auto"></span>\n      \t<button id="ap-trigger-extra" class="btn h6 caps right icon icon-opts px0 border-gray rounded"><span style="opacity:0">More</span></button>\n    \t</div>\n  \t</div>\n    </form>\n  </div>\n\n  <div class="flex-auto flex flex-column bg-gray-1 border-top border-gray-2" style="min-height:220px">\n\n  <div id="aprico-extra" class="p2 sm-p3" hidden>\n    <div class="flex justify-between mb2">\n        <div class="sm-mb2 col-3 ">\n            <label class="label">Length</label>\n            <input class="lg-h3" type="number" min="4" max="40" value="20" id="ap-length">\n        </div>\n        <div class="sm-mb2 col-9 flex-auto pl2 sm-pl4 md-pl2 lg-pl4">\n            <label class="label">Alphabet</label>\n            <ul class="list-reset flex justify-between center">\n                <li>\n                    <input type="checkbox" checked value="1" id="ap-letters" class="switch-toggle switch-toggle-round">\n                    <label for="ap-letters"><span class="mt2 block">Letters</span></label>\n                </li>\n                <li>\n                    <input type="checkbox" checked value="1" id="ap-numbers" class="switch-toggle switch-toggle-round">\n                    <label for="ap-numbers"><span class="mt2 block">Numbers</span></label>\n                </li>\n                <li>\n                    <input type="checkbox" checked value="1" id="ap-symbols" class="switch-toggle switch-toggle-round">\n                    <label for="ap-symbols"><span class="mt2 block">Symbols</span></label>\n                </li>\n            </ul>\n        </div>\n    </div>\n    <div class="">\n        <div class="-mb2">\n            <label class="label">Variant</label>\n            <input class="sm-h3" type="text" id="ap-variant">\n        </div>\n    </div>\n  </div>\n\n  <div id="aprico-result" class="p2 sm-p3" hidden>\n  <div class="mb2">\n      <label class="label bold mb2" id="a-pass-label">Password</label>\n      <input class="sm-h3 sm-mb2 monospace" type="password" id="ap-result" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" readonly="true">\n  </div>\n  <div class="flex">\n  <button class="btn btn-small h6 px0 hidden mr2 icon icon-view weight-400" id="ap-show">Show</button>\n  <button class="btn btn-small h6 px0 hidden icon icon-copy weight-400" id="ap-copy">Copy</button>\n  </div>\n  </div>\n\n  <div id="aprico-about" class="flex-auto flex flex-column col-12">\n  \x3c!-- <div class="flex flex-column bg-gray-1"> --\x3e\n  <div class="p2 sm-p3">\n    <p id="aprico-tips" class="h6 md-h5 m0"></p>\n  </div>\n  <span class="flex-auto"></span>\n  <div class="flex p2 sm-p3">\n  <a class="btn btn-small h6 px0 icon icon-open weight-400 external-link" href="https://aprico.org">About</a>\n  <a class="hide btn btn-small h6 px0 icon icon-open weight-400  ml2 external-link" href="mailto:pino@aprico.org?subject=Feedback%20about%20aprico">Feedback</a>\n\n  <button id="ap-link-online" class="hide btn btn-small h6 px0 icon icon-open">Online Version</button>\n  <span class="flex-auto"></span>\n  <button class="btn btn-small h6 px0 icon icon-logout" id="ap-delete-hash">Change ID</button>\n  </div>  \n  \x3c!-- </div> --\x3e\n  </div>\n\n  </div>\n</div>\n\t'};e.exports=r},{}],11:[function(t,e,n){const r={common:["Thank you for using <strong>aprico</strong>.",'Have something to say about <strong>aprico</strong>? Feel free to send <a target="_blank" class="external-link" href="mailto:pino@aprico.org">feedback</a>.'],webext:['Easily open aprico with <code><span class="macOS-inline-notice">⌘</span><span class="otherOS-inline-notice">ctrl</span></code> + <code>shift</code> + <code>.</code>'],mobile:["For a better user experience add <strong>aprico</strong> to your home screen."],desktop:['<strong>aprico</strong> is also available as a browser extension for <a class="external-link" href="https://addons.mozilla.org/firefox/addon/aprico-free-password-manager/">FireFox</a> and <a class="external-link" href="https://chrome.google.com/webstore/detail/aprico-free-password-mana/anghijfdmgonjcmljokbndedjcjdldbk">Chrome</a>.']};e.exports=r},{}],12:[function(t,e,n){"use strict";const r={getId:function(t){return document.getElementById(t)},stringToDom:function(t){return document.createRange().createContextualFragment(t.trim())},copyToClipboard:function(t){if(t.type="text",navigator.userAgent.match(/ipad|ipod|iphone/i)){var e=t.contentEditable,n=t.readOnly;t.contentEditable=!0,t.readOnly=!0;var r=document.createRange();r.selectNodeContents(t);var i=window.getSelection();i.removeAllRanges(),i.addRange(r),t.setSelectionRange(0,999999),t.contentEditable=e,t.readOnly=n}else t.select();let s=document.execCommand("copy");return t.type="password","selectionStart"in t&&(t.selectionEnd=t.selectionStart),t.blur(),s},chainOnTransitionEnd:function(t,e){let n=function(r){r.target.removeEventListener(r.type,n),r.target==e&&t()};return e.addEventListener("transitionend",n),this},detectPlatform:function(){const t=navigator.userAgent||navigator.vendor||window.opera;let e={};return e.webext=!("undefined"==typeof browser||!browser.runtime||!browser.runtime.id)||!("undefined"==typeof chrome||!chrome.runtime||!chrome.runtime.id),e.macos=navigator.platform.toUpperCase().indexOf("MAC")>=0,e.mobile=!e.webext&&/mobi/i.test(t),e.standalone=e.mobile&&(1==window.navigator.standalone||window.matchMedia("(display-mode: standalone)").matches),e.ios=e.mobile&&/iPad|iPhone|iPod/.test(t)&&!window.MSStream,e.android=e.mobile&&/android/i.test(t)&&!window.MSStream,e},setPlatformCSSClasses:function(t,e){t=t||r.detectPlatform(),e=e||document.body,t.webext?e.classList.add("platform-webext"):e.classList.add("platform-browser"),t.macos?e.classList.add("platform-macOS"):e.classList.add("platform-otherOS"),t.mobile?e.classList.add("platform-mobile"):e.classList.add("platform-desktop"),t.mobile&&(t.standalone?e.classList.add("platform-mobile-app"):e.classList.add("platform-mobile-browser"),t.ios?e.classList.add("platform-iOS"):t.android&&e.classList.add("platform-android"))}};e.exports=r},{}],13:[function(t,e,n){e.exports="0.2.0"},{}]},{},[9]);
