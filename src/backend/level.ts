/*
 * 1是玩家
 * x是障碍
 * @是目标点
 * B是箱子
 * +是空地
 * -是不可达空地
 */
export const levelMap: Map<number, string> = new Map();

levelMap.set(
    1,
    `
    xxxxx-
    x+++xx
    x++B1x
    xxB+@x
    -x++@x
    -xxxxx
`,
);

levelMap.set(
    2,
    `
    xxxxxx
    x1B+@x
    xxxxxx
`,
);
