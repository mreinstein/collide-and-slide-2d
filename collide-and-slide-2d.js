import Pool           from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/pool.js'
import { vec2 }       from 'https://cdn.skypack.dev/pin/gl-matrix@v3.4.3-OSmwlRYK5GW1unkuAQkN/mode=imports,min/optimized/gl-matrix.js'
import segmentsEllipsoid1Indexed from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/segments-ellipsoid-sweep1-indexed.js'
import contact        from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/contact.js'
import copyContact    from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/contact-copy.js'
import plane          from 'https://cdn.jsdelivr.net/gh/mreinstein/collision-2d/src/plane.js'
import sign           from 'https://cdn.jsdelivr.net/gh/mreinstein/math-gap/src/sign.js'
import vec2SetLength  from 'https://cdn.jsdelivr.net/gh/mreinstein/vec2-gap/set-length.js'


const VERY_CLOSE_DISTANCE = 0.005
const MAX_RECURSION_DEPTH = 5

const tmpContact = contact()


// collision detection/resolution
// handle collisions between a moving entity (position and radius) and static line segments
// http://www.peroxide.dk/papers/collision/collision.pdf
//
// @param vec2 out resulting position is copied here
// @param object contact the contact object to fill. if there are multiple contacts, returns last one.
// @param array lines non-moving line segments to collide against
// @param vec2 position the moving AABB sphere center point
// @param vec2 ellipsoid moving AABB ellipsoid radius (x, y)
// @param vec2 delta the displacement vector of the entity
// @return bool true if there was a collision
export default function collideAndSlide (
    out,
    lines,
    indices,
    lineCount,
    position,
    ellipsoid,
    moveVel,
    gravityVel,
    contact
) {
    // convert position and movement velocity from R3 to ellipsoid space
    const eSpacePosition = vec2.divide(Pool.malloc(), position, ellipsoid)
    const eSpaceVelocity = vec2.divide(Pool.malloc(), moveVel, ellipsoid)

    // reset the contact object. null means no collision
    contact.collider = -1

    // movement collision/response
    collideWithWorld(out, contact, lines, indices, lineCount, eSpacePosition, ellipsoid, eSpaceVelocity)

    // convert gravity velocity from R3 to ellipsoid space
    vec2.divide(eSpaceVelocity, gravityVel, ellipsoid)

    collideWithWorld(out, contact, lines, indices, lineCount, out, ellipsoid, eSpaceVelocity, MAX_RECURSION_DEPTH)

    // Convert final result back from ellipsoid space back to R3:
    vec2.multiply(out, out, ellipsoid)

    Pool.free(eSpacePosition)
    Pool.free(eSpaceVelocity)

    return contact.collider >= 0
}


function collideWithWorld (out, contact, lines, indices, lineCount, pos, ellipsoid, vel, collisionRecursionDepth = 0) {
    if (vec2.length(vel) === 0 || collisionRecursionDepth > MAX_RECURSION_DEPTH) {
        vec2.copy(out, pos)
        return
    }

    // get nearest collision from line segments

    // no collision, move the full distance
    if (!segmentsEllipsoid1Indexed(lines, indices, lineCount, pos, ellipsoid, vel, tmpContact)) {
        vec2.add(out, pos, vel)
        return
    }

    // find the point of desired final location of the entity
    const destinationPoint = vec2.add(Pool.malloc(), pos, vel)
    const newBasePoint = vec2.copy(Pool.malloc(), pos)

    // only update if we are not already very close and if so, we only
    // move very close to the intersection, not the exact spot.
    const movementDistance = vec2.length(vel) * tmpContact.time
    if (movementDistance >= VERY_CLOSE_DISTANCE) {
        const V = vec2SetLength(Pool.malloc(), vel, movementDistance - VERY_CLOSE_DISTANCE)

        vec2.add(newBasePoint, pos, V)

        // adjust line intersection point (so sliding plane will be unaffected by the fact
        // that we move slightly less than the collision tells us)
        vec2.normalize(V, V)
        vec2.scale(V, V, VERY_CLOSE_DISTANCE)
        vec2.subtract(tmpContact.position, tmpContact.position, V)

        Pool.free(V)
    }

    copyContact(contact, tmpContact)

    // determine the sliding plane

    // project the destination point onto the sliding plane
    const slidePlaneOrigin = tmpContact.position

    const slidePlaneNormal = vec2.subtract(Pool.malloc(), newBasePoint, tmpContact.position)
    vec2.normalize(slidePlaneNormal, slidePlaneNormal)

    const slidingPlane = plane.fromPlane(plane.create(), slidePlaneOrigin, slidePlaneNormal)
    const planeDistance = plane.signedDistanceTo(slidingPlane, destinationPoint)

    const newDestinationPoint = vec2.scaleAndAdd(
        Pool.malloc(),
        destinationPoint,
        slidePlaneNormal,
        -planeDistance
    )

    // generate slide vector. Becomes the new velocity vector in next iteration
    const newVelocityVector = vec2.subtract(Pool.malloc(), newDestinationPoint, tmpContact.position)

    // dont recurse if the new velocity is very small
    if (vec2.length(newVelocityVector) < VERY_CLOSE_DISTANCE) {
        vec2.copy(out, newBasePoint)
    } else {
        collideWithWorld(
            out,
            contact,
            lines,
            indices,
            lineCount,
            newBasePoint,
            ellipsoid,
            newVelocityVector,
            collisionRecursionDepth + 1
        )
    }

    Pool.free(destinationPoint)
    Pool.free(slidePlaneNormal)
    Pool.free(newDestinationPoint)
    Pool.free(newVelocityVector)
    Pool.free(newBasePoint)
}
