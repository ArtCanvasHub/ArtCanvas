/* ── ARTCANVAS PROCEDURAL ART ENGINE ─────────────────────
   Each function: (ctx, width, height) → renders to canvas
──────────────────────────────────────────────────────── */

/* Seeded deterministic RNG — mixes in window._artSeed so each work looks unique */
function rng(seed) {
  let s = ((seed ^ 0x5f375a86) + ((window._artSeed || 0) * 6271 | 0)) >>> 0;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/* Helpers */
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* Fake smooth noise using trig interference */
function noise2(x, y, freq, phase) {
  return (Math.sin(x * freq + phase) * Math.cos(y * freq * .7 + phase * 1.3) + 1) * .5;
}

/* Multi-pass glow: draw fn multiple times with shrinking blur */
function glow(ctx, drawFn, color, sizes) {
  ctx.save();
  sizes.forEach(([blur, alpha]) => {
    ctx.shadowBlur  = blur;
    ctx.shadowColor = color;
    ctx.globalAlpha = alpha;
    drawFn();
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   SPACE — deep-space nebula with ringed gas giant
══════════════════════════════════════════════════════ */
function drawSpace(ctx, w, h) {
  const rv = rng(3719);
  const hueOff = rv() * 340;
  const pxFrac = .32 + rv() * .38;
  const pyFrac = .12 + rv() * .32;
  const prFrac = .15 + rv() * .16;

  /* ── Deep space bg ── */
  const bgH = (220 + hueOff) % 360;
  const bg = ctx.createRadialGradient(w*.42, h*.3, 0, w*.5, h*.5, Math.hypot(w,h)*.7);
  bg.addColorStop(0,  `hsl(${bgH},70%,12%)`);
  bg.addColorStop(.35,`hsl(${bgH},80%,5%)`);
  bg.addColorStop(.7, `hsl(${bgH},85%,3%)`);
  bg.addColorStop(1,  `hsl(${bgH},80%,2%)`);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  const r = rng(42);

  /* ── Star field: 3 layers ── */
  // Distant haze stars
  for (let i = 0; i < 350; i++) {
    const x = r()*w, y = r()*h, a = r()*.35+.08;
    ctx.fillStyle = `rgba(${220+r()*35|0},${220+r()*35|0},${240+r()*15|0},${a})`;
    ctx.beginPath(); ctx.arc(x, y, r()*.55+.1, 0, Math.PI*2); ctx.fill();
  }
  // Medium stars
  ctx.save();
  ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(200,210,255,.7)';
  for (let i = 0; i < 55; i++) {
    const x = r()*w, y = r()*h;
    ctx.fillStyle = `rgba(245,248,255,${r()*.55+.35})`;
    ctx.beginPath(); ctx.arc(x, y, r()*.9+.5, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
  // Bright stars with cross flare
  ctx.save();
  for (let i = 0; i < 7; i++) {
    const x = r()*(w*.9)+w*.05, y = r()*(h*.75);
    const hue = r()>.65 ? 220+r()*50 : 38+r()*18;
    const sz  = r()*.8+1.4;
    ctx.shadowBlur = 18; ctx.shadowColor = `hsl(${hue},80%,85%)`;
    ctx.fillStyle  = `hsl(${hue},50%,97%)`;
    ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI*2); ctx.fill();
    // Diffraction spikes
    ctx.shadowBlur = 8; ctx.shadowColor = `hsl(${hue},90%,80%)`;
    ctx.strokeStyle = `hsla(${hue},90%,88%,.45)`;
    ctx.lineWidth = .6;
    const fl = sz*5+6;
    for (let a = 0; a < Math.PI; a += Math.PI/2) {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a)*fl, y + Math.sin(a)*fl);
      ctx.lineTo(x - Math.cos(a)*fl, y - Math.sin(a)*fl);
      ctx.stroke();
    }
  }
  ctx.restore();

  /* ── Nebula clouds ── */
  const nebulas = [
    {x:.26,y:.28,r:.55,h:(238+hueOff)%360,a:.15},
    {x:.72,y:.38,r:.48,h:(280+hueOff)%360,a:.12},
    {x:.5, y:.65,r:.42,h:(200+hueOff)%360,a:.10},
    {x:.12,y:.62,r:.32,h:(310+hueOff)%360,a:.09},
    {x:.85,y:.7, r:.3, h:(260+hueOff)%360,a:.08},
  ];
  nebulas.forEach(n => {
    const ng = ctx.createRadialGradient(n.x*w,n.y*h,0,n.x*w,n.y*h,n.r*w);
    ng.addColorStop(0, `hsla(${n.h},88%,55%,${n.a*2.2})`);
    ng.addColorStop(.38,`hsla(${n.h+18},78%,40%,${n.a})`);
    ng.addColorStop(.75,`hsla(${n.h+35},65%,30%,${n.a*.45})`);
    ng.addColorStop(1,  `hsla(${n.h},55%,20%,0)`);
    ctx.fillStyle = ng; ctx.fillRect(0,0,w,h);
  });
  // Secondary nebula wisps
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  [[.38,.42,188,.045],[.62,.22,255,.04],[.5,.55,220,.035]].forEach(([x,y,hue,a]) => {
    const wg = ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,.22*w);
    wg.addColorStop(0,`hsla(${hue},100%,65%,${a})`);
    wg.addColorStop(1,`hsla(${hue},80%,40%,0)`);
    ctx.fillStyle=wg; ctx.fillRect(0,0,w,h);
  });
  ctx.restore();

  /* ── Gas giant planet ── */
  const px = w*pxFrac, py = h*pyFrac, pr = Math.min(w,h)*prFrac;
  const pH = (240 + hueOff) % 360;

  // Outer atmosphere halo
  const atm = ctx.createRadialGradient(px,py,pr*.88,px,py,pr*2.2);
  atm.addColorStop(0,  `hsla(${pH},70%,55%,.24)`);
  atm.addColorStop(.35,`hsla(${pH},65%,45%,.14)`);
  atm.addColorStop(1,  `hsla(${pH},60%,30%,0)`);
  ctx.fillStyle = atm; ctx.fillRect(0,0,w,h);

  // Planet body
  const pG = ctx.createRadialGradient(px-pr*.34,py-pr*.28,pr*.03,px,py,pr);
  pG.addColorStop(0,   `hsl(${pH},75%,70%)`);
  pG.addColorStop(.22, `hsl(${pH},60%,50%)`);
  pG.addColorStop(.52, `hsl(${pH},72%,27%)`);
  pG.addColorStop(.8,  `hsl(${pH},80%,14%)`);
  pG.addColorStop(1,   `hsl(${pH},85%,5%)`);
  ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2);
  ctx.fillStyle = pG; ctx.fill();

  // Surface bands & detail
  ctx.save();
  ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.clip();
  const bands = [
    [-.45,.06,'rgba(180,140,255,.08)'],
    [-.2, .05,'rgba(140,100,230,.1)'],
    [.05, .07,'rgba(200,160,255,.07)'],
    [.28, .05,'rgba(100,70,200,.09)'],
    [.52, .06,'rgba(160,120,240,.07)'],
  ];
  bands.forEach(([ry,rh,col]) => {
    const y0 = py+ry*pr, y1 = py+(ry+rh)*pr;
    const bg = ctx.createLinearGradient(0,y0,0,y1);
    bg.addColorStop(0,`rgba(0,0,0,0)`);
    bg.addColorStop(.5,col);
    bg.addColorStop(1,`rgba(0,0,0,0)`);
    ctx.fillStyle=bg; ctx.fillRect(px-pr,y0,pr*2,y1-y0);
  });
  // Terminator shadow (right-to-dark)
  const shd = ctx.createLinearGradient(px-pr,py,px+pr,py);
  shd.addColorStop(0,  'rgba(5,1,20,0)');
  shd.addColorStop(.48,'rgba(5,1,20,0)');
  shd.addColorStop(.72,'rgba(5,1,20,.55)');
  shd.addColorStop(1,  'rgba(2,0,10,.92)');
  ctx.fillStyle = shd; ctx.fillRect(px-pr,py-pr,pr*2,pr*2);
  ctx.restore();

  // Atmosphere rim glow on lit edge
  const rim = ctx.createRadialGradient(px-pr*.4,py-pr*.3,pr*.75,px,py,pr*1.05);
  rim.addColorStop(0, 'rgba(0,0,0,0)');
  rim.addColorStop(.8,'rgba(0,0,0,0)');
  rim.addColorStop(1, 'rgba(120,90,255,.35)');
  ctx.fillStyle=rim; ctx.beginPath(); ctx.arc(px,py,pr*1.05,0,Math.PI*2); ctx.fill();

  // Ring system
  ctx.save(); ctx.translate(px,py); ctx.scale(1,.2);
  const rings = [
    {r0:1.25,r1:1.45,a:.52,h:280},
    {r0:1.5, r1:1.75,a:.35,h:270},
    {r0:1.8, r1:1.92,a:.18,h:260},
  ];
  rings.forEach(ring => {
    const rh = (ring.h + hueOff) % 360;
    const rg = ctx.createRadialGradient(0,0,ring.r0*pr,0,0,ring.r1*pr);
    rg.addColorStop(0, `hsla(${rh},70%,72%,0)`);
    rg.addColorStop(.3,`hsla(${rh},75%,68%,${ring.a})`);
    rg.addColorStop(.7,`hsla(${rh-15},65%,55%,${ring.a*.7})`);
    rg.addColorStop(1, `hsla(${rh},60%,45%,0)`);
    ctx.beginPath();
    ctx.arc(0,0,ring.r1*pr,0,Math.PI*2);
    ctx.arc(0,0,ring.r0*pr,0,Math.PI*2,true);
    ctx.fillStyle=rg; ctx.fill('evenodd');
  });
  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FOREST — bioluminescent night forest with layered depth
══════════════════════════════════════════════════════ */
function drawForest(ctx, w, h) {
  const rv = rng(7213);
  const hueOff = rv() * 340;
  const mxFrac = .12 + rv() * .22;
  const myFrac = .08 + rv() * .18;
  const skyH = (160 + hueOff) % 360;

  /* ── Night sky ── */
  const sky = ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,  `hsl(${skyH},70%,3%)`);
  sky.addColorStop(.45,`hsl(${skyH},65%,5%)`);
  sky.addColorStop(.8, `hsl(${skyH},60%,3%)`);
  sky.addColorStop(1,  `hsl(${skyH},55%,3%)`);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  /* ── Moon ── */
  const mx=w*mxFrac, my=h*myFrac, mr=h*.065;
  // Moonlight halo
  const mlHalo = ctx.createRadialGradient(mx,my,mr,mx,my,mr*5.5);
  mlHalo.addColorStop(0, 'rgba(190,220,190,.22)');
  mlHalo.addColorStop(.4,'rgba(140,190,150,.1)');
  mlHalo.addColorStop(1, 'rgba(90,150,100,0)');
  ctx.fillStyle=mlHalo; ctx.fillRect(0,0,w,h);
  // Moon disc
  ctx.save();
  ctx.shadowBlur=28; ctx.shadowColor='rgba(210,240,215,.7)';
  const mG = ctx.createRadialGradient(mx-mr*.3,my-mr*.25,0,mx,my,mr);
  mG.addColorStop(0,'#e8f5e8'); mG.addColorStop(.55,'#c8e0c8'); mG.addColorStop(1,'#90b890');
  ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fillStyle=mG; ctx.fill();
  ctx.restore();
  // Moon craters
  ctx.save(); ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.clip();
  [[-.25,-.15,.12],[.2,.28,.09],[.05,-.38,.07],[-.38,.22,.06]].forEach(([dx,dy,cr]) => {
    const cg = ctx.createRadialGradient(mx+dx*mr,my+dy*mr,0,mx+dx*mr,my+dy*mr,cr*mr);
    cg.addColorStop(0,'rgba(100,130,100,.22)'); cg.addColorStop(1,'rgba(100,130,100,0)');
    ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);
  });
  ctx.restore();

  /* ── Background stars (dim through canopy) ── */
  const rs = rng(77);
  for (let i=0;i<80;i++) {
    const x=rs()*w, y=rs()*h*.55;
    ctx.fillStyle=`rgba(180,220,190,${rs()*.25+.05})`;
    ctx.beginPath(); ctx.arc(x,y,rs()*.5+.1,0,Math.PI*2); ctx.fill();
  }

  /* ── Layered tree silhouettes ── */
  function treeLayer(xr, yr, wfrac, hfrac, col, levels) {
    const tx=w*xr, ty=h*yr, tw=w*wfrac, th=h*hfrac;
    ctx.fillStyle=col;
    // Trunk
    ctx.fillRect(tx-tw*.08,ty,tw*.16,th*.2);
    // Layered triangular canopy
    for (let l=0;l<levels;l++) {
      const lw=tw*(1.15-l*.22), lh=th*.28+l*th*.04, ly=ty-th*(.22+l*.2);
      ctx.beginPath(); ctx.moveTo(tx,ly-lh); ctx.lineTo(tx+lw/2,ly); ctx.lineTo(tx-lw/2,ly); ctx.closePath(); ctx.fill();
    }
  }
  // Far layer (lightest dark)
  const farTrees = [[.03,.95,.055,.38],[.13,.92,.05,.32],[.24,.93,.06,.42],[.32,.94,.04,.28],[.44,.95,.065,.45],[.56,.92,.05,.35],[.67,.93,.055,.38],[.75,.94,.045,.3],[.87,.92,.06,.4],[.96,.95,.05,.35]];
  farTrees.forEach(([xr,yr,wf,hf]) => treeLayer(xr,yr,wf,hf,'#010e06',3));

  // Mid layer
  const midTrees = [[.08,.94,.07,.5],[.19,.9,.065,.44],[.35,.92,.075,.52],[.5,.88,.085,.58],[.64,.9,.07,.48],[.79,.91,.075,.5],[.92,.93,.065,.42]];
  midTrees.forEach(([xr,yr,wf,hf]) => treeLayer(xr,yr,wf,hf,'#010c04',4));

  // Near layer (darkest)
  const nearTrees = [[.01,.97,.09,.62],[.18,.94,.095,.68],[.42,.91,.11,.74],[.62,.93,.1,.65],[.82,.92,.095,.68],[.97,.96,.08,.55]];
  nearTrees.forEach(([xr,yr,wf,hf]) => treeLayer(xr,yr,wf,hf,'#010804',4));

  /* ── God rays from moon ── */
  ctx.save(); ctx.globalCompositeOperation='screen'; ctx.globalAlpha=.055;
  for (let i=0;i<7;i++) {
    const ang = -.55 + i*.18;
    const rg=ctx.createLinearGradient(mx,my,mx+Math.cos(ang)*w*.8,my+Math.sin(ang)*h*.9);
    rg.addColorStop(0,'rgba(160,220,170,.7)'); rg.addColorStop(1,'rgba(100,180,120,0)');
    ctx.fillStyle=rg;
    ctx.beginPath(); ctx.moveTo(mx,my);
    ctx.lineTo(mx+Math.cos(ang-.04)*w*.9,my+Math.sin(ang-.04)*h);
    ctx.lineTo(mx+Math.cos(ang+.04)*w*.9,my+Math.sin(ang+.04)*h);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  /* ── Ground fog ── */
  const fog=ctx.createLinearGradient(0,h*.78,0,h);
  fog.addColorStop(0,'rgba(30,80,45,0)');
  fog.addColorStop(.4,'rgba(20,60,35,.18)');
  fog.addColorStop(1,'rgba(10,40,22,.38)');
  ctx.fillStyle=fog; ctx.fillRect(0,0,w,h);

  /* ── Bioluminescent orbs ── */
  const rb=rng(177);
  ctx.save();
  for (let i=0;i<22;i++) {
    const x=rb()*w, y=h*.62+rb()*h*.3;
    const hue=(130+hueOff+rb()*60)%360, sz=rb()*h*.025+h*.008;
    ctx.shadowBlur=sz*4; ctx.shadowColor=`hsla(${hue},100%,70%,.9)`;
    ctx.fillStyle=`hsla(${hue},100%,82%,.85)`;
    ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fill();
    ctx.fill(); // double for intensity
  }
  ctx.restore();

  /* ── Floating fireflies ── */
  const rf=rng(277);
  ctx.save();
  for (let i=0;i<18;i++) {
    const x=rf()*w, y=h*.35+rf()*h*.55;
    const hue=(85+hueOff+rf()*90)%360;
    ctx.shadowBlur=14; ctx.shadowColor=`hsla(${hue},100%,72%,.95)`;
    ctx.fillStyle=`hsla(${hue},100%,90%,.9)`;
    ctx.beginPath(); ctx.arc(x,y,rf()*2+.6,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   NEON — rain-slick cyberpunk city at night
══════════════════════════════════════════════════════ */
function drawNeon(ctx, w, h) {
  const rv = rng(6173);
  const hueOff = rv() * 340;
  const skyH = (280 + hueOff) % 360;

  /* ── Sky & atmosphere ── */
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0, `hsl(${skyH},88%,3%)`);
  sky.addColorStop(.6,`hsl(${skyH},90%,5%)`);
  sky.addColorStop(.8,`hsl(${skyH},92%,7%)`);
  sky.addColorStop(1, `hsl(${skyH},88%,6%)`);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  const r=rng(55);

  /* ── Buildings ── */
  const STREET_Y = h*.72;
  const bldgs=[];
  const slots=18;
  for (let i=0;i<slots;i++) {
    bldgs.push({
      x: (i/slots)*w + r()*w*.02-w*.01,
      w: w*.045+r()*w*.04,
      h: h*(.14+r()*.52),
    });
  }
  bldgs.sort((a,b)=>a.h-b.h); // shorter in front

  bldgs.forEach(b => {
    const by = STREET_Y-b.h;
    // Body
    const bg=ctx.createLinearGradient(b.x,by,b.x+b.w,by);
    bg.addColorStop(0,'#0a0014'); bg.addColorStop(.5,'#0e001c'); bg.addColorStop(1,'#07000f');
    ctx.fillStyle=bg; ctx.fillRect(b.x,by,b.w,b.h);
    // Window grid
    const cols=Math.max(2,Math.floor(b.w/8));
    const rows=Math.max(3,Math.floor(b.h/14));
    for (let row=0;row<rows;row++) for (let col=0;col<cols;col++) {
      if (r()>.45) {
        const hue = r()>.5 ? 295+r()*20 : r()>.5 ? 175+r()*20 : 52+r()*12;
        ctx.fillStyle=`hsla(${hue},100%,72%,${r()*.55+.22})`;
        ctx.fillRect(b.x+col*(b.w/cols)+2, by+row*(b.h/rows)+3, b.w/cols-4, b.h/rows-5);
      }
    }
    // Rooftop accent light
    if (r()>.4) {
      const hue=r()>.5?285:182;
      ctx.save();
      ctx.shadowBlur=18; ctx.shadowColor=`hsl(${hue},100%,65%)`;
      ctx.fillStyle=`hsl(${hue},100%,80%)`;
      ctx.fillRect(b.x+b.w*.2,by-2,b.w*.6,3);
      ctx.restore();
    }
  });

  /* ── Neon signs with multi-pass glow ── */
  const signs=[
    {x:w*.1, y:h*.45,t:'HOTEL',   hue:(295+hueOff)%360,size:w*.042},
    {x:w*.38,y:h*.42,t:'24HR',    hue:(180+hueOff)%360,size:w*.038},
    {x:w*.62,y:h*.48,t:'BAR',     hue:(52+hueOff)%360, size:w*.045},
    {x:w*.82,y:h*.43,t:'NOODLES', hue:(310+hueOff)%360,size:w*.028},
  ];
  signs.forEach(s => {
    ctx.font = `bold ${s.size}px 'Courier New', monospace`;
    [30,16,8,3].forEach((blur,i) => {
      ctx.save();
      ctx.shadowBlur=blur; ctx.shadowColor=`hsl(${s.hue},100%,65%)`;
      ctx.fillStyle=i===3 ? `hsl(${s.hue},100%,90%)` : `hsl(${s.hue},100%,70%)`;
      ctx.fillText(s.t,s.x,s.y);
      ctx.restore();
    });
  });

  /* ── Street & wet reflections ── */
  ctx.fillStyle='#0d0018'; ctx.fillRect(0,STREET_Y,w,h-STREET_Y);
  // Reflection gradient
  const ref=ctx.createLinearGradient(0,STREET_Y,0,h);
  ref.addColorStop(0,'rgba(0,0,0,.75)'); ref.addColorStop(1,'rgba(0,0,0,.92)');
  ctx.fillStyle=ref; ctx.fillRect(0,STREET_Y,w,h-STREET_Y);
  // Neon glow pools on street
  signs.forEach(s => {
    const rg=ctx.createRadialGradient(s.x+60,STREET_Y,0,s.x+60,STREET_Y,w*.18);
    rg.addColorStop(0,`hsla(${s.hue},100%,55%,.28)`);
    rg.addColorStop(1,`hsla(${s.hue},100%,35%,0)`);
    ctx.fillStyle=rg; ctx.fillRect(0,STREET_Y,w,h-STREET_Y);
  });
  // Reflected sign smears
  signs.forEach(s => {
    ctx.save(); ctx.globalAlpha=.12;
    ctx.font=`bold ${s.size}px 'Courier New', monospace`;
    ctx.save(); ctx.scale(1,-1); ctx.translate(0,-STREET_Y*2-s.size);
    ctx.shadowBlur=20; ctx.shadowColor=`hsl(${s.hue},100%,65%)`;
    ctx.fillStyle=`hsl(${s.hue},100%,75%)`;
    ctx.fillText(s.t,s.x,s.y);
    ctx.restore(); ctx.restore();
  });

  /* ── Rain streaks ── */
  ctx.save(); ctx.globalAlpha=.08;
  ctx.strokeStyle='rgba(180,160,255,1)'; ctx.lineWidth=.5;
  const rr=rng(155);
  for (let i=0;i<70;i++) {
    const x=rr()*w, y=rr()*h, len=h*.04+rr()*h*.06;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len*.2,y+len); ctx.stroke();
  }
  ctx.restore();

  /* ── Atmospheric fog at street level ── */
  const fog=ctx.createLinearGradient(0,STREET_Y-h*.08,0,STREET_Y+h*.06);
  fog.addColorStop(0,'rgba(0,0,0,0)');
  fog.addColorStop(.5,'rgba(50,0,80,.18)');
  fog.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=fog; ctx.fillRect(0,0,w,h);
}

/* ══════════════════════════════════════════════════════
   FLOW — liquid interference field with particle streams
══════════════════════════════════════════════════════ */
function drawFlow(ctx, w, h) {
  const rv = rng(5501);
  const hueOff = rv() * 340;
  const yShift = (rv() - .5) * .18;
  const bgH = (260 + hueOff) % 360;

  /* ── Background ── */
  const bg=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.5,Math.hypot(w,h)*.65);
  bg.addColorStop(0,`hsl(${bgH},70%,10%)`); bg.addColorStop(.55,`hsl(${bgH},80%,5%)`); bg.addColorStop(1,`hsl(${bgH},85%,3%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  /* ── Flow field waves — layered interference ── */
  const waves=[
    {hue:(252+hueOff)%360,a:.72,freq:.016,amp:.18,ph:0,   y:.32+yShift},
    {hue:(198+hueOff)%360,a:.65,freq:.021,amp:.14,ph:1.2, y:.45+yShift},
    {hue:(285+hueOff)%360,a:.68,freq:.013,amp:.21,ph:2.4, y:.55+yShift},
    {hue:(178+hueOff)%360,a:.58,freq:.025,amp:.12,ph:.7,  y:.62+yShift},
    {hue:(328+hueOff)%360,a:.62,freq:.019,amp:.16,ph:3.1, y:.38+yShift},
    {hue:(220+hueOff)%360,a:.55,freq:.012,amp:.19,ph:1.8, y:.7+yShift},
    {hue:(162+hueOff)%360,a:.52,freq:.022,amp:.11,ph:4.2, y:.48+yShift},
    {hue:(308+hueOff)%360,a:.48,freq:.017,amp:.17,ph:2.9, y:.78+yShift},
  ];

  waves.forEach((wv,wi) => {
    ctx.beginPath(); ctx.moveTo(0,h);
    for (let x=0;x<=w;x+=1.5) {
      const t  = x*wv.freq+wi*.95;
      const y  = h*wv.y + Math.sin(t)*h*wv.amp
                         + Math.sin(t*2.1+wi*.7)*h*wv.amp*.42
                         + Math.sin(t*.5+wi*1.3)*h*wv.amp*.28;
      x<1 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath();
    const wg=ctx.createLinearGradient(0,h*(wv.y-wv.amp*.8),0,h*(wv.y+wv.amp*.8));
    wg.addColorStop(0,`hsla(${wv.hue},88%,68%,${wv.a})`);
    wg.addColorStop(.5,`hsla(${wv.hue+22},80%,55%,${wv.a*.55})`);
    wg.addColorStop(1,`hsla(${wv.hue},70%,38%,0)`);
    ctx.fillStyle=wg; ctx.fill();
  });

  /* ── Bright flowing particles ── */
  const rp=rng(99);
  ctx.save();
  for (let i=0;i<80;i++) {
    const x=rp()*w, y=rp()*h;
    const hue=160+rp()*170, sz=rp()*2.2+.4;
    const dist=Math.abs(y/h-.52);
    if (dist>.4) continue;
    ctx.shadowBlur=sz*5; ctx.shadowColor=`hsla(${hue},100%,80%,.9)`;
    ctx.fillStyle=`hsla(${hue},90%,88%,${.6-dist})`;
    ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  /* ── Central energy core ── */
  const cx=w*.5, cy=h*.5;
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,h*.22);
  cg.addColorStop(0,  'rgba(255,255,255,.06)');
  cg.addColorStop(.4, 'rgba(200,160,255,.04)');
  cg.addColorStop(1,  'rgba(100,80,200,0)');
  ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);

  /* ── Vignette ── */
  const vig=ctx.createRadialGradient(w*.5,h*.5,Math.hypot(w,h)*.2,w*.5,h*.5,Math.hypot(w,h)*.7);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,.6)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,w,h);
}

/* ══════════════════════════════════════════════════════
   PORTRAIT — dramatic cinematic character portrait
══════════════════════════════════════════════════════ */
function drawPortrait(ctx, w, h) {
  const rv = rng(8317);
  const hueOff = rv() * 340;
  const hxFrac = .38 + (rv() - .5) * .18;
  const hyFrac = .28 + (rv() - .5) * .14;
  const keyH = (25 + hueOff) % 360;
  const rimH = (210 + hueOff) % 360;

  /* ── Background — warm split light ── */
  const bg=ctx.createRadialGradient(w*hxFrac,h*hyFrac,0,w*.5,h*.5,Math.hypot(w,h)*.8);
  bg.addColorStop(0, `hsl(${keyH},45%,9%)`);
  bg.addColorStop(.45,`hsl(${keyH},40%,5%)`);
  bg.addColorStop(.8, `hsl(${keyH},35%,3%)`);
  bg.addColorStop(1,  `hsl(${keyH},30%,2%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  // Warm key light from upper-left
  const kl=ctx.createRadialGradient(w*.18,h*.12,0,w*.38,h*.3,w*.72);
  kl.addColorStop(0,`hsla(${keyH},100%,62%,.32)`);
  kl.addColorStop(.45,`hsla(${keyH},100%,42%,.14)`);
  kl.addColorStop(1,`hsla(${keyH},90%,25%,0)`);
  ctx.fillStyle=kl; ctx.fillRect(0,0,w,h);
  // Cool rim light from right
  const rl=ctx.createRadialGradient(w*.9,h*.3,0,w*.78,h*.4,w*.55);
  rl.addColorStop(0,`hsla(${rimH},70%,50%,.18)`);
  rl.addColorStop(1,`hsla(${rimH},70%,35%,0)`);
  ctx.fillStyle=rl; ctx.fillRect(0,0,w,h);

  const hx=w*.5,hy=h*.36,hr=w*.195;

  /* ── Hair — dark mass behind head ── */
  ctx.fillStyle='#0a0410';
  ctx.beginPath();
  ctx.moveTo(hx,hy-hr*.92);
  ctx.bezierCurveTo(hx+hr*1.28,hy-hr*.72,hx+hr*1.38,hy+hr*.28,hx+hr*.72,hy+hr*.15);
  ctx.quadraticCurveTo(hx+hr*.82,hy-hr*.28,hx,hy-hr*.88);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx,hy-hr*.92);
  ctx.bezierCurveTo(hx-hr*1.28,hy-hr*.72,hx-hr*1.38,hy+hr*.22,hx-hr*.68,hy+hr*.12);
  ctx.quadraticCurveTo(hx-hr*.8,hy-hr*.32,hx,hy-hr*.88);
  ctx.closePath(); ctx.fill();
  // Hair strand detail
  ctx.save();
  ctx.strokeStyle='rgba(30,15,50,.6)'; ctx.lineWidth=2;
  for (let i=0;i<8;i++) {
    const ox=(i-.5)*.06*w;
    ctx.beginPath();
    ctx.moveTo(hx+ox,hy-hr*.88);
    ctx.quadraticCurveTo(hx+ox*1.4,hy-hr*.2,hx+ox*1.6,hy+hr*.4);
    ctx.stroke();
  }
  ctx.restore();

  /* ── Skin — face ── */
  const fg=ctx.createRadialGradient(hx-hr*.28,hy-hr*.22,hr*.04,hx,hy,hr);
  fg.addColorStop(0, '#d0824a');
  fg.addColorStop(.28,'#a85a2e');
  fg.addColorStop(.6, '#7a3818');
  fg.addColorStop(.88,'#3e1208');
  fg.addColorStop(1,  '#1a0504');
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=fg; ctx.fill();

  /* ── Facial features ── */
  // Brow ridge shadow
  ctx.save(); ctx.globalAlpha=.45;
  ctx.fillStyle='#1a0508';
  ctx.beginPath();
  ctx.ellipse(hx-hr*.28,hy-hr*.18,hr*.24,hr*.06,-0.15,0,Math.PI*2); ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hx+hr*.28,hy-hr*.18,hr*.24,hr*.06,0.15,0,Math.PI*2); ctx.fill();
  ctx.restore();

  // Eyes
  [[hx-hr*.26,hy-hr*.06,1],[hx+hr*.26,hy-hr*.06,-1]].forEach(([ex,ey,dir]) => {
    // Shadow beneath eye
    ctx.save(); ctx.globalAlpha=.4;
    ctx.fillStyle='#120408';
    ctx.beginPath(); ctx.ellipse(ex,ey+hr*.04,hr*.14,hr*.07,0,0,Math.PI*2); ctx.fill();
    ctx.restore();
    // Iris
    const ig=ctx.createRadialGradient(ex,ey,0,ex,ey,hr*.115);
    ig.addColorStop(0,'rgba(180,220,255,.95)');
    ig.addColorStop(.35,'rgba(100,155,255,.8)');
    ig.addColorStop(.7,'rgba(50,90,200,.6)');
    ig.addColorStop(1,'rgba(20,50,160,0)');
    ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(ex,ey,hr*.115,0,Math.PI*2); ctx.fill();
    // Pupil
    ctx.fillStyle='rgba(5,3,15,.92)';
    ctx.beginPath(); ctx.arc(ex,ey,hr*.052,0,Math.PI*2); ctx.fill();
    // Highlight
    ctx.save(); ctx.shadowBlur=4; ctx.shadowColor='rgba(255,255,255,.8)';
    ctx.fillStyle='rgba(255,255,255,.92)';
    ctx.beginPath(); ctx.arc(ex+hr*.04*dir,ey-hr*.03,hr*.02,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });

  // Nose bridge suggestion
  ctx.save(); ctx.globalAlpha=.25; ctx.strokeStyle='#100408'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(hx,hy-hr*.04); ctx.quadraticCurveTo(hx+hr*.07,hy+hr*.14,hx,hy+hr*.16); ctx.stroke();
  ctx.restore();

  // Lips
  const lx=hx, ly=hy+hr*.28;
  const lipG=ctx.createLinearGradient(lx-hr*.14,ly-hr*.04,lx+hr*.14,ly+hr*.04);
  lipG.addColorStop(0,'#7a2a18'); lipG.addColorStop(.5,'#9a3820'); lipG.addColorStop(1,'#6a2010');
  ctx.fillStyle=lipG;
  ctx.beginPath();
  ctx.moveTo(lx-hr*.15,ly); ctx.quadraticCurveTo(lx,ly-hr*.055,lx+hr*.15,ly);
  ctx.quadraticCurveTo(lx,ly+hr*.065,lx-hr*.15,ly);
  ctx.closePath(); ctx.fill();

  /* ── Neck & shoulders ── */
  const ng=ctx.createLinearGradient(w*.3,h*.58,w*.7,h*.58);
  ng.addColorStop(0,'#100508'); ng.addColorStop(.5,'#1e0a08'); ng.addColorStop(1,'#100508');
  ctx.fillStyle=ng;
  ctx.beginPath(); ctx.moveTo(w*.28,h); ctx.bezierCurveTo(w*.3,h*.66,w*.4,h*.6,w*.44,h*.55);
  ctx.lineTo(w*.5,h*.52); ctx.lineTo(w*.56,h*.55);
  ctx.bezierCurveTo(w*.6,h*.6,w*.7,h*.66,w*.72,h);
  ctx.closePath(); ctx.fill();
  // Neck
  ctx.fillStyle='#2a1008';
  ctx.beginPath(); ctx.moveTo(hx-hr*.22,hy+hr*.85); ctx.quadraticCurveTo(hx,hy+hr*.78,hx+hr*.22,hy+hr*.85);
  ctx.lineTo(hx+hr*.18,h*.58); ctx.quadraticCurveTo(hx,h*.55,hx-hr*.18,h*.58);
  ctx.closePath(); ctx.fill();

  /* ── Cool rim highlight on right edge ── */
  ctx.save(); ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.clip();
  const rim=ctx.createLinearGradient(hx-hr,hy,hx+hr,hy);
  rim.addColorStop(0,'rgba(0,0,0,0)');
  rim.addColorStop(.72,'rgba(0,0,0,0)');
  rim.addColorStop(.88,'rgba(60,110,200,.28)');
  rim.addColorStop(1,'rgba(80,140,220,.42)');
  ctx.fillStyle=rim; ctx.fillRect(hx-hr,hy-hr,hr*2,hr*2);
  ctx.restore();

  /* ── Bottom vignette ── */
  const vn=ctx.createLinearGradient(0,h*.62,0,h);
  vn.addColorStop(0,'rgba(0,0,0,0)'); vn.addColorStop(1,'rgba(0,0,0,.82)');
  ctx.fillStyle=vn; ctx.fillRect(0,0,w,h);
}

/* ══════════════════════════════════════════════════════
   DRAGON — epic dragon silhouette against stormy sky
══════════════════════════════════════════════════════ */
function drawDragon(ctx, w, h) {
  const rv = rng(9431);
  const hueOff = rv() * 340;
  const fireXFrac = .35 + rv() * .3;
  const skyH = (320 + hueOff) % 360;
  const fireH = (15 + hueOff) % 360;

  /* ── Dramatic sky ── */
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0, `hsl(${skyH},85%,3%)`);
  sky.addColorStop(.3,`hsl(${(skyH+20)%360},80%,6%)`);
  sky.addColorStop(.6,`hsl(${(skyH+30)%360},75%,14%)`);
  sky.addColorStop(.85,`hsl(${(skyH+15)%360},70%,8%)`);
  sky.addColorStop(1,  `hsl(${skyH},75%,3%)`);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  /* ── Fire glow on horizon ── */
  const fg=ctx.createRadialGradient(w*fireXFrac,h*.72,0,w*fireXFrac,h*.68,w*.7);
  fg.addColorStop(0,`hsla(${fireH},100%,65%,.7)`);
  fg.addColorStop(.25,`hsla(${fireH},100%,42%,.45)`);
  fg.addColorStop(.55,`hsla(${fireH},90%,25%,.22)`);
  fg.addColorStop(1,`hsla(${fireH},80%,12%,0)`);
  ctx.fillStyle=fg; ctx.fillRect(0,0,w,h);

  /* ── Clouds ── */
  ctx.save(); ctx.globalAlpha=.18;
  [[.2,.2,.3,.18],[.65,.15,.4,.22],[.45,.35,.5,.16],[.8,.28,.28,.14]].forEach(([x,y,r,a]) => {
    const cg=ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,r*w);
    cg.addColorStop(0,`rgba(80,20,20,${a})`); cg.addColorStop(1,'rgba(40,5,5,0)');
    ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);
  });
  ctx.restore();

  /* ── Mountain silhouettes ── */
  function mountain(pts, col) {
    ctx.fillStyle=col; ctx.beginPath();
    pts.forEach(([xr,yr],i)=>i===0?ctx.moveTo(xr*w,yr*h):ctx.lineTo(xr*w,yr*h));
    ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();
  }
  mountain([[0,.82],[.1,.6],[.2,.72],[.3,.52],[.42,.68],[.52,.45],[.62,.62],[.72,.42],[.82,.58],[.92,.48],[1,.62]],'#0c0308');
  mountain([[0,.9],[.08,.72],[.18,.82],[.28,.65],[.4,.78],[.55,.58],[.68,.75],[.78,.62],[.9,.78],[1,.72],[1,1],[0,1]],'#060204');

  /* ── Dragon body — dramatic overhead silhouette ── */
  ctx.fillStyle='#050108';
  // Body
  ctx.beginPath();
  ctx.moveTo(w*.28,h*.42);
  ctx.bezierCurveTo(w*.34,h*.28,w*.52,h*.22,w*.64,h*.28);
  ctx.bezierCurveTo(w*.78,h*.34,w*.82,h*.48,w*.72,h*.52);
  ctx.bezierCurveTo(w*.62,h*.56,w*.48,h*.54,w*.38,h*.52);
  ctx.bezierCurveTo(w*.28,h*.5,w*.22,h*.48,w*.28,h*.42);
  ctx.closePath(); ctx.fill();

  // Neck
  ctx.beginPath();
  ctx.moveTo(w*.28,h*.44);
  ctx.bezierCurveTo(w*.22,h*.44,w*.18,h*.38,w*.16,h*.35);
  ctx.bezierCurveTo(w*.14,h*.32,w*.12,h*.28,w*.14,h*.26);
  ctx.bezierCurveTo(w*.16,h*.26,w*.18,h*.3,w*.22,h*.34);
  ctx.bezierCurveTo(w*.26,h*.38,w*.3,h*.42,w*.28,h*.44);
  ctx.closePath(); ctx.fill();

  // Head
  ctx.beginPath();
  ctx.moveTo(w*.14,h*.26);
  ctx.bezierCurveTo(w*.16,h*.19,w*.24,h*.18,w*.28,h*.22);
  ctx.bezierCurveTo(w*.32,h*.26,w*.3,h*.32,w*.26,h*.34);
  ctx.bezierCurveTo(w*.22,h*.36,w*.14,h*.34,w*.14,h*.26);
  ctx.closePath(); ctx.fill();

  // Snout horn
  ctx.beginPath();
  ctx.moveTo(w*.12,h*.22);
  ctx.lineTo(w*.04,h*.16);
  ctx.lineTo(w*.16,h*.22);
  ctx.closePath(); ctx.fill();

  // Wings — left
  ctx.beginPath();
  ctx.moveTo(w*.34,h*.34);
  ctx.bezierCurveTo(w*.2,h*.08,w*.04,h*.06,w*.02,h*.22);
  ctx.bezierCurveTo(w*.06,h*.24,w*.12,h*.2,w*.18,h*.32);
  ctx.bezierCurveTo(w*.1,h*.28,w*.04,h*.36,w*.08,h*.44);
  ctx.bezierCurveTo(w*.16,h*.42,w*.24,h*.38,w*.3,h*.42);
  ctx.closePath(); ctx.fill();
  // Wing membrane detail
  ctx.strokeStyle='rgba(180,60,20,.35)'; ctx.lineWidth=.8;
  ctx.save();
  [[.34,.34,.02,.22],[.32,.36,.08,.44],[.3,.38,.14,.4]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1*w,y1*h); ctx.lineTo(x2*w,y2*h); ctx.stroke();
  });
  ctx.restore();

  // Wings — right
  ctx.fillStyle='#060108';
  ctx.beginPath();
  ctx.moveTo(w*.6,h*.26);
  ctx.bezierCurveTo(w*.75,h*.05,w*.95,h*.04,w*.98,h*.2);
  ctx.bezierCurveTo(w*.94,h*.22,w*.88,h*.16,w*.8,h*.28);
  ctx.bezierCurveTo(w*.9,h*.24,w*.96,h*.34,w*.92,h*.44);
  ctx.bezierCurveTo(w*.82,h*.42,w*.72,h*.36,w*.64,h*.4);
  ctx.closePath(); ctx.fill();

  /* ── Dragon fire breath ── */
  ctx.save();
  // Outer fire volume
  [[w*.04,h*.18,.32,(255+hueOff)%360,60,.35],[w*.05,h*.19,.24,(30+hueOff)%360,80,.45],[w*.06,h*.2,.16,(18+hueOff)%360,100,.55],[w*.07,h*.21,.1,(8+hueOff)%360,120,.65]].forEach(([x,y,r,hue,sat,a]) => {
    const ffg=ctx.createRadialGradient(x,y,0,x,y,r*w);
    ffg.addColorStop(0,`hsla(${hue},${sat}%,90%,${a})`);
    ffg.addColorStop(.4,`hsla(${hue+10},${sat+20}%,65%,${a*.6})`);
    ffg.addColorStop(1,`hsla(${hue+20},100%,40%,0)`);
    ctx.fillStyle=ffg; ctx.fillRect(0,0,w,h);
  });
  ctx.restore();
  // Fire core glow
  ctx.save();
  ctx.shadowBlur=30; ctx.shadowColor='rgba(255,180,30,.8)';
  ctx.fillStyle='rgba(255,230,180,.9)';
  ctx.beginPath(); ctx.arc(w*.06,h*.19,w*.018,0,Math.PI*2); ctx.fill(); ctx.fill();
  ctx.restore();

  /* ── Dragon eye ── */
  ctx.save();
  ctx.shadowBlur=16; ctx.shadowColor='rgba(255,100,20,.95)';
  ctx.fillStyle='rgba(255,140,20,.9)';
  ctx.beginPath(); ctx.arc(w*.188,h*.265,w*.018,0,Math.PI*2); ctx.fill(); ctx.fill();
  ctx.restore();
  ctx.fillStyle='rgba(10,2,2,.92)';
  ctx.beginPath(); ctx.arc(w*.188,h*.265,w*.008,0,Math.PI*2); ctx.fill();
}

/* ══════════════════════════════════════════════════════
   CRYSTAL — underground crystal cave with caustic glow
══════════════════════════════════════════════════════ */
function drawCrystal(ctx, w, h) {
  const rv = rng(4127);
  const hueOff = rv() * 340;
  const bgH = (210 + hueOff) % 360;

  /* ── Cave atmosphere ── */
  const bg=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.hypot(w,h)*.7);
  bg.addColorStop(0,`hsl(${bgH},65%,5%)`); bg.addColorStop(.5,`hsl(${bgH},70%,4%)`); bg.addColorStop(1,`hsl(${bgH},75%,2%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  // Ambient glow pools
  [
    [.3,.6,(200+hueOff)%360,.32],
    [.7,.7,(272+hueOff)%360,.28],
    [.5,.35,(228+hueOff)%360,.22]
  ].forEach(([x,y,hue,r]) => {
    const gg=ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,r*w);
    gg.addColorStop(0,`hsla(${hue},100%,58%,.14)`);
    gg.addColorStop(.45,`hsla(${hue+15},90%,42%,.08)`);
    gg.addColorStop(1,`hsla(${hue},80%,30%,0)`);
    ctx.fillStyle=gg; ctx.fillRect(0,0,w,h);
  });

  /* ── Crystal drawing function ── */
  function crystal(cx,cy,cw,ch,hue,flip,seed) {
    const rc=rng(seed);
    ctx.save(); ctx.translate(cx,cy); if(flip) ctx.scale(1,-1);

    // Multiple faces for 3D look
    const faces=[
      {l:-cw/2, r:-cw*.05, hue:hue,   lit:.18},
      {l:-cw*.05,r:cw*.05,  hue:hue+12,lit:.65},
      {l:cw*.05, r:cw/2,  hue:hue-8,  lit:.28},
    ];
    faces.forEach(f => {
      const fg=ctx.createLinearGradient(0,-ch,0,0);
      fg.addColorStop(0, `hsla(${f.hue},88%,${35+f.lit*35}%,${.8+f.lit*.18})`);
      fg.addColorStop(.45,`hsla(${f.hue},80%,${22+f.lit*22}%,.9)`);
      fg.addColorStop(1,  `hsla(${f.hue},72%,14%,.95)`);
      ctx.fillStyle=fg;
      ctx.beginPath();
      ctx.moveTo(0,-ch);
      ctx.lineTo(f.r,-ch*.38);
      ctx.lineTo(f.r,0);
      ctx.lineTo(f.l,0);
      ctx.lineTo(f.l,-ch*.38);
      ctx.closePath(); ctx.fill();
    });

    // Inner light vein
    ctx.save();
    ctx.shadowBlur=8; ctx.shadowColor=`hsla(${hue+15},100%,80%,.8)`;
    ctx.fillStyle=`hsla(${hue+15},100%,88%,.55)`;
    ctx.beginPath();
    ctx.moveTo(-cw*.04,-ch);
    ctx.lineTo( cw*.06,-ch*.4);
    ctx.lineTo( cw*.04,0);
    ctx.lineTo(-cw*.06,0);
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // Tip glow
    ctx.save();
    ctx.shadowBlur=ch*.28; ctx.shadowColor=`hsla(${hue},100%,75%,.95)`;
    ctx.fillStyle=`hsla(${hue},90%,90%,.8)`;
    ctx.beginPath(); ctx.arc(0,-ch,cw*.045,0,Math.PI*2); ctx.fill(); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  const r=rng(33);

  // Floor crystals — growing up
  const floorClusters=[
    {x:.1, hue:(200+hueOff)%360,n:4},{x:.22,hue:(212+hueOff)%360,n:5},{x:.38,hue:(220+hueOff)%360,n:6},
    {x:.52,hue:(230+hueOff)%360,n:5},{x:.65,hue:(245+hueOff)%360,n:4},{x:.78,hue:(268+hueOff)%360,n:5},{x:.9,hue:(278+hueOff)%360,n:4},
  ];
  floorClusters.forEach(cl => {
    for (let i=0;i<cl.n;i++) {
      const ox=(i-cl.n/2)*.055*w;
      const cw=(r()*.05+.025)*w;
      const ch=(r()*.18+.1)*h;
      crystal(cl.x*w+ox,h,cw,ch*(1-r()*.3),cl.hue+r()*30-15,false,cl.hue*i+7);
    }
  });

  // Ceiling crystals — hanging down
  [[.18,0,(205+hueOff)%360],[.44,0,(252+hueOff)%360],[.72,0,(275+hueOff)%360]].forEach(([xr,yr,hue]) => {
    for (let i=0;i<4;i++) {
      const ox=(i-1.5)*.06*w;
      const cw=(r()*.04+.022)*w;
      const ch=(r()*.12+.07)*h;
      crystal(xr*w+ox,0,cw,ch,hue+r()*22-11,true,hue*i+13);
    }
  });

  /* ── Caustic light patterns on cave floor ── */
  ctx.save(); ctx.globalAlpha=.07;
  const rc=rng(77);
  for (let i=0;i<30;i++) {
    const x=rc()*w, y=h*.7+rc()*h*.3;
    const hue=190+rc()*100;
    const cg=ctx.createRadialGradient(x,y,0,x,y,rc()*w*.08+w*.02);
    cg.addColorStop(0,`hsla(${hue},100%,75%,1)`); cg.addColorStop(1,`hsla(${hue},100%,50%,0)`);
    ctx.fillStyle=cg; ctx.fillRect(0,0,w,h);
  }
  ctx.restore();

  /* ── Dark cave rock foreground ── */
  ctx.fillStyle='#020408';
  ctx.beginPath();
  ctx.moveTo(0,h);
  [[0,.84],[.06,.88],[.12,.82],[.2,.9],[.28,.86],[.36,.91],[.44,.89],[.52,.92],[.6,.88],[.68,.9],[.76,.86],[.84,.9],[.92,.88],[1,.84],[1,1]].forEach(([xr,yr]) => ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();
}

/* ══════════════════════════════════════════════════════
   MECHA — battle mech in ruined city at dusk
══════════════════════════════════════════════════════ */
function drawMecha(ctx, w, h) {
  const rv = rng(2837);
  const hueOff = rv() * 340;
  const skyH = (215 + hueOff) % 360;
  const energyH = (195 + hueOff) % 360;

  /* ── Background sky ── */
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,`hsl(${skyH},65%,5%)`); sky.addColorStop(.4,`hsl(${skyH},68%,8%)`); sky.addColorStop(.7,`hsl(${skyH},60%,7%)`); sky.addColorStop(1,`hsl(${skyH},55%,4%)`);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  // Energy field horizon glow
  const hg=ctx.createRadialGradient(w*.5,h*.6,0,w*.5,h*.6,w*.6);
  hg.addColorStop(0,`hsla(${energyH},100%,55%,.14)`); hg.addColorStop(.4,`hsla(${energyH},100%,42%,.07)`); hg.addColorStop(1,`hsla(${energyH},90%,35%,0)`);
  ctx.fillStyle=hg; ctx.fillRect(0,0,w,h);

  /* ── Destroyed city silhouette ── */
  ctx.fillStyle='#040608';
  ctx.beginPath();
  [[0,.82],[.04,.65],[.08,.72],[.12,.58],[.16,.7],[.22,.52],[.25,.68],[.28,.55],[.32,.72],[.36,.62],[.4,.75],[.44,.6],[.52,.72],[.56,.65],[.62,.78],[.68,.60],[.72,.72],[.76,.62],[.8,.75],[.84,.65],[.88,.72],[.92,.58],[.96,.68],[1,.75],[1,1],[0,1]]
    .forEach(([xr,yr],i)=>i===0?ctx.moveTo(xr*w,yr*h):ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();

  /* ── Grid scan lines in BG ── */
  ctx.save(); ctx.strokeStyle=`hsla(${energyH},100%,50%,.06)`; ctx.lineWidth=.5;
  for (let y=0;y<h;y+=h/18) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  for (let x=0;x<w;x+=w/12) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  ctx.restore();

  /* ── Mech body ── */
  const mc=w*.5, sc=Math.min(w,h)*.38;

  function plate(x,y,pw,ph,angle,depth) {
    ctx.save(); ctx.translate(mc+x*sc, h*.55+y*sc); ctx.rotate(angle);
    const hw=pw*sc*.5,hh=ph*sc*.5;
    const pg=ctx.createLinearGradient(-hw,-hh,hw,hh);
    const d=clamp(depth,.0,1);
    pg.addColorStop(0, `hsl(215,${30+d*20}%,${14+d*10}%)`);
    pg.addColorStop(.35,`hsl(215,${25+d*20}%,${20+d*14}%)`);
    pg.addColorStop(.65,`hsl(215,${22+d*18}%,${12+d*8}%)`);
    pg.addColorStop(1, `hsl(215,${18+d*15}%,${7+d*5}%)`);
    ctx.fillStyle=pg;
    ctx.strokeStyle=`rgba(80,160,255,${.25+d*.18})`;
    ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(-hw,-hh*.75); ctx.lineTo(-hw*.7,-hh); ctx.lineTo(hw*.7,-hh);
    ctx.lineTo(hw,-hh*.75); ctx.lineTo(hw,hh*.75); ctx.lineTo(hw*.7,hh);
    ctx.lineTo(-hw*.7,hh); ctx.lineTo(-hw,hh*.75); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Panel line detail
    ctx.strokeStyle=`rgba(40,100,200,.22)`;ctx.lineWidth=.6;
    ctx.beginPath(); ctx.moveTo(-hw*.5,-hh*.3); ctx.lineTo(hw*.5,-hh*.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*.3,-hh*.6); ctx.lineTo(hw*.3,-hh*.6); ctx.stroke();
    ctx.restore();
  }

  // Legs
  plate(-.38,.72,.3,.72,-.06,.6);
  plate( .38,.72,.3,.72, .06,.6);
  // Feet
  plate(-.38,1.1,.38,.22,0,.5);
  plate( .38,1.1,.38,.22,0,.5);
  // Torso
  plate(0,.08,.78,.75,0,1);
  // Shoulders
  plate(-.62,-.05,.34,.5,-.18,.8);
  plate( .62,-.05,.34,.5, .18,.8);
  // Upper arms
  plate(-.72,.38,.28,.6,-.12,.65);
  plate( .72,.38,.28,.6, .12,.65);
  // Forearms
  plate(-.72,.88,.24,.52,-.08,.55);
  plate( .72,.88,.24,.52, .08,.55);
  // Head
  plate(0,-.62,.46,.4,0,.9);

  /* ── Visor / eye ── */
  ctx.save();
  const vx=mc, vy=h*.55+sc*(-.62);
  const vw=sc*.34, vh=sc*.08;
  // Visor glow
  [24,14,6,2].forEach(blur => {
    ctx.shadowBlur=blur; ctx.shadowColor=`hsla(${energyH},100%,65%,.9)`;
    ctx.fillStyle=blur===2?`hsla(${energyH},80%,90%,.95)`:`hsla(${energyH},100%,60%,.4)`;
    ctx.beginPath(); ctx.ellipse(vx,vy,vw,vh,0,0,Math.PI*2); ctx.fill();
  });
  ctx.restore();

  /* ── Chest energy core ── */
  ctx.save();
  const corex=mc, corey=h*.55+sc*.05;
  [30,18,8,3].forEach(blur => {
    ctx.shadowBlur=blur; ctx.shadowColor=`hsla(${energyH},100%,60%,.9)`;
    ctx.fillStyle=blur===3?`hsla(${energyH},80%,88%,.95)`:`hsla(${energyH},100%,55%,.5)`;
    ctx.beginPath(); ctx.arc(corex,corey,sc*.055*(1-blur/50),0,Math.PI*2); ctx.fill();
  });
  ctx.restore();

  /* ── Ground shadow ── */
  const gs=ctx.createEllipse ? null : null; // fallback
  ctx.save(); ctx.globalAlpha=.5;
  const gsg=ctx.createRadialGradient(mc,h*.98,0,mc,h*.95,sc*.65);
  gsg.addColorStop(0,'rgba(0,0,0,.7)'); gsg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=gsg; ctx.fillRect(0,0,w,h);
  ctx.restore();
}

/* ══════════════════════════════════════════════════════
   FIRE — ceremonial bonfire with embers and smoke
══════════════════════════════════════════════════════ */
function drawFire(ctx, w, h) {
  const rv = rng(3613);
  const hueOff = rv() * 340;
  const fxFrac = .38 + rv() * .24;
  const baseH = (10 + hueOff) % 360;
  const bgH = (baseH + 10) % 360;

  /* ── Dark bg ── */
  const bg=ctx.createRadialGradient(w*fxFrac,h*.75,0,w*fxFrac,h*.55,w*.85);
  bg.addColorStop(0,`hsla(${bgH},80%,12%,.9)`); bg.addColorStop(.5,`hsla(${bgH},70%,5%,.95)`); bg.addColorStop(1,`hsla(${bgH},60%,2%,1)`);
  ctx.fillStyle=`hsl(${bgH},55%,2%)`; ctx.fillRect(0,0,w,h);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);

  /* ── Flame layers — largest to smallest ── */
  function flame(cx,cy,fw,fh,hue,alpha) {
    const fg=ctx.createRadialGradient(cx,cy+fh*.2,fh*.05,cx,cy,fh*.55);
    fg.addColorStop(0, `hsla(${hue+40},100%,88%,${alpha})`);
    fg.addColorStop(.25,`hsla(${hue+20},100%,72%,${alpha*.85})`);
    fg.addColorStop(.55,`hsla(${hue},100%,52%,${alpha*.6})`);
    fg.addColorStop(.85,`hsla(${hue-15},100%,35%,${alpha*.3})`);
    fg.addColorStop(1,  `hsla(${hue-25},100%,20%,0)`);
    ctx.fillStyle=fg;
    ctx.beginPath();
    ctx.moveTo(cx,cy+fh*.05);
    ctx.bezierCurveTo(cx-fw*.45,cy+fh*.4,cx-fw*.55,cy+fh*.75,cx-fw*.18,cy+fh);
    ctx.lineTo(cx+fw*.18,cy+fh);
    ctx.bezierCurveTo(cx+fw*.55,cy+fh*.75,cx+fw*.45,cy+fh*.4,cx,cy+fh*.05);
    ctx.closePath(); ctx.fill();
  }

  // Outer warm volume
  flame(w*fxFrac,h*.2,w*.62,h*.68,(10+hueOff)%360,.52);
  flame(w*(fxFrac-.08),h*.3,w*.44,h*.52,(12+hueOff)%360,.48);
  flame(w*(fxFrac+.08),h*.28,w*.38,h*.5,(8+hueOff)%360,.45);
  // Mid flames
  flame(w*fxFrac,h*.32,w*.42,h*.52,(18+hueOff)%360,.62);
  flame(w*(fxFrac-.04),h*.38,w*.32,h*.42,(20+hueOff)%360,.58);
  flame(w*(fxFrac+.04),h*.35,w*.28,h*.44,(15+hueOff)%360,.55);
  // Inner hot flames
  flame(w*fxFrac,h*.44,w*.26,h*.38,(30+hueOff)%360,.75);
  flame(w*(fxFrac-.02),h*.48,w*.18,h*.3,(38+hueOff)%360,.72);
  flame(w*(fxFrac+.02),h*.46,w*.16,h*.32,(35+hueOff)%360,.68);
  // White-hot core
  ctx.save();
  ctx.shadowBlur=22; ctx.shadowColor=`hsla(${(baseH+40)%360},100%,88%,.9)`;
  ctx.fillStyle=`hsla(${(baseH+50)%360},80%,95%,.92)`;
  ctx.beginPath(); ctx.arc(w*fxFrac,h*.55,w*.035,0,Math.PI*2); ctx.fill(); ctx.fill();
  ctx.restore();

  /* ── Logs / coal base ── */
  ctx.fillStyle='#0a0302';
  ctx.beginPath();
  ctx.moveTo(w*.28,h); ctx.lineTo(w*.25,h*.82); ctx.lineTo(w*.75,h*.82); ctx.lineTo(w*.72,h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='rgba(255,80,10,.35)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(w*.25,h*.82); ctx.lineTo(w*.75,h*.82); ctx.stroke();
  // Embers on log
  const rel=rng(44);
  ctx.save();
  for (let i=0;i<25;i++) {
    const ex=w*.28+rel()*w*.44, ey=h*.82+rel()*h*.1;
    const ehue=rel()*40;
    ctx.shadowBlur=8; ctx.shadowColor=`hsl(${ehue},100%,60%)`;
    ctx.fillStyle=`hsl(${ehue},100%,${65+rel()*20}%)`;
    ctx.beginPath(); ctx.arc(ex,ey,rel()*3.5+.8,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  /* ── Rising embers ── */
  const re=rng(11);
  ctx.save();
  for (let i=0;i<55;i++) {
    const ex=w*.3+re()*w*.4, ey=re()*h*.78;
    const dist=ey/h;
    const hue=re()*45;
    const sz=re()*(1-dist)*3.5+.4;
    ctx.shadowBlur=sz*4; ctx.shadowColor=`hsl(${hue},100%,65%)`;
    ctx.fillStyle=`hsl(${hue},100%,${72+re()*18}%)`;
    ctx.globalAlpha=clamp(1-dist*.9,.05,1);
    ctx.beginPath(); ctx.arc(ex,ey,sz,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  /* ── Smoke ── */
  ctx.save(); ctx.globalAlpha=.12;
  const rs=rng(22);
  for (let i=0;i<20;i++) {
    const sx=w*.4+rs()*w*.2, sy=rs()*h*.3;
    const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,w*.08+rs()*w*.06);
    sg.addColorStop(0,'rgba(80,70,80,.6)'); sg.addColorStop(1,'rgba(40,35,45,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
  }
  ctx.restore();

  /* ── Ambient fire light on ground ── */
  const al=ctx.createRadialGradient(w*fxFrac,h*.82,0,w*fxFrac,h*.82,w*.55);
  al.addColorStop(0,`hsla(${baseH},100%,55%,.25)`); al.addColorStop(.4,`hsla(${baseH},90%,35%,.1)`); al.addColorStop(1,`hsla(${baseH},80%,20%,0)`);
  ctx.fillStyle=al; ctx.fillRect(0,0,w,h);
}

/* ══════════════════════════════════════════════════════
   BANNER — epic profile header (landscape)
══════════════════════════════════════════════════════ */
function drawBanner(ctx, w, h) {
  const sky=ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0, '#020512');
  sky.addColorStop(.35,'#0a0820');
  sky.addColorStop(.65,'#180818');
  sky.addColorStop(1,  '#040410');
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  const r=rng(13);
  // Stars
  for (let i=0;i<280;i++) {
    ctx.fillStyle=`rgba(220,225,255,${r()*.45+.08})`;
    ctx.beginPath(); ctx.arc(r()*w,r()*h*.7,r()*.7+.1,0,Math.PI*2); ctx.fill();
  }
  ctx.save(); ctx.shadowBlur=6; ctx.shadowColor='rgba(210,220,255,.7)';
  for (let i=0;i<30;i++) {
    ctx.fillStyle=`rgba(245,248,255,${r()*.5+.4})`;
    ctx.beginPath(); ctx.arc(r()*w,r()*h*.65,r()*.8+.5,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();

  // Nebula
  [[.25,.28,238,.14],[.68,.38,278,.11],[.5,.55,205,.1]].forEach(([x,y,hue,a]) => {
    const ng=ctx.createRadialGradient(x*w,y*h,0,x*w,y*h,.4*w);
    ng.addColorStop(0,`hsla(${hue},88%,55%,${a*2})`);
    ng.addColorStop(.45,`hsla(${hue+20},78%,40%,${a})`);
    ng.addColorStop(1,`hsla(${hue},65%,30%,0)`);
    ctx.fillStyle=ng; ctx.fillRect(0,0,w,h);
  });

  // Large planet
  const px=w*.72,py=h*.22,pr=h*.38;
  const pG=ctx.createRadialGradient(px-pr*.34,py-pr*.28,pr*.03,px,py,pr);
  pG.addColorStop(0,'#8868e8'); pG.addColorStop(.25,'#4a28b2'); pG.addColorStop(.55,'#28107a'); pG.addColorStop(.85,'#120640'); pG.addColorStop(1,'#050118');
  ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.fillStyle=pG; ctx.fill();
  // Planet shadow
  ctx.save(); ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2); ctx.clip();
  const shd=ctx.createLinearGradient(px-pr,py,px+pr,py);
  shd.addColorStop(.45,'rgba(3,1,16,0)'); shd.addColorStop(.72,'rgba(3,1,16,.6)'); shd.addColorStop(1,'rgba(2,1,12,.95)');
  ctx.fillStyle=shd; ctx.fillRect(px-pr,py-pr,pr*2,pr*2);
  ctx.restore();
  // Ring
  ctx.save(); ctx.translate(px,py); ctx.scale(1,.2);
  ctx.beginPath(); ctx.arc(0,0,pr*1.75,0,Math.PI*2); ctx.arc(0,0,pr*1.1,0,Math.PI*2,true);
  const rg=ctx.createRadialGradient(0,0,pr*1.1,0,0,pr*1.75);
  rg.addColorStop(0,'rgba(0,0,0,0)'); rg.addColorStop(.2,'rgba(160,120,240,.5)'); rg.addColorStop(.8,'rgba(130,95,220,.32)'); rg.addColorStop(1,'rgba(80,55,190,0)');
  ctx.fillStyle=rg; ctx.fill('evenodd');
  ctx.restore();

  // Mountain silhouette
  ctx.fillStyle='#050210';
  ctx.beginPath(); ctx.moveTo(0,h);
  [[0,.72],[.07,.55],[.15,.68],[.24,.46],[.34,.62],[.45,.4],[.55,.58],[.65,.38],[.74,.55],[.84,.44],[.92,.58],[1,.65],[1,1]].forEach(([xr,yr]) => ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();
  // Foreground
  ctx.fillStyle='#030108';
  ctx.beginPath(); ctx.moveTo(0,h);
  [[0,.88],[.1,.78],[.22,.88],[.35,.76],[.48,.85],[.6,.73],[.72,.84],[.84,.75],[.95,.84],[1,.78],[1,1]].forEach(([xr,yr]) => ctx.lineTo(xr*w,yr*h));
  ctx.closePath(); ctx.fill();
  // Warm horizon glow
  const hzg=ctx.createLinearGradient(0,h*.55,0,h*.78);
  hzg.addColorStop(0,'rgba(200,60,20,.12)'); hzg.addColorStop(1,'rgba(120,20,10,0)');
  ctx.fillStyle=hzg; ctx.fillRect(0,0,w,h);
}

/* ══════════════════════════════════════════════════════
   AVATAR / WATCHER / GROUP ICON — small UI elements
══════════════════════════════════════════════════════ */
function drawAvatar(ctx, w, h) {
  const bg=ctx.createRadialGradient(w*.5,h*.38,0,w*.5,h*.5,w*.85);
  bg.addColorStop(0,'#1e0c30'); bg.addColorStop(.6,'#0e0618'); bg.addColorStop(1,'#040210');
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const rl=ctx.createRadialGradient(w*.5,h*.08,0,w*.5,h*.28,w*.6);
  rl.addColorStop(0,'rgba(140,70,255,.42)'); rl.addColorStop(1,'rgba(90,40,200,0)');
  ctx.fillStyle=rl; ctx.fillRect(0,0,w,h);
  const hx=w*.5,hy=h*.42,hr=w*.22;
  // Hair
  ctx.fillStyle='#0c0420';
  ctx.beginPath(); ctx.arc(hx,hy-hr*.78,hr*.68,Math.PI,0); ctx.closePath(); ctx.fill();
  // Skin
  const sg=ctx.createRadialGradient(hx-hr*.25,hy-hr*.2,0,hx,hy,hr);
  sg.addColorStop(0,'#b07848'); sg.addColorStop(.55,'#703a1e'); sg.addColorStop(1,'#2a0c06');
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=sg; ctx.fill();
  // Eyes
  [[hx-hr*.26,hy-hr*.07],[hx+hr*.26,hy-hr*.07]].forEach(([ex,ey]) => {
    ctx.save(); ctx.shadowBlur=8; ctx.shadowColor='rgba(160,100,255,.9)';
    ctx.fillStyle='rgba(190,130,255,.92)';
    ctx.beginPath(); ctx.arc(ex,ey,hr*.11,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.fillStyle='rgba(8,3,18,.95)';
    ctx.beginPath(); ctx.arc(ex,ey,hr*.052,0,Math.PI*2); ctx.fill();
  });
  // Body
  const bdg=ctx.createRadialGradient(hx,h*.82,0,hx,h*.72,w*.44);
  bdg.addColorStop(0,'#140828'); bdg.addColorStop(1,'#080418');
  ctx.fillStyle=bdg; ctx.beginPath(); ctx.arc(hx,h*.78,w*.33,0,Math.PI*2); ctx.fill();
  // Vignette
  const vn=ctx.createLinearGradient(0,h*.7,0,h);
  vn.addColorStop(0,'rgba(0,0,0,0)'); vn.addColorStop(1,'rgba(0,0,0,.75)');
  ctx.fillStyle=vn; ctx.fillRect(0,0,w,h);
}

function drawWatcher(ctx, w, h, seed) {
  const r=rng(seed||42), hue=r()*360;
  const bg=ctx.createRadialGradient(w*.5,h*.38,0,w*.5,h*.5,w*.78);
  bg.addColorStop(0,`hsl(${hue},55%,16%)`); bg.addColorStop(.7,`hsl(${hue},45%,8%)`); bg.addColorStop(1,`hsl(${hue},38%,4%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  const hx=w*.5,hy=h*.42,hr=w*.22;
  // Hair
  ctx.fillStyle=`hsl(${hue+18},38%,10%)`;
  ctx.beginPath(); ctx.arc(hx,hy-hr*.78,hr*.64,Math.PI,0); ctx.closePath(); ctx.fill();
  // Face
  const fg=ctx.createRadialGradient(hx-hr*.2,hy-hr*.18,0,hx,hy,hr);
  fg.addColorStop(0,`hsl(${hue+22},62%,60%)`); fg.addColorStop(.6,`hsl(${hue+12},52%,38%)`); fg.addColorStop(1,`hsl(${hue},42%,20%)`);
  ctx.beginPath(); ctx.arc(hx,hy,hr,0,Math.PI*2); ctx.fillStyle=fg; ctx.fill();
  // Eyes
  ctx.save(); ctx.shadowBlur=6; ctx.shadowColor=`hsl(${hue+40},100%,72%)`;
  ctx.fillStyle=`hsl(${hue+40},90%,78%)`;
  [[hx-hr*.25,hy-hr*.07],[hx+hr*.25,hy-hr*.07]].forEach(([ex,ey]) => {
    ctx.beginPath(); ctx.arc(ex,ey,hr*.088,0,Math.PI*2); ctx.fill();
  });
  ctx.restore();
  // Body
  const bdg=ctx.createRadialGradient(hx,h*.82,0,hx,h*.72,w*.4);
  bdg.addColorStop(0,`hsl(${hue},48%,18%)`); bdg.addColorStop(1,`hsl(${hue},40%,6%)`);
  ctx.fillStyle=bdg; ctx.beginPath(); ctx.arc(hx,h*.78,w*.3,0,Math.PI*2); ctx.fill();
}

function drawGroupIcon(ctx, w, h, hue) {
  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,`hsl(${hue},62%,20%)`); bg.addColorStop(1,`hsl(${hue},55%,10%)`);
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  ctx.save();
  ctx.shadowBlur=8; ctx.shadowColor=`hsl(${hue},100%,65%)`;
  ctx.strokeStyle=`hsl(${hue},90%,68%)`; ctx.lineWidth=1.8;
  ctx.beginPath(); ctx.arc(w*.5,h*.42,w*.22,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.28,h*.44,w*.14,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.72,h*.44,w*.14,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(w*.5,h*.64); ctx.lineTo(w*.5,h*.82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.3,h*.58); ctx.quadraticCurveTo(w*.18,h*.68,w*.12,h*.82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.7,h*.58); ctx.quadraticCurveTo(w*.82,h*.68,w*.88,h*.82); ctx.stroke();
  ctx.restore();
}

window.DRAW_FNS = {
  space:   drawSpace,
  forest:  drawForest,
  neon:    drawNeon,
  flow:    drawFlow,
  portrait:drawPortrait,
  dragon:  drawDragon,
  crystal: drawCrystal,
  mecha:   drawMecha,
  fire:    drawFire,
};
window.drawBanner    = drawBanner;
window.drawAvatar    = drawAvatar;
window.drawWatcher   = drawWatcher;
window.drawGroupIcon = drawGroupIcon;
