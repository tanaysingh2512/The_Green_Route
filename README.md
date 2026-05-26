# 🌿 The Green Route

> *Why does your map show traffic, but not the forests being fragmented by the road it just recommended?*

**🥉 Third Place — Deloitte Spark Hackathon 2026** | Built in 24 hours | In partnership with WWF & AI Sweden

---

## 📌 Overview

**The Green Route** overlays real environmental data onto everyday navigation. When you plan a route, it scores the actual climate impact of your specific drive — not just what exists alongside the road, but what your journey costs the planet.

Most map apps optimise for speed and time. The Green Route adds a third dimension: **ecological cost.**

---

## 🌍 The Problem

> *"It doesn't show the forest ecosystems fragmented by the very roads it recommends. It doesn't show the wildlife habitats bisected by your route. And it doesn't show which ecosystems are already under critical pressure — where every additional vehicle compounds irreversible damage."*

Existing environmental data on deforestation, air quality, and ecosystem health is rich — but buried in expert tools that ordinary users never see. Millions of route choices are made every day with zero visibility into their environmental footprint.

**The Green Route bridges that gap.**

---

## 💡 How It Works

### The Eco Score — 0 to 100 (higher = better for the planet)

The score measures what **your specific drive** does to the climate — not background statistics, not what already exists alongside the road.

```
Raw Impact = (CO₂ emitted           × 0.35)   ← HBEFA 4.2
           + (Air pollution load     × 0.25)   ← OpenAQ v3
           + (Forest carbon lost     × 0.20)   ← Hansen GFC / GFW
           + (Ecosystem sensitivity  × 0.10)   ← CORINE Land Cover 2018
           + (Ecoregion carbon value × 0.10)   ← WWF Terrestrial Ecoregions

Eco Score = 100 − (Raw Impact / Worst Case) × 100
```

> **Key insight:** emitting CO₂ through intact forest is worse than emitting through urban sprawl — because that forest is actively absorbing carbon. A shorter route through a sensitive ecosystem can score lower than a longer route through an already-degraded corridor.

---

## 🗄️ Data Sources

| # | Dataset | Source | What it contributes |
|---|---|---|---|
| 1 | **HBEFA 4.2 Emission Factors** | EU / TU Graz | CO₂, NOx, PM2.5 emitted per km — speed corrected for average petrol car |
| 2 | **OpenAQ v3** | openaq.org | Real NO₂ and PM2.5 sensor readings along each route corridor |
| 3 | **Hansen Global Forest Change** | UMD / Global Forest Watch | Tree cover loss (hectares) since 2000 within route buffer |
| 4 | **CORINE Land Cover 2018** | Copernicus / ESA | Land type composition — % urban vs forest vs wetland vs agricultural |
| 5 | **WWF Terrestrial Ecoregions** ✅ | WWF GLOBIL | Ecoregion carbon density (tCO₂/ha) and global threat status |

Route geometry fetched from **OSRM** (Open Source Routing Machine).

---

## 📊 Demo: Stockholm → Uppsala

| Route | Distance | Time | CO₂ Emitted | Eco Score |
|---|---|---|---|---|
| 🔴 E4 Motorway | 70.3 km | 64 min | 13.42 kg | **72 / 100** |
| 🟢 Route 55 | 83.0 km | 72 min | 14.94 kg | **81 / 100** |
| 🟢 Train (SJ) | 68 km | 40 min | 0.68 kg | **89 / 100** |

The E4 scores lower despite being shorter — it emits into air already **2.2× above WHO NO₂ limits**, through a corridor where **831 hectares of forest have been lost since 2000**.

---

## 🚀 Getting Started

### Prerequisites
```bash
python3 -m venv env
source env/bin/activate
pip install requests
```

### API Keys (both free)

| Service | Signup |
|---|---|
| OpenAQ | [openaq.org/register](https://openaq.org/register) |
| Global Forest Watch | [globalforestwatch.org](https://www.globalforestwatch.org) |

Add your keys to the config section at the top of `eco_score_pipeline.py`:

```python
OPENAQ_API_KEY = "your_key_here"
GFW_API_KEY    = "your_key_here"
```

### Run

```bash
python3 eco_score_pipeline.py
```

---

## 📁 Project Structure

```
the-green-route/
│
├── eco_score_pipeline.py     # Core scoring engine — all 5 datasets
├── README.md
│
└── prototype/
    ├── index.html            # Main map interface prototype
    ├── nexus.html            # Analytics dashboard
    ├── oracle.html           # Document intelligence
    └── sentinel.html         # Supply chain risk
```

---

## 🔬 Methodology

- **Emissions** use HBEFA 4.2 speed-corrected factors — the EU standard for official transport emissions reporting across all member states
- **Air quality** pollution load calculated as weighted ratio against WHO annual mean guidelines (NO₂: 10µg/m³ · PM2.5: 5µg/m³)
- **Forest loss** queries the Hansen UMD dataset at 30m resolution — peer-reviewed, published in *Science* (Hansen et al., 2013), updated annually
- **Ecosystem sensitivity** weights inspired by the IPBES ecosystem services valuation framework (UN scientific body for biodiversity)
- **Fallback values** sourced from Naturvårdsverket and Skogsstyrelsen 2023 annual reports — pipeline never crashes without live data

> The data sources are established and peer-reviewed. The innovation is the synthesis — combining five independent scientific signals into a single score a non-expert understands in three seconds and acts on immediately.

---

## 🏆 Built At

| | |
|---|---|
| **Event** | Deloitte Spark Hackathon 2026 |
| **Duration** | 24 hours |
| **Location** | Stockholm, Sweden |
| **Partners** | Deloitte · WWF · AI Sweden |
| **Result** | 🥉 Third Place |

---

## 🙏 Acknowledgements

- **Örjan Jansson** (WWF) — for feedback that shaped the environmental framing
- **Joakim Jerkenhag & Dwayne Dixon** (Deloitte) — for insights and mentorship
- **Nell Näs, Yunfei Yu, Shreyas Sawai** — great people to share the experience with
- **Deloitte, WWF & AI Sweden** — for building a challenge worth solving

---

## 📄 License

MIT — use it, build on it, make it better.

---

<p align="center">
  <i>The planet has been speaking for decades. We just gave it a voice inside the app you already use every day.</i>
</p>
