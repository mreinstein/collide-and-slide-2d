// from https://gist.github.com/mattdesl/47412d930dcd8cd765c871a65532ffac

function dist2 (v, w) {
    return (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2
}


// p - point
// v - start point of segment
// w - end point of segment
export function distToSegmentSquared (p, v, w) {
    const l2 = dist2(v, w)
    if (l2 === 0)
        return dist2(p, v)

    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2
    t = Math.max(0, Math.min(1, t))
    return dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ])
}


// p - point
// v - start point of segment
// w - end point of segment
export default function distToSegment (p, v, w) {
    return Math.sqrt(distToSegmentSquared(p, v, w))
}
