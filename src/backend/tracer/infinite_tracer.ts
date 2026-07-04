import type { GameStatusConstant } from "../constant/game_status";
import type { Tracer } from "./tracer";
import { Checkpoint } from "./checkpoint";

export class InfiniteTracer implements Tracer {
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
