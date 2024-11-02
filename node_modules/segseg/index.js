import segpoint from './segpoint.js'


const DONT_INTERSECT = 0
const DO_INTERSECT = 1
const COLINEAR = 2


/*  Ported from Mukesh Prasad's public domain code:
 *    http://www.realtimerendering.com/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (x1,y1) -- (x2,y2)
 *   and the input points (x3,y3) -- (x4,y4) intersect.
 *   If the lines intersect, the return value is an array
 *   containing coordinates of the point of intersection.
 *
 *   Params
 *        p1, p2   Coordinates of endpoints of one segment.
 *        p3, p4   Coordinates of endpoints of other segment.
 *
 *   The value returned by the function is an enumeration of DONT_INTERSECT | DO_INTERSECT | COLINEAR
 */

function _segseg (out, p1, p2, p3, p4) {
  let x1 = p1[0]
  let y1 = p1[1]
  let x2 = p2[0]
  let y2 = p2[1]
  let x3 = p3[0]
  let y3 = p3[1]
  let x4 = p4[0]
  let y4 = p4[1]

  let a1, a2, b1, b2, c1, c2 // Coefficients of line eqns.
  let r1, r2, r3, r4         // 'Sign' values
  let denom, offset          // Intermediate values
  let x, y                   // Intermediate return values

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x  +  b1 y  +  c1  =  0".
  a1 = y2 - y1
  b1 = x1 - x2
  c1 = x2 * y1 - x1 * y2

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1
  r4 = a1 * x4 + b1 * y4 + c1

  // Check signs of r3 and r4.  If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ( r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0)))
    return DONT_INTERSECT

  // Compute a2, b2, c2
  a2 = y4 - y3
  b2 = x3 - x4
  c2 = x4 * y3 - x3 * y4

  // Compute r1 and r2
  r1 = a2 * x1 + b2 * y1 + c2
  r2 = a2 * x2 + b2 * y2 + c2

  // Check signs of r1 and r2.  If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0)))
    return DONT_INTERSECT

  // Line segments intersect: compute intersection point.
  denom = a1 * b2 - a2 * b1

  if (denom === 0)
    return COLINEAR

  offset = denom < 0 ? - denom / 2 : denom / 2

  x = b1 * c2 - b2 * c1
  y = a2 * c1 - a1 * c2

  out[0] = ( x < 0 ? x : x ) / denom
  out[1] = ( y < 0 ? y : y ) / denom
  
  return DO_INTERSECT
}


export default function segseg (out, p1, p2, p3, p4) {
  const result = _segseg(out, p1, p2, p3, p4)

  if (result === DO_INTERSECT)
    return result

  // handle colinear cases and when a line segment endpoint lies on the other segment
  if (segpoint(p1, p3, p4)) {
    out[0] = p1[0]
    out[1] = p1[1]
    return true
  }

  if (segpoint(p2, p3, p4)) {
    out[0] = p2[0]
    out[1] = p2[1]
    return true
  }

  if (segpoint(p3, p1, p2)) {
    out[0] = p3[0]
    out[1] = p3[1]
    return true
  }

  if (segpoint(p4, p1, p2)) {
    out[0] = p4[0]
    out[1] = p4[1]
    return true
  }

  return false
}
