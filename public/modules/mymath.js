export default {
    clamp: (val, min, max) => Math.min(Math.max(val, min), max),
    radians: (degrees) => (degrees * 0.0174532925)
}