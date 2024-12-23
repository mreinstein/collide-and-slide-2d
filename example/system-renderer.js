import ECS    from 'ecs'
import Global from './Global.js'


const MOVER_QUERY = [ 'mover', 'transform' ]


export default function rendererSystem (world) {

	const onUpdate = function () {
		// draw the line segments
		const { ctx, segs } = Global

		ctx.clearRect(0, 0, 320, 320)

		ctx.strokeStyle = 'white'

		ctx.beginPath()
		for (const seg of segs) {
			ctx.moveTo(seg[0][0], seg[0][1])
			ctx.lineTo(seg[1][0], seg[1][1])
		}

		ctx.stroke()
		
		// movable unit
		ctx.fillStyle = 'dodgerblue'
		const rot = 0
		for (const mover of ECS.getEntities(world, MOVER_QUERY)) {
			ctx.beginPath()
			ctx.ellipse(mover.transform.position[0],
				        mover.transform.position[1],
				        mover.rigidBody.ellipsoidRadius[0],
				        mover.rigidBody.ellipsoidRadius[1], rot, 0, Math.PI*2)
			ctx.fill()
		}	
	}

	return { onUpdate }
}
