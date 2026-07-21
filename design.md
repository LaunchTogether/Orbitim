# Orbitim — Görsel Varlık Planı ve Nano Banana Prompt Kataloğu

Bu belge, projeye eklenecek üretilmiş görsellerin tamamını tanımlar: ne, nereye, hangi
teknik spesifikasyonla, hangi prompt ile. Her prompt tek başına Gemini / Nano Banana'ya
yapıştırılabilir — hepsi kendi içinde tam.

**Prompt'lar İngilizce.** Model İngilizce'de belirgin şekilde daha isabetli. Açıklamalar
Türkçe.

---

## 0. Üç kural

### Kural 1 — Her şey saydam (alpha)

Tek istisna: sosyal paylaşım kartı (§7.4). Onun dışında hiçbir varlıkta arka plan yok.
Gökyüzü yok, yıldız yok, zemin yok, gölge tabağı yok, vinyet yok, çerçeve yok.

Nano Banana bazen alpha yerine opak PNG döndürür. Olursa:

- **Sert kenarlı nesneler** (uydu, ikon, logo): prompt'un sonuna
  `Solid flat magenta #FF00FF background, no gradient, no shadow on the background.`
  ekle, sonra `magick in.png -fuzz 12% -transparent "#FF00FF" out.png` ile anahtarla.
- **Işıltı/glow varlıkları** (korona, kuyruklu yıldız, yıldız noktası): `pure black background`
  iste. Three.js'te `AdditiveBlending` ile siyah zaten sıfır katkı verir, keyleme gerekmez.

### Kural 2 — Üretilmiş görsel asla veri taklidi yapmaz

Projenin tek satılık iddiası bu: *ekrandaki hiçbir şey uydurma değil.* README bunu açıkça
yazıyor. Dolayısıyla:

| Üretilebilir | Üretilemez — asla |
|---|---|
| Uzay aracı gövde çizimleri (donanım illüstrasyonu) | Gezegen yüzey haritaları (`public/textures/` NASA/Solar System Scope kaynaklı, CC BY 4.0) |
| Marka: logo, favicon, uygulama ikonu | Yıldız alanı plakası (Samanyolu bandı gerçek gökyüzü) |
| Arayüz ikonografisi | Halka dokusu, bulut haritası, gece ışıkları |
| Efekt sprite'ları (korona, koma, HUD nişangahı) | Herhangi bir sayısal telemetriyi resmeden görsel |
| Asteroit kaya albedo/normal dokusu (şekil veri değil) | "Örnek uydu görüntüsü" gibi sunulacak sahte fotoğraf |

Uydu gövde çizimleri **temsilîdir**, fotoğraf değil. Arayüzde göründükleri yere
`Illustration · not imagery` etiketi konacak — panelin geri kalanı ölçülmüş sayı taşırken
resmin de kendi statüsünü söylemesi gerekir.

### Kural 3 — Tek aile

Aşağıdaki **STYLE BLOCK** her uzay aracı prompt'unun sonuna **birebir** eklenir. Varlıkların
tek elden çıkmış görünmesini sağlayan tek şey bu.

---

## 1. STYLE BLOCK (uzay aracı çizimleri için — kelimesi kelimesine kopyala)

```
STYLE: Technical spacecraft illustration, engineering-accurate, three-quarter view,
slightly above the orbital plane. Single hard sunlight from the upper left; a faint
cold blue Earth-shine fill from the lower right, at about 15% of the key light. Matte
realism, no glamour: multi-layer insulation in matte gold and matte black, brushed
aluminium and white thermal paint, solar arrays with a visible cell grid and a dark
blue-violet anti-reflective coating. Panel seams, bolt lines, antenna feeds and radiator
fins are legible. Colours desaturated, contrast moderate, no colour grading.

HARD CONSTRAINTS: fully transparent background with a real alpha channel. No space
background, no stars, no Earth, no nebula, no ground plane, no drop shadow, no glow,
no lens flare, no bloom, no vignette, no frame, no border, no text, no labels, no
callouts, no dimension lines, no watermark, no signature. Subject only, centred, with
even margins. Crisp edges suitable for compositing at small sizes.
```

---

## 2. Renk paleti

Arayüzde hâlihazırda kullanılan değerler (`src/ui/*`, `satelliteGroups.ts`). Marka ve ikon
prompt'ları bunlara kilitli:

| Rol | Hex | Kullanım |
|---|---|---|
| Void | `#000000` | Sayfa zemini |
| Signal | `#7dd3fc` | Birincil vurgu (sky-300), Starlink |
| Signal light | `#bae6fd` | Başlık vurgusu (sky-200) |
| Station | `#fbbf24` | İstasyonlar (amber-400) |
| Live | `#34d399` | Canlı göstergesi (emerald-400) |
| Steel | `#94a3b8` | Enkaz, ikincil metin |
| Paper | `#ffffff` | Birincil metin |

Tipografi karakteri: dar aralıklı, geniş harf boşluklu (`tracking-[0.24em]`) mono
büyük harf + çok ince (`font-extralight`) grotesk başlık. Wordmark bunu yansıtmalı.

---

## 3. Mevcut durum — bulunanlar

Taramada çıkan, bu planın var olma sebebi olan şeyler:

| Bulgu | Dosya | Sonuç |
|---|---|---|
| **Uydular renkli kare noktalar.** `pointsMaterial`, doku yok — 11.000 nesne aynı kare | `src/scene/SatelliteLayer.tsx:164` | §4 glyph sprite'ları |
| **Seçim işaretçisi düz halka geometrisi** | `src/scene/SatelliteFocus.tsx:174` | §6.5 HUD nişangahı |
| **Uydu dosyasında görsel yok** — sadece sayı satırları | `src/ui/SatelliteInfo.tsx` | §5 hero çizimler |
| **Favicon başka projeden.** Mor `#863bff` şimşek, Orbitim ile ilgisi yok | `public/favicon.svg` | §7.2 — değişmeli |
| **`public/icons.svg` yabancı.** Bluesky/Discord/GitHub/X ikonları, mor `#aa3bff`, kodda hiç referansı yok | `public/icons.svg` | Silinecek veya §8 ile değiştirilecek |
| **`og:image` etiketi hiç yok** | `index.html:14-19` | §7.4 |
| **`src/assets/{logo,hero,starlink}.png` kodda kullanılmıyor** | — | §7.1 çıktısıyla değişecek |
| **Korona ve yıldız sprite'ları canvas gradyanı** | `src/scene/SunGlow.tsx:9`, `src/scene/Starfield.tsx` | §6.1, §6.2 |
| **Takımyıldız listesinde ikon yok**, sadece renkli nokta | `src/ui/SatellitePanel.tsx:74` | §8 |
| **Asteroit kuşağı düz renkli instanced mesh** | `src/scene/AsteroidBelt.tsx` | §6.6 (opsiyonel) |

---

## 4. Uydu glyph sprite'ları — sahnede noktaların yerine

**Neden 14 değil 8:** 14 CelesTrak grubu var ama nokta boyutunda (`size={0.014}`) 14 ayrı
siluetin okunması mümkün değil. Sekiz donanım sınıfı hem doğru hem okunur.

### 4.0 Teknik spesifikasyon — bu bölümdeki hepsi için

- **Boyut:** 128 × 128 px, PNG, alpha.
- **Renk: saf beyazdan gri tonlarına, RENK YOK.** `pointsMaterial` `color` alanı grup
  rengini çarpım olarak uygular (`satelliteGroups.ts` renkleri); sprite renkliyse tint bozulur.
- **Doluluk:** siluet karenin ~%75'ini kaplasın, kenarda en az 12 px şeffaf pay.
- **Kenar:** sert, anti-aliased. Yumuşak glow yok — `alphaTest: 0.25` ile keseceğiz.
- **Yerleşim:** kütle merkezi tam ortada. Nokta pozisyonu gerçek yörünge konumu; siluet
  kaymışsa uydu yanlış yerde görünür.
- **Hedef:** `public/sprites/sat-<sınıf>.png`

Bu bölümdeki prompt'lar STYLE BLOCK **kullanmaz** — glyph'ler düz siluettir, render değil.

Ortak sonek (her §4 prompt'unun sonuna ekle):

```
GLYPH SPEC: Flat silhouette icon, not a 3D render. Pure white shape on full
transparency, no colour anywhere, no gradient, no inner shading, no outline stroke,
no glow. Hard anti-aliased edges. The shape fills about 75% of a square canvas and is
centred on its own centre of mass with even transparent margins. Readable when scaled
down to 16 pixels. 128x128 pixels. Transparent PNG with a real alpha channel. No
background, no shadow, no text, no watermark.
```

### 4.1 `sat-station.png` — grup: `stations`

```
A white silhouette glyph of a modular crewed space station seen at a three-quarter
angle: a long horizontal truss backbone with four large rectangular solar array wings
mounted in symmetric pairs at both ends, and a short cluster of cylindrical pressurised
modules crossing the truss at its centre. The wings are the widest feature; the module
cluster reads as a compact thicker mass at the middle. Include a small radiator panel
set perpendicular to the arrays.

[GLYPH SPEC buraya]
```

### 4.2 `sat-flatpack.png` — gruplar: `starlink`, `oneweb`

```
A white silhouette glyph of a modern flat-panel internet satellite: a single thin flat
rectangular chassis with one long solar array extending from one edge only, giving an
asymmetric L-shaped profile. Four small phased-array antenna patches sit flush on the
chassis face. Very low profile, no dish, no boom. The asymmetry is the identifying
feature and must be obvious at small size.

[GLYPH SPEC buraya]
```

### 4.3 `sat-gnss.png` — gruplar: `gps`, `glonass`, `galileo`, `beidou`

```
A white silhouette glyph of a navigation satellite bus: a compact box-shaped body with
two long rectangular solar array wings extending symmetrically to left and right, and a
flat rectangular antenna array panel on the nadir face made of a grid of short helical
antenna elements pointing down. Symmetric, T-shaped overall profile with the antenna
grid clearly visible as a small toothed rectangle below the body.

[GLYPH SPEC buraya]
```

### 4.4 `sat-crosslink.png` — grup: `iridium-NEXT`

```
A white silhouette glyph of a low-orbit communications satellite with three flat
mission-antenna panels angled outward from a triangular prism body like the petals of a
half-open flower, plus two narrow solar arrays on a shared boom. The three angled panels
are the identifying feature. Compact, aggressive, faceted profile.

[GLYPH SPEC buraya]
```

### 4.5 `sat-geo.png` — grup: `geo`

```
A white silhouette glyph of a large geostationary communications satellite: a boxy
central body carrying two very long multi-section solar array wings extending far to
either side, and two parabolic dish reflectors of different sizes mounted on the
earth-facing side on short booms. The wings should read as much longer relative to the
body than on any other satellite in this set. Include one thin whip antenna.

[GLYPH SPEC buraya]
```

### 4.6 `sat-polar.png` — gruplar: `weather`, `resource`

```
A white silhouette glyph of a polar-orbiting Earth observation satellite: an elongated
rectangular bus with one single large solar array wing on one side, a scanning radiometer
drum protruding from the nadir end, and a small deployable boom with a magnetometer on
the opposite end. Elongated, front-heavy profile — clearly nose-down toward the planet.

[GLYPH SPEC buraya]
```

### 4.7 `sat-observatory.png` — gruplar: `science`, `brightest`

```
A white silhouette glyph of an orbital telescope: a long cylindrical tube body with an
open aperture at one end and a hinged aperture door tilted back at an angle, two
rectangular solar arrays mounted flat along the tube sides, and a high-gain dish on a
short boom near the base. The cylinder is the dominant mass; the open angled door is the
identifying feature.

[GLYPH SPEC buraya]
```

### 4.8 `sat-debris.png` — grup: `debris_iridium`

```
A white silhouette glyph of a single irregular fragment of orbital debris: a jagged
angular shard of torn spacecraft structure with a piece of crumpled honeycomb panel edge
and two bent stringers. Asymmetric, sharp, no symmetry axis. Roughly one third the visual
area of the other satellite glyphs in this set — it must read as smaller and broken, not
as a designed object.

[GLYPH SPEC buraya]
```

### 4.9 Entegrasyon

`src/scene/SatelliteLayer.tsx:164` içindeki `pointsMaterial`:

```tsx
<pointsMaterial
  map={glyph}          // sınıfa göre yüklenmiş beyaz sprite
  alphaTest={0.25}     // yumuşak kuyruğu kes, depth sıralaması sorunu çıkmasın
  color={definition.color}
  size={0.02}          // glyph siluetli olduğu için noktadan büyük olmalı
  sizeAttenuation
  transparent
  depthWrite={false}
/>
```

`SatelliteGroup` tipine (`src/scene/satelliteGroups.ts:7`) `glyph: string` alanı eklenir,
her grup yukarıdaki sekiz sınıftan birine bağlanır.

---

## 5. Hero çizimler — uydu dosyasında (`SatelliteInfo.tsx`)

Gerçekçiliğin karşılığını verdiği yer burası. Bir uydu seçildiğinde panelin başında,
sayıların üstünde, o aracın 3/4 çizimi. Bunlar **STYLE BLOCK kullanır**.

### 5.0 Teknik spesifikasyon

- **Boyut:** 1536 × 1536 px, PNG, alpha. Arayüzde ~280 px genişlikte kullanılacak,
  Retina için 2× fazlasıyla yeterli.
- **Kadraj:** araç kadrajın ~%85'ini kaplasın, güneş panelleri dahil.
- **Yön:** hepsi aynı yöne baksın — gövde hafif sola dönük, paneller yatay.
- **Hedef:** `public/craft/<ad>.png`
- **Etiket:** panelde altına `Illustration · representative of class` yazılacak.

### 5.1 `iss.png` — Uluslararası Uzay İstasyonu

```
The International Space Station in orbital configuration, seen from slightly above and
ahead. The full integrated truss structure runs horizontally across the frame with four
pairs of large gold-brown solar array wings, white ammonia radiator panels angled
perpendicular to the arrays, and the pressurised module stack crossing at the centre:
the cylindrical laboratory modules in white thermal blankets, the Cupola dome on the
nadir side, and a docked crew vehicle at the forward port. Handrails, MMOD shielding
panels and the Canadarm2 robotic arm are visible.

[STYLE BLOCK buraya]
```

### 5.2 `starlink.png` — Starlink v2 mini

```
A single Starlink v2 mini internet satellite in deployed configuration. A thin flat
rectangular chassis in white and matte black carrying four square phased-array antenna
panels flush on its earth-facing face, with one long single solar array wing hinged along
one edge and extended straight out, its cells dark blue-violet in a fine visible grid.
Argon Hall-effect thruster nozzle visible at the aft end. Extremely low profile — the
whole craft reads as two flat planes meeting at a hinge.

[STYLE BLOCK buraya]
```

### 5.3 `gps-iii.png` — GNSS navigasyon uydusu

```
A GPS Block III class navigation satellite. A compact rectangular bus in gold multi-layer
insulation with two long rectangular solar array wings extended symmetrically left and
right on short yokes, and on the nadir face a flat rectangular antenna farm made of a
dense grid of short helical L-band antenna elements pointing downward. A UHF crosslink
antenna and a laser retroreflector array are visible on the same face. Strictly symmetric.

[STYLE BLOCK buraya]
```

### 5.4 `hubble.png` — Yörünge teleskobu

```
An orbital optical telescope of the Hubble class. A large silver cylindrical body wrapped
in reflective multi-layer insulation, the forward aperture open with its hinged door
tilted back at about forty degrees, two flat rectangular solar arrays mounted along the
cylinder sides, and two high-gain dish antennas on booms near the aft end. Handrails and
grapple fixtures visible along the barrel. The open aperture reads as a dark void, not a
mirror.

[STYLE BLOCK buraya]
```

### 5.5 `dragon.png` — Ticari mürettebat kapsülü

```
A commercial crew capsule in free flight, docking-configured. A conical white capsule
with a black ablative heat shield at its base and a cylindrical service trunk behind it,
the trunk's curved outer surface covered in body-mounted solar cells in dark blue-violet.
Four pairs of side-mounted abort engine housings sit flush in the capsule wall. The
forward docking port is open with its nose cone hinged upward. Draco thruster ports
visible around the capsule shoulder.

[STYLE BLOCK buraya]
```

### 5.6 `soyuz.png` — Soyuz MS

```
A Soyuz MS spacecraft in orbital configuration: a spherical white orbital module at the
front with a docking probe, a bell-shaped descent module in the middle with a charred
grey-brown ablative shield, and a cylindrical instrumentation and propulsion module at
the rear, flanked by two large flat green-tinted solar array wings on transverse booms.
Kurs rendezvous antennas protrude from the front sphere.

[STYLE BLOCK buraya]
```

### 5.7 `shuttle.png` — Uzay Mekiği (tarihî)

```
A Space Shuttle orbiter in orbit with its payload bay doors fully open, seen from three
quarters above. White upper surfaces, black reinforced carbon-carbon nose cap and wing
leading edges, black thermal tile underside. The open bay reveals gold radiator panel
liners on the inner door faces and an empty payload bay with the remote manipulator arm
stowed along the port sill. Delta wings, vertical stabiliser and three main engine bells
at the aft end all clearly resolved.

[STYLE BLOCK buraya]
```

### 5.8 `oneweb.png` — Küçük LEO uydusu

```
A small LEO broadband satellite of the OneWeb class. A compact rectangular bus roughly
the size of a washing machine, white and matte black, with two narrow solar array wings
on short yokes and two flat Ku-band antenna panels on the earth-facing side. Simple,
mass-produced, unglamorous — visibly a production-line object rather than a bespoke one.

[STYLE BLOCK buraya]
```

### 5.9 `iridium-next.png` — Çapraz bağlantılı takımyıldız uydusu

```
An Iridium NEXT class communications satellite. A triangular prism body with three flat
main mission antenna panels hinged outward at a shallow angle from each face, two narrow
solar arrays on a single shared boom, and four small crosslink antenna horns at the
corners. Gold multi-layer insulation on the body, matte white antenna faces.

[STYLE BLOCK buraya]
```

### 5.10 `geo-comsat.png` — Geostationary yayın uydusu

```
A large geostationary communications satellite in station-keeping configuration. A boxy
central bus in gold multi-layer insulation with two extremely long multi-panel solar
array wings extended to full span left and right, three parabolic dish reflectors of
different diameters on the earth-facing face on deployable booms, one folded omni whip
antenna, and a pair of electric propulsion pods on the anti-earth face. The span of the
wings should dominate the composition.

[STYLE BLOCK buraya]
```

### 5.11 `sentinel.png` — Radar Dünya gözlem uydusu

```
A synthetic aperture radar Earth observation satellite of the Sentinel-1 class. A
rectangular bus with a very long flat rectangular SAR antenna panel mounted rigidly along
one side, one large solar array wing folded out on the opposite side, and a GPS antenna
mast on the zenith face. The long flat radar panel is the identifying feature and must
read as a rigid plank, distinct from the segmented solar array.

[STYLE BLOCK buraya]
```

### 5.12 `goes.png` — Hava durumu uydusu

```
A geostationary weather satellite of the GOES-R class. A rectangular bus with a single
large solar array wing extending from one side on a long yoke, a solar-pointing
instrument boom counterbalancing it, an imaging radiometer aperture on the earth-facing
face, a search-and-rescue antenna, and a magnetometer on a long thin deployed boom. The
one-winged asymmetry with a counterweight boom is the identifying feature.

[STYLE BLOCK buraya]
```

### 5.13 `upper-stage.png` — Harcanmış üst kademe (grup: `brightest`)

```
A spent rocket upper stage tumbling in orbit. A large empty cylindrical propellant tank
in bare brushed aluminium with visible weld seams and orthogrid milling patterns, a
single vacuum-optimised engine bell at one end with a scorched interior, and a truncated
interstage adapter ring at the other. Insulation partly torn away in strips. No solar
arrays, no antennas — this is discarded hardware, not a working spacecraft.

[STYLE BLOCK buraya]
```

### 5.14 `debris.png` — Yörünge enkazı parçası

```
A single fragment of orbital debris from a satellite collision: a torn piece of aluminium
honeycomb sandwich panel about the size of a dinner plate, its core cells exposed along
the ragged fracture edge, one bent structural stringer still attached, a scrap of gold
multi-layer insulation hanging from a rivet, and a severed wiring harness with copper
strands visible. Scorched and micrometeoroid-pitted surfaces. Sharp, irregular, no
symmetry.

[STYLE BLOCK buraya]
```

---

## 6. Sahne efekt sprite'ları

### 6.1 `corona.png` — Güneş koronası (1024 × 1024)

`src/scene/SunGlow.tsx:9` içindeki `createGlowTexture` canvas gradyanının yerine.
Gradyan radyal simetrik olduğu için düz duruyor; gerçek korona ışınsal akıntılar taşır.

```
A solar corona seen in white light during a total eclipse, as a standalone radial
element. A bright dense inner ring fading outward into long delicate radial streamers
that reach different distances in different directions, with two broader equatorial
streamer fans opposite each other and shorter fine polar plumes at ninety degrees to
them. Colour: white at the centre grading through pale gold to faint warm orange at the
extremities. Perfectly centred, radially structured but not radially symmetric.

CONSTRAINTS: pure black background, no stars, no planet, no solar disc drawn as a hard
edge, no lens flare, no diffraction spikes, no text. Square 1024x1024. The centre must be
brightest and the outer edge must fade completely to black before the frame border, so
the sprite can be used with additive blending without a visible square boundary.
```

Kullanım: `spriteMaterial` `blending={THREE.AdditiveBlending}` — siyah zaten görünmez,
alpha gerekmez.

### 6.2 `star-point.png` — Yıldız noktası (64 × 64)

`src/scene/Starfield.tsx` içindeki `createStarSprite` yerine.

```
A single point-source star as seen by a diffraction-limited optical system: an intensely
bright white core, a tight Airy disc falling off steeply, and four faint straight
diffraction spikes at ninety degrees to each other, each about three times the core
radius. Monochrome white on pure black. Perfectly centred and symmetric. Square 64x64.
The falloff must reach pure black well before the frame border. No colour, no text, no
background elements.
```

### 6.3 `comet-coma.png` — Kuyruklu yıldız koması (1024 × 1024)

Sıradaki özellik için hazır varlık.

```
The coma of an active comet as a standalone element: a bright compact nucleus glow at the
centre surrounded by a soft asymmetric envelope of outgassing dust, denser and more
sharply bounded on one side (the sunward side) and diffusing outward on the other.
Faintly blue-green at the inner coma from diatomic carbon fluorescence, warming to
neutral dusty grey-white at the outer edge. Pure black background, additive-ready. No
tail — the tail is a separate asset. No stars, no text. Square 1024x1024, fading fully to
black before the border.
```

### 6.4 `comet-tail.png` — Kuyruk (2048 × 512, yatay)

```
A comet tail as a standalone horizontal element, streaming to the right from an implied
source just off the left edge. Two overlapping structures: a broad curved yellowish-white
dust tail that widens and fades gradually, and a narrower straight ion tail in cool
electric blue running slightly above it with fine filamentary striations and one visible
kink. Both fade to nothing before the right border and before the top and bottom borders.
Pure black background, additive-ready. No nucleus, no coma, no stars, no text. 2048x512.
```

### 6.5 `reticle.png` — Seçim nişangahı (512 × 512)

`src/scene/SatelliteFocus.tsx:174` içindeki düz `ringGeometry` yerine.

```
A minimal targeting reticle for a spacecraft heads-up display: a thin circular ring
broken into four equal arcs with small gaps at the diagonals, four short tick marks
pointing inward at the twelve, three, six and nine o'clock positions, and one slightly
longer tick at twelve. A second, much fainter concentric ring sits just outside the
first. Line weight uniform and hairline-thin.

CONSTRAINTS: pure white lines on a fully transparent background with a real alpha channel.
No fill inside the ring, no glow, no gradient, no colour, no numbers, no text, no
crosshair through the centre — the centre must stay completely empty so the tracked
object is never occluded. Perfectly centred, square 512x512, with a 6% transparent margin
outside the outer ring.
```

Beyaz olmalı: `meshBasicMaterial` `color` alanı grup rengini uygular.

### 6.6 `asteroid-albedo.png` — Asteroit kaya dokusu (1024 × 1024) — *opsiyonel*

`src/scene/AsteroidBelt.tsx` — 8000 instanced mesh şu an düz renkli. Şekiller veri
olmadığı için üretilmiş doku Kural 2'yi ihlal etmez.

```
A seamless tileable texture of a carbonaceous asteroid surface: dark charcoal-grey
regolith, densely covered in overlapping impact craters of many sizes from large shallow
basins to fresh sharp-rimmed small ones, with scattered angular boulders, fine dust
ponding in crater floors, and a few brighter fresh-excavation patches. Even lighting with
no cast direction — this is an albedo map, not a rendered surface. Low overall contrast,
low saturation, no visible seams at any edge. 1024x1024, tiles seamlessly, no text.
```

> **Uyarı:** Görüntü modelleri "seamless tileable" konusunda güvenilir değil. Çıktıyı
> 2×2 tekrar ederek kontrol et; dikiş görünüyorsa kullanma. Alternatif: dokusuz bırak,
> `roughness` ile idare et.

### 6.7 `thruster-plume.png` — İtki alevi (512 × 512) — *opsiyonel*

ISS'e binildiğinde veya manevra anında.

```
A vacuum thruster plume as a standalone element: a small intensely bright throat at the
bottom edge expanding upward into a wide translucent conical exhaust that fades to
nothing before the top border. Colour: white-hot at the throat, grading through pale blue
to a faint violet at the diffuse outer edge. Faint shock diamond structure visible in the
first third. Pure black background, additive-ready. No nozzle hardware drawn, no
spacecraft, no stars, no text. 512x512.
```

---

## 7. Marka

### 7.1 Logo — dört yön, birini seç

Kavram tabanı: *Orbitim* = yörünge + birinci tekil sahiplik. "Buradan bakınca yörüngeler."
Dolayısıyla mark bir gözlem noktası ile bir yörünge taşımalı.

**Tümü için ortak spesifikasyon:** 2048 × 2048 PNG, alpha, kare kadraj, kenarda %8 pay,
tek renkli veya en fazla iki renkli, siyah zeminde de beyaz zeminde de çalışır.

#### 7.1.a `logo-node.png` — Eğik yörünge + düğüm noktası (*önerilen*)

```
A minimalist geometric logo mark: a single perfect ellipse drawn as a thin hairline
stroke, tilted about twenty-three degrees from horizontal, reading as a circular orbit
seen in perspective. On the ellipse, at its lower left, sits one solid filled dot roughly
one twelfth of the ellipse's width — the only filled element in the mark. Where the
ellipse passes behind the implied centre, the stroke breaks with a small clean gap, so
the near arc reads as in front of the far arc. Nothing at the centre — the focus is empty.

STYLE: precise instrument geometry, drafted not drawn. Uniform hairline stroke weight
throughout. Stroke and dot in a single colour: light blue #7dd3fc. Flat vector aesthetic,
no gradients, no 3D, no bevel, no shadow, no texture, no glow.

CONSTRAINTS: fully transparent background with a real alpha channel. No background shape,
no container circle, no square badge, no text, no letters, no wordmark, no watermark.
Square 2048x2048, centred, 8% clear margin. Must remain legible at 16 pixels.
```

#### 7.1.b `logo-track.png` — Yer izi eğrisi

```
A minimalist geometric logo mark: a single sine-like curve, one full period, drawn as a
hairline stroke — the ground track a satellite sweeps across a flattened map. The curve is
clipped inside a perfect circle, meeting the circle's edge cleanly at both ends. The
circle itself is drawn in the same hairline weight but at forty percent opacity, so the
track is clearly the subject. One small filled dot sits on the curve at its rising node.

STYLE: precise instrument geometry, drafted not drawn. Uniform hairline stroke weight.
Single colour: light blue #7dd3fc, with the circle at 40% opacity of it. Flat vector
aesthetic, no gradients, no 3D, no shadow, no texture, no glow.

CONSTRAINTS: fully transparent background with a real alpha channel. No background fill,
no square badge, no text, no letters, no watermark. Square 2048x2048, centred, 8% clear
margin. Must remain legible at 16 pixels.
```

#### 7.1.c `logo-aperture.png` — Açıklık / bakış noktası

```
A minimalist geometric logo mark: six identical thin blades arranged in rotational
symmetry around an empty hexagonal aperture at the centre, like a camera iris held
half-open. Each blade is a hairline outline, not a filled shape. The central hexagonal
opening is completely empty and is the brightest part of the composition by absence. One
blade — the upper right — is drawn at full opacity while the other five sit at fifty
percent, giving the mark a single point of emphasis.

STYLE: precise instrument geometry, drafted not drawn. Uniform hairline stroke weight.
Single colour: light blue #7dd3fc. Flat vector aesthetic, no gradients, no 3D, no bevel,
no shadow, no glow.

CONSTRAINTS: fully transparent background with a real alpha channel. No background shape,
no container, no text, no letters, no watermark. Square 2048x2048, centred, 8% clear
margin. Must remain legible at 16 pixels.
```

#### 7.1.d `logo-o.png` — Harf O yörünge olarak

```
A minimalist logotype mark: the capital letter O drawn as an extremely thin, wide,
geometric sans-serif circle — the counter is large and the stroke is hairline, so the
letter reads simultaneously as a letter and as an orbit. A second, smaller hairline
ellipse crosses it at about thirty degrees, passing in front of the O on one side and
breaking behind it on the other, with clean gaps at the two crossings. A single small
filled dot sits on the crossing ellipse.

STYLE: precise geometric type construction, drafted not drawn. Uniform hairline stroke
weight for both the letter and the ellipse. Single colour: light blue #7dd3fc. Flat vector
aesthetic, no gradients, no 3D, no shadow, no glow.

CONSTRAINTS: fully transparent background with a real alpha channel. No background shape,
no badge, no additional letters, no wordmark, no watermark. Square 2048x2048, centred, 8%
clear margin. Must remain legible at 16 pixels.
```

### 7.2 `favicon-source.png` — Favicon kaynağı (512 × 512)

`public/favicon.svg` **başka bir projenin varlığı** — mor `#863bff` şimşek işareti. Kaldır.

Seçilen logo yönünü 16 px'e indirgenmiş biçimde yeniden üret:

```
A favicon-scale version of the following mark, redrawn for extreme small size: [seçilen
logonun tarifini buraya yapıştır]. Simplify aggressively for 16-pixel legibility: stroke
weight increased to roughly three times the original relative thickness, the ellipse
tilt reduced, and every detail below one pixel at final size removed entirely. Only two
elements survive: the ellipse and the dot.

STYLE: flat vector, single colour light blue #7dd3fc, no gradients, no 3D, no shadow,
no glow.

CONSTRAINTS: fully transparent background with a real alpha channel. No background shape,
no rounded-square badge, no text, no watermark. Square 512x512, centred, 6% clear margin.
```

Üretimden sonra SVG'ye çevir (`potrace` veya elle yeniden çiz) — `index.html:5` SVG bekliyor.

### 7.3 `app-icon.png` — Uygulama ikonu (1024 × 1024)

Native uygulamalar için. **Bu varlık saydam değil** — mağazalar opak ister.

```
A mobile app icon, 1024x1024, full-bleed square with no transparency and no rounded
corners (the platform applies the mask). Background: a deep near-black field with a very
subtle radial falloff from the centre, from #0a0f18 at the middle to #000000 at the
corners — no visible banding. Centred on it, at about 58% of the icon width, the following
mark in light blue #7dd3fc: [seçilen logonun tarifini buraya yapıştır]. The mark's stroke
is thickened to about twice its original relative weight so it holds at 40 pixels.

CONSTRAINTS: opaque background, edge to edge. No text, no letters, no wordmark, no
gloss overlay, no drop shadow, no border, no watermark, no rounded corner mask drawn into
the image.
```

### 7.4 `og-card.png` — Sosyal paylaşım kartı (1200 × 630) — **tek saydam olmayan varlık**

`index.html` içinde `og:image` etiketi **hiç yok**. Eklenmeli.

```
A social share card, 1200x630, opaque. Left two thirds: a deep black field carrying, in
the upper left, a small hairline orbital mark in light blue #7dd3fc, and beneath it the
word ORBITIM in a very light geometric sans-serif, white, all capitals, with wide letter
spacing. Below that, in a much smaller monospace type at 45% white opacity, the line
"THE SOLAR SYSTEM, RIGHT NOW". Right third: the limb of a planet curving out of frame,
rendered as a thin bright atmospheric arc over darkness — the planet's disc itself is
almost entirely unlit, only the limb catches the light. A dozen small light-blue points
of light are scattered above the limb in an arc, reading as satellites in orbit.

STYLE: restrained, instrument-panel aesthetic. Deep blacks, one accent colour, generous
empty space. No lens flare, no bloom, no glossy reflections, no gradient mesh, no
stock-photo look.

CONSTRAINTS: opaque background, exactly 1200x630 pixels. The only text in the image is
the word ORBITIM and the line THE SOLAR SYSTEM, RIGHT NOW — spelled exactly as written,
no other letters or numbers anywhere. No watermark, no border, no logo other than the
orbital mark described.
```

> Metin üreten görsel modelleri harf bozar. Çıktıda yazıyı harf harf kontrol et; bozuksa
> kartı yazısız üret ve metni sonradan HTML/Figma ile bindir.

### 7.5 `wordmark.png` — Kelime markası (2048 × 512) — *opsiyonel*

```
A wordmark reading exactly ORBITIM in capital letters, set in an extremely light
geometric sans-serif with wide, even letter spacing — the weight of a hairline, the
proportions of a technical drawing annotation. The letter O is replaced by the orbital
mark: a hairline ellipse tilted about twenty-three degrees with a single small filled dot
on its lower left arc, sized and positioned to sit on the same baseline and cap height as
the remaining letters. All letters and the mark in pure white.

CONSTRAINTS: fully transparent background with a real alpha channel. The only text is
ORBITIM, spelled exactly, seven letters, no other characters. No background shape, no
tagline, no underline, no box, no watermark. 2048x512, horizontally centred, with 10%
clear margin left and right.
```

---

## 8. Arayüz ikon seti

`public/icons.svg` başka bir projeden gelmiş (Bluesky, Discord, GitHub, X ikonları, mor
`#aa3bff`) ve kodda hiç referansı yok. Silinecek. Yerine ihtiyaç duyulan gerçek set:

**Ortak spesifikasyon:** her biri 512 × 512 PNG alpha, saf beyaz, 2 px eşdeğeri düz çizgi
ağırlığı (512'de ~24 px), yuvarlak uç, dolgu yok. Hedef `public/icons/<ad>.png`, sonra tek
SVG sprite'a çevrilecek.

Ortak sonek:

```
ICON SPEC: Single-weight line icon, pure white strokes on full transparency, no fill, no
colour, no gradient, no shadow, no glow. Stroke weight uniform at about 24 pixels on a
512x512 canvas, round caps and round joins. Geometric construction on a 24-unit grid.
The icon occupies the central 80% of the canvas. Readable at 20 pixels. Transparent PNG
with a real alpha channel. No background, no container shape, no text, no watermark.
```

| Dosya | İçerik prompt'u (ICON SPEC ekle) | Nereye |
|---|---|---|
| `icon-constellation.png` | `Four small dots arranged in a shallow arc with thin straight lines connecting them in sequence, and one longer line curving beneath the arc — a satellite constellation over a horizon.` | `SatellitePanel` başlığı |
| `icon-orbit.png` | `A small filled circle at the centre with one thin tilted ellipse around it and a single dot on the ellipse.` | Yörünge satırı |
| `icon-ground-track.png` | `A horizontal rectangle with rounded corners representing a map frame, and one sine-like curve crossing it from edge to edge, with a dot at the curve's peak.` | Yer izi satırı |
| `icon-altitude.png` | `A shallow curved arc across the bottom representing a planet limb, and a vertical line with arrowheads at both ends rising from the arc to a small square.` | İrtifa satırı |
| `icon-velocity.png` | `Three horizontal lines of decreasing length stacked with even gaps, the longest at the top, all ending in a shared vertical alignment on the left, with a small chevron pointing right at the end of the middle line.` | Hız satırı |
| `icon-clock.png` | `A circle with two straight hands from the centre, the shorter pointing to eleven and the longer to two, and four short tick marks at the quarter positions outside the circle.` | `TimeControls` |
| `icon-ride.png` | `A small rounded triangle nose-up with two short swept fins, and three short parallel lines below it of decreasing length.` | "Ride the ISS" butonu |
| `icon-signal-age.png` | `A circle with a single hand pointing to two o'clock and one small curved arrow wrapping counter-clockwise around the upper left of the circle.` | TLE yaşı uyarısı |
| `icon-escape.png` | `A rounded square outline with its right edge open, and an arrow pointing right through the opening.` | Escape ipucu |
| `icon-layers.png` | `Three flat parallelograms stacked with even vertical gaps, seen in shallow isometric.` | Katman geçişi |

---

## 9. Landing sayfası — opsiyonel

`src/ui/Landing.tsx` bilinçli olarak canlı sahnenin üstünde duruyor; arkasında hareketli
gerçek sistem var. **Buraya statik hero görseli koymak bir gerileme olur** ve önerilmiyor.

Yalnızca şu iki küçük varlık değer katar:

### 9.1 `landing-mark.png` — 256 × 256

Sol üstteki `ORBITIM` yazısının yanına, seçilen logonun ince çizgi versiyonu. §7.1
çıktısını yeniden ölçeklemek yeterli, ayrı üretim gerekmez.

### 9.2 `scrim-noise.png` — 512 × 512, tekrarlanabilir

```
A seamless tileable film grain texture: fine monochrome luminance noise, evenly
distributed, with no visible clumping, no directional streaking and no repeating pattern.
Very low contrast — the difference between the lightest and darkest pixel is small.
Neutral grey at the mean. Tiles seamlessly at all four edges. 512x512, no text.
```

Kullanım: siyah scrim'in üstüne `opacity: 0.02`, `mix-blend-mode: overlay`. Geniş düz
siyah alanlardaki gradyan bantlaşmasını kırar (`Landing.tsx:123`'teki gradyanlar).

---

## 10. Dosya düzeni ve üretim sırası

```
public/
  sprites/      sat-station.png  sat-flatpack.png  sat-gnss.png  sat-crosslink.png
                sat-geo.png  sat-polar.png  sat-observatory.png  sat-debris.png
  craft/        iss.png  starlink.png  gps-iii.png  hubble.png  dragon.png  soyuz.png
                shuttle.png  oneweb.png  iridium-next.png  geo-comsat.png  sentinel.png
                goes.png  upper-stage.png  debris.png
  effects/      corona.png  star-point.png  comet-coma.png  comet-tail.png  reticle.png
                thruster-plume.png  asteroid-albedo.png  scrim-noise.png
  icons/        icon-*.png  (10 adet)
  brand/        logo.png  wordmark.png  app-icon.png  og-card.png
  favicon.svg   (yeniden çizilecek)
```

**Üretim sırası — etkiden maliyete:**

1. **§4 glyph'ler (8 görsel)** — ekranda en çok görünen değişiklik. 11.000 kare nokta gider.
2. **§7.1 logo (1 seçim, 4 deneme)** — kimliği olmayan bir site kimlik kazanır.
3. **§6.5 nişangah + §6.1 korona (2 görsel)** — sahnenin iki zayıf yeri.
4. **§5 hero çizimler (14 görsel)** — uydu paneline ağırlık verir, en pahalı kalem.
5. **§7.2–7.4 favicon / uygulama ikonu / OG kartı (3 görsel)** — dağıtım öncesi zorunlu.
6. **§8 ikon seti (10 görsel)** — cila.
7. **§6.3–6.4 kuyruklu yıldız (2 görsel)** — özellik geldiğinde.
8. **§6.6–6.7, §9.2 opsiyoneller.**

**Toplam: 44 görsel** (14'ü opsiyonel/koşullu).

---

## 11. Kabul kontrolü

Her varlık projeye girmeden önce:

- [ ] Gerçekten alpha kanalı var mı — `magick identify -format '%[channels]' dosya.png`
      çıktısı `srgba` olmalı, `srgb` değil.
- [ ] Kenarda mat kalıntı yok mu — koyu zemin üzerinde açık bir hale kalmışsa
      `-channel A -level 10%,90%` ile temizle.
- [ ] §4 glyph'leri gerçekten renksiz mi — renkli piksel varsa grup tint'i bozulur.
- [ ] Görsel içinde yazı var mı — §7.4 dışında hiçbir varlıkta harf olmamalı; model
      sıklıkla anlamsız yazı ekler.
- [ ] Boyut bütçesi: `public/` şu an 3 MB'ın üstünde. Her PNG `oxipng -o4 --strip all`
      veya WebP'den geçsin. Hero çizimleri WebP'ye çok iyi gider.
- [ ] Panelde görünen her üretilmiş çizimin altında `Illustration · representative of
      class` etiketi var mı. Kural 2 buna bağlı.
