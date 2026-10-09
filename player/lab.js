// Interaction tied to each episode's learning goal; chosen by project.lab (default: work-location quiz).
(()=>{
 const LABS={
  location:{title:'練習：該選哪個工作位置？ Which work location?',label:{local:'這台電腦',cloud:'雲端',remote:'遠端'},cases:[
   {q:'要修改你電腦裡、還沒上傳 GitHub 的課程資料夾',a:'local',why:'只有「這台電腦」能直接讀寫你本機的資料夾。'},
   {q:'關上筆電後，仍希望任務繼續跑（專案已在 GitHub）',a:'cloud',why:'「雲端」在獨立容器中執行，不依賴你的電腦開著；但拿不到本機檔案。'},
   {q:'專案放在學校實驗室的 Linux 伺服器上，要在那裡跑測試',a:'remote',why:'「遠端」透過連線（SSH）在另一台主機上執行指令。'}]},
  models:{title:'練習：這個任務選哪個模型？ Which model?',label:{astra:'GPT-6 Astra',sol:'GPT-6.1 Sol',luna:'GPT-6 Luna'},cases:[
   {q:'一次摘要 300 份會議紀錄，每份都很短',a:'luna',why:'大量、單純的摘要與擷取，用最省的 Luna。'},
   {q:'重構一個中型專案，要反覆修改、跑測試',a:'sol',why:'複雜但重複的程式工作，接近 Astra 又比較省的 6.1 Sol 最合適。'},
   {q:'跨程式、資料與研究的困難多步驟任務，第一次就要做對',a:'astra',why:'最困難的多步驟工作才值得用最強、也最耗用量的 Astra。'}]},
  settings:{title:'練習：要去哪一個設定頁？ Which settings page?',label:{config:'組態',connections:'連線',worktrees:'Worktrees',appshots:'Appshots'},cases:[
   {q:'每次都跳出核准，想改變「新對話」預設的核准政策',a:'config',why:'「組態」設定核准政策與沙盒的預設值；單一對話則用輸入框下方的權限選單。'},
   {q:'想用手機掃 QR code，遙控家裡的電腦',a:'connections',why:'「連線」裡的「控制這台電腦」可以讓手機配對。'},
   {q:'電腦裡累積太多 worktree，想少留幾個',a:'worktrees',why:'「Worktrees」可以調整保留數量（預設 15 個）或關閉自動刪除。'}]}};
 function render(kind){const L=LABS[kind]||LABS.location,lab=document.getElementById('lab');window.labInfo={answers:L.cases.map(c=>c.a),keys:Object.keys(L.label)};
  lab.innerHTML='<h2>'+L.title+'</h2><div class="lab-grid">'+L.cases.map((c,i)=>
   `<div class="lab-card"><p>${c.q}</p><div class="steps">${Object.keys(L.label).map(k=>`<button class="ghost" data-i="${i}" data-k="${k}">${L.label[k]}</button>`).join('')}</div><p class="feedback" id="fb${i}" aria-live="polite"></p></div>`).join('')+'</div>';
  lab.onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const c=L.cases[b.dataset.i],fb=document.getElementById('fb'+b.dataset.i),ok=b.dataset.k===c.a;
   fb.className='feedback '+(ok?'ok':'bad');fb.textContent=ok?'正確！'+c.why:'再想想：「'+L.label[b.dataset.k]+'」不是最適合的地方。'}}
 window.addEventListener('lesson-ready',()=>render(window.lesson.getProject().lab));
})();
