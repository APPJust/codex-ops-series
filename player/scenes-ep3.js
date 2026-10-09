// Episode 3 renderers: the Settings window rebuilt from the user's screenshots (nav order and labels),
// with each page's key options drawn from the official docs. Pure functions of (scene, t).
const NAV=[['個人',null],['一般','general','gear'],['通知','notifications','bell'],['匯入','import','down'],['個人檔案','profile','person'],['外觀','appearance','sun'],['帳戶','account','person'],['Archived chats','archived','box'],
 ['家長控制','parental','person'],['受信任聯絡人','trusted','person'],['聲音','voice','mic'],['組態','config','term'],['個人化','personalize','spark'],['Mini 與寵物','pets','pet'],['鍵盤快捷鍵','shortcuts','key'],['使用量與帳單','usage','gauge'],['資料控制','data','shield'],
 ['整合',null],['外掛程式','plugins','plug'],['密碼','passwords','lock'],['Computer use','computer','cursor'],['Appshots','appshots','frame'],['瀏覽器','browser','web'],['雲端電腦','cloudpc','cloudpc'],
 ['程式設計',null],['掛勾','hooks','hook'],['連線','connections','globe'],['Codex Cloud','cloud','cloud'],['舊版 Codex Cloud','legacy','cloud'],['程式碼審查','review','pr'],['Git','git','branch'],['Worktrees','worktrees','wt']];
// page content: [type, label, value/options, extra]
const PAGES={
 general:{zh:'一般',en:'General',rows:[['radio','送出訊息',['Enter 送出','Ctrl+Enter 送出'],0],['radio','工作中追加的訊息',['引導 Steer','排隊 Queue'],0],['toggle','執行中防止睡眠（macOS／Linux）',false]]},
 notifications:{zh:'通知',en:'Notifications',rows:[['radio','回合完成通知',['永不','只在背景時','一律'],1],['toggle','需要核准時通知',true],['toggle','提問時通知',true]]},
 import:{zh:'匯入',en:'Import',rows:[['chips','匯入來源',['Claude Code','Claude Cowork','Cursor']],['value','會帶過來','AGENTS.md・設定・技能・MCP・近 30 天對話'],['note','不會更改或刪除原本工具的設定']]},
 profile:{zh:'個人檔案',en:'Profile',rows:[['value','活動統計','累計 token・連續天數・最長任務'],['value','名稱與頭像','編輯'],['value','個人卡片','分享使用亮點'],['value','邀請','邀請好友']]},
 appearance:{zh:'外觀',en:'Appearance',rows:[['radio','主題',['淺色','深色','系統'],2],['value','顏色','強調色・背景・前景'],['value','字型與字級','介面 14 px・程式碼 14 px'],['toggle','半透明側邊欄',true]]},
 account:{zh:'帳戶',en:'Account',tag:['官方文件未詳述','muted'],rows:[['value','帳號資訊','—'],['note','官方文件沒有說明這一頁的細節']]},
 archived:{zh:'Archived chats',en:'Archived chats',rows:[['list','封存的對話',['對話名稱・日期・專案','對話名稱・日期・專案']],['value','還原','取消封存']]},
 parental:{zh:'家長控制',en:'Parental controls',tag:['ChatGPT 共通','amber'],rows:[['value','連結青少年帳號','雙方同意後連結'],['toggle','減少敏感內容',true],['value','安靜時段','設定不能使用的時段'],['note','依說明中心與新聞報導（2025-09 推出）']]},
 trusted:{zh:'受信任聯絡人',en:'Trusted contact',tag:['ChatGPT 共通','amber'],rows:[['value','聯絡人','1 位成年人'],['note','對方需在 1 週內接受邀請'],['note','通知只說明原因，不含對話內容']]},
 voice:{zh:'聲音',en:'Voice',rows:[['keys','語音對話快捷鍵',['自訂']],['toggle','螢幕情境（macOS）',false]]},
 config:{zh:'組態',en:'Configuration',rows:[['value','使用者設定','開啟 config.toml'],['select','核准政策 Approval policy','On request'],['select','沙盒 Sandbox','Workspace write'],['toggle','允許網路存取',false],['select','個性 Personality','Pragmatic']]},
 personalize:{zh:'個人化',en:'Personalization',rows:[['value','個人指示','AGENTS.md'],['toggle','記憶 Memories',true],['toggle','建議提示',true]]},
 pets:{zh:'Mini 與寵物',en:'Mini and pets',rows:[['radio','顯示',['內建寵物','自訂寵物','Mini'],0],['keys','快速對話（Windows）',['Win','Alt','P']],['value','寵物大小','可調整']]},
 shortcuts:{zh:'鍵盤快捷鍵',en:'Keyboard shortcuts',rows:[['keys','開啟設定',['Ctrl',',']],['keys','顯示寵物',['Alt','Win','P']],['value','搜尋','依指令或依按鍵'],['value','還原','重設為預設值']]},
 usage:{zh:'使用量與帳單',en:'Usage and billing',rows:[['meter','5 小時',92,'下午 3:36 重置'],['meter','1 週',82,'10 月 14 日重置'],['value','可用重置','2 次'],['value','點數','購買點數']],foot:'數值取自你提供的截圖'},
 data:{zh:'資料控制',en:'Data controls',tag:['ChatGPT 共通','amber'],rows:[['toggleAnim','為所有人改善模型',true],['note','關閉後，新對話不會用於訓練模型'],['value','匯出資料','另有說明']]},
 plugins:{zh:'外掛程式',en:'Plugins',rows:[['list','已安裝',['Browser','Computer Use']],['value','MCP 伺服器','新增伺服器'],['note','也可以在對話中輸入 @ 呼叫外掛']]},
 passwords:{zh:'密碼',en:'Passwords',tag:['介面細節未詳述','muted'],rows:[['value','儲存的登入','雲端瀏覽器'],['note','重複使用前需要你確認'],['note','依官方 dots 文件「Save to Passwords」說明']]},
 computer:{zh:'Computer use',en:'Computer use',rows:[['toggle','控制 Control',true],['chips','一律允許的 App',['Chrome','Excel','PowerPoint']],['note','Windows：核准紀錄存在 config.toml']]},
 appshots:{zh:'Appshots',en:'Appshots',rows:[['keys','快捷鍵（同時按）',['Alt','Alt']],['radio','送到',['目前對話','新對話','自動'],2],['note','自動：60 秒內用過的對話，否則開新對話']]},
 browser:{zh:'瀏覽器',en:'Browser',rows:[['value','下載位置','下載資料夾'],['select','瀏覽・下載・上傳','需要核准'],['value','網站例外','逐站設定'],['toggle','開發者模式：完整 CDP 存取',false]]},
 cloudpc:{zh:'雲端電腦',en:'Cloud computer',rows:[['select','網站權限','一律詢問'],['value','瀏覽器資料','全部清除'],['note','依官方 Cloud browser 說明；Work 雲端任務使用']]},
 hooks:{zh:'掛勾',en:'Hooks',rows:[['chips','事件',['PreToolUse','PostToolUse','Stop','PermissionRequest']],['value','設定檔','hooks.json・config.toml'],['note','新增或修改的掛勾，要先信任才會執行']]},
 connections:{zh:'連線',en:'Connections',rows:[['value','控制這台電腦','手機掃 QR code 配對'],['value','SSH 主機','新增主機・選擇專案資料夾'],['note','主機要保持開機、上線並登入同一帳號']]},
 cloud:{zh:'Codex Cloud',en:'Codex Cloud',rows:[['value','環境 Environments','建立環境'],['select','網路存取','套件管理器'],['value','環境變數・網路密鑰','逐一設定'],['select','誰可以使用','只有我']]},
 legacy:{zh:'舊版 Codex Cloud',en:'Legacy Codex Cloud',tag:['規劃淘汰','red'],rows:[['chips','仍支援',['程式碼審查','GitHub','Linear']],['note','新環境請用上一頁的 Codex Cloud']]},
 review:{zh:'程式碼審查',en:'Code review',rows:[['value','審查指示 Review instructions','編輯'],['toggle','GitHub 自動審查',false],['note','自動審查需 Codex 連接器與儲存庫權限']]},
 git:{zh:'Git',en:'Git',rows:[['value','分支命名','依你的規則'],['toggle','允許強制推送',false],['value','Commit・PR 說明提示詞','編輯'],['radio','審查方式',['Inline','Detached'],0]]},
 worktrees:{zh:'Worktrees',en:'Worktrees',rows:[['value','Worktree 根目錄','$CODEX_HOME/worktrees'],['value','保留數量','15'],['toggle','自動刪除舊的 worktree',true],['note','刪除前會先存快照，可再還原']]}
};
const TAGC={muted:[C.row,C.sub],amber:[C.amberL,C.amber],red:[C.redL,C.red]};
function navIcon(k,x,y){const m={gear:'gear',bell:'warn',down:'file',person:'person',sun:'gear',box:'folder',mic:'person',term:'term',spark:'shield',pet:'bubble',key:'code',gauge:'gauge',shield:'shield',plug:'code',lock:'shield',cursor:'person',frame:'web',web:'web',cloudpc:'cloud',hook:'code',globe:'globe',cloud:'cloud',pr:'code',branch:'code',wt:'folder'}[k]||'file';return anyIcon(m,x,y,.5,C.sub,3.2)}
function navScroll(cur){const rowH=36,vis=606-132-10,idx=Math.max(0,NAV.findIndex(n=>n[1]===cur));return Math.min(Math.max(0,idx*rowH-vis/2+rowH),NAV.length*rowH-vis)}
function settingsNav(B,cur,t,want){
 // nav column with search; scrolls so the active row stays in view
 const X=0,Y=0,W=420,H=606,rowH=36;let o=panel(B,'nav',X,Y,W,H,{rx:24,fill:'#f7f8fb'});
 o+=S.text(28,52,'設定',{'font-size':30,'font-weight':800,fill:C.ink})+S.rect({x:22,y:70,width:376,height:44,rx:22,fill:'#eceef3'})+S.text(58,99,'搜尋',{'font-size':21,fill:C.muted});
 const top=132,vis=H-top-10;
 let rows='';NAV.forEach(([zh,k,ic],i)=>{const y=top+i*rowH-want;if(y<top-2||y+rowH>top+vis+2)return;
  if(!k){rows+=S.text(30,y+26,zh,{'font-size':19,'font-weight':700,fill:C.muted});return}
  const on=k===cur;if(on)rows+=S.rect({x:14,y:y+2,width:392,height:rowH-4,rx:12,fill:'#e3e7f0'});
  rows+=navIcon(ic,28,y+6)+S.text(66,y+25,zh,{'font-size':21,fill:on?C.ink:C.sub,'font-weight':on?700:500})});
 o+=`<clipPath id="navclip"><rect x="0" y="${top}" width="${W}" height="${vis}"/></clipPath>`+S.g({'clip-path':'url(#navclip)'},rows);
 return o;
}
function pageBody(key,x,y,w,u){
 const p=PAGES[key];if(!p)return '';let o='';
 o+=S.text(x,y+44,p.zh,{'font-size':42,'font-weight':800,fill:C.ink})+S.text(x+tw(p.zh,42)+18,y+44,p.en,{'font-size':24,fill:C.muted,'font-weight':600});
 if(p.tag){const [f,c]=TAGC[p.tag[1]];o+=chip(x+w-tw(p.tag[0],21)-40,y+12,p.tag[0],{size:21,fill:f,color:c})}
 p.rows.forEach((r,i)=>{const ry=y+80+i*92,ru=clamp(u*5-i*.8);if(ru<=0)return;let g=S.rect({x,y:ry,width:w,height:80,rx:16,fill:'#fff',stroke:C.line,'stroke-width':1.5});
  const [type,label,val,ex]=r;
  if(type==='note'){g=S.rect({x,y:ry,width:w,height:80,rx:16,fill:'#f7f8fb'})+S.text(x+24,ry+50,'ⓘ '+label,{'font-size':24,fill:C.sub})}
  else{g+=S.text(x+24,ry+50,label,{'font-size':25,'font-weight':600,fill:C.ink});const rx=x+w-24;
   if(type==='toggle'||type==='toggleAnim'){const on=type==='toggleAnim'?(clamp(u*2-1.2)<.5):val;g+=S.rect({x:rx-64,y:ry+24,width:64,height:34,rx:17,fill:on?C.blue:'#cfd3de'})+S.circle({cx:on?rx-17:rx-47,cy:ry+41,r:13,fill:'#fff'})}
   else if(type==='radio'){let cx=rx;for(let j=val.length-1;j>=0;j--){const s=val[j],bw=tw(s,21)+34;cx-=bw;g+=S.rect({x:cx,y:ry+20,width:bw,height:40,rx:20,fill:j===ex?C.ink:'#eef0f5'})+S.text(cx+17,ry+47,s,{'font-size':21,fill:j===ex?'#fff':C.sub,'font-weight':600});cx-=8}}
   else if(type==='select'){const bw=tw(val,21)+64;g+=S.rect({x:rx-bw,y:ry+20,width:bw,height:40,rx:12,fill:'#eef0f5'})+S.text(rx-bw+16,ry+47,val,{'font-size':21,fill:C.ink})+S.path({d:`M${rx-30} ${ry+36} l7 7 l7 -7`,stroke:C.sub,'stroke-width':2.5,fill:'none'})}
   else if(type==='value'){g+=S.text(rx,ry+49,val,{'font-size':22,fill:C.sub,'text-anchor':'end'})}
   else if(type==='keys'){let cx=rx;for(let j=val.length-1;j>=0;j--){const s=val[j],bw=Math.max(44,tw(s,21)+26);cx-=bw;g+=S.rect({x:cx,y:ry+20,width:bw,height:40,rx:9,fill:'#fff',stroke:C.ink,'stroke-width':2})+S.text(cx+bw/2,ry+47,s,{'font-size':21,'font-weight':700,fill:C.ink,'text-anchor':'middle'});cx-=10}}
   else if(type==='chips'){let cx=rx;for(let j=val.length-1;j>=0;j--){const s=val[j],bw=tw(s,20)+30;cx-=bw;g+=S.rect({x:cx,y:ry+22,width:bw,height:36,rx:18,fill:C.blueL})+S.text(cx+15,ry+46,s,{'font-size':20,'font-weight':600,fill:C.blue});cx-=8}}
   else if(type==='list'){g+=val.map((s,j)=>S.text(rx,ry+34+j*28,s,{'font-size':20,fill:C.sub,'text-anchor':'end'})).join('')}
   else if(type==='meter'){const bw=360,bx=rx-bw-150;g+=S.rect({x:bx,y:ry+32,width:bw,height:16,rx:8,fill:'#e5e8ef'})+S.rect({x:bx,y:ry+32,width:bw*val/100*E.out(clamp(u*2)),height:16,rx:8,fill:C.blue})+S.text(bx+bw+16,ry+48,val+'%',{'font-size':23,'font-weight':800,fill:C.ink})+S.text(rx,ry+48,ex,{'font-size':19,fill:C.muted,'text-anchor':'end'})}}
  o+=up(ru,g,14)});
 if(p.foot)o+=S.text(x,y+80+p.rows.length*92+26,p.foot,{'font-size':19,fill:C.muted});
 return o;
}
SCENES.settings=(sc,t,B)=>{
 const items=sc.phases.filter(p=>PAGES[p.name]);let cur=items[0],prev=null;
 const L=.3; // page swaps lead the narration slightly
 for(const p of items){if(t>=p.start-L){prev=cur===p?prev:cur;cur=p}}
 const i=items.indexOf(cur),last=i>0?items[i-1]:null;
 const want=last?lerp(navScroll(last.name),navScroll(cur.name),E.inout(at(t,cur.start-L,.45))):navScroll(cur.name);
 let o=settingsNav(B,cur.name,t,want);
 // page swap: old page fades out over 0.25 s, then the new page builds row by row
 B.push({id:'page',x:450,y:0,width:1278,height:606});
 o+=panel([],'',450,0,1278,606,{rx:24});
 const sw=at(t,cur.start-L,.25);
 if(last&&sw<1)o+=S.g({opacity:1-sw},pageBody(last.name,490,20,1198,1));
 if(sw>=1||!last)o+=pageBody(cur.name,490,20,1198,at(t,cur.start-L+(last?.25:0),1.2));
 return o;
};

// ── Origin: avatar menu → Settings; date; three groups ──
SCENES.settingsIntro=(sc,t,B)=>{
 const T={open:ps(sc,'open'),date:ps(sc,'date'),groups:ps(sc,'groups')};let o='';
 // rebuilt account menu (generic account name)
 const mu=at(t,sc.start+.2,.6),menuOut=at(t,T.date,.5);
 if(menuOut<1){B.push({id:'menu',x:120,y:0,width:520,height:600,overlapGroup:'intro'});
  const items=[['剩餘用量',''],['升級為 Pro','↗'],['可用重置 2 次','›'],['深入了解','↗'],['Show Pet','Alt+Win+P'],['邀請好友',''],['設定','Ctrl+,'],['說明','›'],['登出','']];
  let m=panel([],'',120,0,520,600,{rx:26})+S.circle({cx:168,cy:52,r:24,fill:'#5fbf9f'})+S.text(168,60,'AI',{'font-size':20,'font-weight':700,fill:'#fff','text-anchor':'middle'})+S.text(206,48,'你的帳號',{'font-size':25,'font-weight':700,fill:C.ink})+S.text(206,76,'Plus',{'font-size':19,fill:C.muted});
  items.forEach(([s,k],i)=>{const y=108+i*54,hot=s==='設定'&&t>=T.open;if(hot)m+=S.rect({x:136,y:y-4,width:488,height:50,rx:14,fill:C.amberL,stroke:C.amber,'stroke-width':2.5});
   m+=S.text(162,y+29,s,{'font-size':24,fill:C.ink,'font-weight':hot?800:500})+(k?S.text(600,y+29,k,{'font-size':20,fill:C.muted,'text-anchor':'end'}):'')});
  o+=S.g({opacity:clamp(mu*1.6)*(1-menuOut)},m);
  const ku=at(t,T.open+.5,.5);if(ku>0)o+=S.g({opacity:clamp(ku*1.6)*(1-menuOut)},S.text(760,300,'或按',{'font-size':30,fill:C.sub})+S.rect({x:840,y:262,width:110,height:60,rx:12,fill:'#fff',stroke:C.ink,'stroke-width':3})+S.text(895,302,'Ctrl',{'font-size':28,'font-weight':800,fill:C.ink,'text-anchor':'middle'})+S.text(972,302,'+',{'font-size':32,fill:C.sub})+S.rect({x:996,y:262,width:70,height:60,rx:12,fill:'#fff',stroke:C.ink,'stroke-width':3})+S.text(1031,302,',',{'font-size':34,'font-weight':800,fill:C.ink,'text-anchor':'middle'}))}
 // date
 const du=at(t,T.date+.45,.6),dOut=at(t,T.groups,.5);
 if(du>0){B.push({id:'date',x:364,y:120,width:1000,height:260,overlapGroup:'intro'});o+=S.g({opacity:1-dOut*.0},up(du,S.text(864,230,'2026-07-09',{'font-size':96,'font-weight':800,fill:C.green,'text-anchor':'middle'})+S.text(864,300,'Codex 併入 ChatGPT 桌面 App',{'font-size':36,'font-weight':700,fill:C.ink,'text-anchor':'middle'})+S.text(864,344,'Codex joins the ChatGPT desktop app',{'font-size':24,fill:C.muted,'text-anchor':'middle'})))}
 // groups (below the date)
 const gu=at(t,T.groups,.6);
 if(gu>0){const G=[['個人','Personal','16 頁',C.blue],['整合','Integrations','6 頁',C.green],['程式設計','Coding','7 頁',C.amber]];B.push({id:'groups',x:180,y:400,width:1368,height:200});
  G.forEach(([zh,en,n,c],i)=>{const u=at(t,T.groups+i*.5,.5),x=180+i*468;o+=up(u,S.rect({x,y:400,width:432,height:190,rx:24,fill:'#fff',stroke:c,'stroke-width':3})+S.text(x+30,464,zh,{'font-size':40,'font-weight':800,fill:c})+S.text(x+30,500,en,{'font-size':22,fill:C.muted})+S.text(x+30,560,n,{'font-size':30,'font-weight':700,fill:C.ink}))})}
 return o;
};

// ── Comparison: Configuration defaults vs. this chat's permission menu ──
SCENES.cfgVsChat=(sc,t,B)=>{
 const T={cfg:sc.start,chat:ps(sc,'chat'),both:ps(sc,'both')};let o='';
 const a=at(t,T.cfg+.2,.6),b=at(t,T.chat,.6),c=at(t,T.both,.6);
 B.push({id:'cfg',x:0,y:20,width:760,height:470});B.push({id:'chatp',x:968,y:20,width:760,height:470});
 o+=up(a,panel([],'',0,20,760,470,{rx:26,stroke:t<T.chat?C.blue:C.line,sw:t<T.chat?3:1.5})+S.text(32,82,'設定 › 組態',{'font-size':34,'font-weight':800,fill:C.ink})+S.text(32,118,'Configuration = 預設值 Defaults',{'font-size':23,fill:C.blue,'font-weight':700})
  +[['核准政策','On request'],['沙盒','Workspace write'],['允許網路存取','關閉']].map(([k,v],i)=>S.rect({x:32,y:150+i*92,width:696,height:76,rx:16,fill:'#f7f8fb',stroke:C.line})+S.text(56,197+i*92,k,{'font-size':26,'font-weight':600,fill:C.ink})+S.text(704,197+i*92,v,{'font-size':23,fill:C.sub,'text-anchor':'end'})).join('')
  +S.text(32,456,'影響之後開的每個新對話',{'font-size':23,fill:C.sub}));
 o+=up(b,panel([],'',968,20,760,470,{rx:26,stroke:t>=T.chat&&t<T.both?C.blue:C.line,sw:t>=T.chat&&t<T.both?3:1.5})+S.text(1000,82,'輸入框下方',{'font-size':34,'font-weight':800,fill:C.ink})+S.text(1000,118,'Permission menu = 這個對話 This chat',{'font-size':23,fill:C.blue,'font-weight':700})
  +S.rect({x:1000,y:160,width:696,height:150,rx:24,fill:'#fff',stroke:'#dfe2ea','stroke-width':2})+S.text(1028,210,'想做什麼都可以',{'font-size':26,fill:'#a3a8b8'})+icon2('shield',1022,256,.8,C.sub,2.6)+S.text(1066,284,'代我核准',{'font-size':24,fill:C.sub})+S.text(1676,284,'GPT-6 Astra 極高 ⌄',{'font-size':22,fill:C.ink,'text-anchor':'end'})
  +S.text(1000,372,'只改變目前這個對話',{'font-size':25,fill:C.ink,'font-weight':600})+S.text(1000,410,'Only the current chat changes',{'font-size':20,fill:C.muted}));
 if(c>0){B.push({id:'flow',x:0,y:510,width:1728,height:90});o+=up(c,S.rect({x:0,y:510,width:1728,height:90,rx:24,fill:C.blueL})+S.text(864,566,'新對話從預設值開始 → 需要時在對話裡調整',{'font-size':32,'font-weight':800,fill:C.blue,'text-anchor':'middle'}))
  ;o+=arrow2(770,250,958,250,c,C.blue,6)}
 return o;
};

// ── Application: three common cases → which page → what to change ──
SCENES.cases=(sc,t,B)=>{
 const C3=[['c1','一直跳出核准','Too many approvals','組態','核准政策・或在對話改用代我核准'],['c2','想用手機遙控','Control from your phone','連線','控制這台電腦 → 掃 QR code'],['c3','Worktree 太多','Too many worktrees','Worktrees','調低保留數量']];let o='';
 B.push({id:'demo-badge',x:0,y:0,width:230,height:44});o+=chip(0,0,'示範情境 Demo',{size:22,fill:C.amberL,color:C.amber});
 C3.forEach(([k,zh,en,page,act],i)=>{const u=at(t,ps(sc,k),.6);if(u<=0)return;const y=64+i*128;B.push({id:'case-'+k,x:0,y,width:1728,height:112});
  o+=up(u,S.rect({x:0,y,width:1728,height:112,rx:20,fill:'#fff',stroke:C.line,'stroke-width':1.5})+S.text(32,y+52,zh,{'font-size':32,'font-weight':800,fill:C.ink})+S.text(32,y+88,en,{'font-size':21,fill:C.muted})
   +S.path({d:`M560 ${y+56} H640`,stroke:C.line,'stroke-width':5,'stroke-linecap':'round'})+S.path({d:`M630 ${y+44} L644 ${y+56} L630 ${y+68}`,stroke:C.line,'stroke-width':5,fill:'none','stroke-linecap':'round'})
   +S.rect({x:676,y:y+26,width:300,height:60,rx:16,fill:C.blueL})+S.text(826,y+66,'設定 › '+page,{'font-size':27,'font-weight':800,fill:C.blue,'text-anchor':'middle'})
   +S.text(1010,y+66,act,{'font-size':27,fill:C.ink}))});
 const l=at(t,ps(sc,'limit'),.6);if(l>0){B.push({id:'limit',x:0,y:460,width:1728,height:110});o+=up(l,S.rect({x:0,y:460,width:1728,height:110,rx:22,fill:C.redL})+icon2('warn',28,486,1.1,C.red,3)+S.text(100,528,'限制：放寬核准前，要確定你信任這個任務',{'font-size':32,'font-weight':800,fill:C.ink})+S.text(100,560,'Before loosening approvals, be sure you trust the task',{'font-size':21,fill:C.sub}))}
 return o;
};

// ── Outlook + series end ──
SCENES.settingsOutlook=(sc,t,B)=>{
 const T={a:sc.start,b:ps(sc,'b'),end:ps(sc,'end')};let o='';
 const a=at(t,T.a+.2,.6),b=at(t,T.b,.6),e=at(t,T.end,.6);
 B.push({id:'o-a',x:0,y:0,width:840,height:400});
 o+=up(a,panel([],'',0,0,840,400,{rx:26,stroke:C.green,sw:2.5})+chip(28,26,'已公布 Announced',{size:22,fill:C.greenL,color:C.green})+S.text(32,150,'舊版 Codex Cloud',{'font-size':40,'font-weight':800,fill:C.ink})+S.text(32,200,'規劃淘汰',{'font-size':40,'font-weight':800,fill:C.red})+S.text(32,248,'Legacy Codex Cloud is planned for deprecation',{'font-size':22,fill:C.muted})+S.text(32,330,'新環境請用 Codex Cloud',{'font-size':27,fill:C.sub}));
 if(b>0){B.push({id:'o-b',x:888,y:0,width:840,height:400});o+=up(b,panel([],'',888,0,840,400,{rx:26,stroke:C.amber,sw:2.5})+chip(916,26,'建議 Advice',{size:22,fill:C.amberL,color:C.amber})+S.text(920,150,'找不到某個選項？',{'font-size':38,'font-weight':800,fill:C.ink})
  +S.text(920,230,'① 更新 App',{'font-size':32,'font-weight':700,fill:C.ink})+S.text(920,290,'② 對照官方文件',{'font-size':32,'font-weight':700,fill:C.ink})+S.text(920,350,'Update the app, then check the docs',{'font-size':22,fill:C.muted}))}
 if(e>0){B.push({id:'o-end',x:0,y:440,width:1728,height:130});o+=up(e,S.rect({x:0,y:440,width:1728,height:130,rx:26,fill:C.ink})+S.text(864,500,'系列完結　謝謝收看',{'font-size':40,'font-weight':800,fill:'#fff','text-anchor':'middle'})+S.text(864,546,'EP1 模式・位置・權限　EP2 模型・側邊欄・用量　EP3 設定',{'font-size':24,fill:'#c9d6ff','text-anchor':'middle'}))}
 return o;
};
