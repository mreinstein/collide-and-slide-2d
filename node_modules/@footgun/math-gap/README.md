# math-gap
math functions that are missing or lacking from the standard javascript library

## clamp

It's 2024 and Javascript still doesn't have `clamp`...

### Usage

`clamp(value, a, b)`

Returns `value`, if it is between `a` and `b`. Otherwise, returns the number
it's gone past.


## lerp

Linearly interpolate between 2 values

### Usage

`lerp(a, b, amount)`

`amount` should be a value between 0 and 1, indicating how far to interpolate from `a` to `b`

```javascript

const val = lerp(10, 20, 0.5) // val === 15
```


## sign

`Math.sign` was added to Javascript somewhat recently. It's behavior regarding `0` is to not give it 
a positive or negative sign:

```javascript
Math.sign(1)  // returns 1
Math.sign(0)  // returns 0
Math.sign(-1) // returns -1
```

In some cases, we want want to consider 0 as a positive value, and alias 0 to 1.
This comes up in games and simulations, e.g., a 2d sprite can only face left or right (-1 or 1)

That's what this module does:
```javascript
sign(1)  // returns 1
sign(0)  // returns 1
sign(-1) // returns -1
```


## to-degrees

Converts `radians` to its corresponding value in `degrees`.

```javascript
const d1 = toDegrees(0.5235987755982988)  // d1 === 29.999999999999996

const d2 = toDegrees(0.5235987755982989)  // d2 === 30.000000000000004
````


## to-radians

Converts `degrees` to its corresponding value in `radians`.

```javascript
const val = toRadians(30) // val === 0.5235987755982988
````


## bitfield

get and set bits

```javascript
let flags = 0 // a byte (contains 8 bits)
flags = bitfield.set(flags, 0, true)  // flags === 00000001
flags = bitfield.set(flags, 2, true)  // flags === 00000101
console.log(bitfield.get(flags, 2))   // true
console.log(bitfield.get(flags, 1))   // false
flags = bitfield.set(flags, 0, false) // flags === 00000100
````


## quantize-angle
pack/unpack an angle expressed in radians to/frame a byte

```javascript
const angle = Math.PI * 0.3

const u = new Uint8Array(1)
u[0] = quantizeAngle.pack(angle)


const angle2 = quantizeAngle.unpack(u[0])

console.log(angle === angle2) // true
```
