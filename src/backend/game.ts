import { GameStatusConstant } from "./constant/game_status";
import { Grid } from "./grid";
import type { Tracer } from "./tracer/tracer";
import { MoveTypeConstant } from "./constant/move_type";
import _ from "lodash";
import { levelMap } from "./level";
import { SingleTracer } from "./tracer/single_tracer";

export class Game {
    private grid: Grid;
    private moveNum: number;
    private status: GameStatusConstant;
    private tracer: Tracer;
    private level: number;

    constructor(level: number = 1) {
        this.grid = this.loadGrid(level);
        this.moveNum = 0;
        this.status = GameStatusConstant.RUNNING;
        this.tracer = new SingleTracer();
        this.tracer.setInit(
            _.cloneDeep(this.grid.getBoxPoints()),
            _.cloneDeep(this.grid.getPlayerPoint()),
            this.status,
            this.moveNum,
        );
        this.level = level;
    }

    public loadGrid(level: number): Grid {
        let gridStr = levelMap.get(level);
        if (!gridStr) {
            throw new Error("ERROR! No such level.");
        }
        gridStr = gridStr.trim();

        let height = 0;
        let width = 0;
        const border = new Set<number>();
        const boxPoints = new Set<number>();
        const targetPoints = new Set<number>();
        const space = new Set<number>();
        const uspace = new Set<number>();
        let playerPoint = 0;

        let i = -1;
        for (const c of gridStr) {
            if (c === " ") {
                continue;
            }
            if (c === "\n") {
                height++;
                if (width === 0) {
                    width = i + 1;
                }
                continue;
            }

            i++;
            if (c === "B") {
                boxPoints.add(i);
                space.add(i);
            } else if (c === "@") {
                targetPoints.add(i);
            } else if (c === "1") {
                playerPoint = i;
                space.add(i);
            } else if (c === "x") {
                border.add(i);
            } else if (c === "+") {
                space.add(i);
            } else if (c === "-") {
                uspace.add(i);
            }
        }
        height++;

        return new Grid(height, width, border, boxPoints, targetPoints, playerPoint, space, uspace);
    }

    public move(type: MoveTypeConstant): boolean {
        if (this.status !== GameStatusConstant.RUNNING) {
            return false;
        }

        let newPoint = this.grid.getPlayerPoint();
        if (type === MoveTypeConstant.UP) {
            if (newPoint < this.grid.getWidth()) {
                return false;
            }
            newPoint -= this.grid.getWidth();
        } else if (type === MoveTypeConstant.DOWN) {
            if (newPoint >= this.grid.getWidth() * (this.grid.getHeight() - 1)) {
                return false;
            }
            newPoint += this.grid.getWidth();
        } else if (type === MoveTypeConstant.LEFT) {
            if (newPoint % this.grid.getWidth() === 0) {
                return false;
            }
            newPoint -= 1;
        } else if (type === MoveTypeConstant.RIGHT) {
            if (newPoint % this.grid.getWidth() === this.grid.getWidth() - 1) {
                return false;
            }
            newPoint += 1;
        }

        if (this.grid.getBorder().has(newPoint)) {
            return false;
        }

        // 推到箱子
        let newBoxPoint = -1;
        if (this.grid.getBoxPoints().has(newPoint)) {
            if (type === MoveTypeConstant.UP) {
                if (newPoint < this.grid.getWidth()) {
                    return false;
                }
                newBoxPoint = newPoint - this.grid.getWidth();
            } else if (type === MoveTypeConstant.DOWN) {
                if (newPoint >= this.grid.getWidth() * (this.grid.getHeight() - 1)) {
                    return false;
                }
                newBoxPoint = newPoint + this.grid.getWidth();
            } else if (type === MoveTypeConstant.LEFT) {
                if (newPoint % this.grid.getWidth() === 0) {
                    return false;
                }
                newBoxPoint = newPoint - 1;
            } else if (type === MoveTypeConstant.RIGHT) {
                if (newPoint % this.grid.getWidth() === this.grid.getWidth() - 1) {
                    return false;
                }
                newBoxPoint = newPoint + 1;
            }
        }

        if (this.grid.getBorder().has(newBoxPoint)) {
            return false;
        }
        if (this.grid.getBoxPoints().has(newBoxPoint)) {
            return false;
        }

        this.tracer.record(
            _.cloneDeep(this.grid.getBoxPoints()),
            _.cloneDeep(this.grid.getPlayerPoint()),
            this.status,
            this.moveNum,
        );

        if (newBoxPoint !== -1) {
            const boxSet = this.grid.getBoxPoints();
            boxSet.delete(newPoint);
            boxSet.add(newBoxPoint);
        }
        this.grid.setPlayerPoint(newPoint);
        if (this.isWin()) {
            this.status = GameStatusConstant.WIN;
        }
        this.moveNum++;

        return true;
    }

    public isWin(): boolean {
        for (const point of this.grid.getBoxPoints()) {
            if (!this.grid.getTargetPoints().has(point)) {
                return false;
            }
        }
        return true;
    }

    public undo(): void {
        if (this.moveNum === 0) {
            return;
        }
        if (this.status !== GameStatusConstant.RUNNING) {
            return;
        }

        const ckpt = this.tracer.undo();
        if (!ckpt) {
            return;
        }
        this.moveNum = ckpt.getMoveNum();
        this.status = ckpt.getStatus();
        this.grid.setPlayerPoint(ckpt.getPlayerPoint());
        this.grid.setBoxPoints(ckpt.getBoxPoints());
    }

    public redo(): void {
        const ckpt = this.tracer.redo();
        if (!ckpt) {
            return;
        }
        this.moveNum = ckpt.getMoveNum();
        this.status = ckpt.getStatus();
        this.grid.setBoxPoints(_.cloneDeep(ckpt.getBoxPoints()));
        this.grid.setPlayerPoint(ckpt.getPlayerPoint());
        this.tracer.resetHistory();
    }

    public getGrid(): Grid {
        return this.grid;
    }

    public getStatus(): GameStatusConstant {
        return this.status;
    }

    public getMoveNum(): number {
        return this.moveNum;
    }
}
