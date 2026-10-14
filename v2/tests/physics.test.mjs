import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moveRover, ROVER_RADIUS } from '../src/game/physics.ts';

function clear(pose, obstacles) {
  for (const offset of [-.7, 0, .7]) {
    const x=pose.x+Math.sin(pose.angle)*offset,z=pose.z+Math.cos(pose.angle)*offset;
    for(const o of obstacles) {
      const d='r' in o?Math.hypot(x-o.x,z-o.z)-o.r:Math.hypot(x-Math.max(o.x-o.halfX,Math.min(x,o.x+o.halfX)),z-Math.max(o.z-o.halfZ,Math.min(z,o.z+o.halfZ)));
      assert.ok(d>=ROVER_RADIUS-.003,`penetration: ${d} at ${x},${z}`);
    }
    assert.ok(Math.hypot(x,z)<=43.1-ROVER_RADIUS+.003);
  }
}
test('boost-sized and long movements cannot tunnel through a thin wall',()=>{
 const obstacles=[{x:0,z:0,halfX:6,halfZ:.08}];
 const pose=moveRover({x:0,z:-12,angle:0},25,0,obstacles);
 clear(pose,obstacles);assert.ok(pose.z<0);assert.ok(pose.impact>.9);
});
test('front bumper stops before a wall rather than allowing the center through',()=>{
 const obstacles=[{x:0,z:0,halfX:4,halfZ:1}];
 const pose=moveRover({x:0,z:-8,angle:0},7,0,obstacles);
 clear(pose,obstacles);assert.ok(pose.z < -2.6);
});
test('oblique contact slides along a building without entering it',()=>{
 const obstacles=[{x:0,z:0,halfX:3,halfZ:4}];
 let pose={x:-5,z:-5,angle:Math.PI/4};
 for(let i=0;i<80;i++) { pose=moveRover(pose,.15,Math.PI/4,obstacles);clear(pose,obstacles); }
 assert.ok(pose.z>0,'the rover should keep its tangent movement');
});
test('rover can reverse away from a collision',()=>{
 const obstacles=[{x:0,z:0,r:2}];
 const hit=moveRover({x:0,z:-7,angle:0},6,0,obstacles);
 const reverse=moveRover(hit,-3,0,obstacles);
 clear(reverse,obstacles);assert.ok(reverse.z<hit.z-2.9);
});
test('exact-center spawn overlap resolves to a finite safe point',()=>{
 const obstacles=[{x:0,z:0,r:3}];
 const pose=moveRover({x:0,z:0,angle:0},0,0,obstacles);
 assert.ok(Number.isFinite(pose.x)&&Number.isFinite(pose.z));clear(pose,obstacles);
});
test('island edge contains the entire rover at high speed',()=>{
 const pose=moveRover({x:0,z:40,angle:0},15,0,[]);clear(pose,[]);assert.ok(pose.z<42);
});
test('rotating beside a wall keeps the bumper outside',()=>{
 const obstacles=[{x:0,z:0,halfX:4,halfZ:1}];
 let pose={x:0,z:-2.1,angle:Math.PI/2};
 for(let i=0;i<25;i++){pose=moveRover(pose,0,Math.PI/2-(i+1)*Math.PI/50,obstacles);clear(pose,obstacles);}
});
