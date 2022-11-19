function calcVector(ax, ay, bx, by) {
    return {
        x: bx - ax,
        y: by - ay
    }
}

function getDistanceOfVector(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

module.exports = {
    calcVector,
    getDistanceOfVector
}