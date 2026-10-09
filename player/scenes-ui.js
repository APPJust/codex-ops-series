// Scene renderers for the Codex operations series. Each returns SVG markup for the 1728x610 visual
// area as a pure function of (scene, time). Custom geometry goes to B for automated overlap QA.
const C={ink:'#1d1f2a',sub:'#4a4f63',muted:'#8a8fa3',blue:'#3d6ef0',blueL:'#e3eafe',green:'#14875f',greenL:'#dcf2e9',amber:'#b97a10',amberL:'#fcf0d6',red:'#c8423a',redL:'#fbe3e0',card:'#ffffff',line:'#d5d8e2',row:'#eef1f7'};
const clamp=x=>Math.min(1,Math.max(0,x)),lerp=(a,b,u)=>a+(b-a)*u;
const E={out:x=>1-Math.pow(1-clamp(x),3),inout:x=>{x=clamp(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},back:x=>{x=clamp(x);const c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function attrs(a){return Object.entries(a).filter(([,v])=>v!==undefined&&v!==null).map(([k,v])=>k+'="'+esc(v)+'"').join(' ')}
const S={rect:a=>'<rect '+attrs(a)+'/>',text:(x,y,s,a={})=>'<text '+attrs({x,y,...a})+'>'+esc(s)+'</text>',g:(a,inner)=>'<g '+attrs(a)+'>'+inner+'</g>',path:a=>'<path '+attrs(a)+'/>',circle:a=>'<circle '+attrs(a)+'/>',line:a=>'<line '+attrs(a)+'/>'};
function phaser(scene,t){const map={};for(const p of scene.phases)map[p.name]=p;return n=>{const p=map[n];if(!p)return 1;return clamp((t-p.start)/(p.end-p.start))}}
function phaseStart(scene,n){return scene.phases.find(p=>p.name===n).start}
// rough text width (CJK ≈ 1em, Latin ≈ .56em) for layout decisions
const tw=(s,size)=>[...s].reduce((w,ch)=>w+(/[　-鿿＀-￯]/.test(ch)?size:size*.56),0);

// ── icons (line style, 1.0 = 48px box, origin at top-left) ──
function icon(kind,x,y,s=1,color=C.ink,sw=3){
 const k=s*48,st={stroke:color,'stroke-width':sw,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'};
 const P=d=>S.path({d,...st}),T=`translate(${x} ${y}) scale(${s})`;
 const body={
  laptop:P('M9 12 H39 Q41 12 41 14 V31 H7 V14 Q7 12 9 12 Z')+P('M3 35 H45 L43 38 H5 Z'),
  cloud:P('M14 36 H35 A8 8 0 0 0 35 20 A11 11 0 0 0 14 22 A7 7 0 0 0 14 36 Z'),
  globe:S.circle({cx:24,cy:24,r:16,...st})+P('M8 24 H40')+P('M24 8 Q14 24 24 40 Q34 24 24 8'),
  folder:P('M6 14 Q6 11 9 11 H19 L23 15 H39 Q42 15 42 18 V35 Q42 38 39 38 H9 Q6 38 6 35 Z'),
  file:P('M13 7 H29 L37 15 V41 H13 Z')+P('M29 7 V15 H37'),
  server:P('M10 9 H38 V21 H10 Z')+P('M10 27 H38 V39 H10 Z')+S.circle({cx:16,cy:15,r:1.5,fill:color})+S.circle({cx:16,cy:33,r:1.5,fill:color}),
  check:P('M10 25 L20 34 L38 14'),
  cross:P('M13 13 L35 35')+P('M35 13 L13 35'),
  repo:P('M12 8 H36 V40 H12 Z')+P('M18 16 H30')+P('M18 23 H30')+P('M18 30 H26'),
  term:P('M7 10 H41 V38 H7 Z')+P('M13 19 L19 24 L13 29')+P('M23 30 H31')
 }[kind];
 return S.g({transform:T},body);
}
const shadow=(x,y,w,h,rx,op=1)=>S.rect({x:x+0,y:y+10,width:w,height:h,rx,fill:'#1d1f2a',opacity:.07*op})+S.rect({x:x,y:y+3,width:w,height:h,rx,fill:'#1d1f2a',opacity:.05*op});
const bi=(x,y,zh,en,o={})=>S.text(x,y,zh,{'font-size':o.zs||30,'font-weight':o.zw||700,fill:o.zc||C.ink,'text-anchor':o.anchor||'start'})+(en?S.text(x,y+(o.gap||32),en,{'font-size':o.es||22,fill:o.ec||C.muted,'text-anchor':o.anchor||'start','font-weight':500}):'');
function badge(x,y,label,u,fill=C.blue){if(u<=0)return '';const w=tw(label,24)+36,s=lerp(.6,1,E.back(u));return S.g({transform:`translate(${x} ${y}) scale(${s})`,opacity:clamp(u*2)},S.rect({x:-w/2,y:-22,width:w,height:44,rx:22,fill})+S.text(0,9,label,{'text-anchor':'middle','font-size':24,'font-weight':700,fill:'#fff'}))}

// ── Work-location menu rebuilt from the app (Traditional Chinese UI) ──
const LOC=[{icon:'laptop',zh:'這台電腦',en:'This computer'},{icon:'cloud',zh:'雲端',en:'Cloud'},{icon:'globe',zh:'遠端',en:'Remote'}];
function locMenu(sel,selU,clickU){
 // local coords: card 400x262 + chip row below
 let o=shadow(0,0,400,262,24)+S.rect({x:0,y:0,width:400,height:262,rx:24,fill:C.card,stroke:'#e3e5ec','stroke-width':1.5});
 o+=S.text(28,50,'工作位置',{'font-size':25,fill:C.muted,'font-weight':500});
 const rowY=i=>76+i*58,hy=lerp(rowY(sel.from),rowY(sel.to),E.inout(selU));
 o+=S.rect({x:12,y:hy,width:376,height:52,rx:14,fill:C.row});
 if(clickU>0&&clickU<1)o+=S.circle({cx:200,cy:rowY(sel.to)+26,r:lerp(10,150,E.out(clickU)),fill:C.blue,opacity:.16*(1-clickU)});
 LOC.forEach((l,i)=>{o+=icon(l.icon,26,rowY(i)+4,.92,C.ink,2.6)+S.text(84,rowY(i)+36,l.zh,{'font-size':28,fill:C.ink,'font-weight':500})});
 const cy=lerp(rowY(sel.from),rowY(sel.to),E.inout(selU));
 o+=icon('check',336,cy+6,.8,C.ink,3);
 // chip row under the menu (mirrors 選擇專案 / 這台電腦 chips)
 const cur=LOC[selU>.5?sel.to:sel.from];
 o+=S.rect({x:0,y:286,width:400,height:64,rx:20,fill:'#e9ebf1'})+icon('folder',18,294,.8,C.sub,2.6)+S.text(64,328,'選擇專案',{'font-size':24,fill:C.sub});
 o+=S.rect({x:184,y:294,width:204,height:48,rx:16,fill:'#dfe2ea'})+icon(cur.icon,194,296,.8,C.ink,2.6)+S.text(240,328,cur.zh,{'font-size':25,fill:C.ink,'font-weight':600});
 return o;
}

// ── Detailed card bodies (card-local coordinates, width w, height h) ──
function bodyLocal(w,h,p,wt=0){
 let o='';const sx=48,sy=104,sw=w-96,sh=300,wOut=clamp(wt*7),wu=E.out(clamp(wt*7-1));
 // Worktree: a separate checkout appears behind the screen (same repo, own copy)
 if(wu>0)o+=S.rect({x:sx+16*wu,y:sy-16*wu,width:sw,height:sh,rx:16,fill:C.greenL,stroke:C.green,'stroke-width':2.5,'stroke-dasharray':'9 7',opacity:wu});
 o+=S.rect({x:sx,y:sy,width:sw,height:sh,rx:16,fill:'#f7f8fb',stroke:C.ink,'stroke-width':3});
 o+=S.path({d:`M${sx-30} ${sy+sh+8} H${sx+sw+30} L${sx+sw+12} ${sy+sh+30} H${sx-12} Z`,fill:'#e6e8ef',stroke:C.ink,'stroke-width':3,'stroke-linejoin':'round'});
 o+=icon('folder',sx+24,sy+18,.85,C.blue,2.8)+S.text(sx+76,sy+54,'我的專案',{'font-size':27,'font-weight':700,fill:C.ink})+S.text(sx+196,sy+54,'my-project',{'font-size':22,fill:C.muted});
 const files=['index.html','login.js','styles.css'],fy=i=>sy+86+i*64;
 const edit=E.out(clamp((p-.42)/.2)),agent=clamp((p-.12)/.3);
 files.forEach((f,i)=>{const hot=i===1&&edit>0;
  o+=S.rect({x:sx+40,y:fy(i),width:sw-80,height:52,rx:12,fill:hot?C.amberL:'#fff',stroke:hot?C.amber:C.line,'stroke-width':hot?2.5:1.5});
  o+=icon('file',sx+52,fy(i)+4,.92,C.sub,2.4)+S.text(sx+104,fy(i)+35,f,{'font-size':25,fill:C.ink,'font-family':'Consolas,"Lesson Latin",monospace'});
 });
 if(edit>0&&wOut<1)o+=S.g({opacity:edit*(1-wOut)},S.rect({x:sx+250,y:fy(1)+9,width:132,height:34,rx:17,fill:C.amber})+S.text(sx+316,fy(1)+33,'✎ 已修改',{'font-size':21,'font-weight':700,fill:'#fff','text-anchor':'middle'}));
 if(wu>0)o+=S.g({opacity:wu},S.rect({x:sx+250,y:fy(1)+9,width:168,height:34,rx:17,fill:C.green})+S.text(sx+334,fy(1)+33,'✎ 在副本修改',{'font-size':21,'font-weight':700,fill:'#fff','text-anchor':'middle'})
  +S.rect({x:sx+sw-236,y:sy+20,width:216,height:42,rx:21,fill:C.green})+S.text(sx+sw-128,sy+49,'⑂ Worktree 副本',{'font-size':22,'font-weight':700,fill:'#fff','text-anchor':'middle'}));
 // Codex agent travels from the corner to login.js
 if(agent>0){const ax=lerp(sx+sw-70,sx+sw-60,E.inout(agent)),ay=lerp(sy+40,fy(1)+26,E.inout(agent));o+=badge(ax,ay,'Codex',clamp(agent*3))}
 if(wOut<1)o+=S.g({opacity:1-wOut},bi(w/2,h-58,'直接修改你資料夾裡的檔案','Edits the files in your folder, in place',{anchor:'middle',zs:28}));
 if(wu>0)o+=S.g({opacity:wu},bi(w/2,h-58,'Worktree：在獨立副本修改，不干擾手上的檔案','Worktree edits a separate copy of the repository',{anchor:'middle',zs:27,zc:C.green}));
 return o;
}
function bodyCloud(w,h,p,q){
 // q (episode timing): per-sentence progress {off,bar,env}; without q the sample's single-phase timing applies
 const offU=q?clamp(q.off*3):clamp((p-.45)/.15),barU=q?E.out(clamp(q.bar*2.5)):E.out(clamp((p-.58)/.22)),envU=q?q.env:0;
 let o='';const cx=48,cy=196,cw=w-96,ch=212;
 // published environment chip
 o+=S.rect({x:w/2-190,y:96,width:380,height:58,rx:29,fill:C.blueL})+icon('repo',w/2-176,101,.8,C.blue,2.6)+S.text(w/2-126,134,'已發布環境',{'font-size':25,'font-weight':700,fill:C.blue})+S.text(w/2+10,134,'Published env',{'font-size':20,fill:C.blue});
 o+=S.rect({x:cx,y:cy,width:cw,height:ch,rx:18,fill:'#f7f9ff',stroke:C.blue,'stroke-width':2.5,'stroke-dasharray':'10 8'});
 o+=S.text(cx+22,cy+38,'獨立容器',{'font-size':24,'font-weight':700,fill:C.blue})+S.text(cx+130,cy+38,'Isolated container',{'font-size':20,fill:C.blue});
 // three file tiles copy down from the environment chip
 for(let i=0;i<3;i++){const u=E.out(clamp((p-.1-i*.08)/.28));if(u<=0)continue;const tx=cx+40+i*((cw-80-150)/2),ty=cy+70;
  const x=lerp(w/2-75,tx,u),y=lerp(108,ty,u);o+=S.g({opacity:clamp(u*2)},S.rect({x,y,width:150,height:56,rx:12,fill:'#fff',stroke:C.line,'stroke-width':1.5})+icon('file',x+8,y+5,.9,C.sub,2.4)+S.text(x+58,y+36,['index','login','styles'][i],{'font-size':21,fill:C.ink,'font-family':'Consolas,"Lesson Latin",monospace'}))}
 const copyLbl=clamp((p-.3)/.15);if(copyLbl>0)o+=S.text(w/2+86,cy-14,'複製一份 · own copy',{'font-size':20,fill:C.sub,opacity:copyLbl});
 const ag=clamp((p-.42)/.2);if(ag>0)o+=badge(w/2,cy+168,'Codex 在這裡工作',ag);
 const off=offU;if(off>0&&cw>500)o+=S.g({opacity:off},S.rect({x:cx+cw-196,y:cy+14,width:180,height:34,rx:17,fill:C.greenL})+S.text(cx+cw-106,cy+38,'關機也能繼續',{'font-size':20,'font-weight':700,fill:C.green,'text-anchor':'middle'}));
 // barrier: your laptop cannot be reached from the container
 const bar=barU;
 if(envU>0&&envU<1)o+=S.rect({x:w/2-198,y:88,width:396,height:74,rx:37,fill:'none',stroke:C.amber,'stroke-width':4,opacity:.5+.5*Math.sin(envU*18)**2});
 if(bar>0){const y=cy+ch+46;o+=S.g({opacity:bar},icon('laptop',cx+8,y-30,1,C.sub,2.6)+S.path({d:`M${cx+72} ${y-6} H${cx+72+(cw-150)*bar}`,stroke:C.red,'stroke-width':3,'stroke-dasharray':'8 7'})+S.g({transform:`translate(${cx+cw/2-24} ${y-30})`},S.circle({cx:24,cy:24,r:22,fill:C.redL})+icon('cross',8,8,.66,C.red,4)))}
 o+=bi(w/2,h-58,'拿不到本機檔案、登入狀態與 VPN','No local files, sign-ins, or VPN',{anchor:'middle',zs:28,zc:bar>0?C.red:C.ink});
 return o;
}
function bodyRemote(w,h,p,q){
 // q (episode timing): per-sentence progress {link,cmd,req}
 let o='';const ly=170;const pl=q?clamp(.06+q.link*.5):p,pc=q?q.cmd:null;
 o+=icon('laptop',56,ly,2.3,C.sub,1.5)+S.text(56+55,ly+148,'你的電腦',{'font-size':24,fill:C.sub,'text-anchor':'middle'});
 const hx=w-56-110;o+=icon('server',hx,ly-14,2.3,C.ink,1.5)+S.text(hx+55,ly+148,'遠端主機',{'font-size':24,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(hx+55,ly+176,'Remote host',{'font-size':20,fill:C.muted,'text-anchor':'middle'});
 const link=E.inout(clamp((pl-.06)/.3)),x1=56+120,x2=hx-12,y=ly+56;
 if(link>0){o+=S.path({d:`M${x1} ${y} H${lerp(x1,x2,link)}`,stroke:C.blue,'stroke-width':4,'stroke-linecap':'round'});o+=S.rect({x:(x1+x2)/2-44,y:y-50,width:88,height:36,rx:18,fill:C.blueL,opacity:link})+S.text((x1+x2)/2,y-24,'SSH',{'font-size':22,'font-weight':700,fill:C.blue,'text-anchor':'middle',opacity:link})}
 // packets travel out (prompt) and back (results)
 for(let k=0;k<3;k++){const u=q?(pc-k*.12)/.35:(p-.36-k*.07)/.22;if(u>0&&u<1){const back=k===2;o+=S.circle({cx:back?lerp(x2,x1,E.inout(u)):lerp(x1,x2,E.inout(u)),cy:y,r:9,fill:back?C.green:C.blue})}}
 // terminal on the host
 const tx=48,ty=372,tW=w-96;const tU=q?clamp(pc*1.4):clamp((p-.4)/.4);
 o+=S.rect({x:tx,y:ty,width:tW,height:104,rx:14,fill:'#20232f'});
 const lines=[['$ npm test','#c9d6ff'],['✓ 12 passed（在遠端主機執行）','#7fe0b4']];
 lines.forEach(([s,c],i)=>{const n=Math.floor([...s].length*clamp(tU*2-i));if(n>0)o+=S.text(tx+24,ty+40+i*40,[...s].slice(0,n).join(''),{'font-size':24,fill:c,'font-family':'Consolas,"Lesson Latin","Lesson TC",monospace'})});
 if(q&&q.req>0)o+=up(q.req*2,chip(hx-150,ly-64,'需安裝並登入 Codex',{size:21,fill:C.amberL,color:C.amber}),10);
 o+=bi(w/2,h-58,'在另一台主機的專案裡執行指令','Runs commands on the other host',{anchor:'middle',zs:28});
 return o;
}
function compact(w,h,l,dim){
 return S.g({opacity:dim?.62:1},icon(l.icon,w/2-40,120,1.66,C.sub,1.8)+bi(w/2,262,l.zh,l.en,{anchor:'middle',zs:34,es:22}));
}

const SCENES={};
SCENES.title=(sc)=>S.text(864,300,sc.screen||'',{'text-anchor':'middle','font-size':40,fill:C.ink});

// ── Principle core shot: the three work locations ──
SCENES.location=(sc,t,B)=>{
 const P=phaser(sc,t),tl=phaseStart(sc,'local'),tc=phaseStart(sc,'cloud'),tr=phaseStart(sc,'remote');
 const cam=E.inout(clamp((t-tl+.15)/.95));                 // menu → left column, cards reveal
 const k=i=>[tl,tc,tr][i],seg=t<tc?0:t<tr?1:2;
 const trans=i=>E.inout(clamp((t-k(i))/.6));               // focus shift into card i
 const act=[0,0,0];
 if(seg===0)act[0]=1;else{act[seg]=trans(seg);act[seg-1]=1-trans(seg)}
 const sel={from:seg===0?0:seg-1,to:seg},selU=seg===0?1:clamp((t-k(seg)+.35)/.35),clickU=clamp((t-k(seg)+.1)/.5);
 let o='';
 // menu camera move: large & centred → docked on the left
 const mx=lerp(664,8,cam),my=lerp(40,78,cam),ms=lerp(1.32,1,cam);
 B.push({id:'loc-menu',x:mx,y:my,width:400*ms,height:350*ms,overlapGroup:cam<1?'cam':undefined});
 if(cam>.98)o+=S.text(208,496,'選單位置：輸入框上方',{'font-size':22,fill:C.muted,'text-anchor':'middle'})+S.text(208,526,'Work in · above the composer',{'font-size':19,fill:C.muted,'text-anchor':'middle'});
 // cards: widths redistribute with focus (sum constant)
 const X0=470,W=1258,G=22,wA=660,wI=(W-wA-2*G)/2,H=574,Y=18;
 let x=X0;const reveal=clamp((cam-.6)/.4);
 for(let i=0;i<3;i++){
  const w=wI+(wA-wI)*act[i],a=act[i],l=LOC[i],u=E.out(clamp(reveal*1.6-i*.3));
  if(u>0){
   B.push({id:'card-'+i,x,y:Y,width:w,height:H,overlapGroup:cam<1?'cam':undefined});
   let inner=shadow(0,0,w,H,26,a)+S.rect({x:0,y:0,width:w,height:H,rx:26,fill:C.card,stroke:a>.5?C.blue:C.line,'stroke-width':a>.5?3:1.5});
   // header
   const hd=clamp((a-.55)/.3),cd=clamp((.46-a)/.26);
   if(hd>0)inner+=S.g({opacity:hd},icon(l.icon,30,24,1,C.blue,3)+S.text(92,62,l.zh,{'font-size':34,'font-weight':800,fill:C.ink})+S.text(92+tw(l.zh,34)+16,62,l.en,{'font-size':23,fill:C.muted,'font-weight':600}));
   if(cd>0)inner+=S.g({opacity:cd},compact(w,H,l,i!==seg&&i<seg));
   if(hd>0){const pp=i===0?P('local'):i===1?P('cloud'):P('remote');
    const hasWt=sc.phases.some(q=>q.name==='worktree');
    const hasCq=sc.phases.some(q=>q.name==='cloudoff'),cq=hasCq?{off:P('cloudoff'),bar:P('cloudx'),env:P('cloudenv')}:undefined;
    inner+=S.g({opacity:hd,'clip-path':`inset(0 round 26px)`},i===0?bodyLocal(w,H,pp,hasWt?P('worktree'):0):i===1?bodyCloud(w,H,pp,cq):bodyRemote(w,H,pp,sc.phases.some(q=>q.name==='remotecmd')?{link:P('remote'),cmd:P('remotecmd'),req:P('remotereq')}:undefined))}
   o+=S.g({transform:`translate(${x} ${Y+(1-u)*30})`,opacity:u},inner);
  }
  x+=w+G;
 }
 // menu drawn last so the camera move never slides it under a card
 o+=S.g({transform:`translate(${mx} ${my}) scale(${ms})`},locMenu(sel,selU,t>=tl-.2?clickU:0));
 return o;
};
