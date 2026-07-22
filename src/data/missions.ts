import type { BodyId } from '../lib/ephemeris/bodies';

/**
 * What has been sent where, and where it came down.
 *
 * Two kinds of record. A site is a place on a surface a spacecraft actually
 * reached, carrying the coordinates it reached it at, so it can be marked on
 * the globe. A milestone is an event in a body's exploration that has no single
 * point on the ground — a flyby, an orbiter, a discovery — and belongs to the
 * body as a whole.
 *
 * Coordinates are planetocentric latitude north and east longitude in the
 * −180…180 convention, from the mission reports and the USGS Gazetteer of
 * Planetary Nomenclature. Dates are the landing or impact date in UTC, not the
 * launch date.
 */

export type SiteKind = 'landing' | 'crewed' | 'rover' | 'sample-return' | 'impact' | 'launch';

export interface SurfaceSite {
  id: string;
  name: string;
  agency: string;
  /** ISO date the site was reached. */
  date: string;
  kind: SiteKind;
  /** Planetocentric latitude, degrees north. */
  lat: number;
  /** East longitude, degrees, −180 to 180. */
  lon: number;
  summary: string;
}

export type MilestoneKind =
  | 'flyby'
  | 'orbiter'
  | 'lander'
  | 'rover'
  | 'sample'
  | 'impact'
  | 'crewed'
  | 'planned';

export interface Milestone {
  year: number;
  name: string;
  agency: string;
  kind: MilestoneKind;
  summary: string;
}

export interface ExplorationRecord {
  /** Places on the surface, marked on the globe. */
  sites: readonly SurfaceSite[];
  /** The body's exploration in order, whether or not anything landed. */
  milestones: readonly Milestone[];
}

export const EXPLORATION: Partial<Record<BodyId, ExplorationRecord>> = {
  sun: {
    sites: [],
    milestones: [
      { year: 1976, name: 'Helios 2', agency: 'NASA · DFVLR', kind: 'flyby', summary: 'Closest approach of any spacecraft for 42 years, 43 million km from the photosphere.' },
      { year: 1990, name: 'Ulysses', agency: 'ESA · NASA', kind: 'orbiter', summary: 'First survey of the Sun over its poles, out of the ecliptic entirely.' },
      { year: 1995, name: 'SOHO', agency: 'ESA · NASA', kind: 'orbiter', summary: 'Continuous watch on the Sun from L1 for three decades and counting.' },
      { year: 2018, name: 'Parker Solar Probe', agency: 'NASA', kind: 'orbiter', summary: 'Flew through the corona in 2021 — the first spacecraft to enter the atmosphere of a star.' },
      { year: 2020, name: 'Solar Orbiter', agency: 'ESA · NASA', kind: 'orbiter', summary: 'Closest images ever taken of the solar surface, and the first of the poles.' },
      { year: 2023, name: 'Aditya-L1', agency: 'ISRO', kind: 'orbiter', summary: "India's first solar observatory, stationed at the L1 point." }
    ]
  },

  mercury: {
    sites: [],
    milestones: [
      { year: 1974, name: 'Mariner 10', agency: 'NASA', kind: 'flyby', summary: 'Three flybys mapped 45% of the surface — the only view of Mercury for 34 years.' },
      { year: 2008, name: 'MESSENGER', agency: 'NASA', kind: 'flyby', summary: 'Flybys revealed the hemisphere Mariner 10 never saw.' },
      { year: 2011, name: 'MESSENGER', agency: 'NASA', kind: 'orbiter', summary: 'First orbiter. Found water ice in permanently shadowed polar craters; impacted the surface in 2015.' },
      { year: 2021, name: 'BepiColombo', agency: 'ESA · JAXA', kind: 'flyby', summary: 'Six flybys of Mercury to shed the speed needed to be captured by it.' },
      { year: 2026, name: 'BepiColombo', agency: 'ESA · JAXA', kind: 'planned', summary: 'Orbit insertion, splitting into two orbiters studying the planet and its magnetosphere.' }
    ]
  },

  venus: {
    sites: [
      { id: 'venera7', name: 'Venera 7', agency: 'USSR', date: '1970-12-15', kind: 'landing', lat: -5, lon: -9, summary: 'First spacecraft to transmit from the surface of another planet. It survived 23 minutes.' },
      { id: 'venera9', name: 'Venera 9', agency: 'USSR', date: '1975-10-22', kind: 'landing', lat: 31.01, lon: -68.36, summary: 'Returned the first photograph ever taken on the surface of another planet.' },
      { id: 'venera13', name: 'Venera 13', agency: 'USSR', date: '1982-03-01', kind: 'landing', lat: -7.55, lon: -57, summary: 'Colour panoramas and the first soil analysis. Designed for 32 minutes; lasted 127.' },
      { id: 'venera14', name: 'Venera 14', agency: 'USSR', date: '1982-03-05', kind: 'landing', lat: -13.05, lon: -49.81, summary: 'Basalt underfoot, and a microphone that recorded the wind of another world.' },
      { id: 'vega2', name: 'Vega 2', agency: 'USSR', date: '1985-06-15', kind: 'landing', lat: -8.5, lon: 164.5, summary: 'Dropped a lander on the way to Halley’s Comet; the last craft to reach the surface.' }
    ],
    milestones: [
      { year: 1962, name: 'Mariner 2', agency: 'NASA', kind: 'flyby', summary: 'First successful flyby of another planet, and the end of any hope of a temperate Venus.' },
      { year: 1967, name: 'Venera 4', agency: 'USSR', kind: 'lander', summary: 'First probe to measure another planet’s atmosphere directly, crushed on the way down.' },
      { year: 1978, name: 'Pioneer Venus', agency: 'NASA', kind: 'orbiter', summary: 'Orbiter and four atmospheric probes; first radar map of the surface.' },
      { year: 1990, name: 'Magellan', agency: 'NASA', kind: 'orbiter', summary: 'Radar-mapped 98% of the surface through the cloud, at 100 m resolution.' },
      { year: 2006, name: 'Venus Express', agency: 'ESA', kind: 'orbiter', summary: 'Eight years watching the atmosphere; found evidence of recent volcanism.' },
      { year: 2015, name: 'Akatsuki', agency: 'JAXA', kind: 'orbiter', summary: 'Reached orbit on its second attempt, five years late, and mapped the super-rotating winds.' }
    ]
  },

  earth: {
    sites: [
      { id: 'baikonur', name: 'Baikonur Cosmodrome', agency: 'USSR · Roscosmos', date: '1957-10-04', kind: 'launch', lat: 45.92, lon: 63.34, summary: 'Sputnik 1 and Gagarin both left from here. The first and oldest spaceport.' },
      { id: 'ksc', name: 'Kennedy Space Center', agency: 'NASA', date: '1967-11-09', kind: 'launch', lat: 28.61, lon: -80.6, summary: 'Pad 39A launched every crewed Moon landing, and now launches Falcon 9.' },
      { id: 'baikonur-gagarin', name: 'Vostok 1 landing', agency: 'USSR', date: '1961-04-12', kind: 'crewed', lat: 51.27, lon: 45.99, summary: 'Yuri Gagarin came down near Engels after the first human orbit of the Earth.' },
      { id: 'jiuquan', name: 'Jiuquan', agency: 'CNSA', date: '2003-10-15', kind: 'launch', lat: 40.96, lon: 100.29, summary: 'China’s crewed programme flies from the Gobi desert.' },
      { id: 'kourou', name: 'Guiana Space Centre', agency: 'ESA · CNES', date: '1979-12-24', kind: 'launch', lat: 5.24, lon: -52.77, summary: 'Five degrees from the equator, the best place on Earth to launch eastward.' },
      { id: 'sriharikota', name: 'Satish Dhawan Space Centre', agency: 'ISRO', date: '1980-07-18', kind: 'launch', lat: 13.72, lon: 80.23, summary: 'Chandrayaan and Mangalyaan both began here.' },
      { id: 'tanegashima', name: 'Tanegashima', agency: 'JAXA', date: '1975-09-09', kind: 'launch', lat: 30.4, lon: 130.97, summary: 'Japan’s main spaceport, and the departure point for Hayabusa’s asteroid sample returns.' },
      { id: 'starbase', name: 'Starbase', agency: 'SpaceX', date: '2023-04-20', kind: 'launch', lat: 25.99, lon: -97.15, summary: 'Test site for Starship, the largest launch vehicle ever flown.' }
    ],
    milestones: [
      { year: 1957, name: 'Sputnik 1', agency: 'USSR', kind: 'orbiter', summary: 'First artificial satellite. Ninety minutes per orbit, and a radio beep anyone could hear.' },
      { year: 1958, name: 'Explorer 1', agency: 'NASA', kind: 'orbiter', summary: 'Discovered the Van Allen radiation belts on its first pass.' },
      { year: 1961, name: 'Vostok 1', agency: 'USSR', kind: 'crewed', summary: 'Yuri Gagarin, one orbit, 108 minutes — the first human in space.' },
      { year: 1972, name: 'Landsat 1', agency: 'NASA · USGS', kind: 'orbiter', summary: 'Began the longest continuous record of the Earth’s land surface from space.' },
      { year: 1998, name: 'International Space Station', agency: 'NASA · Roscosmos · ESA · JAXA · CSA', kind: 'crewed', summary: 'Continuously inhabited since November 2000.' },
      { year: 2021, name: 'Tiangong', agency: 'CNSA', kind: 'crewed', summary: 'China’s permanently crewed station, assembled in orbit across 2021 and 2022.' }
    ]
  },

  moon: {
    sites: [
      { id: 'luna2', name: 'Luna 2', agency: 'USSR', date: '1959-09-13', kind: 'impact', lat: 29.1, lon: 0, summary: 'The first object made on Earth to touch another world, at 3.3 km/s.' },
      { id: 'luna9', name: 'Luna 9', agency: 'USSR', date: '1966-02-03', kind: 'landing', lat: 7.08, lon: -64.37, summary: 'First soft landing anywhere beyond Earth, and the first pictures from a lunar surface.' },
      { id: 'surveyor1', name: 'Surveyor 1', agency: 'NASA', date: '1966-06-02', kind: 'landing', lat: -2.47, lon: -43.34, summary: 'Proved the regolith would bear the weight of a crewed lander.' },
      { id: 'apollo11', name: 'Apollo 11', agency: 'NASA', date: '1969-07-20', kind: 'crewed', lat: 0.67, lon: 23.47, summary: 'Mare Tranquillitatis. Armstrong and Aldrin spent 21 hours on the surface.' },
      { id: 'apollo12', name: 'Apollo 12', agency: 'NASA', date: '1969-11-19', kind: 'crewed', lat: -3.01, lon: -23.42, summary: 'Landed 180 m from Surveyor 3 and brought pieces of it home.' },
      { id: 'luna16', name: 'Luna 16', agency: 'USSR', date: '1970-09-20', kind: 'sample-return', lat: -0.68, lon: 56.3, summary: 'First robotic sample return: 101 g of Mare Fecunditatis, delivered to Earth.' },
      { id: 'lunokhod1', name: 'Luna 17 · Lunokhod 1', agency: 'USSR', date: '1970-11-17', kind: 'rover', summary: 'First wheeled vehicle on another world; drove 10 km over ten months.', lat: 38.24, lon: -35 },
      { id: 'apollo14', name: 'Apollo 14', agency: 'NASA', date: '1971-02-05', kind: 'crewed', lat: -3.65, lon: -17.47, summary: 'Fra Mauro, the site Apollo 13 never reached.' },
      { id: 'apollo15', name: 'Apollo 15', agency: 'NASA', date: '1971-07-30', kind: 'crewed', lat: 26.13, lon: 3.63, summary: 'Hadley Rille, and the first drive in the lunar rover.' },
      { id: 'apollo16', name: 'Apollo 16', agency: 'NASA', date: '1972-04-21', kind: 'crewed', lat: -8.97, lon: 15.5, summary: 'The only landing in the lunar highlands.' },
      { id: 'apollo17', name: 'Apollo 17', agency: 'NASA', date: '1972-12-11', kind: 'crewed', lat: 20.19, lon: 30.77, summary: 'Taurus-Littrow, and the last time anyone stood on the Moon.' },
      { id: 'change3', name: "Chang'e 3 · Yutu", agency: 'CNSA', date: '2013-12-14', kind: 'rover', lat: 44.12, lon: -19.51, summary: 'First soft landing in 37 years, in Mare Imbrium.' },
      { id: 'change4', name: "Chang'e 4 · Yutu-2", agency: 'CNSA', date: '2019-01-03', kind: 'rover', lat: -45.44, lon: 177.6, summary: 'First landing on the far side, relayed home via a satellite beyond the Moon.' },
      { id: 'change5', name: "Chang'e 5", agency: 'CNSA', date: '2020-12-01', kind: 'sample-return', lat: 43.06, lon: -51.92, summary: 'Returned 1.7 kg of the youngest lunar basalt yet sampled.' },
      { id: 'chandrayaan3', name: 'Chandrayaan-3 · Vikram', agency: 'ISRO', date: '2023-08-23', kind: 'landing', lat: -69.37, lon: 32.35, summary: 'First landing near the lunar south pole, where the water ice is.' },
      { id: 'change6', name: "Chang'e 6", agency: 'CNSA', date: '2024-06-01', kind: 'sample-return', lat: -41.63, lon: -153.98, summary: 'First samples ever collected from the far side, out of the South Pole–Aitken basin.' }
    ],
    milestones: [
      { year: 1959, name: 'Luna 3', agency: 'USSR', kind: 'flyby', summary: 'Photographed the far side, which no one had ever seen.' },
      { year: 1968, name: 'Apollo 8', agency: 'NASA', kind: 'crewed', summary: 'First crew to leave Earth orbit and the first to see Earthrise.' },
      { year: 1969, name: 'Apollo 11', agency: 'NASA', kind: 'crewed', summary: 'First people on another world.' },
      { year: 1994, name: 'Clementine', agency: 'NASA · BMDO', kind: 'orbiter', summary: 'First global multispectral map, and the first hint of polar ice.' },
      { year: 2009, name: 'Lunar Reconnaissance Orbiter', agency: 'NASA', kind: 'orbiter', summary: 'Still mapping the surface at half a metre per pixel — every landing site included.' },
      { year: 2019, name: "Chang'e 4", agency: 'CNSA', kind: 'lander', summary: 'First landing on the far side.' },
      { year: 2024, name: "Chang'e 6", agency: 'CNSA', kind: 'sample', summary: 'First sample return from the far side.' }
    ]
  },

  mars: {
    sites: [
      { id: 'viking1', name: 'Viking 1', agency: 'NASA', date: '1976-07-20', kind: 'landing', lat: 22.27, lon: -47.95, summary: 'Chryse Planitia. First successful landing on Mars, and the first images from its surface.' },
      { id: 'viking2', name: 'Viking 2', agency: 'NASA', date: '1976-09-03', kind: 'landing', lat: 47.64, lon: 134.29, summary: 'Utopia Planitia. Ran biology experiments whose results are still argued over.' },
      { id: 'pathfinder', name: 'Mars Pathfinder · Sojourner', agency: 'NASA', date: '1997-07-04', kind: 'rover', lat: 19.13, lon: -33.25, summary: 'Bounced down on airbags and released the first rover on another planet.' },
      { id: 'spirit', name: 'Spirit', agency: 'NASA', date: '2004-01-04', kind: 'rover', lat: -14.57, lon: 175.47, summary: 'Gusev crater. Drove 7.7 km over six years against a 90-day design life.' },
      { id: 'opportunity', name: 'Opportunity', agency: 'NASA', date: '2004-01-25', kind: 'rover', lat: -1.95, lon: -5.53, summary: 'Meridiani Planum. Found evidence of standing water and drove 45 km in fifteen years.' },
      { id: 'phoenix', name: 'Phoenix', agency: 'NASA', date: '2008-05-25', kind: 'landing', lat: 68.22, lon: -125.75, summary: 'Dug into the arctic plain and touched water ice directly.' },
      { id: 'curiosity', name: 'Curiosity', agency: 'NASA', date: '2012-08-06', kind: 'rover', lat: -4.59, lon: 137.44, summary: 'Gale crater. Found an ancient freshwater lakebed and is still climbing Mount Sharp.' },
      { id: 'insight', name: 'InSight', agency: 'NASA', date: '2018-11-26', kind: 'landing', lat: 4.5, lon: 135.62, summary: 'Listened to marsquakes for four years and mapped the interior from them.' },
      { id: 'perseverance', name: 'Perseverance · Ingenuity', agency: 'NASA', date: '2021-02-18', kind: 'rover', lat: 18.44, lon: 77.45, summary: 'Jezero crater delta. Caching samples for return, and carried the first aircraft to fly on another world.' },
      { id: 'zhurong', name: 'Tianwen-1 · Zhurong', agency: 'CNSA', date: '2021-05-15', kind: 'rover', lat: 25.07, lon: 109.93, summary: 'Utopia Planitia. China’s first Mars landing, on its first attempt.' }
    ],
    milestones: [
      { year: 1965, name: 'Mariner 4', agency: 'NASA', kind: 'flyby', summary: 'Twenty-one photographs that replaced the canals with craters.' },
      { year: 1971, name: 'Mariner 9', agency: 'NASA', kind: 'orbiter', summary: 'First orbiter of another planet; arrived into a global dust storm and waited it out.' },
      { year: 1997, name: 'Mars Global Surveyor', agency: 'NASA', kind: 'orbiter', summary: 'Mapped the whole planet and found gullies cut by something that flowed.' },
      { year: 2001, name: 'Mars Odyssey', agency: 'NASA', kind: 'orbiter', summary: 'Still working, the longest-serving spacecraft at any other planet.' },
      { year: 2006, name: 'Mars Reconnaissance Orbiter', agency: 'NASA', kind: 'orbiter', summary: 'HiRISE resolves objects 30 cm across — including the rovers’ tracks.' },
      { year: 2014, name: 'MAVEN', agency: 'NASA', kind: 'orbiter', summary: 'Showed how the solar wind stripped away the atmosphere Mars used to have.' },
      { year: 2016, name: 'ExoMars Trace Gas Orbiter', agency: 'ESA · Roscosmos', kind: 'orbiter', summary: 'Hunting the methane that comes and goes in the Martian air.' },
      { year: 2021, name: 'Ingenuity', agency: 'NASA', kind: 'flyby', summary: 'Seventy-two flights in air a hundredth the density of ours.' }
    ]
  },

  jupiter: {
    sites: [],
    milestones: [
      { year: 1973, name: 'Pioneer 10', agency: 'NASA', kind: 'flyby', summary: 'First spacecraft to cross the asteroid belt and reach Jupiter.' },
      { year: 1979, name: 'Voyager 1 & 2', agency: 'NASA', kind: 'flyby', summary: 'Found the rings, the volcanoes of Io, and the cracked ice of Europa.' },
      { year: 1995, name: 'Galileo', agency: 'NASA', kind: 'orbiter', summary: 'Eight years in orbit, and a probe dropped 150 km into the clouds before it failed.' },
      { year: 2007, name: 'New Horizons', agency: 'NASA', kind: 'flyby', summary: 'Used Jupiter for a gravity assist to Pluto, and photographed it on the way past.' },
      { year: 2016, name: 'Juno', agency: 'NASA', kind: 'orbiter', summary: 'Polar orbits through the radiation belts, mapping the gravity field and the deep atmosphere.' },
      { year: 2023, name: 'JUICE', agency: 'ESA', kind: 'planned', summary: 'On its way to study Ganymede, Callisto and Europa; arrives 2031.' },
      { year: 2024, name: 'Europa Clipper', agency: 'NASA', kind: 'planned', summary: 'Launched towards a moon-by-moon survey of Europa’s ice; arrives 2030.' }
    ]
  },

  saturn: {
    sites: [],
    milestones: [
      { year: 1979, name: 'Pioneer 11', agency: 'NASA', kind: 'flyby', summary: 'First visit, and the discovery of the F ring.' },
      { year: 1980, name: 'Voyager 1', agency: 'NASA', kind: 'flyby', summary: 'Turned aside from the outer planets to fly past Titan, and left the ecliptic doing it.' },
      { year: 2004, name: 'Cassini', agency: 'NASA · ESA · ASI', kind: 'orbiter', summary: 'Thirteen years in orbit: the ring structure, the geysers of Enceladus, the lakes of Titan.' },
      { year: 2005, name: 'Huygens', agency: 'ESA', kind: 'lander', summary: 'Landed on Titan — the most distant landing ever made.' },
      { year: 2017, name: 'Cassini Grand Finale', agency: 'NASA', kind: 'impact', summary: 'Twenty-two passes between the planet and its rings, then a deliberate burn-up to protect the moons.' }
    ]
  },

  uranus: {
    sites: [],
    milestones: [
      { year: 1986, name: 'Voyager 2', agency: 'NASA', kind: 'flyby', summary: 'The only visit ever made. Found ten new moons, and a magnetic field tipped 59° from the axis.' }
    ]
  },

  neptune: {
    sites: [],
    milestones: [
      { year: 1989, name: 'Voyager 2', agency: 'NASA', kind: 'flyby', summary: 'The only visit ever made. Found the Great Dark Spot, six moons, and the fastest winds in the solar system.' }
    ]
  },

  io: {
    sites: [],
    milestones: [
      { year: 1979, name: 'Voyager 1', agency: 'NASA', kind: 'flyby', summary: 'Caught a plume 300 km high — the first active volcano found beyond Earth.' },
      { year: 1999, name: 'Galileo', agency: 'NASA', kind: 'flyby', summary: 'Six close passes through the worst radiation environment in the solar system.' },
      { year: 2024, name: 'Juno', agency: 'NASA', kind: 'flyby', summary: 'Passed 1 500 km above the surface and imaged the lava lakes directly.' }
    ]
  },

  europa: {
    sites: [],
    milestones: [
      { year: 1979, name: 'Voyager 2', agency: 'NASA', kind: 'flyby', summary: 'Showed a surface of ice cracked into linea, with almost no craters — therefore young.' },
      { year: 1996, name: 'Galileo', agency: 'NASA', kind: 'flyby', summary: 'Magnetic measurements pointed to a salty ocean beneath the shell.' },
      { year: 2022, name: 'Juno', agency: 'NASA', kind: 'flyby', summary: 'Closest images in 22 years, from 352 km up.' },
      { year: 2030, name: 'Europa Clipper', agency: 'NASA', kind: 'planned', summary: 'Around fifty flybys to measure the ice thickness and sample any plumes.' }
    ]
  },

  ganymede: {
    sites: [],
    milestones: [
      { year: 1979, name: 'Voyager 1 & 2', agency: 'NASA', kind: 'flyby', summary: 'Revealed the grooved terrain covering half the surface.' },
      { year: 1996, name: 'Galileo', agency: 'NASA', kind: 'flyby', summary: 'Found a magnetic field of its own — the only moon known to have one.' },
      { year: 2021, name: 'Juno', agency: 'NASA', kind: 'flyby', summary: 'First close look in twenty years, from 1 038 km.' },
      { year: 2034, name: 'JUICE', agency: 'ESA', kind: 'planned', summary: 'Will enter orbit around it: the first spacecraft ever to orbit a moon other than ours.' }
    ]
  },

  callisto: {
    sites: [],
    milestones: [
      { year: 1979, name: 'Voyager 1 & 2', agency: 'NASA', kind: 'flyby', summary: 'Showed a surface saturated with craters — nothing has resurfaced it in four billion years.' },
      { year: 1996, name: 'Galileo', agency: 'NASA', kind: 'flyby', summary: 'Eight flybys; the magnetic response suggests a deep salty ocean here too.' }
    ]
  },

  titan: {
    sites: [
      { id: 'huygens', name: 'Huygens', agency: 'ESA', date: '2005-01-14', kind: 'landing', lat: -10.3, lon: -167.7, summary: 'Descended for 2h27m through the haze and kept transmitting from the ground. The most distant landing ever made.' }
    ],
    milestones: [
      { year: 1980, name: 'Voyager 1', agency: 'NASA', kind: 'flyby', summary: 'Flew close enough to prove the atmosphere was thick nitrogen — and opaque.' },
      { year: 2004, name: 'Cassini', agency: 'NASA', kind: 'orbiter', summary: 'Radar cut through the haze and found dunes, rivers and lakes of liquid methane.' },
      { year: 2005, name: 'Huygens', agency: 'ESA', kind: 'lander', summary: 'Landed on a damp plain of water ice pebbles.' },
      { year: 2028, name: 'Dragonfly', agency: 'NASA', kind: 'planned', summary: 'A nuclear-powered rotorcraft that will fly between sites across the surface.' }
    ]
  },

  phobos: {
    sites: [],
    milestones: [
      { year: 1971, name: 'Mariner 9', agency: 'NASA', kind: 'flyby', summary: 'First close images; showed it as a battered, irregular rock rather than a sphere.' },
      { year: 1989, name: 'Phobos 2', agency: 'USSR', kind: 'orbiter', summary: 'Returned data for two months, then went silent days before releasing its landers.' },
      { year: 2026, name: 'MMX', agency: 'JAXA', kind: 'planned', summary: 'Will land, collect a sample, and bring it back to Earth.' }
    ]
  },

  deimos: {
    sites: [],
    milestones: [
      { year: 1971, name: 'Mariner 9', agency: 'NASA', kind: 'flyby', summary: 'First resolved images of the smaller Martian moon.' },
      { year: 1977, name: 'Viking 2', agency: 'NASA', kind: 'flyby', summary: 'Passed within 30 km, close enough to resolve boulders.' },
      { year: 2023, name: 'Hope', agency: 'UAE Space Agency', kind: 'flyby', summary: 'Imaged the far side of Deimos, which had barely been seen.' }
    ]
  },

  triton: {
    sites: [],
    milestones: [
      { year: 1989, name: 'Voyager 2', agency: 'NASA', kind: 'flyby', summary: 'The only visit. Found nitrogen geysers erupting from a surface at −235 °C.' }
    ]
  }
};

export function getExploration(id: BodyId): ExplorationRecord | undefined {
  return EXPLORATION[id];
}
