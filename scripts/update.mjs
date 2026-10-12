import {spawn} from 'node:child_process';
import {existsSync,mkdirSync,readFileSync,writeFileSync,readdirSync,copyFileSync,renameSync,rmSync,mkdtempSync,openSync,closeSync,unlinkSync,realpathSync} from 'node:fs';
import {resolve,dirname,join,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const protectedNames=new Set(['data','.spot-it','.git','node_modules','dist']);
export function sourceFiles(root){const files=[];function walk(folder){for(const entry of readdirSync(folder,{withFileTypes:true})){if(protectedNames.has(entry.name))continue;const full=join(folder,entry.name);if(entry.isSymbolicLink())throw new Error('Unexpected symbolic link in update source.');if(entry.isDirectory())walk(full);else if(entry.isFile())files.push(relative(root,full).split(sep).join('/'));}}walk(root);return files.sort();}
function safe(root,path){if(typeof path!=='string'||!path||path.includes('\\')||path.split('/').some(p=>p==='..'||p==='')||protectedNames.has(path.split('/')[0]))throw new Error('Unsafe source path in update manifest.');const full=resolve(root,path);if(!full.startsWith(resolve(root)+sep))throw new Error('Source path is outside the project.');return full;}
function json(path,fallback){try{return JSON.parse(readFileSync(path,'utf8'));}catch{return fallback;}}
export function applyPreparedUpdate(root,staged,sha){
 if(!/^[a-f0-9]{40}$/.test(sha))throw new Error('Invalid GitHub revision.');
 if(!existsSync(join(staged,'node_modules'))||!existsSync(join(staged,'dist/index.html'))||json(join(staged,'package.json'),{}).name!=='spot-it')throw new Error('The new version has not been installed and built successfully.');
 const stateDir=join(root,'.spot-it');mkdirSync(stateDir,{recursive:true});const state=json(join(stateDir,'update.json'),{});const fresh=sourceFiles(staged);const previous=Array.isArray(state.files)?state.files:[];const affected=[...new Set([...previous,...fresh])];affected.forEach(p=>safe(root,p));
 const backup=mkdtempSync(join(dirname(root),'.spot-it-backup-'));const oldFiles=[];const moved=[];const installed=[];let sourceTouched=false;let success=false;
 try{
  for(const file of affected){const original=safe(root,file);if(existsSync(original)){const saved=safe(backup,file);mkdirSync(dirname(saved),{recursive:true});copyFileSync(original,saved);oldFiles.push(file);}}
  for(const folder of ['node_modules','dist']){if(existsSync(join(root,folder))){renameSync(join(root,folder),join(backup,folder));moved.push(folder);}renameSync(join(staged,folder),join(root,folder));installed.push(folder);}
  sourceTouched=true;
  for(const file of fresh){const target=safe(root,file);mkdirSync(dirname(target),{recursive:true});copyFileSync(safe(staged,file),target);}
  for(const file of previous)if(!fresh.includes(file))rmSync(safe(root,file),{force:true});
  writeFileSync(join(stateDir,'update.json.tmp'),JSON.stringify({sha,files:fresh,updatedAt:new Date().toISOString(),backup},null,2)+'\n');renameSync(join(stateDir,'update.json.tmp'),join(stateDir,'update.json'));success=true;
  console.log('Updated successfully. Profiles, progress and purchases were kept.');console.log('Previous source files are backed up at: '+backup);
 }finally{
  if(!success){if(sourceTouched){for(const file of affected)rmSync(safe(root,file),{force:true});for(const file of oldFiles){const target=safe(root,file);mkdirSync(dirname(target),{recursive:true});copyFileSync(safe(backup,file),target);}}for(const folder of ['node_modules','dist']){if(installed.includes(folder)&&existsSync(join(root,folder)))rmSync(join(root,folder),{recursive:true,force:true});if(moved.includes(folder)&&existsSync(join(backup,folder)))renameSync(join(backup,folder),join(root,folder));}console.log('Update was not applied. The previous version was restored.');}
 }
 return backup;
}
async function running(){for(let port=Number(process.env.PORT||3000);port<Number(process.env.PORT||3000)+20;port++){try{const r=await fetch(`http://127.0.0.1:${port}/api/health`,{signal:AbortSignal.timeout(250)});const data=await r.json();if(data.ok&&(!data.app||data.app==='spot-it'))return true;}catch{}}return false;}
function execute(command,args,cwd,extraEnv={}){return new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd,stdio:'inherit',env:{...process.env,...extraEnv}});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error('Update preparation failed. The installed version was not changed.')));});}
export async function updateProject(root,{fetcher=fetch}={}){
 root=resolve(root);if(process.env.SPOT_IT_SKIP_UPDATE==='1'){console.log('Automatic update check is disabled for this run.');return;}if(existsSync(join(root,'.git'))){console.log('Developer checkout: automatic replacement is skipped. Use Git to update this copy.');return;}
 const lockPath=root+'.update.lock';let owned=false;let temp;
 try{
  try{const fd=openSync(lockPath,'wx');writeFileSync(fd,String(process.pid));closeSync(fd);owned=true;}catch(e){if(e.code!=='EEXIST')throw e;const pid=Number(readFileSync(lockPath,'utf8'));let alive=Number.isInteger(pid)&&pid>0;if(alive)try{process.kill(pid,0);}catch{alive=false;}if(alive){console.log('Another update check is running.');return;}unlinkSync(lockPath);const fd=openSync(lockPath,'wx');writeFileSync(fd,String(process.pid));closeSync(fd);owned=true;}
  console.log('Checking GitHub for a new SPOT IT version…');
  const response=await fetcher('https://api.github.com/repos/emilhakobyan0808-design/SPOT_IT/commits/main',{headers:{Accept:'application/vnd.github+json','User-Agent':'SPOT-IT-updater'},signal:AbortSignal.timeout(6000)});if(!response.ok)throw new Error('GitHub update check is unavailable ('+response.status+').');const {sha}=await response.json();if(!/^[a-f0-9]{40}$/.test(sha))throw new Error('Invalid revision received from GitHub.');
  if(json(join(root,'.spot-it/update.json'),{}).sha===sha){console.log('SPOT IT is already up to date.');return;}
  if(await running()){console.log('Close the running SPOT IT server with Ctrl+C, then run this command again to update.');return;}
  temp=mkdtempSync(join(dirname(root),'.spot-it-update-'));const archive=join(temp,'source.zip');console.log('Downloading the new version…');const downloaded=await fetcher(`https://github.com/emilhakobyan0808-design/SPOT_IT/archive/${sha}.zip`,{signal:AbortSignal.timeout(120000)});if(!downloaded.ok)throw new Error('Could not download the new version.');writeFileSync(archive,Buffer.from(await downloaded.arrayBuffer()));const unpacked=join(temp,'unpacked');mkdirSync(unpacked);
  if(process.platform==='win32')await execute('powershell.exe',['-NoProfile','-Command','Expand-Archive -LiteralPath $env:SPOT_IT_UPDATE_ZIP -DestinationPath $env:SPOT_IT_UPDATE_DEST'],dirname(root),{SPOT_IT_UPDATE_ZIP:archive,SPOT_IT_UPDATE_DEST:unpacked});else await execute('unzip',['-q',archive,'-d',unpacked],dirname(root));
  const staged=join(unpacked,'SPOT_IT-'+sha);if(json(join(staged,'package.json'),{}).name!=='spot-it')throw new Error('The downloaded archive is not the expected project.');
  const launcher=await import(pathToFileURL(join(root,'scripts/launch.mjs')).href);const npm=launcher.findNpmCli();console.log('Preparing and checking the new version before replacing the old one…');await execute(process.execPath,[npm,'ci','--no-audit','--no-fund','--cache',join(root,'.spot-it/npm-cache')],staged);await execute(process.execPath,[npm,'run','build'],staged);
  applyPreparedUpdate(root,staged,sha);
  const stateFile=join(root,'.spot-it/state.json');const state=json(stateFile,{});state.dependencies=launcher.digestFiles(root,['package.json','package-lock.json'])+':'+process.platform+':'+process.arch+':'+process.versions.node.split('.')[0];state.build=launcher.digestFiles(root,['src','shared','public','index.html','tsconfig.json','scripts/build.mjs']);writeFileSync(stateFile,JSON.stringify(state,null,2)+'\n');
 }catch(e){console.log('Update unavailable: '+e.message+' Starting the installed version instead.');}
 finally{if(temp)rmSync(temp,{recursive:true,force:true});if(owned&&existsSync(lockPath))unlinkSync(lockPath);}
}
if(process.argv[1]&&realpathSync(process.argv[1])===fileURLToPath(import.meta.url)){const index=process.argv.indexOf('--project');if(index<0||!process.argv[index+1])throw new Error('A project path is required.');await updateProject(process.argv[index+1]);}
