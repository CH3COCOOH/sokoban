import { GameStatusConstant } from "./constant/game_status";

export class Tracer {
    private history: Checkpoint[];
    private initCkpt: Checkpoint | null;

    constructor() {
        this.history = [];
        this.initCkpt = null;
    }

    public undo(): Checkpoint | null {
        if (this.history.length === 0) {
            return null;
        }
        return this.history.pop()!;
    }

    public setInit(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ): void {
        const ckpt = new Checkpoint(boxPoints, playerPoint, status, moveNum);
        this.initCkpt = ckpt;
    }

    public redo(): Checkpoint | null {
        return this.initCkpt;
    }

    public resetHistory(): void {
        this.history = [];
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
