import type { GameStatusConstant } from "../constant/game_status";

export class Checkpoint {
    private boxPoints: Set<number>;
    private playerPoint: number;
    private status: GameStatusConstant;
    private moveNum: number;

    constructor(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ) {
        this.boxPoints = boxPoints;
        this.playerPoint = playerPoint;
        this.status = status;
        this.moveNum = moveNum;
    }

    public getBoxPoints(): Set<number> {
        return this.boxPoints;
    }

    public getPlayerPoint(): number {
        return this.playerPoint;
    }

    public getStatus(): GameStatusConstant {
        return this.status;
    }

    public getMoveNum(): number {
        return this.moveNum;
    }
}
