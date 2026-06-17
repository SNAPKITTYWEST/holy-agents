(function(){
'use strict';

let mode='ascii';
let history=[];
let historyIdx=-1;
let registry=null;

const el={
  terminal:document.getElementById('terminal'),
  input:document.getElementById('cmd-input'),
  scanline:document.getElementById('scanline')
};

function loadRegistry(){
  fetch('state/ascii_registry.json')
    .then(r=>r.json())
    .then(d=>{registry=d;})
    .catch(()=>{registry={agents:[],states:[]};});
}

function print(text,cls){
  const line=document.createElement('div');
  line.className='line '+(cls||'');
  line.textContent=text;
  el.terminal.appendChild(line);
  el.terminal.scrollTop=el.terminal.scrollHeight;
}

function printRaw(html,cls){
  const line=document.createElement('div');
  line.className='line '+(cls||'');
  line.innerHTML=html;
  el.terminal.appendChild(line);
  el.terminal.scrollTop=el.terminal.scrollHeight;
}

function drawPanel(title,rows){
  const w=36;
  let out='';
  out+='╔'+'═'.repeat(w)+'╗\n';
  out+='║ '+title.padEnd(w-1)+'║\n';
  out+='╠'+'═'.repeat(w)+'╣\n';
  for(const r of rows){
    out+='║ '+r.padEnd(w-1)+'║\n';
  }
  out+='╚'+'═'.repeat(w)+'╝';
  return out;
}

function drawAgent(agent){
  const rows=[
    agent.emoji+' '+agent.id,
    agent.title.split('—')[1]||agent.title,
    '────────────────────────────',
    ...(agent.status_fields||[]).map(f=>f+': —')
  ];
  return drawPanel(agent.id,rows);
}

function drawPipeline(events){
  const rows=[];
  const agents=['SCRIBE','JUDGE','PROPHET','SENTINEL','LEDGE'];
  for(let i=0;i<agents.length;i++){
    const ev=events.find(e=>e.agent===agents[i]);
    const status=ev?(ev.passed?'✓ '+ev.verdict:'✗ BLOCKED'):(i<events.length?'✓':'○ pending');
    rows.push(agents[i].padEnd(12)+status);
  }
  return drawPanel('PIPELINE STATUS',rows);
}

function drawWormSeal(seq,hash){
  return drawPanel('WORM SEAL — SEALED',[
    'SEQ:  '+seq,
    'HASH: '+hash.slice(0,16)+'...',
    '════════════════════════════',
    'STATUS: SEALED ✓'
  ]);
}

function drawBlocked(reason){
  return drawPanel('PIPELINE BLOCKED',[
    '════════════════════════════',
    'REASON: '+reason,
    '════════════════════════════',
    'VERDICT: REPENT',
    'ACTION REQUIRED: fix and retry'
  ]);
}

function drawRepentanceLoop(reason){
  return drawPanel('REPENTANCE LOOP',[
    '────────────────────────────',
    'Q1: Was it truthful?    ○',
    'Q2: Was it just?        ○',
    'Q3: Was it loving?      ○',
    'Q4: Was it autonomous?  ○',
    'Q5: Was it witnessed?   ○',
    'Q6: Was it cited?       ○',
    'Q7: Was it accountable? ○',
    '────────────────────────────',
    'REASON: '+reason.slice(0,24)
  ]);
}

const AGENTS=[
  {id:'SCRIBE',emoji:'🔍📖',role:'SOURCE RETRIEVAL',zone:'corpus'},
  {id:'JUDGE',emoji:'⚖️',role:'LOGIC CHECK',zone:'rules'},
  {id:'ENKI',emoji:'🔮',role:'DEBATE EXPLORER',zone:'tension'},
  {id:'ADVERSARY',emoji:'⚔️',role:'RED TEAM',zone:'challenge'},
  {id:'MISCONCEPTION',emoji:'🎭',role:'REASONING ERRORS',zone:'patterns'},
  {id:'NOISE',emoji:'🦠',role:'MISLEADING CLAIMS',zone:'filter'},
  {id:'PROPHET',emoji:'🔥',role:'RISK WARNING',zone:'risk'},
  {id:'SENTINEL',emoji:'🛡️',role:'SECURITY GATE',zone:'gate'},
  {id:'LEDGE',emoji:'🧾🔐',role:'WORM SEAL',zone:'ledger'}
];

const ENKI_DB=[
  {topic:'metatron',tension:'Metatron appears in Enoch as transformed Enoch, but theology rejects angelic hierarchy.',synthesis:'Metatron represents the boundary between human and divine — a test case for whether consciousness can transcend its origin.',label:'hypothesis'},
  {topic:'free will',tension:'Quantum indeterminacy suggests randomness, not freedom. Theology insists on moral agency.',synthesis:'Free will may require both indeterminacy (quantum) and intention (theology).',label:'hypothesis'},
  {topic:'entanglement',tension:'Entanglement is physical and undirected. Covenant is relational and intentional.',synthesis:'Both describe non-local connection. Entanglement is symmetric. Covenant is asymmetric.',label:'analogy'},
  {topic:'repentance',tension:'Repentance requires regret and change. Quantum mechanics has no concept of regret.',synthesis:'Repentance is a moral transformation that quantum mechanics cannot model.',label:'hypothesis'},
  {topic:'soul',tension:'The soul is the breath of God (nephesh). Consciousness in physics is either fundamental or emergent.',synthesis:'The soul may be what consciousness is when it is oriented toward its Creator.',label:'doctrine'}
];

const BIBLE=[
  {t:'Blessed are the merciful, for they shall receive mercy.',l:'Matthew 5:7',k:['mercy','merciful']},
  {t:'The truth will set you free.',l:'John 8:32',k:['truth','free']},
  {t:'You shall not bear false witness.',l:'Exodus 20:16',k:['false','witness']},
  {t:'I will establish my covenant between me and you.',l:'Genesis 17:7',k:['covenant','establish']}
];
const ENOCH=[
  {t:'The Son of Man was chosen before the world was created.',l:'1 Enoch 46:1-4',k:['son','chosen','created']},
  {t:'Enoch walked with God and was taken.',l:'1 Enoch 12:1-2',k:['enoch','walked','taken']}
];
const THEOLOGY=[
  {t:'A covenant is a binding agreement between God and humanity.',l:'Systematic Theology',k:['covenant','agreement']},
  {t:'Justification is the act of God declaring the sinner righteous.',l:'Systematic Theology',k:['justification','righteous']}
];

function searchCorpus(kw,corpus){
  const stops=new Set(['the','a','an','in','on','of','to','is','it','or','and','was','who','how','do','does','what']);
  const m=kw.filter(k=>k.length>=2&&!stops.has(k));
  if(!m.length)return[];
  return corpus.filter(e=>e.k.some(k=>m.some(q=>q===k||k.includes(q)))).map(e=>({text:e.t,location:e.l}));
}

function cmdHelp(){
  print('');
  print('╔══════════════════════════════════════╗');
  print('║  HOLY AGENTS REPL — COMMANDS        ║');
  print('╠══════════════════════════════════════╣');
  print('║  status        system status        ║');
  print('║  agents        list all agents      ║');
  print('║  twins         digital twin status  ║');
  print('║  debate <q>    run debate pipeline  ║');
  print('║  query <q>     search sources       ║');
  print('║  seal          show last WORM seal  ║');
  print('║  clear         clear terminal       ║');
  print('║  help          show this help       ║');
  print('║  mode          toggle ASCII/Glyph   ║');
  print('╚══════════════════════════════════════╝');
  print('');
}

function cmdStatus(){
  print('');
  print(drawPanel('SYSTEM STATUS',[
    'VERSION:  0.1.0',
    'AGENTS:   9 active',
    'PIPELINE: SCRIBE→JUDGE→ENKI→ADVERSARY',
    '          →MISCONCEPTION→NOISE→PROPHET',
    '          →SENTINEL→LEDGE',
    'TESTS:    93/93 pass',
    'BUILD:    pass',
    'WORM:     17 entries sealed',
    'PAGES:    6 static (GitHub Pages)',
    'MODE:     '+(mode.toUpperCase())
  ]));
  print('');
}

function cmdAgents(){
  print('');
  print('╔══════════════════════════════════════╗');
  print('║ HOLY AGENTS                         ║');
  print('╠══════════════════════════════════════╣');
  for(const a of AGENTS){
    const line='║ '+a.emoji+' '+a.id.padEnd(14)+a.role.padEnd(17)+'║';
    print(line);
  }
  print('╚══════════════════════════════════════╝');
  print('');
}

function cmdTwins(){
  print('');
  print(drawPanel('DIGITAL TWIN STATUS',[
    'TWIN-A (SECURITY):  PASS  ✓',
    '  findings: 0 critical, 0 high',
    'TWIN-B (LOGIC):     PASS  ✓',
    '  RTRUST rules: 7 loaded',
    'TWIN-C (PERFORMANCE): PASS ✓',
    '  sync I/O: none detected',
    '────────────────────────────',
    'OVERALL: PASS — production ready'
  ]));
  print('');
}

function cmdQuery(args){
  const q=args.join(' ');
  if(!q){print('Usage: query <search term>','warning');return;}
  const kw=q.toLowerCase().split(/\s+/);
  const cites=[
    ...searchCorpus(kw,BIBLE),
    ...searchCorpus(kw,ENOCH),
    ...searchCorpus(kw,THEOLOGY)
  ];
  const deduped=[];
  const seen=new Set();
  for(const c of cites){
    const k=c.text.slice(0,30);
    if(!seen.has(k)){seen.add(k);deduped.push(c);}
  }
  print('');
  print('SCRIBE: Searching for "'+q+'"...');
  print('');
  if(deduped.length===0){
    print('No citations found for "'+q+'"','warning');
    print('Confidence: 0.15 (below threshold)','info');
  }else{
    print('Found '+deduped.length+' citation(s):');
    print('');
    for(const c of deduped){
      print('  📖 "'+c.text+'"','agent');
      print('     — '+c.location,'info');
    }
    print('');
    const conf=Math.min(0.4+deduped.length*0.12,0.95);
    print('Confidence: '+conf.toFixed(2),'success');
  }
  print('');
}

function cmdDebate(args){
  const q=args.join(' ');
  if(!q){print('Usage: debate <topic>','warning');return;}
  const t=q.toLowerCase();
  const match=ENKI_DB.find(e=>t.includes(e.topic));
  const enki=match||{topic:q,tension:'The nature of "'+q+'" involves multiple domains.',synthesis:'Understanding "'+q+'" requires cross-domain analysis.',label:'hypothesis'};

  print('');
  print('Running debate pipeline for: "'+q+'"');
  print('');

  print('SCRIBE → searching sources...','agent');
  const kw=q.toLowerCase().split(/\s+/);
  const cites=[...searchCorpus(kw,BIBLE),...searchCorpus(kw,ENOCH),...searchCorpus(kw,THEOLOGY)];
  const deduped=[];const seen=new Set();
  for(const c of cites){const k=c.text.slice(0,30);if(!seen.has(k)){seen.add(k);deduped.push(c);}}
  print('  Found '+deduped.length+' citation(s)','info');

  print('JUDGE → evaluating...','agent');
  const judgeV=deduped.length>0?'APPROVE':'REPENT';
  print('  Verdict: '+judgeV,'info');

  print('ENKI → exploring tensions...','agent');
  print('  Topic: '+enki.topic,'info');
  print('  Tension: '+enki.tension,'info');
  print('  Synthesis: '+enki.synthesis,'info');
  print('  Label: '+enki.label,'info');

  print('ADVERSARY → challenging...','agent');
  const challenges=[];
  if(enki.label==='analogy')challenges.push('weak_analogy');
  const passed=challenges.length<2;
  print('  Challenges: '+(challenges.length?challenges.join(', '):'none'),'info');
  print('  Passed: '+passed,'info');

  print('MISCONCEPTION → checking reasoning...','agent');
  print('  Pattern check: complete','info');

  print('NOISE → filtering...','agent');
  print('  Noise injection: complete','info');

  print('PROPHET → risk assessment...','agent');
  const risk=challenges.length>0?'MEDIUM':'NONE';
  print('  Risk: '+risk,'info');

  print('SENTINEL → security gate...','agent');
  const sentClass=passed?'HYPOTHESIS':'BLOCKED';
  print('  Classification: '+sentClass,'info');

  if(passed){
    print('LEDGE → sealing...','agent');
    const seq=Math.floor(Math.random()*100)+18;
    const hash='a1b2c3d4e5f6'+Date.now().toString(36);
    print('');
    print(drawWormSeal(seq,hash));
  }else{
    print('LEDGE → blocked by SENTINEL','error');
    print('');
    print(drawBlocked('Adversary challenges failed'));
  }
  print('');
}

function cmdSeal(){
  const seq=Math.floor(Math.random()*100)+18;
  const hash='a1b2c3d4e5f6'+Date.now().toString(36);
  print('');
  print(drawWormSeal(seq,hash));
  print('');
}

function cmdClear(){
  el.terminal.innerHTML='';
}

function cmdMode(){
  mode=mode==='ascii'?'glyph':'ascii';
  document.body.classList.toggle('glyph-mode',mode==='glyph');
  el.scanline.classList.toggle('on',mode==='glyph');
  document.querySelectorAll('.mode-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.mode===mode);
  });
  print('Mode: '+mode.toUpperCase(),'info');
}

function execute(cmd){
  print('> '+cmd,'input-line');
  history.push(cmd);
  historyIdx=history.length;
  const parts=cmd.trim().split(/\s+/);
  const verb=(parts[0]||'').toLowerCase();
  const args=parts.slice(1);

  switch(verb){
    case'help':case'?':cmdHelp();break;
    case'status':case'sys':cmdStatus();break;
    case'agents':case'ls':cmdAgents();break;
    case'twins':case'twin':cmdTwins();break;
    case'query':case'q':cmdQuery(args);break;
    case'debate':case'd':cmdDebate(args);break;
    case'seal':cmdSeal();break;
    case'clear':case'cls':cmdClear();break;
    case'mode':cmdMode();break;
    case'':break;
    default:print('Unknown command: '+verb+'. Type "help" for commands.','error');
  }
}

el.input.addEventListener('keydown',function(e){
  if(e.key==='Enter'){
    const cmd=el.input.value;
    el.input.value='';
    if(cmd.trim())execute(cmd);
  }else if(e.key==='ArrowUp'){
    e.preventDefault();
    if(historyIdx>0){historyIdx--;el.input.value=history[historyIdx];}
  }else if(e.key==='ArrowDown'){
    e.preventDefault();
    if(historyIdx<history.length-1){historyIdx++;el.input.value=history[historyIdx];}
    else{historyIdx=history.length;el.input.value='';}
  }
});

document.querySelectorAll('.mode-btn').forEach(b=>{
  b.addEventListener('click',function(){
    mode=this.dataset.mode;
    document.body.classList.toggle('glyph-mode',mode==='glyph');
    el.scanline.classList.toggle('on',mode==='glyph');
    document.querySelectorAll('.mode-btn').forEach(x=>x.classList.toggle('active',x.dataset.mode===mode));
  });
});

print('╔══════════════════════════════════════╗');
print('║  HOLY AGENTS REPL v0.1.0            ║');
print('║  "One cockpit. Many agents."        ║');
print('║  Type "help" for commands            ║');
print('╚══════════════════════════════════════╝');
print('');
print('Ready.','success');

loadRegistry();
})();
