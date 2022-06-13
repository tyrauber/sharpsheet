// https://github.com/cpietsch/sharpsheet v0.0.8 Copyright 2022 Christopher Pietsch
"use strict";var e=require("fs"),t=require("sharp"),o=require("path"),i=require("glob"),s=require("@mapbox/shelf-pack");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=a(e),r=a(t),l=a(o),c=a(i),p=a(s);const h=(e,t)=>Array.from({length:Math.ceil(e.length/t)},(o,i)=>e.slice(i*t,i*t+t)),u=(e,t,o)=>`sprite-${e}-${t}.${o}`;module.exports=async function(e,t,o){const i=o.border||1,s=o.sheetDimension||1024,a=o.outputFormat||"png",f=o.outputQuality||100,d=o.outputFilename||"spritesheet.json",g=o.compositeChunkSize||100,m=o.sheetBackground||{r:0,g:0,b:0,alpha:0};let w=[],y=[],b=[],k=[];if("string"==typeof e?k=e.startsWith("[")&&e.endsWith("]")?JSON.parse(e.replace(/'/g,'"')):c.default.sync(e):Array.isArray(e)&&(k=e),!k.length)return void console.error("no images found");const q=function(e){n.default.existsSync(e)||n.default.mkdirSync(e,{recursive:!0});return e}(t);console.log("found",k.length,"files"),console.log("loading metadata");for(const e in k){const t=k[e],o=l.default.parse(t).name;try{const s=await r.default(t).metadata();w.push({id:+e,w:s.width+2*i,h:s.height+2*i}),y.push(t),b.push(o)}catch(e){console.error(e,t),console.log("skipping file")}}console.log("bin packing"),w.sort((e,t)=>t.h-e.h);let S=w.map(e=>e),$=[];for(;0!==S.length;){let e=new p.default(s,s).pack(S);$.push(e),S=S.filter(t=>!e.find(e=>e.id===t.id))}const v=$.map(e=>e.map(e=>({name:b[e.id],input:y[e.id],left:e.x+i,top:e.y+i,width:e.w-2*i,height:e.h-2*i})));console.log("creating spritesheets",v.length),await Promise.all(v.map(async(e,t)=>{console.log("composing spritesheet",t);const o={width:s,height:s,channels:4,background:m};let i=await r.default({create:o}).raw().toBuffer();const n=h(e,g);for(let e of n)console.log("composing sprites",g*t),i=await r.default(i,{raw:o}).composite(e).raw().toBuffer();const l=`sprite-${s}-${t}.${a}`;return{composite:e,fileName:l,fileMeta:await r.default(i,{raw:o}).toFormat(a,{quality:f}).toFile(q+"/"+l)}}));const x={meta:{type:"sharpsheet",version:"1",app:"https://github.com/cpietsch/sharpsheet"},spritesheets:v.map((e,t)=>({image:u(s,t,a),sprites:e.map(({left:e,top:t,width:o,height:i,name:s})=>({name:s,position:{x:e,y:t},dimension:{w:o,h:i}}))}))};n.default.writeFileSync(q+"/"+d,JSON.stringify(x,null,2))};
