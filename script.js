// —— WCA SCRAMBLE GENERATOR (CORRECTED) ——
const puzzleSpecs = { '2x2': 9, '3x3': 20, '4x4': 40, '5x5': 60 };
const faces = ["U","D","L","R","F","B"];
const mods  = ["", "2", "'"];

// map each face to its axis group:
const axisOf = {
    U: 'UD', D: 'UD',
    L: 'LR', R: 'LR',
    F: 'FB', B: 'FB'
};

function genScramble(type='3x3') {
    const len = puzzleSpecs[type] || 20;
    const scr = [];

    // history for face & axis
    let lastFace = null;
    let lastAxis1 = null, lastAxis2 = null;

    while (scr.length < len) {
    // pick a random face + modifier
    const face = faces[Math.floor(Math.random() * faces.length)];
    const mod   = mods[Math.floor(Math.random() * mods.length)];
    const ax    = axisOf[face];

    // 1) no two moves on the same face in a row
    if (face === lastFace) continue;

    // 2) no three consecutive moves on the same axis
    if (lastAxis1 === ax && lastAxis2 === ax) continue;

    // accept it
    scr.push(face + mod);

    // shift history
    lastFace  = face;
    lastAxis2 = lastAxis1;
    lastAxis1 = ax;
    }

    return scr.join(' ');
}

// —— ELEMENTS & STATE ——
const timeEl = document.getElementById('time'),
        scrambleEl = document.getElementById('scramble'),
        logEl = document.getElementById('log'),
        statsEl = document.getElementById('stats'),
        startBtn = document.getElementById('startBtn'),
        stopBtn  = document.getElementById('stopBtn'),
        resetBtn = document.getElementById('resetBtn'),
        splitBtn = document.getElementById('splitBtn'),
        penaltyBtn = document.getElementById('penaltyBtn'),
        dnfBtn   = document.getElementById('dnfBtn'),
        clearBtn = document.getElementById('clearBtn'),
        downloadTxt  = document.getElementById('downloadTxt'),
        downloadCsv  = document.getElementById('downloadCsv'),
        downloadJson = document.getElementById('downloadJson'),
        themeToggle  = document.getElementById('themeToggle'),
        puzzleType   = document.getElementById('puzzleType');

let startTime=0, timerInterval=null, isRunning=false;
let currentSplits = [], currentPenalty = 0;
const results = JSON.parse(localStorage.getItem('results')||'[]');

function formatTime(ms) {
    const h=Math.floor(ms/3600000),
        m=Math.floor((ms%3600000)/60000),
        s=Math.floor((ms%60000)/1000),
        r=ms%1000;
    return [h,m,s].map(x=>x.toString().padStart(2,'0')).join(':')
        + '.' + r.toString().padStart(3,'0');
}

function renderStats() {
    if (!results.length) {
    statsEl.textContent = 'No solves yet.'; return;
    }
    const times = results.filter(r=>!r.dnf).map(r=>r.ms + (r.penalty||0)*1000).sort((a,b)=>a-b);
    const best=times[0], worst=times[times.length-1],
        avg=times.reduce((a,b)=>a+b,0)/times.length;
    const ao = n => times.length<n ? 'N/A'
    : formatTime(times.slice(-n).reduce((a,b)=>a+b,0)/n);

    statsEl.innerHTML = `
    <div>Total Solves: ${results.length}</div>
    <div>Best: ${formatTime(best)}</div>
    <div>Worst: ${formatTime(worst)}</div>
    <div>Average: ${formatTime(avg)}</div>
    <div>Ao5: ${ao(5)}</div>
    <div>Ao12: ${ao(12)}</div>
    `;
}

function renderLog() {
    logEl.innerHTML = results.map(r=>{
    const ptxt = r.penalty ? ` +${r.penalty}` : r.dnf?' DNF':'';
    const splits = r.splits?.length
        ? `<div class="split">Splits: ${r.splits.map(formatTime).join(' / ')}</div>`
        : '';
    return `<div class="entry">
        [${r.date}] – <b>${r.time}${ptxt}</b><br>
        <span class="scramble">[${r.scramble}]</span> /
        <span class="solution">[${r.solution}]</span>
        ${splits}
    </div>`;
    }).join('');
    renderStats();
}

function save() { localStorage.setItem('results',JSON.stringify(results)); }

clearBtn.onclick = ()=>{
    if(confirm('Clear all history?')){
    results.length=0; save(); renderLog();
    }
};

function updateClock() {
    timeEl.textContent = formatTime(Date.now()-startTime);
}
function startSolve() {
    startTime=Date.now();
    timerInterval = setInterval(updateClock,10);
    isRunning=true;
    startBtn.disabled=true; stopBtn.disabled=false;
    splitBtn.disabled=false; penaltyBtn.disabled=false; dnfBtn.disabled=false;
}
function endSolve(dnf=false) {
    clearInterval(timerInterval);
    const elapsed = Date.now()-startTime;
    results.push({
    date: new Date().toLocaleString(),
    ms: elapsed,
    time: formatTime(elapsed),
    scramble: scrambleEl.textContent,
    solution: invertScramble(scrambleEl.textContent),
    splits: currentSplits.slice(),
    penalty: currentPenalty,
    dnf
    });
    save(); renderLog();
    isRunning=false; currentSplits=[]; currentPenalty=0;
    startBtn.disabled=false; stopBtn.disabled=true;
    splitBtn.disabled=true; penaltyBtn.disabled=true; dnfBtn.disabled=true;
}

startBtn.onclick = () => startSolve();
stopBtn.onclick  = () => endSolve(false);
dnfBtn.onclick   = () => endSolve(true);
resetBtn.onclick = ()=>{
    clearInterval(timerInterval);
    isRunning=false; currentSplits=[]; currentPenalty=0;
    timeEl.textContent='00:00:00.000';
    scrambleEl.textContent=genScramble(puzzleType.value);
    startBtn.disabled=false; stopBtn.disabled=true;
    splitBtn.disabled=true; penaltyBtn.disabled=true; dnfBtn.disabled=true;
};
splitBtn.onclick   = () => currentSplits.push(Date.now()-startTime);
penaltyBtn.onclick = () => currentPenalty=2;

function doDownload(name,txt){
    const blob=new Blob([txt],{type:'text/plain'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=name; a.click();
    URL.revokeObjectURL(url);
}
downloadTxt.onclick = ()=>{
    if(!results.length) return alert('No solves');
    const lines = results.map(r=>{
    const p=r.penalty?`+${r.penalty}`:''; const d=r.dnf?' DNF':'';
    return `[${r.date}] ${r.time}${p}${d} : [${r.scramble}] / [${r.solution}]`;
    }).join('\n');
    doDownload(`solves_${Date.now()}.txt`, lines);
};
downloadCsv.onclick = ()=>{
    if(!results.length) return alert('No solves');
    const hdr=['date','time','ms','penalty','dnf','scramble','solution','splits'];
    const rows = results.map(r=>[
    `"${r.date}"`, r.time, r.ms, r.penalty||0, r.dnf?1:0,
    `"${r.scramble}"`, `"${r.solution}"`,
    `"${(r.splits||[]).map(formatTime).join('|')}"`
    ].join(','));
    doDownload(`solves_${Date.now()}.csv`, hdr.join(',')+'\n'+rows.join('\n'));
};
downloadJson.onclick=()=>{
    if(!results.length) return alert('No solves');
    doDownload(`solves_${Date.now()}.json`, JSON.stringify(results,null,2));
};

themeToggle.onclick = ()=>{
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark')
    ? 'Light Mode' : 'Dark Mode';
};

document.addEventListener('keyup', e=>{
    if(e.code==='Space'){
    e.preventDefault();
    isRunning? stopBtn.click() : startBtn.click();
    }
});

// —— INIT ——
scrambleEl.textContent = genScramble(puzzleType.value);
puzzleType.onchange = ()=> scrambleEl.textContent = genScramble(puzzleType.value);
renderLog();