import { GameStatusConstant } from "./constant/game_status";

export class Tracer {
    private history: Checkpoint[];

    constructor() {
        this.history = [];
    }

    public undo(): Checkpoint | null {
        if (this.history.length === 0) {
            return null;
        }
        return this.history.pop()!;
    }

    public record(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ): void {
        const ckpt = new Checkpoint(boxPoints, playerPoint, status, moveNum);
        this.history.push(ckpt);
    }
}

class Checkpoint {
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
