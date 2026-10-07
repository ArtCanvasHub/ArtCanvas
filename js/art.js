// Seeded RNG
function rng(seed) {
  let s = seed ^ 0x5f375a86;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

function drawSpace(ctx, w, h) {
  const g = ctx.createRadialGradient(w*.4,h*.35,0,w*.5,h*.5,w*.9);
  g.addColorStop(0,'#1a0a3c'); g.addColorStop(.4,'#0d0522'); g.addColorStop(1,'#020208');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  const r = rng(42);
  for (let i = 0; i < 120; i++) {
    ctx.beginPath(); ctx.arc(r()*w, r()*h, r()*1.4+.2, 0, Math.PI*2);
    ctx.fillStyle = `rgba(220,220,255,${r()*.6+.2})`; ctx.fill();
  }
  [[.3,.3,240,.35],[.65,.45,290,.28],[.5,.55,200,.22]].forEach(([xr,yr,hue,rad]) => {
    const ng = ctx.createRadialGradient(xr*w,yr*h,0,xr*w,yr*h,rad*w);
    ng.addColorStop(0,`hsla(${hue},80%,55%,.12)`); ng.addColorStop(1,`hsla(${hue},80%,40%,0)`);
    ctx.fillStyle = ng; ctx.fillRect(0,0,w,h);
  });
  const px=w*.65, py=h*.3, pr=h*.21;
  const pg = ctx.createRadialGradient(px-pr*.3,py-pr*.3,pr*.05,px,py,pr);
  pg.addColorStop(0,'#7050d0'); pg.addColorStop(.5,'#2a1268'); pg.addColorStop(1,'#100828');
  ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
  const eg = ctx.createRadialGradient(px,py,pr*.9,px,py,pr*1.5);
  eg.addColorStop(0,'rgba(100,60,200,.25)'); eg.addColorStop(1,'rgba(100,60,200,0)');
  ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(px,py,pr*1.5,0,Math.PI*2); ctx.fill();
  ctx.save(); ctx.translate(px,py); ctx.scale(1,.28);
  ctx.beginPath(); ctx.arc(0,0,pr*1.65,0,Math.PI*2);
  ctx.strokeStyle='rgba(160,110,230,.5)'; ctx.lineWidth=pr*.14; ctx.stroke();
  ctx.restore();
}

function drawForest(ctx, w, h) {
  const sky = ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#020b14'); sky.addColorStop(.55,'#041a1a'); sky.addColorStop(1,'#020a08');
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
  const mx=w*.22, my=h*.18, mr=h*.07;
  const mg = ctx.createRadialGradient(mx-mr*.2,my-mr*.2,0,mx,my,mr);
  mg.addColorStop(0,'#dff0df'); mg.addColorStop(.7,'#b0d0b0'); mg.addColorStop(1,'#70a070');
  ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fillStyle=mg; ctx.fill();
  const mlg = ctx.createRadialGradient(mx,my,mr,mx,my,mr*3.2);
  mlg.addColorStop(0,'rgba(160,210,160,.18)'); mlg.addColorStop(1,'rgba(160,210,160,0)');
  ctx.fillStyle=mlg; ctx.beginPath(); ctx.arc(mx,my,mr*3.2,0,Math.PI*2); ctx.fill();
  const r = rng(77);
  for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.arc(r()*w,r()*h*.6,r()*.7+.2,0,Math.PI*2); ctx.fillStyle=`rgba(200,230,200,${r()*.4+.15})`; ctx.fill(); }
  ctx.fillStyle='#010d08';
  [[.05,.9,.06,.36],[.15,.86,.05,.3],[.25,.88,.07,.38],[.38,.83,.05,.29],[.6,.87,.06,.32],[.72,.84,.05,.28],[.82,.9,.07,.35],[.92,.87,.04,.25],[.47,.95,.09,.42]].forEach(([xr,yr,wr,hr]) => {
    const tx=w*xr,ty=h*yr,tw=w*wr,th=h*hr;
    ctx.fillRect(tx-tw*.1,ty,tw*.2,th*.3);
    for (let l=0;l<3;l++) { const lw=tw*(1.2-l*.28),ly=ty-th*(.28+l*.26),lh=th*.36; ctx.beginPath(); ctx.moveTo(tx,ly-lh); ctx.lineTo(tx+lw/2,ly); ctx.lineTo(tx-lw/2,ly); ctx.closePath(); ctx.fill(); }
  });
  const ox=w*.57, oy=h*.42;
  for (let i=5;i>=0;i--) { const og=ctx.createRadialGradient(ox,oy,0,ox,oy,h*(.025+i*.018)); og.addColorStop(0,`rgba(140,255,170,${.85-i*.14})`); og.addColorStop(1,'rgba(80,200,120,0)'); ctx.fillStyle=og; ctx.beginPath(); ctx.arc(ox,oy,h*(.025+i*.018),0,Math.PI*2); ctx.fill(); }
}

function drawNeon(ctx, w, h) {
  const sky = ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#020008'); sky.addColorStop(.65,'#0a0018'); sky.addColorStop(1,'#120012');
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
  const rg = ctx.createLinearGradient(0,h*.65,0,h);
  rg.addColorStop(0,'rgba(0,0,0,0)'); rg.addColorStop(1,'rgba(180,0,120,.22)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
  const r=rng(55), bs=[];
  for (let i=0;i<15;i++) bs.push({x:(i/15)*w+r()*20-10, w:w*.055+r()*w*.045, h:h*(.18+r()*.48)});
  bs.sort((a,b)=>a.h-b.h);
  bs.forEach(b => {
    const by=h-b.h;
    ctx.fillStyle='#0a0016'; ctx.fillRect(b.x,by,b.w,b.h);
    const cols=Math.floor(b.w/9),rows=Math.floor(b.h/13);
    for (let row=0;row<rows;row++) for (let col=0;col<cols;col++) {
      if (r()>.42) { const hue=r()>.5?300:(r()>.5?180:55); ctx.fillStyle=`hsla(${hue},100%,68%,${r()*.5+.25})`; ctx.fillRect(b.x+col*9+2,by+row*13+2,5,7); }
    }
    if (r()>.38) { const rlg=ctx.createRadialGradient(b.x+b.w/2,by,0,b.x+b.w/2,by,b.w*1.2); const hue=r()>.5?280:185; rlg.addColorStop(0,`hsla(${hue},100%,68%,.55)`); rlg.addColorStop(1,`hsla(${hue},100%,40%,0)`); ctx.fillStyle=rlg; ctx.fillRect(b.x-b.w,by-b.w*1.2,b.w*3,b.w*2.4); }
  });
  ctx.save(); ctx.shadowBlur=15;
  [{x:w*.12,y:h*.54,t:'HOTEL',hue:300},{x:w*.42,y:h*.49,t:'24H',hue:185},{x:w*.66,y:h*.57,t:'BAR',hue:55}].forEach(s => {
    ctx.shadowColor=`hsl(${s.hue},100%,60%)`; ctx.fillStyle=`hsl(${s.hue},100%,72%)`; ctx.font=`bold ${w*.038}px monospace`; ctx.fillText(s.t,s.x,s.y);
  });
  ctx.restore();
}

function drawFlow(ctx, w, h) {
  ctx.fillStyle='#090314'; ctx.fillRect(0,0,w,h);
  [{hue:260,amp:h*.15,freq:.015,y:h*.3},{hue:200,amp:h*.12,freq:.02,y:h*.45},{hue:320,amp:h*.18,freq:.012,y:h*.6},{hue:180,amp:h*.1,freq:.025,y:h*.5},{hue:280,amp:h*.14,freq:.018,y:h*.35}].forEach((wv,wi) => {
    ctx.beginPath(); ctx.moveTo(0,h);
    for (let x=0;x<=w;x+=2) { const y=wv.y+Math.sin(x*wv.freq+wi*1.2)*wv.amp+Math.sin(x*wv.freq*2.4+wi*1.9)*wv.amp*.38; x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    const wg=ctx.createLinearGradient(0,wv.y-wv.amp,0,wv.y+wv.amp);
    wg.addColorStop(0,`hsla(${wv.hue},85%,62%,.65)`); wg.addColorStop(1,`hsla(${wv.hue},85%,45%,0)`);
    ctx.fillStyle=wg; ctx.fill();
  });
  const r=rng(99);
  for (let i=0;i<50;i++) { const x=r()*w,y=r()*h,hue=r()*180+160; ctx.beginPath(); ctx.arc(x,y,r()*2+.4,0,Math.PI*2); ctx.fillStyle=`hsla(${hue},90%,72%,${r()*.5+.25})`; ctx.fill(); }
}

function drawPortrait(ctx, w, h) {
  const bg=ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.5,w*.9);
  bg.addColorStop(0,'#1c0c08'); bg.addColorStop(.5,'#0d0508'); bg.addColorStop(1,'#040204');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const rl=ctx.createRadialGradient(w*.5,h*.18,0,w*.5,h*.3,w*.55);
  rl.addColorStop(0,'rgba(255,140,50,.28)'); rl.addColorStop(1,'rgba(255,80,10,0)');
  ctx.fillStyle=rl; ctx.fillRect(0,0,w,h);
  const hx=w*.5,hy=h*.36,hr=w*.19;
  const hg=ctx.createRadialGradient(hx-hr*.28,hy-hr*.22,hr*.06,hx,hy,hr);
  hg.addColorStop(0,'#c07842'); hg.addColorStop(.6,'#7a3c1e'); hg.addColorStop(1,'#3a0e06');
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
  const bdg=ctx.createLinearGradient(w*.3,h*.55,w*.7,h*.55);
  bdg.addColorStop(0,'#160804'); bdg.addColorStop(.5,'#221008'); bdg.addColorStop(1,'#160804');
  ctx.fillStyle=bdg; ctx.beginPath(); ctx.moveTo(w*.3,h); ctx.quadraticCurveTo(w*.3,h*.62,w*.42,h*.56); ctx.lineTo(w*.48,h*.5); ctx.lineTo(w*.52,h*.5); ctx.lineTo(w*.58,h*.56); ctx.quadraticCurveTo(w*.7,h*.62,w*.7,h); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#08030a'; ctx.beginPath(); ctx.moveTo(hx-hr*.9,hy); ctx.quadraticCurveTo(hx-hr*1.45,hy+hr*.55,w*.18,h*.72); ctx.lineTo(w*.13,h*.78); ctx.lineTo(w*.28,h*.62); ctx.quadraticCurveTo(hx-hr*1.2,hy+hr*.95,hx-hr*.78,hy-hr*.28); ctx.closePath(); ctx.fill();
  [[hx-hr*.28,hy-hr*.06],[hx+hr*.28,hy-hr*.06]].forEach(([ex,ey]) => {
    const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,hr*.16);
    eg.addColorStop(0,'rgba(140,190,255,.9)'); eg.addColorStop(.5,'rgba(100,150,255,.4)'); eg.addColorStop(1,'rgba(50,100,200,0)');
    ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(ex,ey,hr*.16,0,Math.PI*2); ctx.fill();
  });
  const ao=ctx.createLinearGradient(0,h*.68,0,h); ao.addColorStop(0,'rgba(0,0,0,0)'); ao.addColorStop(1,'rgba(0,0,0,.65)'); ctx.fillStyle=ao; ctx.fillRect(0,0,w,h);
}

function drawDragon(ctx, w, h) {
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#050215'); sky.addColorStop(.4,'#1a0510'); sky.addColorStop(.7,'#3a0808'); sky.addColorStop(1,'#0a0204');
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
  const sg=ctx.createRadialGradient(w*.5,h*.62,0,w*.5,h*.62,w*.55);
  sg.addColorStop(0,'rgba(255,150,50,.58)'); sg.addColorStop(.3,'rgba(220,60,10,.3)'); sg.addColorStop(1,'rgba(160,10,10,0)');
  ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#040108'; ctx.beginPath();
  [[0,.86],[.07,.62],[.14,.76],[.22,.52],[.3,.7],[.4,.46],[.5,.66],[.6,.43],[.7,.63],[.8,.49],[.9,.65],[1,.7],[1,1],[0,1]].forEach(([xr,yr],i)=>i===0?ctx.moveTo(xr*w,yr*h):ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();
  ctx.fillStyle='#020106'; ctx.strokeStyle='rgba(200,80,0,.55)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(w*.3,h*.36); ctx.quadraticCurveTo(w*.45,h*.25,w*.62,h*.3); ctx.quadraticCurveTo(w*.72,h*.32,w*.76,h*.4); ctx.quadraticCurveTo(w*.65,h*.38,w*.5,h*.4); ctx.quadraticCurveTo(w*.38,h*.42,w*.3,h*.38); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.42,h*.32); ctx.quadraticCurveTo(w*.26,h*.1,w*.14,h*.2); ctx.quadraticCurveTo(w*.2,h*.3,w*.3,h*.32); ctx.quadraticCurveTo(w*.36,h*.35,w*.42,h*.35); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.62,h*.28); ctx.quadraticCurveTo(w*.77,h*.08,w*.88,h*.18); ctx.quadraticCurveTo(w*.82,h*.28,w*.72,h*.3); ctx.quadraticCurveTo(w*.67,h*.32,w*.62,h*.3); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.29,h*.35); ctx.lineTo(w*.22,h*.32); ctx.lineTo(w*.17,h*.37); ctx.lineTo(w*.22,h*.39); ctx.lineTo(w*.29,h*.39); ctx.closePath(); ctx.fill(); ctx.stroke();
  const eyeG=ctx.createRadialGradient(w*.2,h*.35,0,w*.2,h*.35,w*.03);
  eyeG.addColorStop(0,'rgba(255,110,0,.95)'); eyeG.addColorStop(1,'rgba(255,50,0,0)');
  ctx.fillStyle=eyeG; ctx.beginPath(); ctx.arc(w*.2,h*.35,w*.03,0,Math.PI*2); ctx.fill();
}

function drawCrystal(ctx, w, h) {
  ctx.fillStyle='#02050a'; ctx.fillRect(0,0,w,h);
  [{x:.3,y:.6,hue:200,r:.3},{x:.7,y:.7,hue:280,r:.25},{x:.5,y:.4,hue:220,r:.2}].forEach(g => {
    const gg=ctx.createRadialGradient(g.x*w,g.y*h,0,g.x*w,g.y*h,g.r*w);
    gg.addColorStop(0,`hsla(${g.hue},100%,58%,.16)`); gg.addColorStop(1,`hsla(${g.hue},100%,38%,0)`);
    ctx.fillStyle=gg; ctx.fillRect(0,0,w,h);
  });
  function crystal(x,y,cw,ch,hue,flip) {
    ctx.save(); ctx.translate(x,y); if(flip)ctx.scale(1,-1);
    const cg=ctx.createLinearGradient(-cw/2,0,cw/2,0);
    cg.addColorStop(0,`hsla(${hue},78%,18%,.92)`); cg.addColorStop(.32,`hsla(${hue},88%,48%,.72)`); cg.addColorStop(.68,`hsla(${hue},78%,28%,.82)`); cg.addColorStop(1,`hsla(${hue},68%,14%,.92)`);
    ctx.fillStyle=cg; ctx.beginPath(); ctx.moveTo(0,-ch); ctx.lineTo(cw/2,-ch*.38); ctx.lineTo(cw/2,0); ctx.lineTo(-cw/2,0); ctx.lineTo(-cw/2,-ch*.38); ctx.closePath(); ctx.fill();
    ctx.fillStyle=`hsla(${hue},100%,80%,.28)`; ctx.beginPath(); ctx.moveTo(-cw*.08,-ch); ctx.lineTo(cw*.1,-ch*.45); ctx.lineTo(cw*.06,0); ctx.lineTo(-cw*.14,0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  const r=rng(33);
  [[.1,1,200],[.2,1,212],[.35,.95,222],[.65,.95,278],[.75,1,260],[.85,1,268],[.45,1,242],[.55,1,232]].forEach(([xr,yr,hue]) => {
    for (let i=-2;i<=2;i++) { const cw=(r()*.055+.028)*w,ch=(r()*.14+.09)*h; crystal(w*xr+i*cw*1.1,h*yr,cw,ch*(1-r()*.38),hue+r()*28-14,false); }
  });
  [[.22,0,205],[.52,0,252],[.78,0,275]].forEach(([xr,yr,hue]) => {
    for (let i=-1;i<=1;i++) { const cw=(r()*.045+.025)*w,ch=(r()*.1+.07)*h; crystal(w*xr+i*cw*1.1,0,cw,ch,hue+r()*24-12,true); }
  });
}

function drawMecha(ctx, w, h) {
  ctx.fillStyle='#03060a'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(60,100,160,.1)'; ctx.lineWidth=.5;
  for (let x=0;x<w;x+=w/12) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y=0;y<h;y+=h/12) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  const ef=ctx.createRadialGradient(w*.5,h*.46,0,w*.5,h*.46,w*.42);
  ef.addColorStop(0,'rgba(60,120,255,.09)'); ef.addColorStop(1,'rgba(60,120,255,0)');
  ctx.fillStyle=ef; ctx.fillRect(0,0,w,h);
  ctx.save(); ctx.translate(w*.5,h*.5);
  const sc=Math.min(w,h)*.34;
  function hexPlate(px,py,pw,ph,angle) {
    ctx.save(); ctx.translate(px*sc,py*sc); ctx.rotate(angle);
    const hw=pw*sc*.5,hh=ph*sc*.5;
    const pg=ctx.createLinearGradient(-hw,-hh,hw,hh);
    pg.addColorStop(0,'#181e2e'); pg.addColorStop(.4,'#28334a'); pg.addColorStop(.6,'#1a2030'); pg.addColorStop(1,'#0a1018');
    ctx.fillStyle=pg; ctx.strokeStyle='rgba(80,140,220,.38)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(-hw,-hh*.7); ctx.lineTo(-hw*.7,-hh); ctx.lineTo(hw*.7,-hh); ctx.lineTo(hw,-hh*.7); ctx.lineTo(hw,hh*.7); ctx.lineTo(hw*.7,hh); ctx.lineTo(-hw*.7,hh); ctx.lineTo(-hw,hh*.7); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='rgba(100,180,255,.28)'; ctx.lineWidth=.8; ctx.beginPath(); ctx.moveTo(-hw*.5,-hh*.3); ctx.lineTo(hw*.5,-hh*.3); ctx.stroke();
    ctx.restore();
  }
  hexPlate(0,-.92,.82,.42,0); hexPlate(-.76,-.32,.36,.62,.2); hexPlate(.76,-.32,.36,.62,-.2); hexPlate(0,.02,.68,.72,0); hexPlate(-.46,.62,.32,.52,.1); hexPlate(.46,.62,.32,.52,-.1);
  const vg=ctx.createLinearGradient(-sc*.3,0,sc*.3,0);
  vg.addColorStop(0,'rgba(0,200,255,0)'); vg.addColorStop(.2,'rgba(0,200,255,.95)'); vg.addColorStop(.8,'rgba(0,200,255,.95)'); vg.addColorStop(1,'rgba(0,200,255,0)');
  ctx.fillStyle=vg; ctx.fillRect(-sc*.3,-sc*.13,sc*.6,sc*.065);
  const vg2=ctx.createRadialGradient(0,-sc*.1,0,0,-sc*.1,sc*.32);
  vg2.addColorStop(0,'rgba(0,200,255,.22)'); vg2.addColorStop(1,'rgba(0,200,255,0)');
  ctx.fillStyle=vg2; ctx.fillRect(-sc*.45,-sc*.32,sc*.9,sc*.44);
  ctx.restore();
}

function drawFire(ctx, w, h) {
  ctx.fillStyle='#030102'; ctx.fillRect(0,0,w,h);
  const fg=ctx.createRadialGradient(w*.5,h,0,w*.5,h*.65,w*.75);
  fg.addColorStop(0,'rgba(255,115,0,.55)'); fg.addColorStop(.3,'rgba(200,35,0,.32)'); fg.addColorStop(1,'rgba(100,8,0,0)');
  ctx.fillStyle=fg; ctx.fillRect(0,0,w,h);
  const r=rng(11);
  for (let i=0;i<28;i++) { const x=r()*w,y=h-r()*h*.62,sz=r()*w*.085+w*.02,hue=r()*38; const pf=ctx.createRadialGradient(x,y,0,x,y+sz*.45,sz); pf.addColorStop(0,`hsla(${hue+18},100%,72%,${r()*.42+.2})`); pf.addColorStop(.5,`hsla(${hue},100%,52%,${r()*.18+.1})`); pf.addColorStop(1,`hsla(${hue-18},100%,30%,0)`); ctx.fillStyle=pf; ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fill(); }
  ctx.save(); ctx.shadowBlur=6;
  for (let i=0;i<42;i++) { const x=r()*w,y=h-r()*h*.68,hue=r()*55,sz=r()*2.2+.5; ctx.shadowColor=`hsl(${hue},100%,62%)`; ctx.fillStyle=`hsl(${hue},100%,${72+r()*20}%)`; ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle='#010101'; ctx.beginPath(); ctx.moveTo(w*.45,h); ctx.quadraticCurveTo(w*.45,h*.58,w*.48,h*.5); ctx.quadraticCurveTo(w*.5,h*.32,w*.5,h*.22); ctx.quadraticCurveTo(w*.5,h*.32,w*.52,h*.5); ctx.quadraticCurveTo(w*.55,h*.58,w*.55,h); ctx.closePath(); ctx.fill();
}

function drawBanner(ctx, w, h) {
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,'#030614'); sky.addColorStop(.4,'#0a0828'); sky.addColorStop(.7,'#160820'); sky.addColorStop(1,'#04060e');
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
  const r=rng(13);
  for (let i=0;i<200;i++) { ctx.beginPath(); ctx.arc(r()*w,r()*h*.75,r()*1.8+.2,0,Math.PI*2); ctx.fillStyle=`rgba(230,230,255,${r()*.65+.15})`; ctx.fill(); }
  [[.3,.3,240,.35],[.65,.45,290,.28],[.5,.55,200,.22]].forEach(([xr,yr,hue,rad]) => {
    const ng=ctx.createRadialGradient(xr*w,yr*h,0,xr*w,yr*h,rad*w);
    ng.addColorStop(0,`hsla(${hue},80%,55%,.12)`); ng.addColorStop(1,`hsla(${hue},80%,38%,0)`);
    ctx.fillStyle=ng; ctx.fillRect(0,0,w,h);
  });
  const px=w*.72,py=h*.28,pr=h*.3;
  const pg=ctx.createRadialGradient(px-pr*.3,py-pr*.3,pr*.06,px,py,pr);
  pg.addColorStop(0,'#7060d8'); pg.addColorStop(.45,'#301468'); pg.addColorStop(1,'#120828');
  ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
  ctx.save(); ctx.translate(px,py); ctx.scale(1,.22);
  ctx.beginPath(); ctx.arc(0,0,pr*1.7,0,Math.PI*2); ctx.strokeStyle='rgba(180,140,240,.45)'; ctx.lineWidth=pr*.12; ctx.stroke();
  ctx.restore();
  ctx.fillStyle='#050210'; ctx.beginPath();
  [[0,.78],[.06,.58],[.14,.7],[.22,.5],[.32,.68],[.42,.45],[.52,.62],[.62,.42],[.72,.6],[.82,.48],[.9,.62],[1,.68],[1,1],[0,1]].forEach(([xr,yr],i)=>i===0?ctx.moveTo(xr*w,yr*h):ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();
  const hg=ctx.createLinearGradient(0,h*.55,0,h*.75);
  hg.addColorStop(0,'rgba(255,80,40,.28)'); hg.addColorStop(1,'rgba(150,30,20,0)');
  ctx.fillStyle=hg; ctx.fillRect(0,0,w,h);
}

function drawAvatar(ctx, w, h) {
  const bg=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.5,w*.8);
  bg.addColorStop(0,'#180a28'); bg.addColorStop(1,'#060310');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const rl=ctx.createRadialGradient(w*.5,h*.1,0,w*.5,h*.25,w*.55);
  rl.addColorStop(0,'rgba(150,80,255,.35)'); rl.addColorStop(1,'rgba(100,40,200,0)');
  ctx.fillStyle=rl; ctx.fillRect(0,0,w,h);
  const hx=w*.5,hy=h*.42,hr=w*.22;
  const hg=ctx.createRadialGradient(hx-hr*.3,hy-hr*.25,hr*.05,hx,hy,hr);
  hg.addColorStop(0,'#a06840'); hg.addColorStop(.6,'#603820'); hg.addColorStop(1,'#280e06');
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
  ctx.fillStyle='#0c0615';
  ctx.beginPath(); ctx.moveTo(hx,hy-hr*.95); ctx.quadraticCurveTo(hx+hr*1.1,hy-hr*.5,hx+hr*1.2,hy+hr*.3); ctx.quadraticCurveTo(hx+hr*.9,hy+hr*.5,hx+hr*.6,hy); ctx.quadraticCurveTo(hx+hr*.4,hy-hr*.5,hx,hy-hr*.92); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx,hy-hr*.95); ctx.quadraticCurveTo(hx-hr*1.1,hy-hr*.5,hx-hr*1.2,hy+hr*.2); ctx.quadraticCurveTo(hx-hr*.9,hy+hr*.55,hx-hr*.6,hy); ctx.quadraticCurveTo(hx-hr*.4,hy-hr*.5,hx,hy-hr*.92); ctx.closePath(); ctx.fill();
  const bdg=ctx.createLinearGradient(w*.25,h*.65,w*.75,h*.65);
  bdg.addColorStop(0,'#0a0515'); bdg.addColorStop(.5,'#140a22'); bdg.addColorStop(1,'#0a0515');
  ctx.fillStyle=bdg; ctx.beginPath(); ctx.moveTo(w*.25,h); ctx.quadraticCurveTo(w*.28,h*.68,w*.38,h*.62); ctx.lineTo(w*.46,h*.56); ctx.lineTo(w*.54,h*.56); ctx.lineTo(w*.62,h*.62); ctx.quadraticCurveTo(w*.72,h*.68,w*.75,h); ctx.closePath(); ctx.fill();
  [[hx-hr*.28,hy-hr*.06],[hx+hr*.28,hy-hr*.06]].forEach(([ex,ey]) => {
    const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,hr*.15);
    eg.addColorStop(0,'rgba(180,120,255,.95)'); eg.addColorStop(.45,'rgba(130,80,220,.5)'); eg.addColorStop(1,'rgba(80,40,180,0)');
    ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(ex,ey,hr*.15,0,Math.PI*2); ctx.fill();
  });
  const ao=ctx.createLinearGradient(0,h*.72,0,h); ao.addColorStop(0,'rgba(0,0,0,0)'); ao.addColorStop(1,'rgba(0,0,0,.7)'); ctx.fillStyle=ao; ctx.fillRect(0,0,w,h);
}

function drawWatcher(ctx, w, h, seed) {
  const r=rng(seed), hue=r()*360;
  const bg=ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.5,w*.7);
  bg.addColorStop(0,`hsl(${hue},50%,18%)`); bg.addColorStop(1,`hsl(${hue},40%,8%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const hx=w*.5,hy=h*.42,hr=w*.22;
  const hg=ctx.createRadialGradient(hx-hr*.2,hy-hr*.2,0,hx,hy,hr);
  hg.addColorStop(0,`hsl(${hue+20},60%,58%)`); hg.addColorStop(1,`hsl(${hue},50%,32%)`);
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
  ctx.fillStyle=`hsl(${hue+30},40%,12%)`; ctx.beginPath(); ctx.arc(hx,hy-hr*.82,hr*.55,Math.PI,0); ctx.closePath(); ctx.fill();
  const bdg=ctx.createRadialGradient(hx,h*.85,0,hx,h*.7,w*.45);
  bdg.addColorStop(0,`hsl(${hue},45%,24%)`); bdg.addColorStop(1,`hsl(${hue},40%,12%)`);
  ctx.fillStyle=bdg; ctx.beginPath(); ctx.arc(hx,h*.78,w*.32,0,Math.PI*2); ctx.fill();
}

function drawGroupIcon(ctx, w, h, hue) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,`hsl(${hue},60%,22%)`); bg.addColorStop(1,`hsl(${hue},55%,12%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=`hsl(${hue},80%,60%)`; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(w*.5,h*.42,w*.22,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.28,h*.42,w*.14,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.72,h*.42,w*.14,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.28,h*.56); ctx.quadraticCurveTo(w*.28,h*.7,w*.14,h*.8); ctx.moveTo(w*.72,h*.56); ctx.quadraticCurveTo(w*.72,h*.7,w*.86,h*.8); ctx.moveTo(w*.5,h*.64); ctx.lineTo(w*.5,h*.82); ctx.stroke();
}

window.DRAW_FNS = { space:drawSpace, forest:drawForest, neon:drawNeon, flow:drawFlow, portrait:drawPortrait, dragon:drawDragon, crystal:drawCrystal, mecha:drawMecha, fire:drawFire };
window.drawBanner = drawBanner;
window.drawAvatar = drawAvatar;
window.drawWatcher = drawWatcher;
window.drawGroupIcon = drawGroupIcon;
