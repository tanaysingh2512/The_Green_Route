// Environmental data inspired by WWF Living Planet Report, Global Forest Watch,
// and IUCN Red List. Zones are placed at real-world deforestation / biodiversity hotspots.
// Radii are intentionally generous so routes passing through regions are detected.

export interface EnvironmentalZone {
  id: string;
  name: string;
  type: 'deforestation' | 'biodiversity' | 'wildlife-corridor';
  lat: number;
  lng: number;
  radius: number; // km — detection radius
  severity: 'high' | 'medium' | 'low';
  impact: {
    treeLoss: number;       // % of primary forest lost since 2000
    affectedSpecies: string[];
    habitatLoss: number;    // m²
  };
  story: string;
  microActions: MicroAction[];
}

export interface MicroAction {
  id: string;
  type: 'plant-tree' | 'eco-route' | 'slow-down' | 'support-project';
  title: string;
  description: string;
  impact: string;
  cost?: number;
}

export const environmentalZones: EnvironmentalZone[] = [
  // ── SWEDEN (Stockholm → Kiruna corridor) ─────────────────────────────────
  {
    id: 'zone-se-1',
    name: 'Tyresta Ancient Forest',
    type: 'deforestation',
    lat: 59.18, lng: 18.22, radius: 55,
    severity: 'medium',
    impact: { treeLoss: 14, affectedSpecies: ['Capercaillie', 'Three-toed woodpecker', 'Flying squirrel'], habitatLoss: 178000 },
    story: "You're passing near Tyresta, one of Sweden's last remaining old-growth boreal forests. 14% of its ancient pines have been lost to logging since 2000. The capercaillie — a giant forest grouse — needs these undisturbed trees to survive.",
    microActions: [
      { id: 'se1-a1', type: 'plant-tree', title: 'Plant a Scots pine for Noah', description: "Plant a native Scots pine in Tyresta's restoration zone", impact: '+15 m² old-growth boreal forest restored' },
      { id: 'se1-a2', type: 'eco-route', title: 'Take the forest-friendly route', description: 'Add 8 min via E4 to avoid logging roads in the buffer zone', impact: '-35% habitat fragmentation impact' },
    ],
  },
  {
    id: 'zone-se-2',
    name: 'Dalarna Wolf & Bear Corridor',
    type: 'wildlife-corridor',
    lat: 61.0, lng: 15.0, radius: 120,
    severity: 'high',
    impact: { treeLoss: 11, affectedSpecies: ['Grey wolf', 'Brown bear', 'Wolverine'], habitatLoss: 312000 },
    story: "Dalarna is the heart of Scandinavia's recovering wolf and bear populations. Your route crosses their primary migration corridor. Wolves were nearly extinct in Sweden — only 30 individuals survived in the 1980s. Today ~400 roam here, but road traffic remains their biggest threat.",
    microActions: [
      { id: 'se2-a1', type: 'slow-down', title: 'Slow down for wolves & bears', description: 'Reduce speed through Dalarna — dawn and dusk are peak movement hours', impact: '70% fewer large mammal collisions' },
      { id: 'se2-a2', type: 'support-project', title: 'Support Naturskyddsföreningen', description: 'Fund Swedish WWF wolf corridor land protection', impact: 'Secures 3 km of safe wildlife crossing', cost: 8 },
    ],
  },
  {
    id: 'zone-se-3',
    name: 'Norrland Boreal Forest Belt',
    type: 'deforestation',
    lat: 63.5, lng: 17.0, radius: 150,
    severity: 'high',
    impact: { treeLoss: 21, affectedSpecies: ['Siberian jay', 'Eurasian lynx', 'Forest reindeer'], habitatLoss: 427000 },
    story: "Sweden's vast Norrland taiga stores as much carbon as all of Sweden's annual CO₂ emissions — yet 21% of its primary forest has been clear-cut since 2000 for the pulp and paper industry. The Siberian jay, which depends entirely on old-growth spruce, is vanishing alongside it.",
    microActions: [
      { id: 'se3-a1', type: 'plant-tree', title: 'Restore Norrland old-growth', description: "Plant Norway spruce and silver birch in Norrland's degraded zones", impact: '+28 m² boreal forest carbon sink restored' },
      { id: 'se3-a2', type: 'eco-route', title: 'Bypass logging traffic route', description: 'Alternate via Route 90 — avoids active clear-cut areas', impact: 'Reduces dust & erosion runoff into salmon streams' },
      { id: 'se3-a3', type: 'support-project', title: 'Buy a forest acre', description: 'Support Protect the Forest Sweden to permanently conserve old-growth', impact: '1 acre permanently protected from logging', cost: 12 },
    ],
  },
  {
    id: 'zone-se-4',
    name: 'Laponian UNESCO World Heritage Area',
    type: 'biodiversity',
    lat: 66.5, lng: 18.5, radius: 120,
    severity: 'medium',
    impact: { treeLoss: 8, affectedSpecies: ['Arctic fox', 'Golden eagle', 'Rough-legged buzzard'], habitatLoss: 189000 },
    story: "You're entering the Laponian Area — a UNESCO World Heritage Site and one of Europe's last great wilderness regions. Climate change is pushing the treeline upward ~5 metres per year, shrinking the alpine tundra that the critically endangered Arctic fox calls home. Only ~200 Arctic foxes remain in Scandinavia.",
    microActions: [
      { id: 'se4-a1', type: 'support-project', title: 'Save the Arctic fox', description: 'Fund Fjällräven Foundation Arctic fox breeding and release programme', impact: 'Supports 1 Arctic fox reintroduction', cost: 6 },
      { id: 'se4-a2', type: 'slow-down', title: 'Reindeer migration zone', description: 'Sami reindeer herds cross roads here during spring migration — drive carefully', impact: 'Protects Sami traditional livelihoods & herds' },
    ],
  },
  {
    id: 'zone-se-5',
    name: 'Kiruna Iron Ore Mining Frontier',
    type: 'deforestation',
    lat: 67.8, lng: 20.2, radius: 80,
    severity: 'high',
    impact: { treeLoss: 26, affectedSpecies: ['Wolverine', 'Forest reindeer', 'Snow bunting'], habitatLoss: 534000 },
    story: "The world's largest iron ore mine at Kiruna has already relocated an entire city — and 26% of surrounding sub-Arctic forest has been cleared since 2000. The wolverine, which needs vast undisturbed territories of 500–1,000 km², is being squeezed out. This is some of Europe's most fragile and slowest-recovering ecosystem.",
    microActions: [
      { id: 'se5-a1', type: 'plant-tree', title: 'Restore sub-Arctic forest', description: "Plant mountain birch — the tree that defines Lapland's treeline", impact: '+20 m² sub-Arctic habitat, 80-year carbon lock-in' },
      { id: 'se5-a2', type: 'support-project', title: 'Protect Sami ancestral land', description: 'Support legal protection of Sami reindeer grazing territories', impact: 'Preserves 10 km² of Indigenous-managed wilderness', cost: 10 },
    ],
  },

  // ── AMAZON BASIN ────────────────────────────────────────────────────────────
  {
    id: 'zone-amazon-1',
    name: 'Amazon Rainforest — Pará State',
    type: 'deforestation',
    lat: -4.0, lng: -52.0, radius: 300,
    severity: 'high',
    impact: { treeLoss: 17, affectedSpecies: ['Jaguar', 'Giant river otter', 'Hyacinth macaw'], habitatLoss: 8200000 },
    story: "The Amazon is the world's largest rainforest — home to 10% of all species on Earth. Brazil's Pará state alone lost 17% of its primary forest since 2000, driven by cattle ranching and soy farming. Every minute, an area the size of a football field is cleared.",
    microActions: [
      { id: 'amz-a1', type: 'plant-tree', title: 'Plant in the Amazon', description: 'Fund Rainforest Trust reforestation in Pará deforestation frontiers', impact: '+1 Amazon tree planted — sequesters 22 kg CO₂/year' },
      { id: 'amz-a2', type: 'support-project', title: 'Protect indigenous territories', description: 'Support Amazon Conservation Association land rights for Kayapó people', impact: 'Secures 50 m² of legally-protected rainforest', cost: 15 },
    ],
  },
  {
    id: 'zone-amazon-2',
    name: 'Amazon Arc of Deforestation — Mato Grosso',
    type: 'deforestation',
    lat: -12.0, lng: -55.0, radius: 280,
    severity: 'high',
    impact: { treeLoss: 23, affectedSpecies: ['Giant anteater', 'Maned wolf', 'Giant armadillo'], habitatLoss: 6800000 },
    story: "Mato Grosso sits at the 'arc of deforestation' — the southernmost boundary where Amazon meets Cerrado savanna. 23% of primary forest here has been cleared, mostly for soy plantations supplying global food chains. The giant anteater roams territories that are disappearing at an unprecedented rate.",
    microActions: [
      { id: 'amz2-a1', type: 'support-project', title: 'Support WWF Amazon programme', description: 'Fund WWF Living Amazon Initiative — direct forest protection', impact: 'Protects 200 m² of Mato Grosso frontier forest', cost: 20 },
      { id: 'amz2-a2', type: 'eco-route', title: 'Choose certified soy products', description: 'Scan the Roundtable on Responsible Soy QR code at your next fuel stop', impact: '-0.8 kg deforestation-linked supply chain pressure' },
    ],
  },

  // ── CONGO BASIN ──────────────────────────────────────────────────────────────
  {
    id: 'zone-congo-1',
    name: 'Congo Basin Rainforest — DRC',
    type: 'deforestation',
    lat: -0.5, lng: 24.0, radius: 300,
    severity: 'high',
    impact: { treeLoss: 9, affectedSpecies: ['Forest elephant', 'Western lowland gorilla', 'Okapi'], habitatLoss: 5600000 },
    story: "The Congo Basin is the world's second-largest rainforest and Earth's single largest carbon store. Though deforestation rates are lower than the Amazon, the forest elephant — a keystone species — has declined by 65% in a decade due to poaching and habitat loss across your route corridor.",
    microActions: [
      { id: 'congo-a1', type: 'support-project', title: 'Protect Congo forest elephants', description: 'Fund Wildlife Conservation Society elephant monitoring in DRC', impact: 'Supports 1 km of anti-poaching patrol route', cost: 12 },
      { id: 'congo-a2', type: 'plant-tree', title: 'Plant a Congo basin tree', description: 'Reforestation with African rainforest species via WeForest DRC programme', impact: '+18 m² Congo basin habitat restored' },
    ],
  },

  // ── BORNEO ───────────────────────────────────────────────────────────────────
  {
    id: 'zone-borneo-1',
    name: 'Borneo Heart of Borneo — Sabah',
    type: 'deforestation',
    lat: 4.5, lng: 117.0, radius: 200,
    severity: 'high',
    impact: { treeLoss: 30, affectedSpecies: ['Bornean orangutan', 'Pygmy elephant', 'Sun bear'], habitatLoss: 7100000 },
    story: "Borneo has lost 30% of its lowland rainforest since 2000 — the fastest deforestation rate of any major forest on Earth. The Bornean orangutan, which shares 97% of our DNA, has seen its population halved in two decades. Palm oil plantations now cover an area larger than England.",
    microActions: [
      { id: 'borneo-a1', type: 'support-project', title: 'Save Borneo orangutans', description: 'Fund Borneo Orangutan Survival Foundation habitat corridors in Sabah', impact: 'Connects 500 m of fragmented forest corridor', cost: 18 },
      { id: 'borneo-a2', type: 'plant-tree', title: 'Plant Borneo native species', description: 'Reforestation with dipterocarp species — the iconic tall Borneo forest trees', impact: '+35 m² Borneo lowland rainforest canopy' },
    ],
  },

  // ── SUMATRA ──────────────────────────────────────────────────────────────────
  {
    id: 'zone-sumatra-1',
    name: 'Sumatra Leuser Ecosystem',
    type: 'biodiversity',
    lat: 3.8, lng: 97.5, radius: 180,
    severity: 'high',
    impact: { treeLoss: 34, affectedSpecies: ['Sumatran tiger', 'Sumatran rhinoceros', 'Sumatran elephant'], habitatLoss: 5800000 },
    story: "The Leuser Ecosystem is the last place on Earth where tigers, rhinos, orangutans, and elephants coexist in one forest. Sumatra has lost 34% of its primary forest since 2000. The Sumatran rhinoceros — the smallest and most endangered rhino species — has fewer than 80 individuals left.",
    microActions: [
      { id: 'sum-a1', type: 'support-project', title: 'Protect the Leuser Ecosystem', description: 'Fund Rainforest Action Network Sumatra tiger corridor protection', impact: 'Secures 300 m² of Sumatran tiger territory', cost: 25 },
      { id: 'sum-a2', type: 'plant-tree', title: 'Restore Sumatran peat forest', description: 'Plant peatland trees via Yayasan Ekosistem Lestari restoration programme', impact: '+40 m² peat forest restored — locks 120 kg CO₂' },
    ],
  },

  // ── SERENGETI / EAST AFRICA ──────────────────────────────────────────────────
  {
    id: 'zone-serengeti-1',
    name: 'Serengeti–Masai Mara Ecosystem',
    type: 'wildlife-corridor',
    lat: -2.3, lng: 34.8, radius: 150,
    severity: 'medium',
    impact: { treeLoss: 12, affectedSpecies: ['Lion', 'African elephant', 'Cheetah'], habitatLoss: 3200000 },
    story: "The Serengeti hosts the world's largest land migration — 1.5 million wildebeest cross the Mara River each year. But expanding human settlement and fencing is fragmenting the 40,000 km² corridor. Lion populations have declined 43% across Africa in the past 21 years.",
    microActions: [
      { id: 'seren-a1', type: 'support-project', title: 'Fund wildlife corridors', description: 'Support African Wildlife Foundation to keep migration corridors open', impact: 'Maintains 1 km of unfenced migration route', cost: 10 },
      { id: 'seren-a2', type: 'slow-down', title: 'Wildlife crossing awareness', description: 'If driving through East Africa, reduce speed at wildlife crossing signs', impact: 'Reduces road mortality for migrating wildlife' },
    ],
  },

  // ── HIMALAYAS ────────────────────────────────────────────────────────────────
  {
    id: 'zone-himalaya-1',
    name: 'Eastern Himalayan Foothills — Nepal',
    type: 'biodiversity',
    lat: 27.7, lng: 85.3, radius: 150,
    severity: 'medium',
    impact: { treeLoss: 16, affectedSpecies: ['Snow leopard', 'Bengal tiger', 'One-horned rhinoceros'], habitatLoss: 2100000 },
    story: "The Eastern Himalayas are a global biodiversity hotspot spanning Nepal, Bhutan, and Northeast India. Snow leopards — with fewer than 4,000 remaining — depend on the alpine meadows shrinking with climate change. The foothills' terai grasslands, home to the one-horned rhino, have lost 16% of tree cover since 2000.",
    microActions: [
      { id: 'him-a1', type: 'support-project', title: 'Protect snow leopard habitat', description: 'Fund Snow Leopard Trust community herder coexistence programme', impact: '2 km² of snow leopard territory protected', cost: 15 },
      { id: 'him-a2', type: 'plant-tree', title: 'Plant in Nepal buffer zones', description: 'Tree planting in Chitwan National Park buffer zones via WWF Nepal', impact: '+25 m² Himalayan foothills habitat restored' },
    ],
  },

  // ── ATLANTIC FOREST (Brazil) ─────────────────────────────────────────────────
  {
    id: 'zone-atl-forest-1',
    name: 'Atlantic Forest — São Paulo Corridor',
    type: 'deforestation',
    lat: -23.5, lng: -46.6, radius: 200,
    severity: 'high',
    impact: { treeLoss: 88, affectedSpecies: ['Golden lion tamarin', 'Muriqui monkey', 'Harpy eagle'], habitatLoss: 12000000 },
    story: "Brazil's Atlantic Forest is one of the world's most endangered biomes — only 12% of the original forest remains, down from a forest that once covered 15% of Brazil. The golden lion tamarin, brought back from the brink of extinction in the 1990s, depends on fragmented forest patches near urban São Paulo.",
    microActions: [
      { id: 'atl-a1', type: 'plant-tree', title: 'Restore Atlantic Forest', description: 'Plant native Atlantic Forest species with Fundação SOS Mata Atlântica', impact: '+30 m² Atlantic Forest restored — world\'s most threatened biome' },
      { id: 'atl-a2', type: 'support-project', title: 'Save the golden lion tamarin', description: 'Fund Golden Lion Tamarin Association forest corridor purchase', impact: 'Connects 2 isolated tamarin forest fragments', cost: 20 },
    ],
  },

  // ── MADAGASCAR ───────────────────────────────────────────────────────────────
  {
    id: 'zone-madagascar-1',
    name: 'Madagascar Eastern Rainforest',
    type: 'biodiversity',
    lat: -18.9, lng: 47.5, radius: 200,
    severity: 'high',
    impact: { treeLoss: 25, affectedSpecies: ['Ring-tailed lemur', 'Indri', 'Fossa'], habitatLoss: 4500000 },
    story: "Madagascar evolved in isolation for 88 million years — 90% of its wildlife exists nowhere else on Earth. The island has lost 25% of its remaining forest since 2000, driven by slash-and-burn agriculture. The indri, the world's largest lemur, has a haunting call that may soon fall silent — there are fewer than 10,000 left.",
    microActions: [
      { id: 'mad-a1', type: 'support-project', title: 'Save Madagascar lemurs', description: 'Fund Madagascar Biodiversity Partnership community forest protection', impact: 'Protects 500 m² of lemur habitat', cost: 12 },
      { id: 'mad-a2', type: 'plant-tree', title: 'Plant in Madagascar', description: 'Native reforestation with Eden Projects Madagascar programme', impact: '+20 m² eastern rainforest canopy restored' },
    ],
  },

  // ── GREAT BARRIER REEF / DAINTREE ────────────────────────────────────────────
  {
    id: 'zone-aus-reef-1',
    name: 'Daintree Rainforest — Queensland',
    type: 'biodiversity',
    lat: -16.2, lng: 145.4, radius: 120,
    severity: 'medium',
    impact: { treeLoss: 6, affectedSpecies: ['Southern cassowary', 'Tree kangaroo', 'Musky rat-kangaroo'], habitatLoss: 890000 },
    story: "The Daintree is the world's oldest continuously surviving tropical rainforest at 135 million years old — older than the Amazon. The southern cassowary, a giant flightless bird, is the forest's primary seed disperser. Without it, up to 100 tree species can't regenerate. Fewer than 1,200 remain.",
    microActions: [
      { id: 'aus-a1', type: 'support-project', title: 'Protect the Daintree', description: 'Fund Rainforest Rescue to buy and protect Daintree lowland parcels', impact: 'Permanently protects 100 m² of oldest rainforest on Earth', cost: 15 },
      { id: 'aus-a2', type: 'slow-down', title: 'Wildlife on Daintree roads', description: 'Drive slowly at night on the Daintree road — cassowaries cross at dusk', impact: 'Reduces cassowary road mortality' },
    ],
  },

  // ── CANADIAN BOREAL ──────────────────────────────────────────────────────────
  {
    id: 'zone-canada-boreal-1',
    name: 'Canadian Boreal Forest — Ontario/Manitoba',
    type: 'deforestation',
    lat: 51.0, lng: -90.0, radius: 300,
    severity: 'medium',
    impact: { treeLoss: 7, affectedSpecies: ['Woodland caribou', 'Gray wolf', 'Canada lynx'], habitatLoss: 9800000 },
    story: "Canada's boreal forest is the world's largest intact forest — storing twice as much carbon as all the world's oil reserves. Though globally its loss rate is lower, active logging and oil sands extraction in Ontario and Alberta threaten the woodland caribou, whose herds have declined 30% in 20 years.",
    microActions: [
      { id: 'can-a1', type: 'support-project', title: 'Protect Canadian boreal', description: "Fund Canadian Parks and Wilderness Society's Indigenous Guardian programme", impact: 'Supports 10 km of Indigenous-protected boreal corridor', cost: 12 },
      { id: 'can-a2', type: 'plant-tree', title: 'Plant boreal tree', description: 'Black spruce reforestation in harvested Ontario boreal sites', impact: '+22 m² boreal carbon sink restored' },
    ],
  },

  // ── MEKONG ───────────────────────────────────────────────────────────────────
  {
    id: 'zone-mekong-1',
    name: 'Mekong Dry Forests — Cambodia',
    type: 'deforestation',
    lat: 12.5, lng: 105.0, radius: 150,
    severity: 'high',
    impact: { treeLoss: 33, affectedSpecies: ['Irrawaddy dolphin', 'Giant ibis', 'Siamese crocodile'], habitatLoss: 3600000 },
    story: "Cambodia has one of the highest deforestation rates in the world — losing 33% of its dry deciduous forests since 2000. The Mekong River's Irrawaddy dolphin population has fallen to fewer than 90 individuals. Illegal logging, hydropower dams, and sand mining are fragmenting one of Southeast Asia's last great river ecosystems.",
    microActions: [
      { id: 'mek-a1', type: 'support-project', title: 'Protect the Mekong dolphins', description: 'Fund WWF Mekong dolphin conservation and anti-electrofishing patrols', impact: 'Protects 5 km of critical dolphin habitat', cost: 10 },
      { id: 'mek-a2', type: 'plant-tree', title: 'Restore Mekong dry forest', description: 'Plant teak and rosewood in degraded Cambodia forestry concessions', impact: '+25 m² Mekong dry forest restored' },
    ],
  },

  // ── CALIFORNIA COAST REDWOODS ────────────────────────────────────────────────
  {
    id: 'zone-california-1',
    name: 'California Coast Redwoods',
    type: 'biodiversity',
    lat: 41.2, lng: -124.0, radius: 150,
    severity: 'medium',
    impact: { treeLoss: 3, affectedSpecies: ['Marbled murrelet', 'Northern spotted owl', 'Coho salmon'], habitatLoss: 1200000 },
    story: "Coast redwoods are the tallest trees on Earth — some over 115 metres high and 2,000 years old. Only 5% of the original old-growth redwood forest survives. Though protected in parks, climate change-driven drought and wildfire increasingly threaten even these ancient giants, which evolved in a now-vanishing coastal fog belt.",
    microActions: [
      { id: 'cal-a1', type: 'support-project', title: 'Protect ancient redwoods', description: "Fund Save the Redwoods League's old-growth acquisition programme", impact: 'Permanently protects 50 m² of ancient redwood grove', cost: 20 },
      { id: 'cal-a2', type: 'plant-tree', title: 'Plant a redwood seedling', description: 'Sponsor a coast redwood seedling in a restoration nursery', impact: '+1 redwood tree planted — could live 2,000 years' },
    ],
  },

  // ── PATAGONIA ────────────────────────────────────────────────────────────────
  {
    id: 'zone-patagonia-1',
    name: 'Patagonian Temperate Rainforest',
    type: 'deforestation',
    lat: -45.5, lng: -72.0, radius: 200,
    severity: 'medium',
    impact: { treeLoss: 11, affectedSpecies: ['Andean condor', 'South Andean deer', 'Puma'], habitatLoss: 2300000 },
    story: "Patagonia's temperate rainforest — the Valdivian forest — is one of the rarest ecosystems on Earth, existing only along a narrow coastal strip of Chile and Argentina. Its ancient alerce trees rival redwoods in age. 11% of the forest has been cleared for salmon farming infrastructure, logging, and exotic pine plantations.",
    microActions: [
      { id: 'pat-a1', type: 'support-project', title: 'Protect Patagonia forests', description: "Fund Tompkins Conservation's Patagonia National Park expansion", impact: 'Supports 1 km² of Patagonian wilderness protection', cost: 15 },
      { id: 'pat-a2', type: 'plant-tree', title: 'Plant alerce native tree', description: 'Reforestation with native Valdivian species in degraded areas', impact: '+30 m² temperate rainforest canopy restored' },
    ],
  },

  // ── WESTERN GHATS (India) ────────────────────────────────────────────────────
  {
    id: 'zone-ghats-1',
    name: 'Western Ghats Biodiversity Hotspot',
    type: 'biodiversity',
    lat: 10.5, lng: 76.5, radius: 150,
    severity: 'medium',
    impact: { treeLoss: 14, affectedSpecies: ['Indian elephant', 'Bengal tiger', 'Lion-tailed macaque'], habitatLoss: 2800000 },
    story: "The Western Ghats are one of the world's eight 'hottest biodiversity hotspots,' older than the Himalayas. They contain 30% of all plant, fish, reptile, and amphibian species found in India. Tea and coffee plantations have replaced 14% of the natural shola forests since 2000, fragmenting elephant corridors across Kerala and Tamil Nadu.",
    microActions: [
      { id: 'ghats-a1', type: 'support-project', title: 'Protect elephant corridors', description: "Fund WWF India's Western Ghats elephant corridor land purchase", impact: 'Secures 200 m² of critical elephant corridor', cost: 12 },
      { id: 'ghats-a2', type: 'plant-tree', title: 'Plant shola forest tree', description: 'Native shola species reforestation via Keystone Foundation in Nilgiris', impact: '+20 m² endangered shola forest habitat restored' },
    ],
  },

  // ── CERRADO (Brazil) ─────────────────────────────────────────────────────────
  {
    id: 'zone-cerrado-1',
    name: 'Cerrado Savanna — Brazil',
    type: 'deforestation',
    lat: -15.0, lng: -47.5, radius: 250,
    severity: 'high',
    impact: { treeLoss: 46, affectedSpecies: ['Giant anteater', 'Maned wolf', 'Giant armadillo'], habitatLoss: 9500000 },
    story: "The Cerrado is the world's most biodiverse savanna — but it's also the least protected major biome in Brazil. An extraordinary 46% has been converted since 2000, mostly for soy and beef. It's the source of 3 major river systems supplying water to 40 million Brazilians. The giant armadillo, its iconic burrowing mammal, has declined 60% in three decades.",
    microActions: [
      { id: 'cerr-a1', type: 'support-project', title: 'Save the Cerrado', description: 'Fund WWF-Brazil Cerrado land protection and legal reserve restoration', impact: 'Protects 400 m² of Cerrado legal reserve', cost: 18 },
      { id: 'cerr-a2', type: 'plant-tree', title: 'Plant Cerrado native species', description: 'Reforestation with native cerrado trees — pequi, baru, and buriti palm', impact: '+35 m² Cerrado biodiversity habitat restored' },
    ],
  },
];

// ─── Helper: zones intersecting a given point ─────────────────────────────────
export function getZonesForLocation(lat: number, lng: number): EnvironmentalZone[] {
  return environmentalZones.filter((zone) => {
    const distance = haversineKm(lat, lng, zone.lat, zone.lng);
    return distance <= zone.radius;
  });
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ─── User impact + achievements ───────────────────────────────────────────────
export interface UserImpact {
  treesPlanted: number;
  forestRestored: number; // m²
  wildlifeProtected: number;
  carbonOffset: number; // kg
  streak: number;
  totalTrips: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export const achievements: Achievement[] = [
  { id: 'first-tree', title: 'First Seed', description: 'Plant your first tree', icon: '🌱' },
  { id: 'forest-guardian', title: 'Forest Guardian', description: 'Plant 10 trees', icon: '🌲' },
  { id: 'wildlife-friend', title: 'Wildlife Friend', description: 'Take eco-route 5 times', icon: '🦌' },
  { id: 'week-streak', title: '7-Day Steward', description: 'Make eco-choices for 7 days', icon: '⭐' },
  { id: 'legacy-builder', title: 'Legacy Builder', description: 'Restore 100m² of forest', icon: '🏆' },
];
