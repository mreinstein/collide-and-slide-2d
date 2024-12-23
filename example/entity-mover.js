import ECS from 'ecs'


export default function moverEntity (world) {
	const E = ECS.createEntity(world)

	ECS.addComponent(world, E, 'mover')

	ECS.addComponent(world, E, 'transform', {
		position: [ 165, 135 ]
	})

	ECS.addComponent(world, E, 'rigidBody', {
		ellipsoidRadius: [ 6, 12 ],
		velocity: [ 0, 0 ],

		accel: 720,
		maxdx: 144,
		gravity: 550,
		floorSegmentIdx: -1,
		jumpV0: -302.55,
		jumpMultiplier: 5,
		fallMultiplier: 2.2,
		friction: 1358.5,
	})
	
	return E
}
