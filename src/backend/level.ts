export const levelMap: Map<number, Record<string, any>> = new Map();

levelMap.set(1, {
    width: 6,
    height: 6,
    playerPoint: 16,
    boxPoints: new Set([15, 20]),
    targetPoints: new Set([22, 28]),
    border: new Set([0, 1, 2, 3, 4, 6, 10, 11, 12, 17, 18, 19, 23, 25, 29, 31, 32, 33, 34, 35]),
});
