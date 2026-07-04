export class Grid {
    private height: number;
    private width: number;
    private border: Set<number>;
    private boxPoints: Set<number>;
    private targetPoints: Set<number>;
    private playerPoint: number;
    private space: Set<number>;
    private uspace: Set<number>; // unreachable space

    constructor(
        height: number,
        width: number,
        border: Set<number>,
        boxPoints: Set<number>,
        targetPoints: Set<number>,
        playerPoint: number,
        space: Set<number>,
        uspace: Set<number>,
    ) {
        this.height = height;
        this.width = width;
        this.border = border;
        this.boxPoints = boxPoints;
        this.targetPoints = targetPoints;
        this.playerPoint = playerPoint;
        this.space = space;
        this.uspace = uspace;
    }

    public getBoxPoints(): Set<number> {
        return this.boxPoints;
    }

    public getPlayerPoint(): number {
        return this.playerPoint;
    }

    public getTargetPoints(): Set<number> {
        return this.targetPoints;
    }

    public getBorder(): Set<number> {
        return this.border;
    }

    public getHeight(): number {
        return this.height;
    }

    public getWidth(): number {
        return this.width;
    }

    public getSpace(): Set<number> {
        return this.space;
    }

    public getUspace(): Set<number> {
        return this.uspace;
    }

    public setPlayerPoint(p: number): void {
        this.playerPoint = p;
    }

    public setBoxPoints(ps: Set<number>): void {
        this.boxPoints = ps;
    }
}
