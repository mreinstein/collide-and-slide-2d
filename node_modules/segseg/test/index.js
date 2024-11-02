import t      from 'assert';
import segseg from '../index.js';


const out = [ 0, 0] // the output vector

/*
  Basic intersection

                (0, 5)
                   o
                   |
 (-10, 0) o--------+-------o  (10, 0)
                   |
                   o
                (0, -5)

*/

t.equal(segseg(out, [ -10, 0 ], [ 10, 0 ], [ 0, 5 ], [ 0, -5 ]), true)
t.deepEqual(out, [ 0, 0 ])


/*
  Basic intersection

                (5, 5)
                   o------o (10, 5)
                   |
                   |
                   o
                (5, 0)

*/

t.equal(segseg(out, [ 5, 5 ], [ 5, 0 ], [ 5, 5 ], [ 10, 5 ]), true)
t.deepEqual(out, [ 5, 5 ])


/*
  Colinear
             (-2, 0)    (2, 0)
  (-10, 0) o----o--------o-----o  (10, 0)

*/

t.equal(segseg(out, [-10, 0], [10, 0], [-2, 0], [2, 0]), true)
t.deepEqual(out, [ -2, 0 ])




// colinear line segments that overlap should return point of intersection
//           segment 2
//      ┌--------------┐
// o----o--------o-----o
// └-------------┘
//     segment 1

t.equal(segseg(out, [-10, 0], [2, 0], [-2, 0], [2, 0]), true)
t.deepEqual(out, [ 2, 0 ])


// handle colinear line segments that don't overlap
//          seg 2
//         ┌-----┐
// o----o  o-----o
// └----┘
//  seg 1

t.equal(segseg(out, [-10, 0], [-2, 0], [2, 0], [10, 0]), false)


/*
  No intersection (parallel)

  (-10, 5) o-------------o (10, 5)

  (-10, 0) o-------------o (10, 0)

*/
out[0] = 7
out[1] = 9
t.equal(segseg(out, [-10, 0], [10, 0], [-10, 5], [10, 5]), false)
t.deepEqual(out, [ 7, 9 ], 'when no intersection out parameter is not updated')


/*
  No intersection

      (-2, 5)  o
                 \
  (-10, 0) o----o  o (2, 0)
              (0, 0)

*/
t.equal(segseg(out, [-10, 0], [0, 0], [-2, 5], [2, 0]), false)


/*
  No intersection

      (-2, 5)  o
               |
               o (-2, 1)
  (-10, 0) o----o
              (0, 0)

*/
t.equal(segseg(out, [-10, 0], [0, 0], [-2, 5], [-2, 1]), false)


/*
  No intersection

    (-5, 5) o
           /
          / (-10, 0)
         /o-----------o
        o            (0, 0)
    (-25, -5)

*/
t.equal(segseg(out, [-10, 0], [0, 0], [-5, 5], [-25, -5]), false)



// see  https://github.com/tmpvar/segseg/issues/1
t.equal(segseg(out, [ -23, -46 ], [ -23, 22 ], [ 50, -50 ], [ -50, 50 ]), true)
t.deepEqual(out, [ -23, 22 ])

