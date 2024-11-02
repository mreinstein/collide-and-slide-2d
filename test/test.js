import assert          from './_assert.js'
import collideAndSlide from '../collide-and-slide-2d.js'
import { contact }     from '@footgun/collision-2d'


const lines = [
	[ [ 265, 417 ], [ 611, 161 ] ]
]

const indices = [ 0 ]

const lineCount = 1

const position = [ 404, 257 ]

const gravityVel = [ 0, 100]
const moveVel  = [ 100, 0 ]

const ellipsoid = [ 4, 7 ]

const c = contact()

const out = [0 , 0]

const collision = collideAndSlide(out, lines, indices, lineCount, position, ellipsoid, moveVel, gravityVel, c)

assert.equal(collision, true)
assert.deepEqual(out, [ 498.98931884765625,236.26009368896484 ])
assert.deepEqual(c.position, [ 125.13674926757812, 34.67463684082031 ])
assert.deepEqual(c.delta, [ 0,-14.28357982635498 ])
assert.deepEqual(c.normal, [ -0.3894166946411133, -0.9210616946220398 ])
assert.equal(c.time, 0.00014939633073836114)
