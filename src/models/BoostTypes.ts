export const BoostTypes = {
    SPEED: "SPEED"
}

export const  getRandomBoostType= function() {
    const boostTypes = Object.values(BoostTypes);
    return boostTypes[Math.floor(Math.random() * boostTypes.length)];
}

module.exports = {
    BoostTypes,
    getRandomBoostType
}
