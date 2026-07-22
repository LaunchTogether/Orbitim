import { getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { getTextureSet } from '../lib/textures/registry';
import { ATMOSPHERES } from '../scene/Atmosphere';

interface BodyDiscProps {
  id: BodyId;
  /** Tailwind size classes for the disc, e.g. `h-14 w-14`. */
  className?: string;
}

/**
 * A body drawn as a small lit disc: its albedo cropped to a circle, a shading
 * overlay standing in for the terminator, and a soft envelope in the body's own
 * atmosphere colour. A world with no published map falls back to its registry
 * colour rather than an empty hole.
 *
 * Pure CSS, no WebGL — it is a chip for the dossier header, not a second render
 * of the sphere already on screen.
 */
export function BodyDisc({ id, className }: BodyDiscProps) {
  const record = getBodyRecord(id);
  const textureUrl = getTextureSet(id)?.map.far ?? null;
  const glow = ATMOSPHERES[id]?.color ?? record.color;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${className ?? ''}`}
      style={{ boxShadow: `0 0 28px -6px ${glow}`, backgroundColor: record.color }}
    >
      {textureUrl && (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${textureUrl})` }}
          aria-hidden
        />
      )}
      {/* Fake sphere: a highlight upper-left falling to a shadowed limb. */}
      <span
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0) 42%), radial-gradient(circle at 70% 74%, rgba(0,0,0,0.72), rgba(0,0,0,0) 60%)'
        }}
        aria-hidden
      />
      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" aria-hidden />
    </div>
  );
}
