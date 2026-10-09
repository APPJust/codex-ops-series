// Episode 2 renderers: models, reasoning, Fast mode, sidebar, usage. Same pure-function contract.
function icon3(kind,x,y,s=1,color=C.ink,sw=3){
 const st={stroke:color,'stroke-width':sw,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},P=d=>S.path({d,...st});
 const body={
  home:P('M8 22 L24 9 L40 22 V40 H30 V29 H18 V40 H8 Z'),
  photo:P('M9 15 H33 V37 H9 Z')+P('M15 10 H39 V32')+P('M12 33 L20 25 L26 30 L30 27 L33 30'),
  clock:S.circle({cx:24,cy:24,r:16,...st})+P('M24 14 V24 L31 28'),
  books:P('M9 9 H16 V40 H9 Z')+P('M19 9 H26 V40 H19 Z')+P('M29 11 L35 9 L42 38 L36 40 Z'),
  plugin:S.circle({cx:24,cy:24,r:16,...st})+S.circle({cx:24,cy:24,r:6,...st})+P('M30 24 V28 Q30 33 35 31'),
  dots:S.circle({cx:12,cy:24,r:2.5,fill:color})+S.circle({cx:24,cy:24,r:2.5,fill:color})+S.circle({cx:36,cy:24,r:2.5,fill:color}),
  pr:S.circle({cx:14,cy:12,r:4,...st})+S.circle({cx:14,cy:36,r:4,...st})+S.circle({cx:34,cy:36,r:4,...st})+P('M14 16 V32')+P('M34 32 V20 Q34 14 28 14 H22')+P('M25 10 L21 14 L25 18'),
  folder:P('M6 14 Q6 11 9 11 H19 L23 15 H39 Q42 15 42 18 V35 Q42 38 39 38 H9 Q6 38 6 35 Z'),
  grid:P('M8 8 H20 V20 H8 Z')+P('M8 28 H20 V40 H8 Z')+P('M28 28 H40 V40 H28 Z')+P('M34 6 L42 14 L34 22 L26 14 Z'),
  pin:P('M24 6 Q34 6 34 16 Q34 24 24 32 Q14 24 14 16 Q14 6 24 6 Z')+S.circle({cx:24,cy:16,r:4,...st})+P('M14 40 Q24 34 34 40'),
  cube:P('M24 6 L40 15 V33 L24 42 L8 33 V15 Z')+P('M8 15 L24 24 L40 15')+P('M24 24 V42'),
  bolt:P('M27 5 L12 27 H23 L20 43 L36 20 H25 Z'),
  slider:P('M8 16 H40')+P('M8 32 H40')+S.circle({cx:18,cy:16,r:4,fill:color})+S.circle({cx:31,cy:32,r:4,fill:color})
 }[kind];
 return S.g({transform:`translate(${x} ${y}) scale(${s})`},body);
}
const anyIcon3=(k,x,y,s,c,w)=>['home','photo','clock','books','plugin','dots','pr','folder','grid','pin','cube','bolt','slider'].includes(k)?icon3(k,x,y,s,c,w):anyIcon(k,x,y,s,c,w);
function composerChip(x,y,model,level,bolt,boltOn){
 // rebuilt from the screenshot: "GPT-6 Astra 極高 ⌄"
 let o=S.rect({x,y,width:480,height:76,rx:22,fill:'#fff',stroke:'#dfe2ea','stroke-width':2})+S.text(x+26,y+48,model,{'font-size':28,'font-weight':600,fill:C.ink})+S.text(x+26+tw(model,28)+12,y+48,level,{'font-size':28,fill:C.muted})+S.path({d:`M${x+26+tw(model,28)+tw(level,28)+26} ${y+34} l8 8 l8 -8`,stroke:C.sub,'stroke-width':3,fill:'none'});
 if(bolt)o+=S.rect({x:x+380,y:y+14,width:48,height:48,rx:14,fill:boltOn?C.amberL:'#f1f2f6',stroke:boltOn?C.amber:'none','stroke-width':2})+icon3('bolt',x+384,y+18,.83,boltOn?C.amber:C.sub,3);
 return o;
}

// ── Origin: model timeline ──
SCENES.modelsOrigin=(sc,t,B)=>{
 let o='';const T={d1:ps(sc,'d1'),d2:ps(sc,'d2'),d3:ps(sc,'d3'),d4:ps(sc,'d4')};
 const iu=at(t,sc.start+.2,.6),iOut=at(t,T.d1-.1,.5);
 if(iOut<1){B.push({id:'topics',x:164,y:120,width:1400,height:300,overlapGroup:'x'});
  const topics=[['模型','slider'],['思考等級','gauge'],['快速模式','bolt'],['側邊欄','dots'],['剩餘用量','gauge']];
  o+=S.g({opacity:clamp(iu*1.6)*(1-iOut)},composerChip(624,120,'GPT-6 Astra','極高',true,false)+topics.map(([s,ic],i)=>{const u=at(t,sc.start+.5+i*.35,.5),x=164+i*284;return up(u,S.rect({x,y:280,width:256,height:120,rx:22,fill:'#fff',stroke:C.line})+anyIcon3(ic,x+24,y0(300),1.1,C.blue,2.6)+S.text(x+90,352,s,{'font-size':30,'font-weight':800,fill:C.ink}))}).join(''))}
 const q=E.inout(at(t,T.d1,1)),ly=380;
 if(q>0){o+=S.path({d:`M100 ${ly} H${lerp(100,1628,q)}`,stroke:C.line,'stroke-width':6,'stroke-linecap':'round'});
  const M=[[650,T.d1,'2026-09-22','GPT-6 Sol、Luna 進入','Sol and Luna arrive',C.blue],[1060,T.d2,'2026-09-29','推出 GPT-6.1 Sol','GPT-6.1 Sol released',C.green],[1470,T.d3,'2026-10-14','GPT-5.5 退出 Codex','GPT-5.5 leaves Codex',C.red],[250,T.d4,'2026-09-14','5.3-Codex-Spark 停用','Spark retired',C.sub]];
  M.forEach(([x,t0,d,zh,en,c],i)=>{const u=at(t,t0+.3,.6);if(u<=0)return;B.push({id:'m'+i,x:x-190,y:ly-90,width:380,height:200});
   o+=up(u,S.circle({cx:x,cy:ly,r:16,fill:'#fff',stroke:c,'stroke-width':6})+S.text(x,ly-40,d,{'font-size':42,'font-weight':800,fill:c,'text-anchor':'middle'})+S.text(x,ly+66,zh,{'font-size':27,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(x,ly+102,en,{'font-size':22,fill:C.muted,'text-anchor':'middle'}))});
  const fu=at(t,T.d3+.8,.6);if(fu>0)o+=up(fu,S.text(1470,ly-104,'（已公布的未來日期）',{'font-size':22,fill:C.red,'text-anchor':'middle'}))}
 return o;
};

// ── Models: picker + model card ──
const MODELS=[{k:'default',zh:'預設',en:'Default',sub:'模型＋思考等級，一條滑桿'},{k:'astra',zh:'GPT-6 Astra',en:'Strongest',sub:'困難的多步驟工作',cap:5,use:5,c:C.violet||'#5b4fd6'},{k:'sol',zh:'GPT-6.1 Sol',en:'Near Astra, cheaper',sub:'複雜的程式工作',cap:4.3,use:3,c:C.blue},{k:'luna',zh:'GPT-6 Luna',en:'Most efficient',sub:'大量摘要、擷取',cap:2.6,use:1,c:C.green}];
SCENES.models=(sc,t,B)=>{
 let o='';const order=['picker','astra','sol','luna','default'],cur=[...order].reverse().find(n=>t>=ps(sc,n))||'picker';
 const extra={astra:['astraplus','Plus：Astra 用量有限，可加購點數'],luna:['lunafree','Free、Go 方案在桌面版也能選'],default:['remember','手動選好的模型，Codex 會記住']}[cur];
 // picker (left)
 B.push({id:'picker',x:0,y:0,width:560,height:606});
 o+=panel([],'',0,0,560,606,{rx:26});
 o+=S.text(32,58,'模型選單',{'font-size':30,'font-weight':800,fill:C.ink})+S.text(178,58,'Model picker',{'font-size':21,fill:C.muted});
 MODELS.forEach((m,i)=>{const y=96+i*104,on=m.k===cur,u=at(t,sc.start+.3+i*.25,.4);
  o+=up(u,S.rect({x:24,y,width:512,height:90,rx:18,fill:on?C.blueL:'#f7f8fb',stroke:on?C.blue:C.line,'stroke-width':on?3:1.5})+(m.k==='default'?icon3('slider',40,y+20,1,C.sub,2.8):S.circle({cx:64,cy:y+45,r:14,fill:m.c}))
   +S.text(104,y+42,m.zh,{'font-size':28,'font-weight':800,fill:C.ink})+S.text(104,y+72,m.sub,{'font-size':21,fill:C.sub}))});
 o+=composerChip(40,520,cur==='luna'?'GPT-6 Luna':cur==='sol'?'GPT-6.1 Sol':cur==='default'?'預設':'GPT-6 Astra','',false,false);
 // right: model card
 B.push({id:'mcard',x:600,y:0,width:1128,height:606});o+=panel([],'',600,0,1128,606,{rx:26});
 const m=MODELS.find(x=>x.k===cur);const cu=at(t,ps(sc,cur),.5);
 if(cur==='picker'){o+=up(at(t,sc.start+.4,.6),S.text(1164,250,'點輸入框右下角的模型名稱',{'font-size':40,'font-weight':800,fill:C.ink,'text-anchor':'middle'})+S.text(1164,300,'Click the model name in the composer',{'font-size':24,fill:C.muted,'text-anchor':'middle'})+composerChip(924,350,'GPT-6 Astra','極高',false,false)+S.rect({x:916,y:342,width:496,height:92,rx:28,fill:'none',stroke:C.amber,'stroke-width':4,opacity:.5+.5*Math.sin(t*5)**2}))}
 else if(cur==='default'){const k=E.inout(at(t,ps(sc,'default')+.6,2.5));o+=up(cu,S.text(640,70,'預設 Default',{'font-size':40,'font-weight':800,fill:C.ink})+S.text(640,110,'模型和思考等級合成一條滑桿 · One slider for model and reasoning',{'font-size':23,fill:C.sub})
   +S.rect({x:680,y:300,width:960,height:14,rx:7,fill:'#e5e8ef'})+S.rect({x:680,y:300,width:960*lerp(.15,.9,k),height:14,rx:7,fill:C.blue})+S.circle({cx:680+960*lerp(.15,.9,k),cy:307,r:22,fill:'#fff',stroke:C.blue,'stroke-width':5})
   +S.text(680,370,'更快・更省',{'font-size':26,fill:C.green,'font-weight':700})+S.text(1640,370,'更強・更耗',{'font-size':26,fill:C.red,'font-weight':700,'text-anchor':'end'})+S.text(680,250,'',{}))}
 else{const bar=(y,label,v,c)=>S.text(640,y,label,{'font-size':26,'font-weight':700,fill:C.ink})+S.rect({x:820,y:y-22,width:760,height:26,rx:13,fill:'#e5e8ef'})+S.rect({x:820,y:y-22,width:760*v/5*E.out(clamp(cu*1.4)),height:26,rx:13,fill:c});
  o+=up(cu,S.text(640,80,m.zh,{'font-size':52,'font-weight':800,fill:m.c})+S.text(640,124,m.en+' · '+m.sub,{'font-size':25,fill:C.sub})+bar(240,'能力',m.cap,m.c)+bar(320,'用量',m.use,C.amber)+S.text(640,400,'長條為相對示意，依官方說明的定位繪製',{'font-size':20,fill:C.muted}))}
 if(extra&&t>=ps(sc,extra[0]))o+=up(at(t,ps(sc,extra[0]),.5),chip(640,470,extra[1],{size:28,fill:C.amberL,color:C.amber}));
 return o;
};
const _v=C.violet;

// ── Reasoning: level slider; trade-off meters; screenshot label ──
SCENES.reasoning=(sc,t,B)=>{
 let o='';const T={more:ps(sc,'more'),cli:ps(sc,'cli'),trade:ps(sc,'trade'),tip:ps(sc,'tip'),shot:ps(sc,'shot')};
 const L=[['輕度','Light'],['中','Medium'],['高','High'],['極高','Extra High'],['Max','Max'],['Ultra','Ultra']],x0=140,dx=290,y=150;
 B.push({id:'slider',x:60,y:40,width:1608,height:220});
 o+=S.rect({x:x0,y:y-6,width:dx*5,height:12,rx:6,fill:'#e5e8ef'});
 L.forEach(([zh,en],i)=>{const extra=i>3,u=at(t,extra?T.more:sc.start+.3+i*.4,.5);if(u<=0)return;const x=x0+i*dx;
  o+=up(u,S.circle({cx:x,cy:y,r:16,fill:'#fff',stroke:extra?C.muted:C.blue,'stroke-width':4,'stroke-dasharray':extra?'5 5':undefined})+S.text(x,y-40,zh,{'font-size':32,'font-weight':800,fill:extra?C.sub:C.ink,'text-anchor':'middle'})+S.text(x,y+52,en,{'font-size':22,fill:C.muted,'text-anchor':'middle'}))});
 if(t>=T.cli)o+=up(at(t,T.cli,.5),chip(x0-90,226,'CLI 叫 Low',{size:22,fill:'#eef0f5',color:C.sub}),8);
 if(t>=T.more)o+=up(at(t,T.more+.3,.5),S.text(x0+4.5*dx,y+92,'部分模型才有 · Some models only',{'font-size':21,fill:C.sub,'text-anchor':'middle'}));
 // knob sweeps during the trade-off sentence
 let lv=t<T.trade?0:lerp(0,3,E.inout(at(t,T.trade+.3,2.6)));
 if(t>=T.tip)lv=lerp(3,1,E.inout(at(t,T.tip+.2,1)));   // advice: back to Medium
 if(t>=T.shot)lv=lerp(1,3,E.inout(at(t,T.shot,.8)));  // screenshot shows Extra High
 const kx=x0+lv*dx;
 o+=S.circle({cx:kx,cy:y,r:24,fill:C.blue,stroke:'#fff','stroke-width':5});
 if(t>=T.trade){B.push({id:'meters',x:60,y:300,width:1608,height:250,overlapGroup:'shot'});const f=(lv+1)/4;
  const meter=(yy,zh,en,v,c)=>S.text(140,yy,zh,{'font-size':28,'font-weight':700,fill:C.ink})+S.text(140,yy+30,en,{'font-size':19,fill:C.muted})+S.rect({x:420,y:yy-24,width:1100,height:30,rx:15,fill:'#e5e8ef'})+S.rect({x:420,y:yy-24,width:1100*v,height:30,rx:15,fill:c});
  o+=up(at(t,T.trade,.5),meter(340,'能處理的難度','Harder problems',f,C.blue)+meter(420,'思考時間','Time to answer',f,C.amber)+meter(500,'用量消耗','Usage',f,C.red)+(t>=T.tip?S.g({opacity:at(t,T.tip,.4)},S.rect({x:140,y:540,width:900,height:50,rx:16,fill:C.greenL})+S.text(160,574,'建議：先用「中」，卡住再往上調',{'font-size':25,'font-weight':700,fill:C.green})):S.text(140,566,'示意：等級越高，三者一起增加',{'font-size':20,fill:C.muted})))}
 if(t>=T.shot){const u=at(t,T.shot,.6);B.push({id:'shot',x:500,y:300,width:900,height:300,overlapGroup:'shot'});
  o+=S.g({opacity:clamp(u*1.6)},S.rect({x:0,y:290,width:1728,height:320,fill:'#f2f3f6'})+composerChip(624,360,'GPT-6 Astra','極高',false,false)
   +S.path({d:'M760 450 V500',stroke:C.blue,'stroke-width':4})+S.text(760,540,'模型 Model',{'font-size':26,'font-weight':700,fill:C.blue,'text-anchor':'middle'})
   +S.path({d:'M914 450 V500',stroke:C.amber,'stroke-width':4})+S.text(990,540,'思考等級 = Extra High',{'font-size':26,'font-weight':700,fill:C.amber,'text-anchor':'middle'}))}
 return o;
};

// ── Fast mode: lightning toggle; race; usage blocks ──
SCENES.fast=(sc,t,B)=>{
 let o='';const T={speed:ps(sc,'speed'),credits:ps(sc,'credits'),models:ps(sc,'models'),cli:ps(sc,'cli'),ultra:ps(sc,'ultra'),tip:ps(sc,'tip')};const raceOut=at(t,T.models,.4);
 const on=t>=sc.start+1.2;
 B.push({id:'chip',x:624,y:0,width:480,height:76});o+=composerChip(624,0,'GPT-6 Astra','極高',true,on);
 if(t<T.speed+.3&&t>sc.start+.6)o+=S.rect({x:998,y:8,width:64,height:60,rx:18,fill:'none',stroke:C.amber,'stroke-width':4,opacity:.5+.5*Math.sin(t*6)**2});
 if(t>=T.speed){B.push({id:'race',x:0,y:110,width:1728,height:200});const r=at(t,T.speed+.2,3);
  const lane=(y,zh,en,v,c,b)=>S.text(0,y+8,zh,{'font-size':28,'font-weight':800,fill:C.ink})+S.text(0,y+38,en,{'font-size':19,fill:C.muted})+S.rect({x:240,y:y-18,width:1300,height:36,rx:18,fill:'#e5e8ef'})+S.rect({x:240,y:y-18,width:1300*v,height:36,rx:18,fill:c})+(b?icon3('bolt',240+1300*v-20,y-22,.9,'#fff',3):'')+(v>=1?S.text(1560,y+10,'完成',{'font-size':24,'font-weight':700,fill:c}):'');
  if(raceOut<1)o+=S.g({opacity:1-raceOut},lane(160,'一般','Standard',clamp(r*1.0),C.sub,false)+lane(260,'快速','Fast',clamp(r*1.6),C.amber,true));
  const info=[[T.models,'支援模型','GPT-6 Astra・GPT-6.1 Sol・GPT-6 Sol・GPT-6 Luna'],[T.cli,'CLI','輸入 /fast 切換'],[T.ultra,'Ultrafast','只有 Astra；Pro 500 美元與部分企業／教育版；用量 8 倍']];
  info.forEach(([t0,k,v],i)=>{if(t<t0+.3)return;o+=up(at(t,t0+.3,.5),S.rect({x:0,y:110+i*66,width:1728,height:56,rx:16,fill:'#f7f8fb',stroke:C.line})+S.text(24,147+i*66,k,{'font-size':26,'font-weight':800,fill:C.amber})+S.text(260,147+i*66,v,{'font-size':26,fill:C.ink}),8)});}
 if(t>=T.speed+1.4){B.push({id:'cost',x:0,y:340,width:1728,height:200});const u=at(t,T.speed+1.4,.6);
  const blocks=(x,y,n,c)=>{let s='';for(let i=0;i<Math.ceil(n);i++){const w=i<Math.floor(n)?80:80*(n-Math.floor(n));s+=S.rect({x:x+i*92,y,width:w,height:60,rx:12,fill:c})}return s};
  o+=up(u,S.text(0,380,'訂閱用量',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(0,410,'Included usage',{'font-size':19,fill:C.muted})+S.text(240,382,'一般',{'font-size':22,fill:C.sub})+blocks(300,350,1,C.sub)+S.text(860,382,'快速',{'font-size':22,fill:C.amber})+blocks(920,350,2.5,C.amber)+S.text(1200,392,'× 2.5',{'font-size':36,'font-weight':800,fill:C.amber}))
  if(t>=T.credits)o+=up(at(t,T.credits,.6),S.text(0,490,'購買的點數',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(0,520,'Purchased credits',{'font-size':19,fill:C.muted})+S.text(240,492,'一般',{'font-size':22,fill:C.sub})+blocks(300,460,1,C.sub)+S.text(860,492,'快速',{'font-size':22,fill:C.amber})+blocks(920,460,2,C.amber)+S.text(1110,502,'× 2',{'font-size':36,'font-weight':800,fill:C.amber}))}
 if(t>=T.tip){B.push({id:'tip',x:0,y:540,width:1728,height:56});o+=up(at(t,T.tip,.5),S.rect({x:0,y:540,width:1728,height:56,rx:18,fill:C.amberL})+S.text(864,578,'⚡ 趕時間才打開，平常關著比較省',{'font-size':26,'font-weight':700,fill:C.amber,'text-anchor':'middle'}),6)}
 return o;
};

// ── Sidebar: rebuilt icon column; callout card per item ──
const SIDE=[['home',null],['photo','images'],['clock','scheduled'],['books','library'],['plugin','plugins'],['dots','more'],['pr','review'],['folder','projects'],['grid','sites'],['pin','maps'],['cube','gpts']];
const SIDECARD={
 images:['圖像','Images','收著你生成的所有圖片，可放大、在畫布上比較與編輯'],
 scheduled:['已排程','Scheduled','定時（每天、每週）或由事件觸發的任務，結果回到這裡'],
 library:['檔案庫','Library','你上傳和產生的檔案，都可以在這裡找到'],
 plugins:['外掛程式','Plugins','瀏覽、安裝外掛；在對話中輸入 @ 就能呼叫'],
 more:['「…」選單','More menu','把常用的項目釘到側邊欄下方'],
 review:['程式碼審查','Code review','檢查 GitHub PR 與本機 Git 變更，送出審查意見'],
 projects:['專案','Projects','把相關的對話、檔案與指示放在一起'],
 sites:['網站','Sites','建立並發布網站：先存版本，再部署'],
 maps:['地圖','Maps','用你的位置找附近的地點與活動（依社群說明）'],
 gpts:['GPT','GPTs','自訂版的 ChatGPT；官方正協助轉成外掛']};
SCENES.sidebar=(sc,t,B)=>{
 let o='';const keys=Object.keys(SIDECARD).filter(k=>sc.phases.some(p=>p.name===k));const cur=[...keys].reverse().find(k=>t>=ps(sc,k))||keys[0];
 // icon column (screenshot layout: divider after "…")
 B.push({id:'side',x:0,y:0,width:120,height:606});o+=S.rect({x:0,y:0,width:120,height:606,rx:24,fill:'#eef1f7'});
 const yOf=i=>14+i*52+(i>5?20:0);
 SIDE.forEach(([ic,k],i)=>{const y=yOf(i),on=k===cur;if(on)o+=S.rect({x:14,y:y-4,width:92,height:52,rx:14,fill:'#fff',stroke:C.blue,'stroke-width':3});o+=icon3(ic,36,y,1,on?C.blue:C.sub,2.4);if(i===5)o+=S.path({d:`M24 ${y+56} H96`,stroke:'#cdd2de','stroke-width':2})});
 // card
 const i=SIDE.findIndex(s=>s[1]===cur),cy=yOf(i)+22,u=at(t,ps(sc,cur),.45),[zh,en,desc]=SIDECARD[cur];
 B.push({id:'card',x:200,y:40,width:1528,height:540});
 o+=S.path({d:`M112 ${cy} C160 ${cy} 160 ${310} 200 310`,stroke:C.blue,'stroke-width':3,fill:'none',opacity:clamp(u*2)});
 let c=panel([],'',200,40,1528,540,{rx:28,stroke:C.blue,sw:2.5})+icon3(SIDE[i][0],236,72,1.5,C.blue,2.2)+S.text(330,124,zh,{'font-size':52,'font-weight':800,fill:C.ink})+S.text(330+tw(zh,52)+20,124,en,{'font-size':28,fill:C.muted,'font-weight':600})+S.text(240,196,desc,{'font-size':30,fill:C.sub});
 if(cur==='maps')c+=chip(1440,70,'社群說明',{size:21,fill:C.amberL,color:C.amber});
 // per-item mini illustration (y 240..560)
 const X=240,Y=240,ill={
  images:()=>[0,1,2].map(j=>S.rect({x:X+j*300,y:Y,width:270,height:200,rx:16,fill:['#dfe7ff','#dcf2e9','#fcf0d6'][j]})+icon3('photo',X+j*300+100,Y+60,1.5,C.sub,2)).join(''),
  scheduled:()=>[['每天 08:00','整理昨日信件'],['每週一 09:00','產生週報'],['GitHub PR 時','自動審查']].map(([a,b],j)=>S.rect({x:X,y:Y+j*92,width:1100,height:76,rx:14,fill:'#f7f8fb'})+icon3('clock',X+16,Y+j*92+14,1,C.blue,2.6)+S.text(X+80,Y+j*92+48,a,{'font-size':26,'font-weight':700,fill:C.ink})+S.text(X+380,Y+j*92+48,b,{'font-size':26,fill:C.sub})).join(''),
  library:()=>['講義.pdf','成績.xlsx','簡報.pptx','網站.zip'].map((f,j)=>S.rect({x:X+j*280,y:Y,width:250,height:200,rx:16,fill:'#f7f8fb',stroke:C.line})+icon('file',X+j*280+90,Y+40,1.4,C.sub,2)+S.text(X+j*280+125,Y+170,f,{'font-size':23,fill:C.ink,'text-anchor':'middle'})).join(''),
  plugins:()=>['Browser','Computer Use','GitHub','Slack'].map((p,j)=>S.rect({x:X+j*280,y:Y,width:250,height:150,rx:16,fill:'#f7f8fb',stroke:C.line})+S.text(X+j*280+125,Y+86,p,{'font-size':26,'font-weight':700,fill:C.ink,'text-anchor':'middle'})).join('')+S.text(X,Y+220,'在對話輸入 @ 呼叫外掛',{'font-size':26,fill:C.blue}),
  more:()=>['專案 Projects','網站 Sites','地圖 Maps','GPTs','Pull requests'].map((s,j)=>S.rect({x:X,y:Y+j*58,width:520,height:48,rx:12,fill:'#f7f8fb'})+S.text(X+20,Y+j*58+33,s,{'font-size':24,fill:C.ink})+icon3('pin',X+470,Y+j*58+6,.75,C.blue,3)).join('')+S.text(X+600,Y+120,'釘選後出現在分隔線下方',{'font-size':28,fill:C.sub}),
  review:()=>S.rect({x:X,y:Y,width:1100,height:76,rx:14,fill:'#f7f8fb'})+icon3('pr',X+16,Y+14,1,C.green,2.6)+S.text(X+80,Y+48,'#42 登入頁加上表單驗證',{'font-size':26,'font-weight':700,fill:C.ink})+S.rect({x:X,y:Y+96,width:1100,height:120,rx:14,fill:'#20232f'})+S.text(X+24,Y+142,'- if (email)',{'font-size':24,fill:'#ff9b92','font-family':'Consolas,monospace'})+S.text(X+24,Y+184,'+ if (isValid(email))',{'font-size':24,fill:'#7fe0b4','font-family':'Consolas,monospace'})+chip(X+860,Y+16,'送出審查',{size:22,fill:C.ink,color:'#fff'}),
  projects:()=>icon('folder',X,Y,3,C.blue,1.4)+['對話','檔案','指示'].map((s,j)=>chip(X+200+j*180,Y+50,s,{size:26})).join('')+S.text(X+200,Y+190,'同一個專案的內容都在一起',{'font-size':26,fill:C.sub}),
  sites:()=>S.rect({x:X,y:Y,width:700,height:280,rx:16,fill:'#f7f8fb',stroke:C.line})+S.rect({x:X,y:Y,width:700,height:40,rx:16,fill:'#e7e9ef'})+S.text(X+20,Y+28,'https://….sites',{'font-size':20,fill:C.sub})+chip(X+760,Y+40,'① 存成版本',{size:26})+chip(X+760,Y+130,'② 部署上線',{size:26,fill:C.greenL,color:C.green}),
  maps:()=>S.rect({x:X,y:Y,width:900,height:280,rx:16,fill:'#e8f3ec'})+S.path({d:`M${X} ${Y+180} C${X+300} ${Y+120} ${X+500} ${Y+240} ${X+900} ${Y+150}`,stroke:'#fff','stroke-width':14,fill:'none'})+[[200,80],[480,150],[700,60]].map(([a,b])=>icon3('pin',X+a,Y+b,1.2,C.red,3)).join('')+S.text(X+940,Y+120,'附近的地點、店家、活動',{'font-size':26,fill:C.ink}),
  gpts:()=>S.rect({x:X,y:Y+40,width:300,height:160,rx:20,fill:'#f7f8fb',stroke:C.line})+icon3('cube',X+120,Y+60,1.3,C.sub,2.4)+S.text(X+150,Y+180,'自訂 GPT',{'font-size':26,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+arrow2(X+330,Y+120,X+460,Y+120,1,C.blue,6)+S.rect({x:X+490,y:Y+40,width:300,height:160,rx:20,fill:C.blueL,stroke:C.blue})+icon3('plugin',X+610,Y+60,1.3,C.blue,2.4)+S.text(X+640,Y+180,'外掛',{'font-size':26,'font-weight':700,fill:C.blue,'text-anchor':'middle'})+S.text(X+840,Y+130,'指示變成技能，檔案一起帶過去',{'font-size':24,fill:C.sub})};
 c+=up(at(t,ps(sc,cur)+.3,.6),ill[cur]());
 const note={images:['imagecost','用量約為一般對話的 3–5 倍',C.red,C.redL,240,470],scheduled:['schedreq','桌面排程：電腦要開著、App 要執行',C.amber,C.amberL,240,530],sites:['siteslive','每次部署都是正式上線的網址',C.red,C.redL,1000,320]}[cur];
 if(note&&t>=ps(sc,note[0]))c+=up(at(t,ps(sc,note[0]),.5),chip(note[4],note[5],note[1],{size:26,fill:note[3],color:note[2]}),8);
 o+=up(u,c,16);
 return o;
};

// ── Comparison: range bars on a log axis (same unit, same plan) ──
SCENES.usageBars=(sc,t,B)=>{
 let o='';const x0=380,x1=1660,lg=v=>x0+(x1-x0)*Math.log10(v)/Math.log10(3000);
 B.push({id:'chart',x:0,y:0,width:1728,height:606});
 o+=S.text(0,30,'對數刻度 · log scale',{'font-size':21,fill:C.muted});
 const ax=at(t,sc.start+.3,.8);o+=S.g({opacity:ax},S.path({d:`M${x0} 480 H${x1}`,stroke:C.ink,'stroke-width':2})+[1,10,100,1000,3000].map(v=>S.path({d:`M${lg(v)} 480 V490`,stroke:C.ink,'stroke-width':2})+S.text(lg(v),520,v.toLocaleString('en-US'),{'font-size':22,fill:C.sub,'text-anchor':'middle'})+S.path({d:`M${lg(v)} 120 V480`,stroke:'#e3e6ee','stroke-width':1.5})).join('')+S.text(x1,560,'則 messages',{'font-size':21,fill:C.muted,'text-anchor':'end'}));
 const rows=[['astra','GPT-6 Astra',5,45,'#5b4fd6'],['sol','GPT-6.1 Sol',15,160,C.blue],['luna','GPT-6 Luna',350,3000,C.green]];
 rows.forEach(([k,n,a,b,c],i)=>{const u=at(t,ps(sc,k),.8);if(u<=0)return;const y=110+i*110,xa=lg(a),xb=lerp(xa,lg(b),E.out(u));
  o+=S.text(0,y+10,n,{'font-size':30,'font-weight':800,fill:C.ink})+S.rect({x:xa,y:y-20,width:Math.max(4,xb-xa),height:40,rx:20,fill:c,opacity:.9})
   +(u>.6?(lg(b)>1400?S.text(xa-16,y+10,`${a}–${b.toLocaleString('en-US')} 則`,{'font-size':26,'font-weight':700,fill:c,'text-anchor':'end'}):S.text(xb+16,y+10,`${a}–${b.toLocaleString('en-US')} 則`,{'font-size':26,'font-weight':700,fill:c})):'')});
 const n=at(t,ps(sc,'note'),.5);if(n>0)o+=up(n,S.rect({x:0,y:540,width:900,height:52,rx:16,fill:C.amberL})+S.text(20,575,'估計範圍；實際依任務、上下文與思考等級而定',{'font-size':24,fill:C.amber,'font-weight':700}),6);
 const cl=at(t,ps(sc,'cloud'),.5);if(cl>0)o+=S.g({opacity:cl},S.rect({x:940,y:540,width:788,height:52,rx:16,fill:'#eef0f5'})+S.text(960,575,'雲端任務可能比本機訊息更耗用量',{'font-size':24,fill:C.sub,'font-weight':700}));
 return o;
};

// ── Application: reading remaining usage (values from the user's screenshot) ──
SCENES.usageRead=(sc,t,B)=>{
 let o='';const T={five:ps(sc,'five'),week:ps(sc,'week'),either:ps(sc,'either'),banked:ps(sc,'banked'),refresh:ps(sc,'refresh'),expire:ps(sc,'expire'),credits:ps(sc,'credits')};
 // menu rebuild (left)
 B.push({id:'menu',x:0,y:0,width:560,height:606});
 let m=panel([],'',0,0,560,606,{rx:26})+S.circle({cx:48,cy:52,r:24,fill:'#5fbf9f'})+S.text(48,60,'AI',{'font-size':20,'font-weight':700,fill:'#fff','text-anchor':'middle'})+S.text(86,48,'你的帳號',{'font-size':25,'font-weight':700,fill:C.ink})+S.text(86,76,'Plus',{'font-size':19,fill:C.muted});
 const hot=(y,h,on)=>on?S.rect({x:14,y,width:532,height:h,rx:14,fill:C.amberL,stroke:C.amber,'stroke-width':2.5}):'';
 m+=hot(104,170,t>=T.five&&t<T.banked)+S.text(40,140,'剩餘用量',{'font-size':26,'font-weight':700,fill:C.ink});
 const refill=t>=T.expire?1-E.inout(at(t,T.expire,.6)):t>=T.refresh?E.inout(at(t,T.refresh+.6,1.2)):0,v5=Math.round(lerp(92,100,refill)),v7=Math.round(lerp(82,100,refill));
 m+=S.text(40,196,'5 小時',{'font-size':26,'font-weight':800,fill:C.ink})+S.text(380,196,v5+'%',{'font-size':26,fill:C.sub,'text-anchor':'end'})+S.text(520,196,'下午3:36',{'font-size':22,fill:C.muted,'text-anchor':'end'});
 m+=S.text(40,250,'1 週',{'font-size':26,'font-weight':800,fill:C.ink})+S.text(380,250,v7+'%',{'font-size':26,fill:C.sub,'text-anchor':'end'})+S.text(520,250,refill>.5?'重新計算':'10月14日',{'font-size':22,fill:refill>.5?C.blue:C.muted,'text-anchor':'end'});
 m+=S.text(40,330,'升級為 Pro',{'font-size':24,fill:C.ink})+hot(356,60,t>=T.banked&&t<T.credits)+S.text(40,396,'可用重置 '+(refill>.5?1:2)+' 次',{'font-size':24,fill:C.ink})+S.text(520,396,'›',{'font-size':26,fill:C.muted,'text-anchor':'end'})+S.text(40,456,'深入了解',{'font-size':24,fill:C.ink})+hot(480,56,t>=ps(sc,'page'))+S.text(40,516,'設定',{'font-size':24,fill:C.ink})+(t>=ps(sc,'page')?S.text(520,516,'› 使用量與帳單',{'font-size':22,fill:C.amber,'font-weight':700,'text-anchor':'end'}):'')+(t>=ps(sc,'cli')?S.g({opacity:at(t,ps(sc,'cli'),.4)},S.rect({x:24,y:548,width:300,height:44,rx:12,fill:'#20232f'})+S.text(44,578,'$ /status',{'font-size':23,fill:'#c9d6ff','font-family':'Consolas,monospace'})+S.text(340,578,'CLI',{'font-size':21,fill:C.muted})):'');
 o+=up(at(t,sc.start+.2,.6),m);
 // right explanations
 B.push({id:'explain',x:600,y:0,width:1128,height:606});o+=panel([],'',600,0,1128,606,{rx:26});
 o+=chip(630,24,'示範：數值取自你的截圖',{size:21,fill:C.amberL,color:C.amber});
 const meter=(y,zh,v,reset,c)=>S.text(640,y,zh,{'font-size':30,'font-weight':800,fill:C.ink})+S.rect({x:800,y:y-26,width:700,height:32,rx:16,fill:'#e5e8ef'})+S.rect({x:800,y:y-26,width:700*v/100,height:32,rx:16,fill:c})+S.text(1520,y,v+'%',{'font-size':28,'font-weight':800,fill:C.ink})+S.text(800,y+40,reset,{'font-size':22,fill:C.muted});
 if(t>=T.five)o+=up(at(t,T.five,.5),meter(140,'5 小時',v5,'下午 3:36 重置 · resets at 3:36 PM',C.blue));
 if(t>=T.week)o+=up(at(t,T.week,.5),meter(250,'1 週',v7,refill>.5?'每週重置日依使用日重算 · new weekly date':'10 月 14 日重置 · resets Oct 14',C.green));
 if(t>=T.either&&t<T.banked)o+=up(at(t,T.either,.5),S.rect({x:640,y:330,width:1040,height:70,rx:18,fill:C.redL})+S.text(1160,375,'任何一個用完 → 等它重置',{'font-size':30,'font-weight':800,fill:C.red,'text-anchor':'middle'}));
 if(t>=T.banked)o+=up(at(t,T.banked,.5),S.rect({x:640,y:330,width:1040,height:70,rx:18,fill:C.blueL})+S.text(1160,375,'可用重置：存起來的一次性重置',{'font-size':30,'font-weight':800,fill:C.blue,'text-anchor':'middle'}));
 if(t>=T.refresh)o+=up(at(t,T.refresh,.5),S.text(640,450,'用一次 → 兩個額度都刷新（示意）',{'font-size':27,fill:C.ink,'font-weight':600}));
 if(t>=T.expire)o+=up(at(t,T.expire,.5),chip(640,480,'會過期',{size:24,fill:C.amberL,color:C.amber})+chip(800,480,'不是購買的點數',{size:24,fill:'#eef0f5',color:C.sub}));
 if(t>=T.credits)o+=up(at(t,T.credits,.5),S.rect({x:640,y:548,width:1040,height:46,rx:14,fill:C.greenL})+S.text(1160,580,'用完了？Plus 可以另外購買點數',{'font-size':25,'font-weight':700,fill:C.green,'text-anchor':'middle'}));
 return o;
};

// ── Outlook ──
SCENES.ep2Outlook=(sc,t,B)=>{
 let o='';const T={b:ps(sc,'b'),next:ps(sc,'next')};
 B.push({id:'oa',x:0,y:0,width:840,height:420});
 o+=up(at(t,sc.start+.2,.6),panel([],'',0,0,840,420,{rx:26,stroke:C.green,sw:2.5})+chip(28,26,'已公布 Announced',{size:22,fill:C.greenL,color:C.green})+S.text(32,150,'2026-10-02',{'font-size':48,'font-weight':800,fill:C.green})+S.text(32,206,'iOS 小工具顯示剩餘用量',{'font-size':34,'font-weight':800,fill:C.ink})+S.text(32,248,'iOS widgets show remaining usage and resets',{'font-size':22,fill:C.muted})+icon2('phone',60,280,2.2,C.ink,1.6)+S.rect({x:170,y:300,width:300,height:30,rx:15,fill:'#e5e8ef'})+S.rect({x:170,y:300,width:276,height:30,rx:15,fill:C.blue})+S.text(490,324,'92%',{'font-size':26,'font-weight':800,fill:C.ink}));
 if(t>=T.b){B.push({id:'ob',x:888,y:0,width:840,height:420});o+=up(at(t,T.b,.6),panel([],'',888,0,840,420,{rx:26,stroke:C.amber,sw:2.5})+chip(916,26,'趨勢（推論） Trend',{size:22,fill:C.amberL,color:C.amber})+S.text(920,150,'模型分得更細',{'font-size':40,'font-weight':800,fill:C.ink})+S.text(920,210,'選對模型 > 一律用最強',{'font-size':34,'font-weight':800,fill:C.amber})+S.text(920,252,'Pick the right tier, not always the strongest',{'font-size':22,fill:C.muted}))}
 if(t>=T.next){B.push({id:'on',x:0,y:470,width:1728,height:110});o+=up(at(t,T.next,.6),S.rect({x:0,y:470,width:1728,height:110,rx:26,fill:C.ink})+S.text(40,537,'下一部影片 Next ▸',{'font-size':30,'font-weight':800,fill:'#c9d6ff'})+S.text(360,537,'設定逐頁說明',{'font-size':34,'font-weight':700,fill:'#fff'})+S.text(1688,537,'Every settings page',{'font-size':22,fill:'#c9d6ff','text-anchor':'end'}))}
 return o;
};
