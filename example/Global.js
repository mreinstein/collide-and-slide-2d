export default {
	// timekeeping (in milliseconds)
    lastFrameTime: 0, // local time the last frame ran
    accumulator:   0, // accumulate time to run ticks at a fixed rate

	world: undefined, // ECS world instance
	canvas: undefined,
	ctx: undefined,

	segs: [ ] // 2d line segments comprising the collidable world
}
