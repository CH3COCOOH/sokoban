import { MoveTypeConstant } from "./constant/move_type";
import { Game } from "./game";
import _ from "lodash";

export class Solver {
    private game: Game;

    constructor(level: number) {
        this.game = new Game(level);
    }

    // dfs
    public solve(): string {
        let start = this.serialize(
            this.game.getGrid().getBoxPoints(),
            this.game.getGrid().getPlayerPoint(),
        );

        const path = new Map<string, string>();
        path.set(start, "");
        const next: string[] = [];
        next.push(start);

        let cur: string;
        while (true) {
            if (next.length === 0) {
                return "";
            }
            cur = next.pop()!;
            const [boxPoints, playerPoint] = this.deserialize(cur);
            this.game.getGrid().setBoxPoints(boxPoints);
            this.game.getGrid().setPlayerPoint(playerPoint);
            if (this.game.isWin()) {
                return this.solutionToString(path, cur);
            }

            const types = [
                MoveTypeConstant.UP,
                MoveTypeConstant.DOWN,
                MoveTypeConstant.LEFT,
                MoveTypeConstant.RIGHT,
            ];
            for (const type of types) {
                const moveResult = this.canMove(type);
                if (moveResult && !path.has(moveResult)) {
                    next.push(moveResult);
                    path.set(moveResult, cur);
                }
            }
        }
    }

    public serialize(boxPoints: Set<number>, playerPoint: number): string {
        let result = Array.from(boxPoints).sort().join(",");
        result += "," + playerPoint;
        return result;
    }

    public deserialize(src: string): [Set<number>, number] {
        const chunk = src.split(",");
        const playerPoint = parseInt(chunk.at(-1)!);
        const boxPoints = new Set(chunk.slice(0, -1).map((x) => parseInt(x)));
        return [boxPoints, playerPoint];
    }

    public canMove(type: MoveTypeConstant): string {
        const grid = this.game.getGrid();
        let newPoint = grid.getPlayerPoint();
        if (type === MoveTypeConstant.UP) {
            if (newPoint < grid.getWidth()) {
                return "";
            }
            newPoint -= grid.getWidth();
        } else if (type === MoveTypeConstant.DOWN) {
            if (newPoint >= grid.getWidth() * (grid.getHeight() - 1)) {
                return "";
            }
            newPoint += grid.getWidth();
        } else if (type === MoveTypeConstant.LEFT) {
            if (newPoint % grid.getWidth() === 0) {
                return "";
            }
            newPoint -= 1;
        } else if (type === MoveTypeConstant.RIGHT) {
            if (newPoint % grid.getWidth() === grid.getWidth() - 1) {
                return "";
            }
            newPoint += 1;
        }
        if (grid.getBorder().has(newPoint)) {
            return "";
        }

        let newBoxPoint = -1;
        if (grid.getBoxPoints().has(newPoint)) {
            if (type === MoveTypeConstant.UP) {
                if (newPoint < grid.getWidth()) {
                    return "";
                }
                newBoxPoint = newPoint - grid.getWidth();
            } else if (type === MoveTypeConstant.DOWN) {
                if (newPoint >= grid.getWidth() * (grid.getHeight() - 1)) {
                    return "";
                }
                newBoxPoint = newPoint + grid.getWidth();
            } else if (type === MoveTypeConstant.LEFT) {
                if (newPoint % grid.getWidth() === 0) {
                    return "";
                }
                newBoxPoint = newPoint - 1;
            } else if (type === MoveTypeConstant.RIGHT) {
                if (newPoint % grid.getWidth() === grid.getWidth() - 1) {
                    return "";
                }
                newBoxPoint = newPoint + 1;
            }
        }

        if (grid.getBorder().has(newBoxPoint)) {
            return "";
        }
        if (grid.getBoxPoints().has(newBoxPoint)) {
            return "";
        }

        const boxSet = _.cloneDeep(grid.getBoxPoints());
        if (newBoxPoint !== -1) {
            boxSet.delete(newPoint);
            boxSet.add(newBoxPoint);
        }
        return this.serialize(boxSet, newPoint);
    }

    public solutionToString(path: Map<string, string>, end: string): string {
        let count = 0;
        let cur = end;
        let result = "";
        const points: number[] = [];

        while (true) {
            const [boxPoints, playerPoint] = this.deserialize(cur);
            points.push(playerPoint);
            cur = path.get(cur)!;
            if (!cur) {
                break;
            }
            count++;
        }

        const width = this.game.getGrid().getWidth();
        while (points.length !== 0) {
            const point = points.pop()!;
            const x = point % width;
            const y = Math.floor(point / width);
            result += `(${x}, ${y}) `;
        }
        result += `\nTotal move count: ${count}`;
        return result;
    }
}
