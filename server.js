const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const MAX_BODY = 32 * 1024;
const leadAttempts = new Map();

const MIME = {
  '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'
};

function readJson(name){return JSON.parse(fs.readFileSync(path.join(DATA,name),'utf8'))}
function send(res,status,payload,headers={}){
  const body=typeof payload==='string'?payload:JSON.stringify(payload);
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store',...headers});
  res.end(body);
}
function bodyJson(req){
  return new Promise((resolve,reject)=>{let body='';req.on('data',chunk=>{body+=chunk;if(body.length>MAX_BODY){reject(new Error('Payload too large'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(body||'{}'))}catch{reject(new Error('Invalid JSON'))}});req.on('error',reject)});
}
function validLead(data){
  const clean={name:String(data.name||'').trim(),phone:String(data.phone||'').trim(),interest:String(data.interest||'').trim(),message:String(data.message||'').trim()};
  if(clean.name.length<2||clean.name.length>100)return {error:'Please provide a valid name.'};
  if(!/^\+?[0-9\s()-]{7,24}$/.test(clean.phone))return {error:'Please provide a valid phone number.'};
  if(clean.interest.length<2||clean.interest.length>100)return {error:'Please select what you are interested in.'};
  if(clean.message.length>1000)return {error:'Message must be under 1,000 characters.'};
  return {data:clean};
}
function rateLimited(ip){
  const now=Date.now(),recent=(leadAttempts.get(ip)||[]).filter(time=>now-time<60_000);recent.push(now);leadAttempts.set(ip,recent);return recent.length>5;
}
function saveLead(lead){
  const file=path.join(DATA,'leads.json');let leads=[];try{leads=readJson('leads.json')}catch{}
  const record={id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:'new',...lead};
  leads.push(record);fs.writeFileSync(file,JSON.stringify(leads,null,2)+'\n');return record;
}
function api(req,res,url){
  if(req.method==='GET'&&url.pathname==='/api/health')return send(res,200,{ok:true,service:'polanco-api',time:new Date().toISOString()});
  if(req.method==='GET'&&url.pathname==='/api/vehicles'){
    let cars=readJson('vehicles.json');const type=url.searchParams.get('type');if(type&&type!=='all')cars=cars.filter(car=>car.type===type);
    return send(res,200,{data:cars,count:cars.length});
  }
  if(req.method==='GET'&&url.pathname==='/api/promotions')return send(res,200,{data:readJson('promotions.json')});
  if(req.method==='GET'&&url.pathname==='/api/config')return send(res,200,{whatsapp:process.env.WHATSAPP_NUMBER||'2348020007626',socials:{instagram:process.env.INSTAGRAM_URL||'https://instagram.com',facebook:process.env.FACEBOOK_URL||'https://facebook.com',tiktok:process.env.TIKTOK_URL||'https://tiktok.com',x:process.env.X_URL||'https://x.com',youtube:process.env.YOUTUBE_URL||''}});
  if(req.method==='POST'&&url.pathname==='/api/leads'){
    const ip=req.socket.remoteAddress||'unknown';if(rateLimited(ip))return send(res,429,{error:'Too many requests. Please wait a minute and try again.'},{'Retry-After':'60'});
    return bodyJson(req).then(data=>{const result=validLead(data);if(result.error)return send(res,400,{error:result.error});const lead=saveLead(result.data);send(res,201,{ok:true,id:lead.id,message:'Enquiry received.'})}).catch(error=>send(res,error.message==='Payload too large'?413:400,{error:error.message}));
  }
  return send(res,404,{error:'API endpoint not found.'});
}
function serveStatic(req,res,url){
  const requested=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);
  const file=path.resolve(ROOT,'.'+requested);
  if(!file.startsWith(ROOT+path.sep))return send(res,403,{error:'Forbidden'});
  fs.stat(file,(error,stat)=>{
    if(error||!stat.isFile())return send(res,404,{error:'Page not found'});
    const ext=path.extname(file).toLowerCase();res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600'});fs.createReadStream(file).pipe(res);
  });
}

const server=http.createServer((req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
  try{if(url.pathname.startsWith('/api/'))return api(req,res,url);if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'Method not allowed'});return serveStatic(req,res,url)}catch(error){console.error(error);return send(res,500,{error:'Internal server error'})}
});
server.listen(PORT,HOST,()=>console.log(`Polanco Motors running at http://${HOST}:${PORT}`));
