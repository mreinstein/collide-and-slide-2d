// @param number b    byte to write bit into
// @param number idx  which bit to set (between 0..7)
// @param bool value  when true, set bit to 1. otherwise set bit to 0.
// @return number     the modified byte
export function set (b, idx, value) {
    if (value)
        b |= 128 >> idx % 8
    else
        b &= ~(128 >> idx % 8)

    return b
}


// @param number b    byte to retrieve bit from
// @param number idx  which bit to read (between 0..7)
// @return bool       true if the bit is set
export function get (b, idx) {
    return !!(b & (128 >> idx % 8))
}
