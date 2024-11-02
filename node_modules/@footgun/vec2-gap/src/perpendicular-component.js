import { vec2 } from 'wgpu-matrix'


// these were ported from OpenSteer's Vec3.h file


// return component of vector parallel to a unit basis vector
// (IMPORTANT NOTE: assumes "basis" has unit magnitude (length==1))
function parallelComponent (out, unitBasis, force) {
    const projection = vec2.dot(force, unitBasis)
    return vec2.scale(unitBasis, projection, out)
}


// return component of vector perpendicular to a unit basis vector
// (IMPORTANT NOTE: assumes "basis" has unit magnitude (length==1))
export default function perpendicularComponent (out, unitBasis, force) {
    parallelComponent(out, unitBasis, force)
    return vec2.subtract(force, out, out)
}
