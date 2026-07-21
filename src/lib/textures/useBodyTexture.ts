import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { getTextureSet } from './registry';
import type { BodyId } from '../ephemeris/bodies';
import type { Lod } from './registry';

const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

function load(url: string, colorSpace: THREE.ColorSpace): Promise<THREE.Texture> {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = colorSpace;
        texture.anisotropy = 8;
        cache.set(url, texture);
        resolve(texture);
      },
      undefined,
      () => reject(new Error(`Texture failed to load: ${url}`))
    );
  });
}

export interface BodyTextures {
  map: THREE.Texture | null;
  emissiveMap: THREE.Texture | null;
  cloudMap: THREE.Texture | null;
  ringMap: THREE.Texture | null;
  /** Highest level of detail currently resident. */
  resolvedLod: Lod | null;
}

const EMPTY: BodyTextures = { map: null, emissiveMap: null, cloudMap: null, ringMap: null, resolvedLod: null };

/**
 * Loads a body's textures at the requested level of detail. The far level is
 * resolved first so a body is never blank, then the near level replaces it once
 * it arrives. Loads for an unmounted body resolve into nothing.
 */
export function useBodyTexture(id: BodyId, lod: Lod): BodyTextures {
  const [textures, setTextures] = useState<BodyTextures>(EMPTY);

  useEffect(() => {
    const set = getTextureSet(id);
    if (!set) {
      setTextures(EMPTY);
      return;
    }
    let cancelled = false;

    const apply = (level: Lod) =>
      Promise.all([
        load(set.map[level], THREE.SRGBColorSpace),
        set.emissiveMap ? load(set.emissiveMap[level], THREE.SRGBColorSpace) : Promise.resolve(null),
        set.cloudMap && level === 'near' ? load(set.cloudMap, THREE.SRGBColorSpace) : Promise.resolve(null),
        set.ringMap ? load(set.ringMap, THREE.SRGBColorSpace) : Promise.resolve(null)
      ]).then(([map, emissiveMap, cloudMap, ringMap]) => {
        if (cancelled) return;
        setTextures((prev) => ({
          map,
          emissiveMap,
          cloudMap: cloudMap ?? prev.cloudMap,
          ringMap,
          resolvedLod: level
        }));
      });

    apply('far')
      .then(() => (lod === 'near' && !cancelled ? apply('near') : undefined))
      .catch((error) => {
        if (!cancelled) console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [id, lod]);

  return textures;
}
