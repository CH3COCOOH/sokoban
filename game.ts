import { GameStatusConstant } from "./constant/game_status";
import { Grid } from "./grid";
import { Tracer } from "./tracer";
import { MoveTypeConstant } from "./constant/move_type";
import fs from "node:fs";
import _ from "lodash";

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
        this.tracer = new Tracer();
        this.level = level;
    }

    public loadGrid(level: number): Grid {
        const file = fs.readFileSync(`./level/${level}.json`, "utf-8");
        const json = JSON.parse(file);
        const boxPoints = new Set(json.boxPoints) as Set<number>;
        const targetPoints = new Set(json.targetPoints) as Set<number>;
        const border = new Set(json.border) as Set<number>;

        return new Grid(json.height, json.width, border, boxPoints, targetPoints, json.playerPoint);
    }

    public move(type: MoveTypeConstant): void {
        if (this.status !== GameStatusConstant.RUNNING) {
            return;
        }

        let newPoint = this.grid.getPlayerPoint();
        if (type === MoveTypeConstant.UP) {
            if (newPoint < this.grid.getWidth()) {
                return;
            }
            newPoint -= this.grid.getWidth();
        } else if (type === MoveTypeConstant.DOWN) {
            if (newPoint >= this.grid.getWidth() * (this.grid.getHeight() - 1)) {
                return;
            }
            newPoint += this.grid.getWidth();
        } else if (type === MoveTypeConstant.LEFT) {
            if (newPoint % this.grid.getWidth() === 0) {
                return;
            }
            newPoint -= 1;
        } else if (type === MoveTypeConstant.RIGHT) {
            if (newPoint % this.grid.getWidth() === this.grid.getWidth() - 1) {
                return;
            }
            newPoint += 1;
        }

        if (this.grid.getBorder().has(newPoint)) {
            return;
        }

        // 推到箱子
        let newBoxPoint = -1;
        if (this.grid.getBoxPoints().has(newPoint)) {
            if (type === MoveTypeConstant.UP) {
                if (newPoint < this.grid.getWidth()) {
                    return;
                }
                newBoxPoint = newPoint - this.grid.getWidth();
            } else if (type === MoveTypeConstant.DOWN) {
                if (newPoint >= this.grid.getWidth() * (this.grid.getHeight() - 1)) {
                    return;
                }
                newBoxPoint = newPoint + this.grid.getWidth();
            } else if (type === MoveTypeConstant.LEFT) {
                if (newPoint % this.grid.getWidth() === 0) {
                    return;
                }
                newBoxPoint = newPoint - 1;
            } else if (type === MoveTypeConstant.RIGHT) {
                if (newPoint % this.grid.getWidth() === this.grid.getWidth() - 1) {
                    return;
                }
                newBoxPoint = newPoint + 1;
            }
        }

        if (this.grid.getBorder().has(newBoxPoint)) {
            return;
        }
        if (this.grid.getBoxPoints().has(newBoxPoint)) {
            return;
        }

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
        this.tracer.record(
            _.cloneDeep(this.grid.getBoxPoints()),
            _.cloneDeep(this.grid.getPlayerPoint()),
            this.status,
            this.moveNum,
        );
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
        this.moveNum = 0;
        this.status = GameStatusConstant.RUNNING;
        this.grid = this.loadGrid(this.level);
        this.tracer = new Tracer();
    }

    public getGrid(): Grid {
        return this.grid;
    }

    public getStatus(): GameStatusConstant {
        return this.status;
    }
}
