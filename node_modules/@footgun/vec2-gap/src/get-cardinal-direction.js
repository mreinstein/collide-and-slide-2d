import { vec2 } from 'wgpu-matrix'


const delta = vec2.create()

const lookup = {
    '4': {
        quadrantAngleWidth: (Math.PI / 2),
        southernLookup: [ 'east', 'south', 'west' ],
        northernLookup: [ 'east', 'north', 'west' ]
    },
    '8': {
        quadrantAngleWidth: (Math.PI / 4),
        southernLookup: [ 'east', 'southeast', 'south', 'southwest', 'west' ],
        northernLookup: [ 'east', 'northeast', 'north', 'northwest', 'west' ]
    }
}

// determine what cardinal direction the target is in relative to a source position
// (north of, west of, northeast of, etc.)
export default function getCardinalDirection (target, source, resolution) {
    vec2.subtract(target, source, delta)
    const angle = Math.atan2(delta[1], delta[0])  // (radians)
    const absAngle = Math.abs(angle)

    const d = lookup['' + resolution]

    const quadrant = Math.round(absAngle / d.quadrantAngleWidth)
    return (angle > 0) ? d.southernLookup[quadrant] : d.northernLookup[quadrant]
}
