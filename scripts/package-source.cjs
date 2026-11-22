const fs=require('node:fs');
const path=require('node:path');
const {deflateRawSync}=require('node:zlib');
const root=path.resolve(__dirname,'..');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const target=path.join(root,'releases','jiyong-source-'+stamp);
fs.mkdirSync(target,{recursive:true});
const files=['README.md','LICENSE','CONTRIBUTING.md','SECURITY.md','THIRD_PARTY_NOTICES.md','AGENTS.md','DESIGN.md','.gitignore','.env.example','package.json','package-lock.json','next.config.ts','next-env.d.ts','postcss.config.mjs','eslint.config.mjs','tsconfig.json','vitest.config.ts'];
const dirs=['app','components','content','data','lib','schemas','types','scripts','tests','public','.github'];
function copy(source,dest){const name=path.basename(source);if(name==='project.private.config.json'||/\.(log|pem|key)$/.test(name))return;const stat=fs.statSync(source);if(stat.isDirectory()){fs.mkdirSync(dest,{recursive:true});for(const entry of fs.readdirSync(source))copy(path.join(source,entry),path.join(dest,entry));}else fs.copyFileSync(source,dest);}
for(const file of [...files,...dirs])if(fs.existsSync(path.join(root,file)))copy(path.join(root,file),path.join(target,file));
fs.mkdirSync(path.join(target,'docs'),{recursive:true});
for(const file of ['case-alignment.md','scene-coverage.md','scenario-prompt-outputs.md','ppt-prompt.md','framework-library.md','design-system.md','open-source-release.md','prompt-task-adaptation.md','taxonomy.md','data-and-state-rules.md'])copy(path.join(root,'docs',file),path.join(target,'docs',file));

const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?(0xedb88320^(n>>>1)):(n>>>1);return n>>>0;});
function crc32(buf){let crc=0xffffffff;for(const b of buf)crc=table[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
const locals=[],centrals=[];let offset=0,count=0;
function archive(dir){for(const entry of fs.readdirSync(dir)){const file=path.join(dir,entry);if(fs.statSync(file).isDirectory()){archive(file);continue;}const name=Buffer.from('jiyong-source/'+path.relative(target,file).split(path.sep).join('/'));const raw=fs.readFileSync(file),packed=deflateRawSync(raw),crc=crc32(raw);const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x800,6);h.writeUInt16LE(8,8);h.writeUInt16LE(0x21,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(packed.length,18);h.writeUInt32LE(raw.length,22);h.writeUInt16LE(name.length,26);locals.push(h,name,packed);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x800,8);c.writeUInt16LE(8,10);c.writeUInt16LE(0x21,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(packed.length,20);c.writeUInt32LE(raw.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);centrals.push(c,name);offset+=h.length+name.length+packed.length;count++;}}
archive(target);const central=Buffer.concat(centrals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(count,8);end.writeUInt16LE(count,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);fs.writeFileSync(target+'.zip',Buffer.concat([...locals,central,end]));console.log(target+'.zip');console.log('Source directory: '+target);
