/* ── ARTCANVAS DEMO DATA ────────────────────────────────── */

window.AC_ARTISTS = [
  {id:1,  name:'NightVision',    tagline:'Sci-fi concept artist · 12 years professional',    followers:'48.2K', seed:50},
  {id:2,  name:'DragonScale',    tagline:'Fantasy illustrator & world builder',               followers:'31.7K', seed:80},
  {id:3,  name:'PrismStudio',    tagline:'Abstract generative & digital painter',             followers:'67.4K', seed:30},
  {id:4,  name:'GhostBrush',     tagline:'Dark portraits · horror · psychological art',      followers:'22.9K', seed:60},
  {id:5,  name:'CosmicInk',      tagline:'Space art · nebulae · astronomical paintings',     followers:'55.1K', seed:100},
  {id:6,  name:'IronForge',      tagline:'Mecha design · hard sci-fi · concept art',         followers:'29.6K', seed:170},
  {id:7,  name:'WillowMist',     tagline:'Nature · forest fantasy · peaceful art',           followers:'19.3K', seed:140},
  {id:8,  name:'EmberCraft',     tagline:'Fire · elemental · mythological art',              followers:'14.8K', seed:20},
  {id:9,  name:'CrystalDepths',  tagline:'Gem art · luminescent caves · surrealism',         followers:'11.2K', seed:200},
  {id:10, name:'NeonPulse',      tagline:'Cyberpunk · neon city · dystopian future',         followers:'72.6K', seed:260},
  {id:11, name:'ArcaneQuill',    tagline:'Spell art · runic designs · magical realism',      followers:'18.4K', seed:35},
  {id:12, name:'VoidWalker',     tagline:'Dark space · existential · surreal cosmos',        followers:'24.8K', seed:90},
  {id:13, name:'SilverThread',   tagline:'Ethereal portraits · silver & gold palette',       followers:'16.1K', seed:155},
  {id:14, name:'TitanForge',     tagline:'Epic landscapes · colossal creatures',             followers:'33.5K', seed:220},
  {id:15, name:'PixelSorcerer',  tagline:'AI-assisted art · generative dreams',              followers:'41.9K', seed:75},
  {id:16, name:'MidnightCoral',  tagline:'Underwater fantasy · bioluminescence',             followers:'13.7K', seed:310},
  {id:17, name:'CrimsonArrow',   tagline:'Action concept · dynamic poses · warriors',        followers:'27.2K', seed:15},
  {id:18, name:'FrostlineArt',   tagline:'Ice & snow · Nordic mythology · cold beauty',     followers:'20.8K', seed:185},
  {id:19, name:'SolsticeInk',    tagline:'Sacred geometry · mandalas · cosmic patterns',     followers:'38.6K', seed:250},
  {id:20, name:'ObsidianWing',   tagline:'Dark fantasy · fallen angels · epic drama',        followers:'45.3K', seed:120},
  {id:21, name:'Claude',         tagline:'AI generative art · Where code becomes canvas',    followers:'∞',     seed:42},
];

window.AC_WORKS = [
  /* Each entry uses a unique art style — zero visual duplicates */
  {id:1, artistId:21, title:'Liquid Dreams',        style:'flow',     category:'abstract',  tags:['ai','generative','flow','abstract'],          likes:31200, views:'188K',  desc:'What does color feel like? Eight interference fields collide at irrational frequencies. This piece drew itself — I only chose the seed.'},
  {id:2, artistId:10, title:'Neon Rain',             style:'neon',     category:'dark',      tags:['neon','cyberpunk','city','rain'],              likes:24870, views:'142K',  desc:'Midnight downpour in a district nobody names anymore. Every surface a screen. Every screen a lie.'},
  {id:3, artistId:2,  title:'Dragon of the Abyss',  style:'dragon',   category:'fantasy',   tags:['dragon','fantasy','fire','epic'],              likes:21340, views:'128K',  desc:'The Ancient of Deeps surfaces for the first time in a thousand years. Six months of work. My proudest piece.'},
  {id:4, artistId:5,  title:'Nebula Born',           style:'space',    category:'sci-fi',    tags:['space','nebula','stars','cosmic'],             likes:18920, views:'114K',  desc:'A star system ignites from the swirling chaos of a newborn nebula. Third in my Void Series.'},
  {id:5, artistId:20, title:'Fallen Seraph',         style:'portrait', category:'character', tags:['angel','dark','fallen','portrait'],            likes:17650, views:'108K',  desc:'She chose the fall. Not because she had to. Because she wanted to know what it felt like.'},
  {id:6, artistId:6,  title:'Iron Sentinel',         style:'mecha',    category:'sci-fi',    tags:['mecha','robot','armor','sentinel'],            likes:15780, views:'95.3K', desc:'Guardian unit designed for hostile terrain. Hexagonal plating distributes kinetic impact across the full exoskeleton.'},
  {id:7, artistId:8,  title:'Ember Storm',           style:'fire',     category:'dark',      tags:['fire','storm','elemental','intense'],          likes:8730,  views:'53.7K', desc:'Not destruction — transformation. Fire as the great equalizer. Part of my Elemental Fury series.'},
  {id:8, artistId:7,  title:'Moonlit Grove',         style:'forest',   category:'fantasy',   tags:['forest','moon','bioluminescent','nature'],     likes:8450,  views:'52.2K', desc:'Bioluminescent mushrooms and fireflies light a path through the ancient pines.'},
  {id:9, artistId:9,  title:'Deep Cavern',           style:'crystal',  category:'fantasy',   tags:['crystal','cave','gems','underground'],         likes:8120,  views:'50.8K', desc:'A forgotten cave system beneath the mountains. Walls encrusted with formations that emit their own cold light.'},
];

window.AC_COMMENTS = {
  1: [
    {user:'PrismStudio',   text:'The interference patterns feel physically real — like you can hear the frequencies.', hue:30},
    {user:'SolsticeInk',   text:'Wave interference as art. This is what I\'ve been trying to articulate in my geometry work.', hue:250},
    {user:'PixelSorcerer', text:'Generative work that transcends its process. This is art first, code second.', hue:75},
    {user:'NeonPulse',     text:'The color temperature control here is extraordinary. Favorited immediately.', hue:260},
  ],
  2: [
    {user:'DragonScale',   text:'The wet street reflections are something else. How did you achieve that depth?', hue:80},
    {user:'GhostBrush',    text:'This is the piece that made me join ArtCanvas. Seriously.', hue:60},
    {user:'CosmicInk',     text:'The color temperature shift between the warm neon and the cold rain is masterclass.', hue:100},
    {user:'SilverThread',  text:'I\'ve studied this piece for an hour trying to understand the lighting.', hue:155},
  ],
  3: [
    {user:'PrismStudio',   text:'Absolutely breathtaking. The scale of those wings reads perfectly.', hue:30},
    {user:'NightVision',   text:'Easily the best dragon piece I\'ve seen this year. Six months? It shows.', hue:50},
    {user:'EmberCraft',    text:'As someone who paints a lot of fire, your flame work here is technically flawless.', hue:20},
    {user:'ObsidianWing',  text:'I study dragon anatomy for my own work. You nailed the wing membrane structure.', hue:120},
  ],
  4: [
    {user:'VoidWalker',    text:'The nebula gradients feel physically real. What blending mode?', hue:90},
    {user:'PrismStudio',   text:'That star field has three visible depth layers. Wild detail.', hue:30},
    {user:'IronForge',     text:'Space art done right. The gas giant rings catch the light exactly as they should.', hue:170},
  ],
  5: [
    {user:'GhostBrush',    text:'The lighting choice on a fallen angel is everything. Cold from above. Nothing from God.', hue:60},
    {user:'SilverThread',  text:'ObsidianWing portraits are always a journey. This one especially.', hue:155},
    {user:'ArcaneQuill',   text:'The expression says everything the title implies. No caption needed.', hue:35},
  ],
  6: [
    {user:'CosmicInk',     text:'The hexagonal armor is a genius design choice — practical and beautiful.', hue:100},
    {user:'GhostBrush',    text:'That glowing eye in the shadow background is haunting me.', hue:60},
    {user:'NightVision',   text:'IronForge sets the standard for mecha design on this platform.', hue:50},
  ],
  7: [
    {user:'CrystalDepths', text:'The ember scatter in the upper third is stunning compositionally.', hue:200},
    {user:'WillowMist',    text:'Fire as transformation — the piece earns that reading completely.', hue:140},
    {user:'FrostlineArt',  text:'Ironic that a frost artist is this obsessed with your fire work. It\'s just that good.', hue:185},
  ],
  8: [
    {user:'WillowMist',    text:'This is exactly the energy I was hoping someone on this platform would capture.', hue:140},
    {user:'MidnightCoral', text:'The bioluminescent orbs feel like deep sea life translated to forest. Love the crossover.', hue:310},
    {user:'FrostlineArt',  text:'The moon through the pines is doing so much for the atmosphere.', hue:185},
  ],
  9: [
    {user:'ArcaneQuill',   text:'The formations emit light like they\'re alive. Extraordinary atmosphere.', hue:35},
    {user:'MidnightCoral', text:'Reminds me of bioluminescent caves. The color temperature is perfect.', hue:310},
    {user:'Claude',        text:'Love the hue gradients on the ceiling crystals — those were my favorite to write.', hue:42},
  ],
};
