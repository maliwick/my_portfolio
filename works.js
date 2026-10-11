'use strict';
(() => {
  const groups = ['projects', 'labs', 'badges'];
  const draftKey = 'malinga-content-drafts-v1';
  const $ = (s) => document.querySelector(s);
  function el(tag, text, cls) { const n = document.createElement(tag); if(text !== undefined) n.textContent = text; if(cls) n.className = cls; return n; }
  function safeUrl(value) { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; } }
  function externalLink(url, text) { const href = safeUrl(url); if(!href) return null; const n=el('a',text); n.href=href; n.target='_blank'; n.rel='noopener noreferrer'; return n; }
  function validate(data) {
    if (!data || groups.some(k => !Array.isArray(data[k]))) throw new Error('The file must contain projects, labs, and badges arrays.');
    for (const k of groups) {
      const ids=new Set();
      for (const v of data[k]) {
        if(!v || typeof v.id!=='string' || !v.id || ids.has(v.id) || typeof v.title!=='string' || !v.title.trim() || typeof v.summary!=='string' || !Array.isArray(v.tags) || v.tags.some(t=>typeof t!=='string') || !['draft','published'].includes(v.status) || typeof v.sample!=='boolean') throw new Error('Invalid or duplicate entry in '+k+'.');
        ids.add(v.id);
        for (const f of ['body','issuer','date','url']) if(v[f]!==undefined && typeof v[f]!=='string') throw new Error('Invalid '+f+' field.');
        if(v.url && !safeUrl(v.url)) throw new Error('Use an http or https link.');
      }
    }
    return data;
  }
  function sample(v,n) { if(v.sample)n.append(el('span','SAMPLE / PLACEHOLDER','sample-label')); }
  function tags(v,n) { const t=el('div',undefined,'work-tags'); v.tags.forEach(x=>t.append(el('span',x))); n.append(t); }
  function detail(v, kind, preview=false) {
    const n=el('article',undefined,'work-detail');
    if(!preview) { const back=el('a','← Back to '+kind); back.href=kind+'.html'; n.append(back); }
    n.append(el('p',kind.toUpperCase(),'work-kicker')); sample(v,n); n.append(el('h1',v.title),el('p',v.summary,'work-lead')); tags(v,n);
    if(v.date)n.append(el('p',v.date)); if(v.issuer)n.append(el('p',v.issuer));
    if(v.body)n.append(el('div',v.body,'writeup')); const link=externalLink(v.url,kind==='badges'?'Verify credential ↗':'View source / supporting work ↗'); if(link)n.append(link);return n;
  }
  function card(v,kind,i) {const n=el('article',undefined,'work-card');n.append(el('span',String(i+1).padStart(2,'0')+' / '+(kind==='labs'?'LAB PRACTICAL':'PROJECT'),'work-index'));sample(v,n);n.append(el('h2',v.title),el('p',v.summary));tags(v,n);const a=el('a',kind==='labs'?'Read write-up ↗':'Explore project ↗');a.href='work.html?type='+kind+'&id='+encodeURIComponent(v.id);n.append(a);return n;}
  async function load() { const r=await fetch('data/content.json',{cache:'no-cache'});if(!r.ok)throw new Error('Content could not be loaded.');return validate(await r.json()); }
  function renderBadges(data) {
    const track=$('#badgeTrack');if(!track)return;const items=data.badges.filter(v=>v.status==='published');
    if(!items.length){track.append(el('p','Earned badges will appear here when added.'));$('#badgePause').hidden=true;return;}
    const group=el('div',undefined,'badge-group');items.forEach(v=>{const n=el('article',undefined,'badge-card');n.append(el('div','◇','badge-emblem'));sample(v,n);n.append(el('strong',v.title),el('small',v.issuer||''));const link=externalLink(v.url,'Verify badge ↗');if(link)n.append(link);group.append(n);});
    const clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('a').forEach(a=>a.tabIndex=-1);track.append(group,clone);
    $('#badgePause').addEventListener('click',()=>{const paused=track.classList.toggle('is-paused');$('#badgePause').textContent=paused?'Resume motion':'Pause motion';$('#badgePause').setAttribute('aria-pressed',String(paused));});
  }
  function setupEditor(published) {
    let data=structuredClone(published), selected=null;
    const status=(s)=>$('#editorStatus').textContent=s;
    try {const local=localStorage.getItem(draftKey);if(local){data=validate(JSON.parse(local));status('Loaded drafts saved on this device.');}}catch{status('Stored drafts could not be read. Published content loaded.');}
    const form=$('#entryForm'), fields=form.elements;
    function reset(){selected=null;form.reset();fields.status.value='draft';}
    function populate(k,v){reset();selected={kind:k,id:v.id};fields.kind.value=k;for(const f of ['title','summary','date','issuer','url','body','status'])fields[f].value=v[f]||'';fields.tags.value=v.tags.join(', ');fields.sample.checked=v.sample;}
    function list(){const area=$('#entryList');area.replaceChildren();for(const k of groups){area.append(el('h3',k));data[k].forEach(v=>{const b=el('button',v.title+' · '+v.status);b.type='button';b.addEventListener('click',()=>populate(k,v));area.append(b);});}}
    function read(){if(!form.reportValidity())return null;const v={id:selected?.id||('entry-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)),title:fields.title.value.trim(),summary:fields.summary.value.trim(),tags:fields.tags.value.split(',').map(t=>t.trim()).filter(Boolean),date:fields.date.value,issuer:fields.issuer.value.trim(),url:fields.url.value.trim(),body:fields.body.value.trim(),status:fields.status.value,sample:fields.sample.checked};try{validate({projects:[],labs:[],badges:[v]});return v;}catch(e){status(e.message);return null;}}
    function persist(){try{localStorage.setItem(draftKey,JSON.stringify(data));status('Saved on this device. Download and commit content.json to publish.');}catch{status('Browser storage is unavailable. Download content.json to keep your changes.');}list();}
    form.addEventListener('submit',e=>{e.preventDefault();const v=read();if(!v)return;if(selected)data[selected.kind]=data[selected.kind].filter(x=>x.id!==selected.id);data[fields.kind.value].push(v);selected={kind:fields.kind.value,id:v.id};persist();});
    $('#newEntry').addEventListener('click',reset);
    $('#previewEntry').addEventListener('click',()=>{const v=read();if(v)$('#editorPreview').replaceChildren(detail(v,fields.kind.value,true));});
    $('#deleteEntry').addEventListener('click',()=>{if(!selected)return;if(!confirm('Remove this entry from your browser draft?'))return;data[selected.kind]=data[selected.kind].filter(v=>v.id!==selected.id);reset();persist();});
    $('#exportContent').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a');a.href=url;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('Downloaded saved entries. Commit data/content.json on GitHub to publish.');});
    $('#importContent').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const next=validate(JSON.parse(await f.text()));data=next;reset();persist();}catch(err){status('Import failed: '+err.message);}e.target.value='';});
    $('#reloadContent').addEventListener('click',async()=>{if(!confirm('Replace browser drafts with published content?'))return;try{data=await load();reset();persist();}catch(e){status(e.message);}});list();reset();
  }
  load().then(data=>{
    if($('#entryForm')){setupEditor(data);return;}
    document.querySelectorAll('[data-content]').forEach(area=>{const kind=area.dataset.content;const items=data[kind].filter(v=>v.status==='published');const render=()=>{const query=($('#workSearch')?.value||'').toLowerCase();let shown=items.filter(v=>(v.title+' '+v.summary+' '+v.tags.join(' ')).toLowerCase().includes(query));if(area.dataset.limit)shown=shown.slice(0,Number(area.dataset.limit));area.replaceChildren(...shown.map((v,i)=>card(v,kind,i)));if(!shown.length)area.append(el('p','No entries found.','work-empty'));if($('#workCount'))$('#workCount').textContent=shown.length+' '+(kind==='labs'?'lab practicals':'projects');};render();$('#workSearch')?.addEventListener('input',render);});
    renderBadges(data);
    if($('#workDetail')){const params=new URLSearchParams(location.search);const kind=params.get('type');const v=groups.includes(kind)?data[kind].find(v=>v.id===params.get('id')&&v.status==='published'):null;if(v){document.title=v.title+' | Malinga';$('#workDetail').replaceChildren(detail(v,kind));}else{$('#workDetail').replaceChildren(el('h1','Entry not found'),el('p','This entry may be a draft or no longer available.'));}}
  }).catch(e=>{document.querySelectorAll('[data-content],#workDetail,#badgeTrack,#editorStatus').forEach(n=>n.replaceChildren(el('p',e.message+' Please reload the page.','work-empty')));});
})();
