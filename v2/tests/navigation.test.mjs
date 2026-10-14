import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findWalkingPath,walkable} from '../src/game/navigation.ts';
test('resident paths go around buildings and roundabouts',()=>{
 const obstacles=[{x:0,z:0,r:4},{x:6,z:1,halfX:2,halfZ:5}];
 const path=findWalkingPath({x:-12,z:0},{x:12,z:0},obstacles);
 assert.ok(path.length>20);assert.equal(path.at(-1).x,12);
 for(let i=0;i<path.length;i++){
  assert.ok(walkable(path[i].x,path[i].z,obstacles,.5));
  if(i){const previous=path[i-1];for(let t=0;t<=1;t+=.1)assert.ok(walkable(previous.x+(path[i].x-previous.x)*t,previous.z+(path[i].z-previous.z)*t,obstacles,.5));}
 }
});
test('unreachable resident destinations return safely without an endless search',()=>{
 const walls=[{x:0,z:-2,halfX:2.5,halfZ:.2},{x:0,z:2,halfX:2.5,halfZ:.2},{x:-2,z:0,halfX:.2,halfZ:2.5},{x:2,z:0,halfX:.2,halfZ:2.5}];
 assert.deepEqual(findWalkingPath({x:0,z:0},{x:10,z:10},walls),[]);
});
test('all four destination parking points are safe for the rover capsule',()=>{
 const obstacles=[{x:-16,z:11.45,halfX:4.05,halfZ:3.05},{x:14,z:-15,r:3.65},{x:-15,z:-14,halfX:1.95,halfZ:1.65},...Array.from({length:4},(_,i)=>({x:15+(i-1.5)*3,z:10.6,halfX:1.4,halfZ:.28}))];
 for(const d of [{x:-16,z:17.4},{x:15,z:16.4},{x:14,z:-9.6},{x:-15,z:-8.6}])for(const offset of [-.7,0,.7])assert.ok(walkable(d.x,d.z+offset,obstacles,.98));
});
