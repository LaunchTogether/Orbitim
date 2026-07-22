/**
 * The bright stars, and the figures drawn between them.
 *
 * Positions are J2000 right ascension and declination, rounded to the arcminute
 * — the catalogue precision a naked-eye sky needs and no more. Magnitudes are
 * apparent visual. Colours are the conventional rendering of each star's
 * spectral class rather than a measured chromaticity: O and B stars blue-white,
 * A white, F yellow-white, G yellow, K orange, M red.
 *
 * The figures are the classical asterisms, not the IAU boundaries: what a person
 * standing outside actually joins up.
 */

export interface CatalogStar {
  id: string;
  name: string;
  /** Right ascension, hours. */
  ra: number;
  /** Declination, degrees. */
  dec: number;
  /** Apparent visual magnitude. */
  magnitude: number;
  /** Spectral colour. */
  color: string;
}

export const BRIGHT_STARS: readonly CatalogStar[] = [
  { id: 'sirius', name: 'Sirius', ra: 6.752, dec: -16.716, magnitude: -1.46, color: '#cfe0ff' },
  { id: 'canopus', name: 'Canopus', ra: 6.399, dec: -52.696, magnitude: -0.74, color: '#fdf6ec' },
  { id: 'arcturus', name: 'Arcturus', ra: 14.261, dec: 19.182, magnitude: -0.05, color: '#ffcf9a' },
  { id: 'vega', name: 'Vega', ra: 18.615, dec: 38.784, magnitude: 0.03, color: '#dbe6ff' },
  { id: 'capella', name: 'Capella', ra: 5.278, dec: 45.998, magnitude: 0.08, color: '#ffedc4' },
  { id: 'rigel', name: 'Rigel', ra: 5.242, dec: -8.202, magnitude: 0.13, color: '#c8daff' },
  { id: 'procyon', name: 'Procyon', ra: 7.655, dec: 5.225, magnitude: 0.34, color: '#fbf3e2' },
  { id: 'achernar', name: 'Achernar', ra: 1.629, dec: -57.237, magnitude: 0.46, color: '#c6d9ff' },
  { id: 'betelgeuse', name: 'Betelgeuse', ra: 5.919, dec: 7.407, magnitude: 0.5, color: '#ff9c66' },
  { id: 'hadar', name: 'Hadar', ra: 14.064, dec: -60.373, magnitude: 0.61, color: '#c8daff' },
  { id: 'altair', name: 'Altair', ra: 19.846, dec: 8.868, magnitude: 0.77, color: '#f2f4ff' },
  { id: 'acrux', name: 'Acrux', ra: 12.443, dec: -63.099, magnitude: 0.77, color: '#c6d8ff' },
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.599, dec: 16.509, magnitude: 0.85, color: '#ffb27a' },
  { id: 'antares', name: 'Antares', ra: 16.49, dec: -26.432, magnitude: 1.09, color: '#ff8e5c' },
  { id: 'spica', name: 'Spica', ra: 13.42, dec: -11.161, magnitude: 1.04, color: '#c3d6ff' },
  { id: 'pollux', name: 'Pollux', ra: 7.755, dec: 28.026, magnitude: 1.14, color: '#ffce93' },
  { id: 'fomalhaut', name: 'Fomalhaut', ra: 22.961, dec: -29.622, magnitude: 1.16, color: '#eef2ff' },
  { id: 'deneb', name: 'Deneb', ra: 20.69, dec: 45.28, magnitude: 1.25, color: '#eaf0ff' },
  { id: 'mimosa', name: 'Mimosa', ra: 12.795, dec: -59.689, magnitude: 1.25, color: '#c6d8ff' },
  { id: 'regulus', name: 'Regulus', ra: 10.139, dec: 11.967, magnitude: 1.35, color: '#d3e1ff' },
  { id: 'castor', name: 'Castor', ra: 7.577, dec: 31.888, magnitude: 1.58, color: '#eef2ff' },
  { id: 'gacrux', name: 'Gacrux', ra: 12.519, dec: -57.113, magnitude: 1.63, color: '#ff9f6e' },
  { id: 'shaula', name: 'Shaula', ra: 17.56, dec: -37.104, magnitude: 1.62, color: '#c9dbff' },
  { id: 'bellatrix', name: 'Bellatrix', ra: 5.418, dec: 6.35, magnitude: 1.64, color: '#c9dbff' },
  { id: 'elnath', name: 'Elnath', ra: 5.438, dec: 28.608, magnitude: 1.65, color: '#dfe8ff' },
  { id: 'alnilam', name: 'Alnilam', ra: 5.604, dec: -1.202, magnitude: 1.69, color: '#c4d8ff' },
  { id: 'alnitak', name: 'Alnitak', ra: 5.679, dec: -1.943, magnitude: 1.77, color: '#c4d8ff' },
  { id: 'alioth', name: 'Alioth', ra: 12.9, dec: 55.96, magnitude: 1.77, color: '#f0f3ff' },
  { id: 'dubhe', name: 'Dubhe', ra: 11.062, dec: 61.751, magnitude: 1.79, color: '#ffd9a8' },
  { id: 'mirfak', name: 'Mirfak', ra: 3.405, dec: 49.861, magnitude: 1.79, color: '#fdf3d9' },
  { id: 'alkaid', name: 'Alkaid', ra: 13.792, dec: 49.313, magnitude: 1.86, color: '#dfe9ff' },
  { id: 'sadr', name: 'Sadr', ra: 20.37, dec: 40.257, magnitude: 2.23, color: '#fdf0d5' },
  { id: 'schedar', name: 'Schedar', ra: 0.675, dec: 56.537, magnitude: 2.24, color: '#ffcb92' },
  { id: 'mintaka', name: 'Mintaka', ra: 5.533, dec: -0.299, magnitude: 2.25, color: '#c4d8ff' },
  { id: 'caph', name: 'Caph', ra: 0.153, dec: 59.15, magnitude: 2.28, color: '#fdf5e4' },
  { id: 'saiph', name: 'Saiph', ra: 5.796, dec: -9.67, magnitude: 2.09, color: '#c4d8ff' },
  { id: 'mizar', name: 'Mizar', ra: 13.399, dec: 54.925, magnitude: 2.23, color: '#eef2ff' },
  { id: 'merak', name: 'Merak', ra: 11.031, dec: 56.383, magnitude: 2.37, color: '#eef2ff' },
  { id: 'phecda', name: 'Phecda', ra: 11.897, dec: 53.695, magnitude: 2.44, color: '#eef2ff' },
  { id: 'polaris', name: 'Polaris', ra: 2.53, dec: 89.264, magnitude: 1.98, color: '#fdf1d8' },
  { id: 'gammaCas', name: 'Gamma Cassiopeiae', ra: 0.945, dec: 60.717, magnitude: 2.47, color: '#cfe0ff' },
  { id: 'ruchbah', name: 'Ruchbah', ra: 1.43, dec: 60.235, magnitude: 2.68, color: '#f4f6ff' },
  { id: 'segin', name: 'Segin', ra: 1.907, dec: 63.67, magnitude: 3.35, color: '#cfe0ff' },
  { id: 'deltaCru', name: 'Delta Crucis', ra: 12.252, dec: -58.749, magnitude: 2.79, color: '#c6d8ff' },
  { id: 'megrez', name: 'Megrez', ra: 12.257, dec: 57.033, magnitude: 3.31, color: '#f0f3ff' },
  { id: 'albireo', name: 'Albireo', ra: 19.512, dec: 27.96, magnitude: 3.18, color: '#ffcb8f' },
  { id: 'gienah', name: 'Gienah Cygni', ra: 20.77, dec: 33.97, magnitude: 2.48, color: '#ffc98d' },
  { id: 'deltaCyg', name: 'Delta Cygni', ra: 19.749, dec: 45.131, magnitude: 2.87, color: '#dfe9ff' },
  { id: 'denebola', name: 'Denebola', ra: 11.818, dec: 14.572, magnitude: 2.11, color: '#f2f4ff' },
  { id: 'algieba', name: 'Algieba', ra: 10.333, dec: 19.841, magnitude: 2.08, color: '#ffcb92' }
];

export interface Constellation {
  name: string;
  /** Pairs of star ids joined by a line of the figure. */
  lines: readonly (readonly [string, string])[];
}

export const CONSTELLATIONS: readonly Constellation[] = [
  {
    name: 'Orion',
    lines: [
      ['betelgeuse', 'bellatrix'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'betelgeuse'],
      ['mintaka', 'rigel'],
      ['alnitak', 'saiph'],
      ['rigel', 'saiph']
    ]
  },
  {
    name: 'Ursa Major',
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid']
    ]
  },
  {
    name: 'Cassiopeia',
    lines: [
      ['segin', 'ruchbah'],
      ['ruchbah', 'gammaCas'],
      ['gammaCas', 'schedar'],
      ['schedar', 'caph']
    ]
  },
  {
    name: 'Crux',
    lines: [
      ['acrux', 'gacrux'],
      ['mimosa', 'deltaCru']
    ]
  },
  {
    name: 'Cygnus',
    lines: [
      ['deneb', 'sadr'],
      ['sadr', 'albireo'],
      ['gienah', 'sadr'],
      ['sadr', 'deltaCyg']
    ]
  },
  {
    name: 'Leo',
    lines: [
      ['regulus', 'algieba'],
      ['algieba', 'denebola']
    ]
  }
];

/**
 * North galactic pole, J2000. Used to thicken the star field towards the plane
 * of the galaxy, which is where the stars actually are.
 */
export const NORTH_GALACTIC_POLE = { ra: 12.857, dec: 27.128 };
