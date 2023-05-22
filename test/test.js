import Contact         from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/contact.js'
import assert          from './_assert.js'
import collideAndSlide from '../collide-and-slide-2d.js'
import { vec2 }        from 'https://cdn.skypack.dev/pin/gl-matrix@v3.4.3-OSmwlRYK5GW1unkuAQkN/mode=imports,min/optimized/gl-matrix.js'


const lines = [
	[ [ 265, 417 ], [ 611, 161 ] ]
]

const indices = [ 0 ]

const lineCount = 1

const position = [ 404, 257 ]

const gravityVel = [ 0, 100]
const moveVel  = [ 100, 0 ]

const ellipsoid = [ 4, 7 ]

const contact = Contact()

const out = [0 , 0]

const collision = collideAndSlide(out, lines, indices, lineCount, position, ellipsoid, moveVel, gravityVel, contact)

assert.equal(collision, true)
assert.deepEqual(out, [ 498.9893493652344, 236.26020050048828 ])
assert.deepEqual(contact.position, [ 125.13674926757812, 34.67463684082031 ])
assert.deepEqual(contact.delta, [ -0, -14.283598400450344 ])
assert.deepEqual(contact.normal, [ -0.3894166946411133, -0.9210616946220398 ])
assert.equal(contact.time, 0.00014810243314507084)
