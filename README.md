# collide-and-slide-2d
slide an ellipse/sphere along a series of line segments in 2d

## why?

Lately I've been making some 2d platformers in javascript, and while there are practically endless resources for tile-based games, there is very little high quality material for collision detection and response between spheres/ellipsoids and 2d line segments. Allow me to qualify "high quality":
* handles sliding along planes
* provides robust contact details on collisions
* **does not leak memory**
* easy to understand
* tiny (200 lines of code not including modules)
* is data-oriented
* is purely functional
* consistent vector/matrix/line representation
* is a pure es module

So here we are.


## usage

This API may seem very odd at first glance, there are many arguments to this function.

Three in particular are worth explaining a little more:
* `lines` is an array of actual line segments. Each item in this array is 1 line. A line is simply an array with 2 `vec2` items in it (each one is an end point on the line segment)
* `indices` is a list of indexes into the `lines` array to actually use when handling collisions. For example, if `indices` is `[ 2, 7 ]` that means `lines[2]` and `lines[7]` will actually be used when calculating the collisions.
* `lineCount` is the number of entries to use in the `indices` array. For example, if `indices === [ 2, 7, 19, 36 ]` and `lineCount === 3` then only the first 3 items from `indices` will be used in calculating the collisions.


**This API may seem clunky, but it's an intentional design decision because it means you can perform collisions in a tight simulation/game loop with purely preallocated memory.**



```javascript
import collideAndSlide from 'https://cdn.jsdelivr.net/gh/mreinstein/collide-and-slide-2d/collide-and-slide.js'
import * as vec2       from 'https://cdn.jsdelivr.net/npm/gl-matrix@3/esm/vec2.js'


const lines = [
	// line segment 0
	[
		[ 0, 300], [ 100, 300 ]
	],

	// line segment 1
	[
		[ 100, 300 ], [ 120, 200 ]
	]
]

// contains the index into the lines array which indicates which lines to include when colliding
const indices = [
	0, // refers to line segment 0
	1  // refers to line segment 1
]

const lineCount = 2 // how many items in the indices array to include when colliding

const out = vec2.create()


const position = vec2.fromValues(50, 200) // current position of ellipsoid
const ellipsoidRadius = [ 5, 10 ]         // the width and height radius of the ellipsoid
const moveVel = vec2.fromValues(10, 0)    // the horizontal movement velocity is 10 right
const gravityVel = vec2.fromValues(0, 6)  // the vertical (gravity) velocity is 6 down
const contact = contact()                 // where the collision info is stored

// returns a boolean indicating if any collision happend or not
const collided = collideAndSlide(
    out,
    lines,
    indices,
    lineCount,
    position,
    ellipsoidRadius,
    moveVel,
    gravityVel,
    contact
)

if (collided)
	console.log('collision occurred. contact details:', contact)

// if no collision the entity is moved the full distance specified by gravity and move velocities.
// if collision, it will move and slide along any lines included in the lines list.
// either way, "out" will have this updated position.
console.log('new position:', out)

```


## credits

This code is a re-implementation of Kasper Fauerby's incredible work: http://www.peroxide.dk/papers/collision/collision.pdf

