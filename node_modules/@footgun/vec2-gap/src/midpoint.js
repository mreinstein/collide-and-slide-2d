import { vec2 }     from 'wgpu-matrix'
import vec2Truncate from './truncate.js'


export default function segmentMidPoint (out, p0, p1) {
    vec2.subtract(p1, p0, out)
    const halfLen = vec2.distance(p1, p0) / 2
    vec2Truncate(out, out, halfLen)
    return vec2.add(out, p0, out)
}

