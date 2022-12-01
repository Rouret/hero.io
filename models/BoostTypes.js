const BoostTypes = {
    SPEED: "SPEED"
}

function getRandomBoostType() {
    let boostTypes = Object.values(BoostTypes);
    return boostTypes[Math.floor(Math.random() * boostTypes.length)];
}

module.exports = {
    BoostTypes,
    getRandomBoostType
}
