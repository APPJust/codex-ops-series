// Episode 1 scene renderers (origin, modes, perms, matrix, demo, outlook). Same contract as scenes-ui.js:
// pure functions of (scene, t) returning SVG for the 1728x610 visual; boxes pushed to B for QA.
const up=(u,inner,dy=24)=>u<=0?'':S.g({transform:`translate(0 ${(1-E.out(u))*dy})`,opacity:clamp(u*1.6)},inner);
const at=(t,t0,d=.6)=>clamp((t-t0)/d);
function ps(sc,n){const p=sc.phases.find(q=>q.name===n);return p?p.start:Infinity}
function icon2(kind,x,y,s=1,color=C.ink,sw=3){
 const st={stroke:color,'stroke-width':sw,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},P=d=>S.path({d,...st});
 const body={
  bubble:P('M8 10 H40 Q42 10 42 12 V30 Q42 32 40 32 H20 L12 39 V32 H8 Q6 32 6 30 V12 Q6 10 8 10 Z'),
  person:S.circle({cx:24,cy:16,r:7,...st})+P('M10 40 Q10 27 24 27 Q38 27 38 40'),
  robot:P('M12 16 H36 V38 H12 Z')+P('M24 9 V16')+S.circle({cx:24,cy:8,r:2,fill:color})+S.circle({cx:19,cy:25,r:2.5,fill:color})+S.circle({cx:29,cy:25,r:2.5,fill:color})+P('M19 32 H29'),
  gear:S.circle({cx:24,cy:24,r:6,...st})+P('M24 7 V13 M24 35 V41 M7 24 H13 M35 24 H41 M12 12 L16 16 M32 32 L36 36 M36 12 L32 16 M12 36 L16 32'),
  shield:P('M24 6 L39 12 V23 Q39 35 24 42 Q9 35 9 23 V12 Z')+P('M18 22 L22 26 L30 18'),
  doc:P('M13 7 H29 L37 15 V41 H13 Z')+P('M18 22 H32 M18 28 H32 M18 34 H27'),
  slides:P('M7 10 H41 V34 H7 Z')+P('M24 34 V40 M17 40 H31')+P('M14 26 L20 20 L25 24 L33 16'),
  sheet:P('M8 8 H40 V40 H8 Z')+P('M8 18 H40 M8 29 H40 M20 8 V40 M30 8 V40'),
  web:P('M6 10 H42 V38 H6 Z')+P('M6 17 H42')+S.circle({cx:11,cy:13.5,r:1.2,fill:color})+S.circle({cx:15,cy:13.5,r:1.2,fill:color}),
  code:P('M17 14 L8 24 L17 34')+P('M31 14 L40 24 L31 34')+P('M27 10 L21 38'),
  gauge:P('M8 34 A16 16 0 1 1 40 34')+P('M24 30 L32 18'),
  phone:P('M15 5 H33 V43 H15 Z')+P('M21 38 H27'),
  warn:P('M24 7 L43 40 H5 Z')+P('M24 19 V29')+S.circle({cx:24,cy:34,r:1.6,fill:color}),
  check:P('M10 25 L20 34 L38 14')
 }[kind];
 return S.g({transform:`translate(${x} ${y}) scale(${s})`},body);
}
const anyIcon=(k,x,y,s,c,w)=>['laptop','cloud','globe','folder','file','server','cross','repo','term'].includes(k)?icon(k,x,y,s,c,w):icon2(k,x,y,s,c,w);
function chip(x,y,label,o={}){const size=o.size||24,w=o.w||tw(label,size)+(o.icon?64:36),h=o.h||size*1.9;
 return S.rect({x,y,width:w,height:h,rx:h/2,fill:o.fill||C.blueL,stroke:o.stroke,'stroke-width':o.stroke?2:undefined})+(o.icon?anyIcon(o.icon,x+12,y+(h-size*1.4)/2,size*1.4/48,o.color||C.blue,2.6):'')+S.text(x+(o.icon?52:18),y+h/2+size*.36,label,{'font-size':size,'font-weight':700,fill:o.color||C.blue})}
function panel(B,id,x,y,w,h,o={}){B.push({id,x,y,width:w,height:h,...(o.group?{overlapGroup:o.group}:{})});return shadow(x,y,w,h,o.rx??24,o.sh??1)+S.rect({x,y,width:w,height:h,rx:o.rx??24,fill:o.fill||C.card,stroke:o.stroke||C.line,'stroke-width':o.sw||1.5})}

// ── 1 Origin: home screen → timeline 2025-05-16 → 2026-07-09 merge into one app ──
SCENES.origin=(sc,t,B)=>{
 const t25=ps(sc,'d2025'),t26=ps(sc,'d2026'),tm=ps(sc,'merge');let o='';
 // intro: rebuilt home screen glyph and prompt, fading out as the timeline starts
 const outI=at(t,t25-.1,.6);
 if(outI<1){const u=at(t,sc.start,.7);o+=S.g({opacity:clamp(u*1.5)*(1-outI),transform:`translate(0 ${-60*E.inout(outI)})`},
  S.g({transform:'translate(804 70) scale(2.5)'},S.path({d:'M14 36 H35 A8 8 0 0 0 35 20 A11 11 0 0 0 14 22 A7 7 0 0 0 14 36 Z',fill:'none',stroke:'#9aa0b3','stroke-width':1.6})+S.path({d:'M19 24 L23 28 L19 32',fill:'none',stroke:'#9aa0b3','stroke-width':1.6})+S.path({d:'M26 32 H31',stroke:'#9aa0b3','stroke-width':1.6}))
  +S.text(864,330,'想讓我們打造什麼？',{'font-size':54,'font-weight':700,fill:C.ink,'text-anchor':'middle'})
  +S.text(864,380,'ChatGPT 桌面 App · Codex',{'font-size':24,fill:C.muted,'text-anchor':'middle'}))}
 // timeline
 const q=E.inout(at(t,t25,1.1)),ly=440,x0=120,x1=1608;
 if(q>0){o+=S.path({d:`M${x0} ${ly} H${lerp(x0,x1,q)}`,stroke:C.line,'stroke-width':6,'stroke-linecap':'round'});
  if(q>.98)o+=S.path({d:`M${x1-14} ${ly-12} L${x1+4} ${ly} L${x1-14} ${ly+12}`,stroke:C.line,'stroke-width':6,fill:'none','stroke-linecap':'round'})}
 const mark=(x,u,date,zh,en,color)=>up(u,S.circle({cx:x,cy:ly,r:16,fill:'#fff',stroke:color,'stroke-width':6})+S.text(x,ly-36,date,{'font-size':46,'font-weight':800,fill:color,'text-anchor':'middle'})
  +S.text(x,ly+66,zh,{'font-size':29,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(x,ly+102,en,{'font-size':22,fill:C.muted,'text-anchor':'middle'}));
 const m1=at(t,t25+.5,.6);if(m1>0)B.push({id:'mark-2025',x:430-280,y:ly-80,width:560,height:190});
 o+=mark(430,m1,'2025-05-16','OpenAI 發表雲端軟體工程代理 Codex','Codex, a cloud software engineering agent',C.blue);
 // 2025 illustration: cloud agent card
 const c1=at(t,t25+.8,.6);if(c1>0){B.push({id:'card-2025',x:290,y:150,width:280,height:180});
  o+=up(c1,panel([],'',290,150,280,180,{stroke:C.blue,sw:2.5})+icon('cloud',310,164,1.2,C.blue,2.6)+S.text(378,206,'Codex',{'font-size':32,'font-weight':800,fill:C.ink})
   +S.rect({x:314,y:236,width:232,height:72,rx:12,fill:'#20232f'})+S.text(330,266,'$ 修改 → 測試',{'font-size':22,fill:'#c9d6ff','font-family':'Consolas,"Lesson Latin","Lesson TC",monospace'})+S.text(330,296,'✓ 交給你審查',{'font-size':22,fill:'#7fe0b4','font-family':'Consolas,"Lesson Latin","Lesson TC",monospace'}))}
 const m2=at(t,t26,.6);if(m2>0)B.push({id:'mark-2026',x:1240-300,y:ly-80,width:600,height:190});
 o+=mark(1240,m2,'2026-07-09','Codex 併入 ChatGPT 桌面 App','Codex joins the ChatGPT desktop app',C.green);
 // two app tiles slide together and fuse into one window with three mode tabs
 const tiles=at(t,t26+.3,.6),fuse=E.inout(at(t,tm,1.0));
 if(tiles>0){B.push({id:'merge',x:960,y:110,width:560,height:240});
  if(fuse<1){const d=lerp(170,0,fuse),op=clamp(tiles*1.6)*(1-fuse);
   for(const [k,name,ic] of [[-1,'ChatGPT','bubble'],[1,'Codex','code']]){const cx=1240+k*d-100;
    o+=S.g({opacity:op,transform:`translate(0 ${(1-E.out(tiles))*20})`},panel([],'',cx,140,200,180,{rx:28})+anyIcon(ic,cx+64,162,1.5,C.ink,2.2)+S.text(cx+100,290,name,{'font-size':28,'font-weight':700,fill:C.ink,'text-anchor':'middle'}))}}
  if(fuse>0){const w=lerp(200,540,fuse),x=1240-w/2;let win=panel([],'',x,120,w,220,{rx:26,stroke:C.green,sw:3});
   if(fuse>.25){const u=clamp((fuse-.25)/.45),tabs=['Chat','Work','Codex'],seg=Math.min(2,Math.floor(at(t,tm+.9,2.4)*3));
    win+=S.g({opacity:u},S.rect({x:x+40,y:150,width:w-80,height:64,rx:32,fill:'#eceef3'})+tabs.map((s,i)=>{const sx=x+40+i*(w-80)/3;return (i===seg?S.rect({x:sx+6,y:156,width:(w-80)/3-12,height:52,rx:26,fill:'#fff',stroke:C.line}):'')+S.text(sx+(w-80)/6,192,s,{'font-size':27,'font-weight':700,fill:i===seg?C.ink:C.sub,'text-anchor':'middle'})}).join('')
     +S.text(1240,276,'一個 App・三種模式',{'font-size':28,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(1240,310,'One app, three modes',{'font-size':21,fill:C.muted,'text-anchor':'middle'}))}
   o+=win}}
 return o;
};

// ── 2 Modes: Chat / Work / Codex columns; Work + Codex share usage ──
SCENES.modes=(sc,t,B)=>{
 const T={chat:ps(sc,'chat'),work:ps(sc,'work'),codex:ps(sc,'codex'),usage:ps(sc,'usage')};
 const cur=t>=T.usage?3:t>=T.codex?2:t>=T.work?1:0;let o='';
 // header rebuilt from the app: top-left product menu (ChatGPT / Codex) + Chat|Work toggle on the ChatGPT page
 const sw=Math.min(2,cur),toCodex=E.inout(at(t,T.codex-.3,.5));B.push({id:'switch',x:460,y:0,width:808,height:64});
 o+=S.rect({x:460,y:0,width:250,height:64,rx:18,fill:'#fff',stroke:C.line,'stroke-width':1.5})+S.text(484,42,toCodex>.5?'Codex':'ChatGPT',{'font-size':28,'font-weight':800,fill:C.ink})+S.path({d:'M672 26 L682 36 L692 26',stroke:C.sub,'stroke-width':3,fill:'none'});
 o+=S.text(585,92,'左上角選單 · top-left menu',{'font-size':18,fill:C.muted,'text-anchor':'middle'});
 if(toCodex<1){const segX=i=>774+6+i*196,ix=lerp(segX(0),segX(1),E.inout(at(t,T.work,.45)));
  o+=S.g({opacity:1-toCodex},S.rect({x:774,y:0,width:404,height:64,rx:32,fill:'#e7e9ef'})+S.rect({x:ix,y:6,width:196,height:52,rx:26,fill:'#fff',stroke:C.line})
   +['Chat','Work'].map((s,i)=>S.text(segX(i)+98,42,s,{'font-size':27,'font-weight':700,fill:i===Math.min(1,sw)?C.ink:C.sub,'text-anchor':'middle'})).join('')+S.text(976,92,'頁面上方切換 · toggle at the top',{'font-size':18,fill:C.muted,'text-anchor':'middle'}))}
 if(toCodex>0)o+=S.g({opacity:toCodex},chip(774,8,'Codex 自成一個畫面，歷史紀錄分開',{size:22,fill:C.blueL,color:C.blue}));
 // navigation explainer (before the columns): where each switch lives
 const half=ps(sc,'nav2');
 if(t<T.chat){const ring=t<half?[452,-8,266,80]:[766,-8,420,80];o+=S.rect({x:ring[0],y:ring[1],width:ring[2],height:ring[3],rx:24,fill:'none',stroke:C.amber,'stroke-width':4,opacity:.5+.5*Math.sin(t*5)**2})}
 const nv=1-at(t,T.chat-.3,.5);
 if(nv>0){B.push({id:'nav-a',x:300,y:150,width:520,height:330,overlapGroup:'xfade'});B.push({id:'nav-b',x:908,y:150,width:520,height:330,overlapGroup:'xfade'});
  const a=at(t,sc.start+.3,.6),b=at(t,half,.6),pick=t<half?0:1;
  let g=up(a,panel([],'',300,150,520,330,{rx:26,stroke:t<half?C.amber:C.line,sw:t<half?3:1.5})+S.text(330,204,'左上角選單',{'font-size':32,'font-weight':800,fill:C.ink})+S.text(330,236,'Top-left menu',{'font-size':21,fill:C.muted})
   +['ChatGPT','Codex'].map((s,i)=>S.rect({x:330,y:270+i*80,width:460,height:66,rx:16,fill:i===0&&t<half?C.row:'#fff',stroke:C.line})+S.text(360,313+i*80,s,{'font-size':30,'font-weight':700,fill:C.ink})+S.text(770,313+i*80,i===0?'→ Chat／Work':'→ 寫程式',{'font-size':22,fill:C.sub,'text-anchor':'end'})).join(''));
  g+=up(b,panel([],'',908,150,520,330,{rx:26,stroke:pick?C.amber:C.line,sw:pick?3:1.5})+S.text(938,204,'ChatGPT 頁面上方',{'font-size':32,'font-weight':800,fill:C.ink})+S.text(938,236,'Toggle at the top of the ChatGPT page',{'font-size':21,fill:C.muted})
   +S.rect({x:938,y:296,width:460,height:84,rx:42,fill:'#e7e9ef'})+S.rect({x:946+226*E.inout(at(t,half+1,.5)),y:304,width:218,height:68,rx:34,fill:'#fff',stroke:C.line})+S.text(1056,350,'Chat',{'font-size':30,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(1282,350,'Work',{'font-size':30,'font-weight':700,fill:C.ink,'text-anchor':'middle'}));
  if(b>0)g+=arrow2(828,305,898,305,b,C.line);
  o+=S.g({opacity:nv},g)}
 const cols=[
  {k:'chat',x:60,ic:'bubble',name:'Chat',zh:'一問一答',en:'Back-and-forth conversation',out:['產出：對話中的回答','Output: answers in chat']},
  {k:'work',x:604,ic:'doc',name:'Work',zh:'把大任務做到完',en:'Carries a task to a finished result',out:['產出：可檢查的成品','Output: reviewable deliverables']},
  {k:'codex',x:1148,ic:'code',name:'Codex',zh:'專門處理軟體開發',en:'Built for software development',out:['產出：程式碼變更與測試','Output: code changes and tests']}];
 const Y=110,W=520,H=420;
 cols.forEach((c,i)=>{const u=at(t,T[c.k],.6);if(u<=0)return;const active=i===cur,dim=cur===3&&i===0?.5:1,p=at(t,T[c.k]+.4,2.6);
  B.push({id:'col-'+c.k,x:c.x,y:Y,width:W,height:H,overlapGroup:t<T.chat+.4?'xfade':undefined});
  let g=panel([],'',c.x,Y,W,H,{rx:26,stroke:active?C.blue:C.line,sw:active?3:1.5})+icon2(c.ic,c.x+28,Y+24,1.1,C.blue,2.8)+S.text(c.x+94,Y+66,c.name,{'font-size':38,'font-weight':800,fill:C.ink})
   +S.text(c.x+30,Y+118,c.zh,{'font-size':28,'font-weight':700,fill:C.ink})+S.text(c.x+30,Y+150,c.en,{'font-size':21,fill:C.muted});
  const bx=c.x+30,by=Y+178,bw=W-60;
  if(c.k==='chat'){
   g+=up(clamp(p*4),S.rect({x:bx+bw-300,y:by,width:300,height:50,rx:20,fill:C.blueL})+S.text(bx+bw-284,by+33,'這個概念是什麼意思？',{'font-size':23,fill:C.ink}));
   g+=up(clamp(p*4-1),S.rect({x:bx,y:by+64,width:340,height:50,rx:20,fill:'#f0f1f5'})+S.text(bx+16,by+97,'簡單說，就是……',{'font-size':23,fill:C.ink}));
   ['發問','搜尋','腦力激盪','草稿'].forEach((s,j)=>{const cw=tw(s,22)+30,cx=bx+[0,82,164,300][j];g+=up(clamp(p*4-1.6-j*.25),chip(cx,by+128,s,{size:22,w:cw,fill:'#eef1f7',color:C.sub}))});
  }else if(c.k==='work'){
   ['規劃步驟','收集資料','製作成品'].forEach((s,j)=>{g+=up(clamp(p*5-j*.6),icon2('check',bx,by-6+j*31,.6,C.green,4)+S.text(bx+40,by+17+j*31,s,{'font-size':22,fill:C.ink}))});
   [['doc','文件'],['slides','簡報'],['sheet','試算表'],['web','網站']].forEach(([ic,s],j)=>{const tx=bx+j*116;g+=up(clamp(p*5-2-j*.4),S.rect({x:tx,y:by+92,width:104,height:76,rx:14,fill:'#f7f8fb',stroke:C.line})+icon2(ic,tx+34,by+95,.75,C.blue,2.8)+S.text(tx+52,by+158,s,{'font-size':20,fill:C.ink,'text-anchor':'middle'}))});
  }else{
   g+=up(clamp(p*4),S.rect({x:bx,y:by,width:bw,height:110,rx:14,fill:'#20232f'})+S.text(bx+18,by+36,'- if (email)',{'font-size':22,fill:'#ff9b92','font-family':'Consolas,monospace'})+S.text(bx+18,by+68,'+ if (isValid(email))',{'font-size':22,fill:'#7fe0b4','font-family':'Consolas,monospace'})+S.text(bx+18,by+98,'$ npm test  ✓ passed',{'font-size':22,fill:'#c9d6ff','font-family':'Consolas,monospace'}));
   ['寫程式','跑指令','審查','Git'].forEach((s,j)=>{const cw=tw(s,22)+30,cx=bx+[0,104,208,290][j];g+=up(clamp(p*4-1.5-j*.25),chip(cx,by+128,s,{size:22,w:cw,fill:'#eef1f7',color:C.sub}))});
  }
  g+=S.path({d:`M${c.x+24} ${Y+H-70} H${c.x+W-24}`,stroke:C.line,'stroke-width':1.5})+S.text(c.x+30,Y+H-38,c.out[0],{'font-size':24,'font-weight':700,fill:C.ink})+S.text(c.x+30,Y+H-12,c.out[1],{'font-size':19,fill:C.muted});
  o+=S.g({opacity:dim},up(u,g));
 });
 // shared usage bracket under Work and Codex
 const us=at(t,T.usage,.7);
 if(us>0){B.push({id:'usage',x:604,y:536,width:1064,height:70});
  o+=S.g({opacity:clamp(us*1.5)},S.path({d:`M620 540 V556 H${lerp(1136,1652,E.out(us))}`,stroke:C.blue,'stroke-width':4,fill:'none'})+(us>.9?S.path({d:'M1652 540 V556',stroke:C.blue,'stroke-width':4}):'')
   +S.rect({x:1006,y:540,width:260,height:62,rx:31,fill:C.blue})+icon2('gauge',1020,548,.95,'#fff',3)+S.text(1074,580,'共用同一份用量',{'font-size':23,'font-weight':700,fill:'#fff'})+S.text(1074,598,'',{}))
   +S.text(1290,592,'Shared usage allowance',{'font-size':21,fill:C.blue,opacity:clamp(us*1.5)});}
 return o;
};

// ── 4 Permissions: menu + sandbox boundary; who approves when Codex crosses it ──
const PERMS=[{zh:'要求核准',en:'Ask for approval',ic:'person'},{zh:'代我核准',en:'Approve for me',ic:'shield'},{zh:'完整存取',en:'Full access',ic:'warn'},{zh:'自訂',en:'Custom (config.toml)',ic:'gear'}];
SCENES.perms=(sc,t,B)=>{
 const T={sandbox:ps(sc,'sandbox'),ask:ps(sc,'ask'),auto:ps(sc,'auto'),full:ps(sc,'full'),custom:ps(sc,'custom')};
 const sel=t>=T.custom?3:t>=T.full?2:t>=T.auto?1:t>=T.ask?0:-1;let o='';
 const cam=E.inout(at(t,T.sandbox-.15,.95));
 // menu: centred then docked on the left
 const mx=lerp(664,8,cam),my=lerp(30,40,cam),ms=lerp(1.25,1,cam);
 let m=shadow(0,0,400,330,24)+S.rect({x:0,y:0,width:400,height:330,rx:24,fill:C.card,stroke:'#e3e5ec','stroke-width':1.5})+S.text(28,48,'權限',{'font-size':25,fill:C.muted});
 const rowY=i=>68+i*64,prev=Math.max(0,sel-1),selStart=[T.ask,T.auto,T.full,T.custom][Math.max(0,sel)],hy=sel<0?null:lerp(rowY(sel===0?0:prev),rowY(sel),sel===0?1:E.inout(at(t,selStart-.3,.35)));
 if(hy!==null)m+=S.rect({x:12,y:hy,width:376,height:58,rx:14,fill:C.row});
const mp=at(t,sc.start+.3,Math.max(1,T.sandbox-sc.start-.6)),sweep=sel<0&&mp>.25&&mp<.95?Math.min(3,Math.floor((mp-.25)/.7*4)):-1;
 if(sweep>=0)m+=S.rect({x:12,y:rowY(sweep),width:376,height:58,rx:14,fill:'#f3f5fa'});
 PERMS.forEach((p,i)=>{m+=icon2(p.ic,24,rowY(i)+7,.9,i===2?C.red:C.ink,2.6)+S.text(80,rowY(i)+30,p.zh,{'font-size':27,fill:C.ink,'font-weight':600})+S.text(80,rowY(i)+52,p.en,{'font-size':18,fill:C.muted})});
 if(hy!==null)m+=icon2('check',338,hy+10,.75,C.ink,3);
 const cur=PERMS[Math.max(0,sel)];
 m+=S.rect({x:0,y:350,width:250,height:56,rx:20,fill:'#e9ebf1'})+icon2(sel<0?'shield':cur.ic,14,356,.85,C.sub,2.6)+S.text(64,388,sel<0?'代我核准':cur.zh,{'font-size':24,fill:C.sub,'font-weight':600});
 B.push({id:'perm-menu',x:mx,y:my,width:400*ms,height:406*ms,overlapGroup:cam<1?'cam':undefined});
 const menu=S.g({transform:`translate(${mx} ${my}) scale(${ms})`},m);
 if(cam>.98)o+=S.text(8,500,'「代我核准」取自 App 介面；',{'font-size':19,fill:C.muted})+S.text(8,526,'其他名稱依官方英文文件翻譯',{'font-size':19,fill:C.muted});
 // sandbox diagram
 const rv=clamp((cam-.5)/.5);
 if(rv>0){
  const bx=520,by=40,bw=620,bh=520,gx=bx+bw,full=at(t,T.full,.8),custom=at(t,T.custom,.6),bOp=lerp(1,.12,full*(1-custom));
  B.push({id:'sandbox',x:bx,y:by,width:bw,height:bh,overlapGroup:cam<1?'cam':undefined});B.push({id:'targets',x:1440,y:110,width:280,height:400});
  let d=S.rect({x:bx,y:by,width:bw,height:bh,rx:28,fill:'#f7f9ff',opacity:rv})
   +S.rect({x:bx,y:by,width:bw,height:bh,rx:28,fill:'none',stroke:full>0&&custom<1?C.red:C.blue,'stroke-width':4,'stroke-dasharray':'14 10',opacity:rv*bOp})
   +S.text(bx+28,by+48,'工作區（沙盒）',{'font-size':28,'font-weight':800,fill:C.blue,opacity:rv})+S.text(bx+232,by+48,'Workspace sandbox',{'font-size':21,fill:C.blue,opacity:rv});
  d+=S.g({opacity:rv},badge(bx+250,by+230,'Codex',1)+[0,1,2].map(i=>icon('file',bx+90+i*90,by+330,1.1,C.sub,2.4)).join('')+chip(bx+60,by+420,'✓ 可讀寫工作區檔案',{size:22,fill:C.greenL,color:C.green}));
  // outside targets
  d+=S.g({opacity:rv},icon('globe',1530,120,1.6,C.ink,2)+S.text(1568,232,'網路',{'font-size':27,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(1568,262,'Network',{'font-size':20,fill:C.muted,'text-anchor':'middle'})
   +icon('file',1530,360,1.6,C.ink,2)+S.text(1568,472,'工作區外的檔案',{'font-size':27,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(1568,502,'Files outside',{'font-size':20,fill:C.muted,'text-anchor':'middle'}));
  // request arrows: Codex → boundary (sandbox), then through the gate when approved
  const sb=at(t,T.sandbox+.6,1.2),ys=[176,416],sx0=bx+310;
  ys.forEach((y,k)=>{const reach=E.inout(clamp(sb*1.4-k*.3));if(reach<=0)return;
   const pass=sel<0?0:sel===3?E.inout(at(t,T.custom+.5,.8)):E.inout(at(t,[T.ask,T.auto,T.full][sel]+(sel===2?.3:1.3)+k*.25,.7));
   d+=S.path({d:`M${sx0} ${by+230} L${lerp(sx0,gx-10,reach)} ${lerp(by+230,y,reach)}`,stroke:C.amber,'stroke-width':4,'stroke-dasharray':'2 9','stroke-linecap':'round',fill:'none'});
   if(pass>0)d+=S.path({d:`M${gx+10} ${y} H${lerp(gx+10,1510,pass)}`,stroke:sel===2?C.red:C.green,'stroke-width':5,'stroke-linecap':'round'});
   else if(reach>.95)d+=S.circle({cx:gx,cy:y,r:9,fill:C.amber});});
  // gatekeeper on the boundary
  const gy=296,swap=E.inout(at(t,T.auto,.6));
  if(sel>=0&&sel!==2){const who=sel===3?'gear':swap>.5?'robot':'person',sx=Math.abs(Math.cos(Math.PI*swap))*(sel===3?1:1)||.05;
   d+=S.g({transform:`translate(${gx} ${gy}) scale(${sel===3?1:sx} 1)`},S.circle({cx:0,cy:0,r:46,fill:'#fff',stroke:sel===3?C.sub:C.blue,'stroke-width':3})+icon2(who,-30,-30,1.25,sel===3?C.sub:C.blue,2.6));}
  const label=sel<0?['越過邊界 → 需要核准','Crossing needs approval',C.amber]:sel===0?['由你核准','You approve',C.blue]:sel===1?['審查代理核准','A reviewer approves',C.blue]:sel===2?['沒有邊界・風險最高','No boundary · highest risk',C.red]:['依 config.toml','Follows config.toml',C.sub];
  if(sb>.3||sel>=0)d+=S.rect({x:gx+60,y:gy-34,width:260,height:72,rx:16,fill:'#fff',stroke:label[2],'stroke-width':2})+S.text(gx+76,gy-2,label[0],{'font-size':24,'font-weight':800,fill:label[2]})+S.text(gx+76,gy+26,label[1],{'font-size':18,fill:C.muted});
  if(sel===1)d+=up(at(t,T.auto+1.2,.6),chip(bx+330,by+420,'沙盒範圍不變',{size:22,fill:C.blueL,color:C.blue}));
  o+=d;
 }
 return o+menu;
};

// ── 5 Comparison matrix: situation → mode + location; permission ladder ──
SCENES.matrix=(sc,t,B)=>{
 const T={head:sc.start,r1:ps(sc,'r1'),r2:ps(sc,'r2'),r3:ps(sc,'r3'),perm:ps(sc,'perm')};let o='';
 const cols=[[0,'情境','Situation'],[880,'模式','Mode'],[1210,'工作位置','Work location']];
 const hu=at(t,T.head,.6);B.push({id:'thead',x:0,y:0,width:1728,height:56});
 o+=up(hu,S.rect({x:0,y:0,width:1728,height:56,rx:16,fill:'#e7e9ef'})+cols.map(([x,zh,en])=>S.text(x+28,38,zh,{'font-size':26,'font-weight':800,fill:C.ink})+S.text(x+28+tw(zh,26)+14,38,en,{'font-size':19,fill:C.muted})).join(''));
 const rows=[['r1','整理你電腦裡的講義','Handouts on your own computer','Codex','laptop','這台電腦'],
  ['r2','專案在 GitHub，關機後也要繼續','Repo on GitHub; keep running after shutdown','Codex','cloud','雲端'],
  ['r3','專案放在實驗室伺服器','Project lives on a lab server','Codex','globe','遠端']];
 const cur=t>=T.perm?-1:t>=T.r3?2:t>=T.r2?1:t>=T.r1?0:-1;
 rows.forEach(([k,zh,en,mode,ic,loc],i)=>{const u=at(t,T[k],.6);if(u<=0)return;const y=72+i*118;B.push({id:'row-'+k,x:0,y,width:1728,height:104});
  o+=up(u,S.rect({x:0,y,width:1728,height:104,rx:18,fill:i===cur?C.blueL:'#fff',stroke:i===cur?C.blue:C.line,'stroke-width':i===cur?2.5:1.5})
   +S.text(28,y+46,zh,{'font-size':30,'font-weight':700,fill:C.ink})+S.text(28,y+80,en,{'font-size':21,fill:C.muted})
   +chip(908,y+30,mode,{icon:'code',size:24})+chip(1238,y+30,loc,{icon:ic,size:24,fill:'#fff',stroke:C.blue}));});
 // permission ladder
 const pu=at(t,T.perm,.6);
 if(pu>0){B.push({id:'ladder',x:0,y:440,width:1728,height:160});
  const steps=[['① 要求核准','Ask for approval','起點 Start here',C.blue],['② 代我核准','Approve for me','熟悉後 Later',C.blue],['③ 完整存取','Full access','完全信任才用 Only if fully trusted',C.red]];
  steps.forEach(([zh,en,note,c],i)=>{const x=i*600,u=at(t,T.perm+i*.9,.6);
   o+=up(u,S.rect({x,y:448,width:528,height:140,rx:22,fill:'#fff',stroke:c,'stroke-width':2.5})+S.text(x+28,y0(498),zh,{'font-size':32,'font-weight':800,fill:c})+S.text(x+28,y0(530),en,{'font-size':21,fill:C.muted})+S.text(x+28,y0(570),note,{'font-size':22,'font-weight':600,fill:C.sub}));
   if(i<2&&u>.5)o+=arrow2(x+538,518,x+592,518,clamp((u-.5)*2),C.line);});}
 return o;
};
const y0=v=>v;
function arrow2(x1,y1,x2,y2,u,color=C.ink,w=5){if(u<=0)return '';const x=lerp(x1,x2,E.out(u)),a=Math.atan2(y2-y1,x2-x1),h=14;
 return S.path({d:`M${x1} ${y1} L${x} ${y2}`,stroke:color,'stroke-width':w,'stroke-linecap':'round'})+S.path({d:`M${x} ${y2} L${x-h*Math.cos(a-.5)} ${y2-h*Math.sin(a-.5)} L${x-h*Math.cos(a+.5)} ${y2-h*Math.sin(a+.5)} Z`,fill:color})}

// ── 6 Demo: rebuilt Codex window; approval dialog; changed files; limits ──
SCENES.demo=(sc,t,B)=>{
 const T={prompt:sc.start,work:ps(sc,'work'),approve:ps(sc,'approve'),diff:ps(sc,'diff'),limits:ps(sc,'limits')};let o='';
 // window frame with slim sidebar
 o+=panel(B,'window',0,0,1110,606,{rx:22,group:'demo'})+S.rect({x:0,y:0,width:76,height:606,rx:22,fill:'#eef0f5'});
 ['laptop','file','folder','code','gear'].forEach((k,i)=>{o+=anyIcon(k,18,30+i*64,.82,C.muted,2.6)});
 // composer
 const cx=110,cy=440,cw=966;
 o+=S.rect({x:cx,y:392,width:cw,height:44,rx:14,fill:'#eef0f5'})+icon('folder',cx+12,394,.8,C.sub,2.6)+S.text(cx+56,422,'課程講義',{'font-size':22,fill:C.ink,'font-weight':600})
  +S.rect({x:cx+170,y:396,width:170,height:36,rx:12,fill:'#e0e3ea'})+icon('laptop',cx+180,397,.7,C.ink,2.8)+S.text(cx+220,421,'這台電腦',{'font-size':21,fill:C.ink,'font-weight':600});
 o+=S.rect({x:cx,y:cy,width:cw,height:146,rx:24,fill:'#fff',stroke:'#dfe2ea','stroke-width':2});
 const prompt='把「課程講義」資料夾整理成一個課程網站',typed=Math.floor([...prompt].length*E.out(at(t,T.prompt+1.4,2.4))),sent=t>=T.work-.4;
 o+=S.text(cx+28,cy+48,sent?'想做什麼都可以':(typed?[...prompt].slice(0,typed).join(''):'想做什麼都可以'),{'font-size':26,fill:sent||!typed?'#a3a8b8':C.ink});
 o+=S.text(cx+26,cy+118,'+',{'font-size':34,fill:C.sub})+icon2('person',cx+70,cy+92,.7,C.sub,2.8)+S.text(cx+108,cy+117,'要求核准',{'font-size':22,fill:C.sub})
  +S.text(cx+cw-260,cy+117,'GPT-6 Astra 極高 ⌄',{'font-size':22,fill:C.ink})+S.circle({cx:cx+cw-40,cy:cy+108,r:24,fill:C.blue})+S.path({d:`M${cx+cw-48} ${cy+108} H${cx+cw-32} M${cx+cw-40} ${cy+100} V${cy+116}`,stroke:'#fff','stroke-width':3});
 // conversation + activity log
 if(sent){const u=at(t,T.work-.4,.5);o+=up(u,S.rect({x:1076-560,y:24,width:560,height:52,rx:20,fill:C.blueL})+S.text(1076-540,58,prompt,{'font-size':22,fill:C.ink}));
  const log=[['讀取 12 個講義檔案','work',.4],['規劃網站結構（首頁＋各週）','work',1.6],['建立 index.html、style.css','work',2.8],['✓ 已安裝套件，繼續產生頁面','approve',-1],['✓ 完成：產生 14 個頁面','diff',.2]];
  log.forEach(([s,k,d],i)=>{const t0=d<0?T.approve+(T.diff-T.approve)*.82:T[k]+d,u=at(t,t0,.5);o+=up(u,S.circle({cx:cx+18,cy:112+i*52,r:6,fill:s.startsWith('✓')?C.green:C.blue})+S.text(cx+38,120+i*52,s,{'font-size':24,fill:C.ink}),12)});}
 // approval dialog (modal over the conversation)
 const ap=at(t,T.approve,.5),close=at(t,T.approve+(T.diff-T.approve)*.78,.4);
 if(ap>0&&close<1){const x=270,y=70,w=640,h=280;B.push({id:'dialog',x,y,width:w,height:h,overlapGroup:'demo'});
  let d=S.rect({x:0,y:0,width:1110,height:606,rx:22,fill:'#1d1f2a',opacity:.18})+shadow(x,y,w,h,22,2)+S.rect({x,y,width:w,height:h,rx:22,fill:'#fff',stroke:C.amber,'stroke-width':2.5})
   +icon2('person',x+26,y+22,.9,C.amber,2.8)+S.text(x+80,y+58,'Codex 想要執行指令',{'font-size':30,'font-weight':800,fill:C.ink})
   +S.rect({x:x+28,y:y+86,width:w-56,height:56,rx:12,fill:'#20232f'})+S.text(x+48,y+123,'$ npm install',{'font-size':25,fill:'#c9d6ff','font-family':'Consolas,monospace'})
   +S.text(x+28,y+182,'原因：需要連網下載網站套件',{'font-size':24,fill:C.sub})
   +S.rect({x:x+w-330,y:y+208,width:140,height:52,rx:16,fill:'#fff',stroke:C.line,'stroke-width':2})+S.text(x+w-260,y+243,'拒絕',{'font-size':24,fill:C.ink,'text-anchor':'middle'})
   +S.rect({x:x+w-176,y:y+208,width:148,height:52,rx:16,fill:C.blue})+S.text(x+w-102,y+243,'核准',{'font-size':24,'font-weight':700,fill:'#fff','text-anchor':'middle'});
  // cursor moves to 核准 and clicks
  const mv=E.inout(at(t,T.approve+(T.diff-T.approve)*.45,.7)),click=at(t,T.approve+(T.diff-T.approve)*.7,.4),px=lerp(x+300,x+w-96,mv),py=lerp(y+320,y+238,mv);
  if(click>0&&click<1)d+=S.circle({cx:x+w-102,cy:y+234,r:lerp(10,70,click),fill:C.blue,opacity:.25*(1-click)});
  d+=S.path({d:`M${px} ${py} l0 30 l8 -8 l7 15 l6 -3 l-7 -14 l11 0 Z`,fill:C.ink,stroke:'#fff','stroke-width':2});
  o+=S.g({opacity:clamp(ap*1.6)*(1-close)},d);}
 // right panel: demo badge → changed files → limits
 o+=panel(B,'side',1140,0,588,606,{rx:22});
 o+=chip(1166,24,'示範情境 Demo',{size:22,fill:C.amberL,color:C.amber});
 const dfOut=at(t,T.diff,.3),df=at(t,T.diff+.3,.5),lmOut=at(t,T.limits,.3),lm=at(t,T.limits+.3,.5);
 // problem → process: what the demo is solving, and the steps so far
 const pr=at(t,T.prompt+.3,.6);
 if(pr>0&&dfOut<1){const steps=[['選專案・工作位置・權限',T.prompt+3],['Codex 讀取並產生網頁',T.work],['核准下載套件',T.approve]];
  o+=S.g({opacity:1-dfOut},up(pr,S.text(1166,124,'問題',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(1236,124,'Problem',{'font-size':20,fill:C.muted})
   +S.rect({x:1166,y:146,width:536,height:120,rx:18,fill:'#f7f8fb',stroke:C.line})+icon('folder',1184,166,1.2,C.sub,2.2)+S.text(1262,196,'講義散在 12 個檔案，',{'font-size':25,fill:C.ink})+S.text(1262,232,'學生不好找',{'font-size':25,fill:C.ink})
   +S.text(1166,322,'過程',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(1236,322,'Process',{'font-size':20,fill:C.muted})
   +steps.map(([s,t0],i)=>{const u=at(t,t0,.5);return u<=0?'':S.g({opacity:clamp(u*1.6)},S.circle({cx:1186,cy:366+i*56,r:16,fill:C.blueL})+S.text(1186,373+i*56,String(i+1),{'font-size':20,'font-weight':800,fill:C.blue,'text-anchor':'middle'})+S.text(1214,374+i*56,s,{'font-size':24,fill:C.ink}))}).join('')))}
 if(df>0&&lmOut<1){o+=S.g({opacity:1-lmOut},up(df,S.text(1166,124,'已變更的檔案',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(1166,154,'Changed files',{'font-size':20,fill:C.muted})
   +[['index.html','+120'],['style.css','+64'],['week01.html','+45'],['week02.html','+41']].map(([f,n],i)=>S.rect({x:1166,y:178+i*66,width:536,height:54,rx:12,fill:'#f7f8fb',stroke:C.line})+icon('file',1176,181+i*66,.95,C.sub,2.4)+S.text(1226,214+i*66,f,{'font-size':23,fill:C.ink,'font-family':'Consolas,"Lesson Latin",monospace'})+S.text(1690,214+i*66,n,{'font-size':23,'font-weight':700,fill:C.green,'text-anchor':'end'})).join('')
   +S.rect({x:1166,y:456,width:250,height:54,rx:16,fill:C.ink})+S.text(1291,491,'逐一檢查變更',{'font-size':23,'font-weight':700,fill:'#fff','text-anchor':'middle'})))}
 if(lm>0){o+=up(lm,icon2('warn',1166,92,1.05,C.amber,3)+S.text(1226,128,'限制',{'font-size':30,'font-weight':800,fill:C.ink})+S.text(1300,128,'Limits',{'font-size':22,fill:C.muted})
   +S.rect({x:1166,y:170,width:536,height:150,rx:18,fill:C.amberL})+S.text(1190,224,'需求越模糊，',{'font-size':28,'font-weight':700,fill:C.ink})+S.text(1190,262,'結果越容易偏離',{'font-size':28,'font-weight':700,fill:C.ink})+S.text(1190,298,'Vague requests drift',{'font-size':20,fill:C.sub}));
  o+=up(at(t,ps(sc,'limits')+(sc.end-ps(sc,'limits'))*.42,.6),S.rect({x:1166,y:340,width:536,height:150,rx:18,fill:C.redL})+S.text(1190,394,'按下核准前，',{'font-size':28,'font-weight':700,fill:C.ink})+S.text(1190,432,'先看懂它要做什麼',{'font-size':28,'font-weight':700,fill:C.ink})+S.text(1190,468,'Understand it before you approve',{'font-size':20,fill:C.sub}));}
 return o;
};

// ── 7 Outlook: announced / trend / open question, then next episode ──
SCENES.outlook=(sc,t,B)=>{
 const T={a:sc.start,b:ps(sc,'b'),next:ps(sc,'next')};let o='';
 const cards=[{x:0,c:C.green,cL:C.greenL,tag:'已公布 Announced',t0:T.a+.2,body:(x)=>S.text(x+30,158,'2026-06-25',{'font-size':46,'font-weight':800,fill:C.green})+S.text(x+30,210,'Codex Remote 正式推出',{'font-size':29,'font-weight':700,fill:C.ink})+S.text(x+30,244,'Codex Remote generally available',{'font-size':20,fill:C.muted})
   +icon2('phone',x+60,282,1.9,C.ink,1.8)+S.path({d:`M${x+170} 330 H${x+300}`,stroke:C.green,'stroke-width':4,'stroke-dasharray':'8 7'})+S.rect({x:x+196,y:304,width:84,height:34,rx:10,fill:C.greenL})+S.text(x+238,328,'QR',{'font-size':21,'font-weight':800,fill:C.green,'text-anchor':'middle'})+icon('laptop',x+320,276,2.2,C.ink,1.5)
   +S.text(x+30,402,'手機配對，遙控你的電腦',{'font-size':24,fill:C.sub})
   +(t>=ps(sc,'handoff')?S.g({opacity:at(t,ps(sc,'handoff'),.5)},S.text(x+30,436,'2026-06-18 起：本機⇄遠端交接對話',{'font-size':22,'font-weight':700,fill:C.green})):'')},
  {x:584,c:C.amber,cL:C.amberL,tag:'趨勢（推論） Trend',t0:T.b,body:(x)=>S.text(x+30,170,'代理能做的事',{'font-size':34,'font-weight':800,fill:C.ink})+S.text(x+30,216,'越來越多',{'font-size':34,'font-weight':800,fill:C.ink})+S.text(x+30,254,'Agents keep taking on more',{'font-size':20,fill:C.muted})
   +['寫程式','操作 App','遙控電腦'].map((s,i)=>chip(x+30,290+i*44,s,{size:20,fill:C.amberL,color:C.amber,h:36})).join('')},
  {x:1168,c:C.red,cL:C.redL,tag:'未解問題 Open question',t0:T.b+1.2,body:(x)=>S.text(x+30,170,'權限與責任',{'font-size':40,'font-weight':800,fill:C.ink})+S.text(x+30,212,'Permissions and responsibility',{'font-size':20,fill:C.muted})
   +icon2('shield',x+30,250,2.4,C.red,1.6)+S.text(x+170,300,'誰核准？',{'font-size':26,fill:C.sub})+S.text(x+170,344,'出錯誰負責？',{'font-size':26,fill:C.sub})}];
 cards.forEach((c,i)=>{const u=at(t,c.t0,.6);if(u<=0)return;B.push({id:'out-'+i,x:c.x,y:0,width:560,height:450});
  o+=up(u,panel([],'',c.x,0,560,450,{rx:26,stroke:c.c,sw:2.5})+S.rect({x:c.x+24,y:24,width:tw(c.tag,22)+36,height:42,rx:21,fill:c.cL})+S.text(c.x+42,53,c.tag,{'font-size':22,'font-weight':700,fill:c.c})+c.body(c.x))});
 const n=at(t,T.next,.6),rc=at(t,ps(sc,'recap'),.6);
 if(rc>0&&n<1){B.push({id:'recap',x:0,y:476,width:1728,height:110,overlapGroup:'rn'});
  const steps=[['① 模式','Mode'],['② 工作位置','Work location'],['③ 權限','Permission']];
  o+=S.g({opacity:1-n},up(rc,S.rect({x:0,y:476,width:1728,height:110,rx:26,fill:C.blueL,stroke:C.blue,'stroke-width':2})+S.text(40,543,'重點回顧 Recap',{'font-size':30,'font-weight':800,fill:C.blue})
   +steps.map(([zh,en],i)=>{const u=at(t,ps(sc,'recap')+.4+i*.7,.5),x=420+i*440;return S.g({opacity:clamp(u*1.6)},S.text(x,540,zh,{'font-size':32,'font-weight':800,fill:C.ink})+S.text(x+tw(zh,32)+14,540,en,{'font-size':21,fill:C.sub})+(i<2?S.text(x+380,540,'→',{'font-size':34,fill:C.blue}):''))}).join('')))}
 if(n>0){B.push({id:'next',x:0,y:476,width:1728,height:110,overlapGroup:'rn'});
  o+=up(n,S.rect({x:0,y:476,width:1728,height:110,rx:26,fill:C.ink})+S.text(40,543,'下一集 Next ▸',{'font-size':30,'font-weight':800,fill:'#c9d6ff'})+S.text(300,543,'模型・思考等級・快速模式・側邊欄・剩餘用量',{'font-size':32,'font-weight':700,fill:'#fff'})+S.text(1688,543,'Models · reasoning · usage',{'font-size':22,fill:'#c9d6ff','text-anchor':'end'}))}
 return o;
};
