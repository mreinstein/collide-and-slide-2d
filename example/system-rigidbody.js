import ECS                                     from 'ecs'
import Global                                  from './Global.js'
import Input                                   from './Input.js'
import * as Vec2Gap                            from '@footgun/vec2-gap'
import clamp                                   from 'clamp'
import collideAndSlide                         from '@footgun/collide-and-slide-2d'
import { aabbSegOverlap, contact, segsEllipsoidSweep1Indexed, segNormal } from '@footgun/collision-2d'
import { vec2 }                                from 'wgpu-matrix'



const MOVER_QUERY = [ 'mover', 'rigidBody' ]
const SLOPE_FORCE = 20             // gravity multiplier when on a slope

// temporary data to avoid garbage collection
const segmentIndices = new Uint16Array(34)
const tmpContact = contact()
const delta = vec2.create()
const _delta = vec2.create()
const closestPosition = vec2.create()
const moveVelocity = vec2.create()
const gravityVelocity = vec2.create()
const eSpacePosition = vec2.create()
const eSpaceVelocity = vec2.create()
const dF = vec2.create()
const V = vec2.create()

// this is very dumb; usually what we'd want is a broadphase that culls out
// line segments too far away from the mover so we run the collide-and-slide on
// less lines. Since this is a demo example with only 34 lines in the whole
// test map, just pass in all the line segments each time.
const segmentCount = 34
for (let i=0; i < segmentCount; i++)
	segmentIndices[i] = i


export default function rigidBodySystem (world) {

	const onFixedUpdate = function (dt) {
		dt = dt / 1000 // convert dt from ms to seconds

		for (const entity of ECS.getEntities(world, MOVER_QUERY)) {
			
			entity.rigidBody.velocity[1] = stepY(entity, dt)
		    entity.rigidBody.velocity[0] = stepX(entity, dt)

		    vec2.scale(entity.rigidBody.velocity, dt, delta)

		    vec2.set(delta[0], 0, moveVelocity)
		    vec2.set(0, delta[1], gravityVelocity)

		    const cc = collideAndSlide(
		        closestPosition,
		        Global.segs,
		        segmentIndices,
		        segmentCount,

		        entity.transform.position,
		        entity.rigidBody.ellipsoidRadius,
		        moveVelocity,
		        gravityVelocity,
		        tmpContact
		    )

		    const wasOnFloor = entity.rigidBody.floorSegmentIdx > -1
	        entity.rigidBody.floorSegmentIdx = -1
	        
	        // apply more gravity when on a slope, to prevent bouncing off the slope
	        // https://www.youtube.com/watch?v=b7bmNDdYPzU
	        if (isOnSlope(entity, Global.segs)) {
	            vec2.set(0, entity.rigidBody.velocity[1] * SLOPE_FORCE, gravityVelocity)

	            // convert position and movement velocity from R3 to ellipsoid space
	            vec2.divide(closestPosition, entity.rigidBody.ellipsoidRadius, eSpacePosition)
	            vec2.divide(gravityVelocity, entity.rigidBody.ellipsoidRadius, eSpaceVelocity)

	            if (segsEllipsoidSweep1Indexed(
	                Global.segs,
	                segmentIndices,
	                segmentCount,
	                eSpacePosition,
	                entity.rigidBody.ellipsoidRadius,
	                eSpaceVelocity,
	                tmpContact)) {

	                // only update if we are not already very close and if so, we only
	                // move very close to the intersection, not the exact spot.
	                const movementDistance = vec2.length(eSpaceVelocity) * tmpContact.time
	                const VERY_CLOSE_DISTANCE = 0.005
	                if (movementDistance >= VERY_CLOSE_DISTANCE) {
	                    Vec2Gap.setLength(V, eSpaceVelocity, movementDistance - VERY_CLOSE_DISTANCE)
	                    vec2.add(eSpacePosition, V, eSpacePosition)

	                    // convert final result back from ellipsoid space back to R3:
	                    vec2.multiply(eSpacePosition, entity.rigidBody.ellipsoidRadius, closestPosition)
	                }
	            }

	            entity.rigidBody.floorSegmentIdx = tmpContact.collider
	        
	        } else {
	            // not on a slope, check if we're on the ground
	            vec2.set(0, 2, dF)
	            entity.rigidBody.floorSegmentIdx = getSlopeSegmentIndex(entity.transform.position,
	                                                                    entity.rigidBody.ellipsoidRadius,
	                                                                    Global.segs,
	                                                                    segmentIndices,
	                                                                    segmentCount,
	                                                                    dF)
	        }

	        vec2.copy(closestPosition, entity.transform.position)

            vec2.set(0, -2, dF)

            if (entity.rigidBody.floorSegmentIdx > -1) {
                
                // when the character is on the ground and falling, reset y velocity to 0
                // so that when we begin falling again (walking off a ledge, falling through platform)
                // we aren't immediately falling at max dy
                if (entity.rigidBody.velocity[1] > 0)
                    entity.rigidBody.velocity[1] = 0

            } else if (getSlopeSegmentIndex(entity.transform.position,
                                            entity.rigidBody.ellipsoidRadius,
                                            Global.segs,
                                            segmentIndices,
                                            segmentCount,
                                            dF) >= 0) {
                // hit head
                if (entity.rigidBody.velocity[1] < 0)
                     entity.rigidBody.velocity[1] = 0
            }

		}
	}

	return { onFixedUpdate }
}



// update entity's y velocity
// @param float dt seconds elapsed
function stepY (entity, dt) {
    let dy = entity.rigidBody.velocity[1]

    const isOnFloor = entity.rigidBody.floorSegmentIdx > -1

    const downJump = Input.down('jump')
    const heldJump = Input.held('jump')

    if (downJump && isOnFloor)
        dy = entity.rigidBody.jumpV0

    // use the low jump gravity when the jump key isn't held down during jump rise phase
    const isRising = !isOnFloor && (dy < 0)
    const jumpMultiplier = (isRising && !heldJump) ? entity.rigidBody.jumpMultiplier : 1

    // increase the gravity during the falling phase of the jump
    const isFalling = !isOnFloor && (dy > 0)
    const fallMultiplier = isFalling ? entity.rigidBody.fallMultiplier : 1

    const ddy = entity.rigidBody.gravity * jumpMultiplier * fallMultiplier

    return dy + ddy * dt
}


// update entity's x velocity
// @param float dt seconds elapsed
function stepX (entity, dt) {
    
    const wasleft = entity.rigidBody.velocity[0] < 0
    const wasright = entity.rigidBody.velocity[0] > 0

    const friction = entity.rigidBody.friction
    const isFalling = entity.rigidBody.velocity[1] > 0
    const accel = (isFalling ? 0.5 : 1) * entity.rigidBody.accel
    let ddx = 0
    let dx = entity.rigidBody.velocity[0]

    const heldLeft = Input.held('left')
    const heldRight = Input.held('right')

    if (heldLeft)
        ddx = ddx - accel
    else if (wasleft)
        ddx = ddx + friction

    if (heldRight)
        ddx = ddx + accel
    else if (wasright)
        ddx = ddx - friction

    dx = clamp(dx + ddx * dt, -entity.rigidBody.maxdx, entity.rigidBody.maxdx)

    // clamp at zero to prevent friction from making us jiggle side to side
    if ((wasleft && dx > 0) || (wasright && dx < 0))
        return 0

    return dx
}


function isOnSlope (entity, segments) {
	if (entity.rigidBody.velocity[1] <= 0)
        return false // if vel[1] is not positive, the entity is jumping and not walking a slope

    // check a sensor box placed under the hero
    
    const position = vec2.clone(entity.transform.position)
    position[1] += entity.rigidBody.ellipsoidRadius[1]
   
    const sensorAABB = { position, width: 3, height: 4 }
    const overlapSegIdx = aabbOverlaps(segments, sensorAABB)

    if (overlapSegIdx >= 0) {

    	const normal = [ 0, 0 ]
    	const seg = segments[overlapSegIdx]
        segNormal(normal, seg[0], seg[1])

        return (Math.abs(normal[1]) < 0.99)  // horizontally flat lines aren't slopes
    }

    return false
}


function aabbOverlaps (segments, aabb) {

	const paddingX = 0
	const paddingY = 0
    for (let segIdx = 0; segIdx < segments.length; segIdx++) {
    	const seg = segments[segIdx]
        vec2.subtract(seg[1], seg[0], _delta)
        if (aabbSegOverlap(aabb, seg[0], _delta, paddingX, paddingY))
            return segIdx
    }

    return -1
}


/**
 * move an ellipsoid by delta, and find the closest hitting line segment
 * 
 * @return int index of the segment index on hit, or -1 if not hit
*/
function getSlopeSegmentIndex (position, ellipsoidRadius, segments, segmentIndices, segmentCount, delta) {
    // convert position and movement velocity from R3 to ellipsoid space
    vec2.divide(position, ellipsoidRadius, eSpacePosition)
    vec2.divide(delta, ellipsoidRadius, eSpaceVelocity)

    const hit = segsEllipsoidSweep1Indexed(
        segments,
        segmentIndices,
        segmentCount,
        eSpacePosition,
        ellipsoidRadius,
        eSpaceVelocity,
        tmpContact
    )
   
    return hit ? tmpContact.collider : -1
}
