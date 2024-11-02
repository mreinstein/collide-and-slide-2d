// convert radians to a uint8
export function pack (radians) {
	return Math.round((radians * 255) / (Math.PI * 2))
}

// take an angle packed into a uint8 and convert it to a float in radians
export function unpack (angle) {
	return (angle / 255) * Math.PI * 2
}
