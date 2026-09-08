import type { GameStatusConstant } from "../constant/game_status";
import { Checkpoint } from "./checkpoint";
import type { Tracer } from "./tracer";

export class SingleTracer implements Tracer {
    private history: Checkpoint | null;
    private initCkpt: Checkpoint | null;

    constructor() {
        this.history = null;
        this.initCkpt = null;
    }

    public undo(): Checkpoint | null {
        const history = this.history;
        this.history = null;
        return history;
    }

    public redo(): Checkpoint | null {
        return this.initCkpt;
    }

    public resetHistory(): void {
        this.history = null;
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

    public record(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ): void {
        const ckpt = new Checkpoint(boxPoints, playerPoint, status, moveNum);
        this.history = ckpt;
    }
}
