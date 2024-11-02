# point-to-segment-2d

Calculate the closest distance from a point to a line segment in 2D.


## usage

```javascript
import dist                     from 'point-to-segment-2d';
import { distToSegmentSquared } from 'point-to-segment-2d';


/*
        (-5, 5) o
            
        (-10, 0)
          o───────────o
                     (0, 0)
  o
(-25, -5)
*/
const p0 = [ -10, 0 ]
const p1 = [ 0, 0 ]

console.log(dist([ -5, -5 ], p0, p1))   // 5

console.log(dist([ -25, -5 ], p0, p1))  // 15.811388300841896

console.log(distToSegmentSquared([ -25, -5 ], p0, p1)) // 250
```


## references

ported from https://gist.github.com/mattdesl/47412d930dcd8cd765c871a65532ffac
