import type { GameStatusConstant } from "../constant/game_status";
import type { Checkpoint } from "./checkpoint";

export interface Tracer {
    undo(): Checkpoint | null;
    redo(): Checkpoint | null;
    resetHistory(): void;
    record(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ): void;
    setInit(
        boxPoints: Set<number>,
        playerPoint: number,
        status: GameStatusConstant,
        moveNum: number,
    ): void;
}
