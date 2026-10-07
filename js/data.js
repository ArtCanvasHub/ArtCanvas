/* ── SHARED MOCK DATA ─────────────────────────────────── */

window.AC_ARTISTS = [
  {id:'nebulaforge',  name:'NebulaForge',  seed:10,  tagline:'Sci-Fi · Fantasy · 3D',      followers:'8.4K'},
  {id:'nightvision',  name:'NightVision',  seed:50,  tagline:'Neon · Cyberpunk · Urban',   followers:'12.1K'},
  {id:'darkflower',   name:'DarkFlower',   seed:90,  tagline:'Illustration · Character',   followers:'6.7K'},
  {id:'neondreamer',  name:'NeonDreamer',  seed:130, tagline:'Digital · Abstract',          followers:'3.2K'},
  {id:'waveart',      name:'WaveArt',      seed:170, tagline:'Landscapes · Motion',         followers:'9.0K'},
  {id:'ghostbrush',   name:'GhostBrush',   seed:210, tagline:'Dark Art · Horror',           followers:'5.5K'},
  {id:'dragonscale',  name:'DragonScale',  seed:250, tagline:'Fantasy · Creatures',         followers:'21.3K'},
  {id:'prismstudio',  name:'PrismStudio',  seed:290, tagline:'3D · Architecture',           followers:'7.8K'},
  {id:'cosmicink',    name:'CosmicInk',    seed:330, tagline:'Space · Concept Art',         followers:'18.0K'},
  {id:'ironcanvas',   name:'IronCanvas',   seed:20,  tagline:'Mech · Industrial',           followers:'11.4K'},
];

window.AC_WORKS = [
  {id:1,  title:'Void Walker',        artistId:'nebulaforge',  style:'space',    category:'sci-fi',    tags:['space','sci-fi','character'],      views:'14.2K', likes:923,  desc:'A lone traveler navigating the void between stars. Inspired by solarpunk aesthetics and old NASA concept art from the 1970s.'},
  {id:2,  title:'Midnight Circuit',   artistId:'nightvision',  style:'neon',     category:'concept',   tags:['neon','cyberpunk','city'],          views:'22.1K', likes:1840, desc:'Late-night cityscape where neon signs bleed into rain-slicked streets. The future feels uncomfortably close.'},
  {id:3,  title:'Ancient Grove',      artistId:'darkflower',   style:'forest',   category:'fantasy',   tags:['forest','nature','fantasy'],        views:'9.4K',  likes:541,  desc:'Centuries-old trees draped in bioluminescent moss. What secrets do these roots hold?'},
  {id:4,  title:'Flow State',         artistId:'waveart',      style:'flow',     category:'abstract',  tags:['abstract','motion','fluid'],        views:'6.8K',  likes:312,  desc:'The feeling of being completely in the zone — represented as pure visual flow. Made during a 12-hour session.'},
  {id:5,  title:'Dragon Epoch',       artistId:'dragonscale',  style:'dragon',   category:'fantasy',   tags:['dragon','fantasy','creature'],      views:'31.2K', likes:3100, desc:'The moment before the world changed. Dragons ruled the skies and humans were just beginning to light fires.'},
  {id:6,  title:'Crystal Spire',      artistId:'prismstudio',  style:'crystal',  category:'concept',   tags:['crystal','architecture','sci-fi'],  views:'7.2K',  likes:398,  desc:'Architectural concept for a floating mineral city. Every structure grows naturally from crystal formations below.'},
  {id:7,  title:'Mecha Uprising',     artistId:'ironcanvas',   style:'mecha',    category:'sci-fi',    tags:['mech','robot','sci-fi'],            views:'18.6K', likes:1560, desc:'The day the mechs decided they were tired of following orders. Oil stains the pavement like blood.'},
  {id:8,  title:'Ember Season',       artistId:'ghostbrush',   style:'fire',     category:'dark',      tags:['fire','dark','atmosphere'],         views:'5.1K',  likes:287,  desc:'Between autumn and winter there is a season of embers. Everything burns before it rests.'},
  {id:9,  title:'Nebula Born',        artistId:'cosmicink',    style:'space',    category:'sci-fi',    tags:['nebula','space','cosmic'],          views:'27.3K', likes:2410, desc:'The birth of a star system captured in a single frame. This piece took four months of iteration to complete.'},
  {id:10, title:'Portrait Study #7',  artistId:'nebulaforge',  style:'portrait', category:'character', tags:['portrait','character','digital'],   views:'11.0K', likes:876,  desc:'Part of an ongoing series exploring the thousand faces of a single soul. Study in light and shadow.'},
  {id:11, title:'Neon District',      artistId:'nightvision',  style:'neon',     category:'concept',   tags:['neon','city','night'],              views:'19.3K', likes:1240, desc:'A district where every surface has been turned into advertisement. Privacy is the new luxury.'},
  {id:12, title:'Bloom Protocol',     artistId:'darkflower',   style:'forest',   category:'fantasy',   tags:['bloom','nature','color'],           views:'12.4K', likes:934,  desc:'When the city decided to let nature reclaim the streets. Year three of the Bloom Protocol.'},
  {id:13, title:'Prism Break',        artistId:'neondreamer',  style:'crystal',  category:'abstract',  tags:['prism','light','abstract'],         views:'4.9K',  likes:271,  desc:'Light passing through crystal is just physics. Light passing through emotion is art.'},
  {id:14, title:'Tidal Surge',        artistId:'waveart',      style:'flow',     category:'abstract',  tags:['ocean','wave','motion'],            views:'17.2K', likes:1340, desc:'The ocean never apologizes for its power. Part 14 of the 20-piece motion series.'},
  {id:15, title:'Phantom Layer',      artistId:'ghostbrush',   style:'space',    category:'dark',      tags:['dark','ghost','atmosphere'],        views:'9.7K',  likes:558,  desc:'The layer between sleep and waking — where things that should not exist briefly do.'},
  {id:16, title:'Scale & Fire',       artistId:'dragonscale',  style:'dragon',   category:'fantasy',   tags:['dragon','fire','epic'],             views:'22.3K', likes:2900, desc:'Close study of dragon scale texture and flame generation. Reference sheet for the Epoch series.'},
  {id:17, title:'Iron Cathedral',     artistId:'ironcanvas',   style:'mecha',    category:'sci-fi',    tags:['mech','cathedral','epic'],          views:'15.0K', likes:1100, desc:'A decommissioned mech repurposed as a place of worship. The world finds meaning in strange places.'},
  {id:18, title:'Fractal Mind',       artistId:'neondreamer',  style:'crystal',  category:'abstract',  tags:['fractal','abstract','mind'],        views:'8.3K',  likes:620,  desc:'An attempt to map the structure of a thought. Every branch leads to something, if you look long enough.'},
  {id:19, title:'Solar Wind',         artistId:'cosmicink',    style:'space',    category:'sci-fi',    tags:['solar','space','light'],            views:'13.5K', likes:987,  desc:'Riding the electromagnetic current between stars. The fastest way to travel is to let go.'},
  {id:20, title:'Forest Memory',      artistId:'darkflower',   style:'forest',   category:'fantasy',   tags:['forest','memory','nostalgic'],      views:'8.1K',  likes:492,  desc:'The smell of pine and rain. A childhood clearing where time moved differently.'},
  {id:21, title:'Signal Lost',        artistId:'nightvision',  style:'neon',     category:'concept',   tags:['signal','neon','glitch'],           views:'10.8K', likes:730,  desc:'When the feed goes static. A meditation on information overload and the relief of silence.'},
  {id:22, title:'Stone Titan',        artistId:'ironcanvas',   style:'mecha',    category:'sci-fi',    tags:['mech','titan','stone'],             views:'24.1K', likes:2100, desc:'Before metal, there was stone. The first mech was built from the mountain itself.'},
  {id:23, title:'Quiet Cosmos',       artistId:'cosmicink',    style:'space',    category:'sci-fi',    tags:['space','quiet','cosmos'],           views:'16.2K', likes:1420, desc:'The universe is not loud. It hums. You have to be very still to hear it.'},
  {id:24, title:'Crimson Scale',      artistId:'dragonscale',  style:'dragon',   category:'fantasy',   tags:['dragon','crimson','scale'],         views:'19.7K', likes:2340, desc:'A study in crimson. The fire-breathers of the northern ranges have a distinctly different anatomy.'},
];

window.AC_COMMENTS = {
  1:  [{user:'NightVision', text:'The composition here is incredible. That lone figure really sells the scale of the void.', hue:50},
       {user:'CosmicInk',   text:'Been following this series for months. Each piece keeps getting better.', hue:330},
       {user:'GhostBrush',  text:'The color palette is perfect. Cold but not lifeless.', hue:210}],
  2:  [{user:'NebulaForge', text:'The rain reflection technique is something else. How long did this take?', hue:10},
       {user:'PrismStudio', text:'Feels like walking through Blade Runner. Amazing work.', hue:290}],
  5:  [{user:'DarkFlower',  text:'This is my all-time favorite piece on the site. The scale is breathtaking.', hue:90},
       {user:'WaveArt',     text:'The lighting on the scales!! I cannot stop staring.', hue:170},
       {user:'NeonDreamer', text:'How many layers did this take? Genuinely asking for study purposes.', hue:130}],
  9:  [{user:'IronCanvas',  text:'Stunning. The color temperature shift from core to edge is so precise.', hue:20},
       {user:'NebulaForge', text:'The scale you achieve is unreal. Bookmarked immediately.', hue:10}],
};
