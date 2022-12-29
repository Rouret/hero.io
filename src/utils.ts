export const random = function (min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomId = function () {
    return Math.random().toString(36).substr(2, 9);
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeAllPrivateProperties = function (object: any) {
    object = clone(object);
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            if (key.startsWith("_")) {
                delete object[key];
            } else if (typeof object[key] === "object") {
                removeAllPrivateProperties(object[key]);
            }
        }
    }
    return object;
}

export const convertSecondToTick = function (second: number, tickrate: number) {
    return Math.floor(second * tickrate);
}

export function clone<T>(object: T) {
    return <T>JSON.parse(JSON.stringify(object));
}

module.exports = {
    random,
    randomId,
    removeAllPrivateProperties,
    convertSecondToTick,
    clone
};
