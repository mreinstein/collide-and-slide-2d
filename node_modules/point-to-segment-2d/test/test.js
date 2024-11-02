import t                        from 'node:assert';
import dist                     from '../point-to-segment-2d.js';
import { distToSegmentSquared } from '../point-to-segment-2d.js';


/*
  Colinear
               (-2, 0)    (2, 0)
  (-10, 0) o      o────────o      o  (10, 0)
*/
t.equal(dist([ -10, 0 ], [ -2, 0 ], [ 2, 0 ]), 8)
t.equal(dist([ 10, 0 ], [ -2, 0 ], [ 2, 0 ]), 8)
t.equal(dist([ 2, 0 ], [ -2, 0 ], [ 2, 0 ]), 0)

t.equal(distToSegmentSquared([ -10, 0 ], [ -2, 0 ], [ 2, 0 ]), 64)
t.equal(distToSegmentSquared([ 10, 0 ], [ -2, 0 ], [ 2, 0 ]), 64)


/*
  Colinear
               (-2, 0)    (2, 0)
  (-10, 0) o──────o────────o───────o  (10, 0)
*/
t.equal(dist([ -2, 0 ], [ -10, 0 ], [ 10, 0 ]), 0)
t.equal(distToSegmentSquared([ -2, 0 ], [ -10, 0 ], [ 10, 0 ]), 0)


/*
        (-5, 5) o
            
        (-10, 0)
          o───────────o
                     (0, 0)
  o
(-25, -5)
*/
t.equal(dist([ -5, -5 ], [ -10, 0 ], [ 0, 0 ]), 5)
t.equal(dist([ -5, 5 ], [ -10, 0 ], [ 0, 0 ]), 5)
t.equal(dist([ -25, -5 ], [ -10, 0 ], [ 0, 0 ]), 15.811388300841896)
t.equal(distToSegmentSquared([ -25, -5 ], [ -10, 0 ], [ 0, 0 ]), 250)
