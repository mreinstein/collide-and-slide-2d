import Contact         from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/contact.js'
import assert          from './_assert.js'
import collideAndSlide from '../collide-and-slide-2d.js'
import { vec2 }        from 'https://cdn.skypack.dev/pin/gl-matrix@v3.4.3-OSmwlRYK5GW1unkuAQkN/mode=imports,min/optimized/gl-matrix.js'


// TODO
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


console.log('collision:', collision)

if (collision) {
	console.log('contact:', contact)
	console.log('out:', out)
}

/*
assert.equal(collision, true)
assert.deepEqual(contact.position, [ , ])
*/