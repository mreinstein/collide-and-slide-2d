import setLength from './set-length.js'
import { vec2 }  from 'wgpu-matrix'


export default function truncate (out, inp, maxLength) {
    if (vec2.length(inp) > maxLength)
        setLength(out, inp, maxLength)
    else
        vec2.copy(inp, out)
    return out
}
