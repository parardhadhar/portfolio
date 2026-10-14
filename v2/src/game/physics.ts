export type Collider = { x: number; z: number; r: number } | { x: number; z: number; halfX: number; halfZ: number };
export interface RoverPose { x: number; z: number; angle: number }
export const ROVER_RADIUS = .98;
const OFFSETS = [-.7, 0, .7];
const LIMIT = 43.1;

// A three-disc capsule covers the bumper and wheel width. Short translation and
// rotation steps prevent crossing thin obstacles between rendered frames.
export function moveRover(pose: RoverPose, distance: number, targetAngle: number, colliders: readonly Collider[]) {
  let x = pose.x, z = pose.z, angle = pose.angle, impact = 0;
  const steps = Math.max(1, Math.ceil(Math.abs(distance) / .18), Math.ceil(Math.abs(targetAngle - angle) / .05));
  const da = (targetAngle - angle) / steps;
  for (let step = 0; step < steps; step++) {
    angle += da;
    const directionX = Math.sin(angle), directionZ = Math.cos(angle);
    x += directionX * distance / steps;
    z += directionZ * distance / steps;
    for (let iteration = 0; iteration < 8; iteration++) {
      let corrected = false;
      for (const offset of OFFSETS) {
        let sx = x + directionX * offset, sz = z + directionZ * offset;
        for (const obstacle of colliders) {
          let dx: number, dz: number, penetration: number;
          if ('r' in obstacle) {
            dx = sx - obstacle.x; dz = sz - obstacle.z;
            const length = Math.hypot(dx, dz);
            penetration = obstacle.r + ROVER_RADIUS - length;
            if (penetration <= .00001) continue;
            if (length < 1e-7) { dx = -directionX; dz = -directionZ; }
            else { dx /= length; dz /= length; }
          } else {
            const cx = Math.max(obstacle.x - obstacle.halfX, Math.min(sx, obstacle.x + obstacle.halfX));
            const cz = Math.max(obstacle.z - obstacle.halfZ, Math.min(sz, obstacle.z + obstacle.halfZ));
            dx = sx - cx; dz = sz - cz;
            const length = Math.hypot(dx, dz);
            if (length > 0) {
              penetration = ROVER_RADIUS - length;
              if (penetration <= .00001) continue;
              dx /= length; dz /= length;
            } else {
              const edges = [
                {d: sx - (obstacle.x - obstacle.halfX), x: -1, z: 0},
                {d: obstacle.x + obstacle.halfX - sx, x: 1, z: 0},
                {d: sz - (obstacle.z - obstacle.halfZ), x: 0, z: -1},
                {d: obstacle.z + obstacle.halfZ - sz, x: 0, z: 1},
              ].sort((a,b) => a.d-b.d);
              dx = edges[0].x; dz = edges[0].z; penetration = edges[0].d + ROVER_RADIUS;
            }
          }
          const push = penetration + .0001;
          x += dx * push; z += dz * push; sx += dx * push; sz += dz * push;
          impact = Math.max(impact, Math.max(0, -(directionX * dx + directionZ * dz) * Math.sign(distance)));
          corrected = true;
        }
        const radius = Math.hypot(sx, sz);
        if (radius > LIMIT - ROVER_RADIUS) {
          const nx = -sx / radius, nz = -sz / radius, push = radius - LIMIT + ROVER_RADIUS + .0001;
          x += nx * push; z += nz * push;
          impact = Math.max(impact, Math.max(0, -(directionX * nx + directionZ * nz) * Math.sign(distance)));
          corrected = true;
        }
      }
      if (!corrected) break;
    }
  }
  return {x, z, angle, impact};
}
