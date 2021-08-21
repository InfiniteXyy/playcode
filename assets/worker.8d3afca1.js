!function(){"use strict";class t extends Error{constructor(t){super(`process exited with code ${t}.`),this.code=t}}class e extends Error{constructor(t,e){super(`${t}.${e} not implemented.`)}}class s extends Error{constructor(t="abort"){super(t)}}class i extends Error{constructor(t){super(t)}}function r(t,e,s=-1){let i="",r=t.length;-1!=s&&(r=e+s);for(let n=e;n<r&&0!=t[n];++n)i+=String.fromCharCode(t[n]);return i}function n(t){if(!t)throw new i("assertion failed.")}function o(t,e=[]){const s={};for(let i of e)s[i]=t[i].bind(t);return s}function h(t,e){return((e-t)/1e3).toFixed(2)}class a{constructor(t){this.memory=t,this.buffer=this.memory.buffer,this.u8=new Uint8Array(this.buffer),this.u32=new Uint32Array(this.buffer)}check(){0===this.buffer.byteLength&&(this.buffer=this.memory.buffer,this.u8=new Uint8Array(this.buffer),this.u32=new Uint32Array(this.buffer))}read8(t){return this.u8[t]}read32(t){return this.u32[t>>2]}write8(t,e){this.u8[t]=e}write32(t,e){this.u32[t>>2]=e}write64(t,e,s=0){this.write32(t,e),this.write32(t+4,s)}readStr(t,e){return r(this.u8,t,e)}writeStr(t,e){return t+=this.write(t,e),this.write8(t,0),e.length+1}write(t,e){if(e instanceof ArrayBuffer)return this.write(t,new Uint8Array(e));if("string"==typeof e)return this.write(t,e.split("").map((t=>t.charCodeAt(0))));return new Uint8Array(this.buffer,t,e.length).set(e),e.length}}class c{constructor(t,e,s,...i){this.argv=[s,...i],this.environ={USER:"alice"},this.memfs=e,this.allowRequestAnimationFrame=!0,this.handles=new Map,this.nextHandle=0;const r=o(this),n=o(this,["proc_exit","environ_sizes_get","environ_get","args_sizes_get","args_get","random_get","clock_time_get","poll_oneoff"]);Object.assign(n,this.memfs.exports),this.ready=WebAssembly.instantiate(t,{wasi_unstable:n,env:r}).then((t=>{this.exports=t.exports,this.mem=new a(this.exports.memory),this.memfs.hostMem=this.mem}))}async run(){await this.ready;try{this.exports._start()}catch(e){let s=!0;if(e instanceof t){if(789514===e.code)return console.log("Allowing rAF after exit."),!0;if(console.log(`Disallowing rAF since exit code is ${e.code}.`),this.allowRequestAnimationFrame=!1,0==e.code)return!1;s=!1}let i=`[91mError: ${e.message}`;throw s&&(i+=`\n${e.stack}`),i+="[0m\n",this.memfs.hostWrite(i),e}}proc_exit(e){throw new t(e)}environ_sizes_get(t,e){this.mem.check();let s=0;const i=Object.getOwnPropertyNames(this.environ);for(const r of i){const t=this.environ[r];s+=r.length+t.length+2}return this.mem.write64(t,i.length),this.mem.write64(e,s),0}environ_get(t,e){this.mem.check();const s=Object.getOwnPropertyNames(this.environ);for(const i of s)this.mem.write32(t,e),t+=4,e+=this.mem.writeStr(e,`${i}=${this.environ[i]}`);return this.mem.write32(t,0),0}args_sizes_get(t,e){this.mem.check();let s=0;for(let i of this.argv)s+=i.length+1;return this.mem.write64(t,this.argv.length),this.mem.write64(e,s),0}args_get(t,e){this.mem.check();for(let s of this.argv)this.mem.write32(t,e),t+=4,e+=this.mem.writeStr(e,s);return this.mem.write32(t,0),0}random_get(t,e){const s=new Uint8Array(this.mem.buffer,t,e);for(let i=0;i<e;++i)s[i]=256*Math.random()|0}clock_time_get(t,s,i){throw new e("wasi_unstable","clock_time_get")}poll_oneoff(t,s,i,r){throw new e("wasi_unstable","poll_oneoff")}}class m{constructor(t){this.hostWrite=t.hostWrite,this.stdinStr=t.stdinStr||"",this.stdinStrPos=0,this.hostMem_=null;const e=o(this,["abort","host_write","host_read","memfs_log","copy_in","copy_out"]);this.ready=fetch("/assets/memfs.2c72ee42.wasm").then((t=>t.arrayBuffer())).then((async t=>{const s=await WebAssembly.compile(t),i=await WebAssembly.instantiate(s,{env:e});this.exports=i.exports,this.mem=new a(this.exports.memory),this.exports.init()}))}set hostMem(t){this.hostMem_=t}setStdinStr(t){this.stdinStr=t,this.stdinStrPos=0}addDirectory(t){this.mem.check(),this.mem.write(this.exports.GetPathBuf(),t),this.exports.AddDirectoryNode(t.length)}addFile(t,e){const s=e instanceof ArrayBuffer?e.byteLength:e.length;this.mem.check(),this.mem.write(this.exports.GetPathBuf(),t);const i=this.exports.AddFileNode(t.length,s),r=this.exports.GetFileNodeAddress(i);this.mem.check(),this.mem.write(r,e)}getFileContents(t){this.mem.check(),this.mem.write(this.exports.GetPathBuf(),t);const e=this.exports.FindNode(t.length),s=this.exports.GetFileNodeAddress(e),i=this.exports.GetFileNodeSize(e);return new Uint8Array(this.mem.buffer,s,i)}abort(){throw new s}host_write(t,e,s,i){this.hostMem_.check(),n(t<=2);let r=0,o="";for(let n=0;n<s;++n){const t=this.hostMem_.read32(e);e+=4;const s=this.hostMem_.read32(e);e+=4,o+=this.hostMem_.readStr(t,s),r+=s}return this.hostMem_.write32(i,r),this.hostWrite(o),0}host_read(t,e,s,i){this.hostMem_.check(),n(0===t);let r=0;for(let n=0;n<s;++n){const t=this.hostMem_.read32(e);e+=4;const s=this.hostMem_.read32(e);e+=4;const i=Math.min(s,this.stdinStr.length-this.stdinStrPos);if(0===i)break;if(this.hostMem_.write(t,this.stdinStr.substr(this.stdinStrPos,i)),r+=i,this.stdinStrPos+=i,i!==s)break}return this.hostMem_.write32(i,r),0}memfs_log(t,e){this.mem.check(),console.log(this.mem.readStr(t,e))}copy_out(t,e,s){this.hostMem_.check();const i=new Uint8Array(this.hostMem_.buffer,t,s);this.mem.check();const r=new Uint8Array(this.mem.buffer,e,s);i.set(r)}copy_in(t,e,s){this.mem.check();const i=new Uint8Array(this.mem.buffer,t,s);this.hostMem_.check();const r=new Uint8Array(this.hostMem_.buffer,e,s);i.set(r)}}class l{constructor(t){this.u8=new Uint8Array(t),this.offset=0}readStr(t){const e=r(this.u8,this.offset,t);return this.offset+=t,e}readOctal(t){return parseInt(this.readStr(t),8)}alignUp(){this.offset=this.offset+511&-512}readEntry(){if(this.offset+512>this.u8.length)return null;const t={filename:this.readStr(100),mode:this.readOctal(8),owner:this.readOctal(8),group:this.readOctal(8),size:this.readOctal(12),mtim:this.readOctal(12),checksum:this.readOctal(8),type:this.readStr(1),linkname:this.readStr(100)};return"ustar  "!==this.readStr(8)?null:(t.ownerName=this.readStr(32),t.groupName=this.readStr(32),t.devMajor=this.readStr(8),t.devMinor=this.readStr(8),t.filenamePrefix=this.readStr(155),this.alignUp(),"0"===t.type?(t.contents=this.u8.subarray(this.offset,this.offset+t.size),this.offset+=t.size,this.alignUp()):"5"!==t.type&&(console.log("type",t.type),n(!1)),t)}untar(t){let e;for(;e=this.readEntry();)switch(e.type){case"0":t.addFile(e.filename,e.contents);break;case"5":t.addDirectory(e.filename)}}}class f{constructor(t){this.moduleCache={},this.hostWrite=t.hostWrite,this.showTiming=t.showTiming||!1,this.clangCommonArgs=["-disable-free","-isysroot","/","-internal-isystem","/include/c++/v1","-internal-isystem","/include","-internal-isystem","/lib/clang/8.0.1/include","-ferror-limit","19","-fmessage-length","80","-fcolor-diagnostics"],this.memfs=new m({hostWrite:this.hostWrite}),this.ready=this.memfs.ready.then((()=>this.untar(this.memfs,"/assets/sysroot.2435a7b5.tar")))}async getModule(t){if(this.moduleCache[t])return this.moduleCache[t];const e=await this.hostLogAsync(`Fetching and compiling ${t}`,(async()=>{const e=await fetch(t);return WebAssembly.compile(await e.arrayBuffer())})());return this.moduleCache[t]=e,e}hostLog(t){this.hostWrite(`[1;93m>[0m ${t}`)}async hostLogAsync(t,e){const s=+new Date;this.hostLog(`${t}...`);const i=await e,r=+new Date;if(this.hostWrite(" done."),this.showTiming){const t="[92m",e="[0m";this.hostWrite(` ${t}(${h(s,r)}s)${e}`)}return i}async untar(t,e){await this.memfs.ready;const s=(async()=>{new l(await fetch(e).then((t=>t.arrayBuffer()))).untar(this.memfs)})();await this.hostLogAsync(`Untarring ${e}`,s)}async compile(t){const e=t.input,s=t.contents,i=t.obj;t.opt,await this.ready,this.memfs.addFile(e,s);const r=await this.getModule("/assets/clang.2a466f0e.wasm");return await this.run(r,"clang","-cc1","-emit-obj",...this.clangCommonArgs,"-O2","-o",i,"-x","c++",e)}async link(t,e){const s="lib/wasm32-wasi",i=`${s}/crt1.o`;await this.ready;const r=await this.getModule("/assets/lld.36419ed2.wasm");return await this.run(r,"wasm-ld","--no-threads","--export-dynamic","-z","stack-size=1048576",`-L${s}`,i,t,"-lc","-lc++","-lc++abi","-o",e)}async run(t,...e){this.hostLog(`${e.join(" ")}`);const s=+new Date,i=new c(t,this.memfs,...e),r=+new Date,n=await i.run(),o=+new Date;if(this.showTiming){const t="[0m";let e=`${"[92m"}(${h(s,r)}s`;e+=`/${h(r,o)}s)${t}`,this.hostWrite(e)}return n?i:null}async compileLinkRun(t){const e="test.o",s="test.wasm";await this.compile({input:"test.cc",contents:t,obj:e}),await this.link(e,s);const i=this.memfs.getFileContents(s),r=await WebAssembly.compile(i);return await this.run(r,s)}}let u,d;const w={hostWrite(t){d.postMessage({id:"write",data:t})}};let g=null;const y=async t=>{switch(t.data.id){case"constructor":d=t.data.data,d.onmessage=y,u=new f(w);break;case"setShowTiming":u.showTiming=t.data.data;break;case"compileLinkRun":g=await u.compileLinkRun(t.data.data),console.log(`finished compileLinkRun. currentApp = ${g}.`)}};self.addEventListener("message",y)}();
