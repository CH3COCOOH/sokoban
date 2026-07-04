import { useEffect, useRef, useState } from "react";
import { Game } from "../../../../backend/game";
import { GameStatusConstant } from "../../../../backend/constant/game_status";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { MoveTypeConstant } from "../../../../backend/constant/move_type";
import { Controller } from "./controller";
import { Helper } from "./helper";
import { Solver } from "../../../../backend/solver";

export enum MoveSourceConstant {
    HUMAN,
    AUTO,
}

export function Board({ setSideOpen }: any) {
    const params = useParams();

    const gameRef = useRef<Game | null>(null);
    const [moveNum, setMoveNum] = useState(0);
    const [boxPoints, setBoxPoints] = useState<null | Set<number>>(null);
    const [playerPoint, setPlayerPoint] = useState(0);
    const [status, setStatus] = useState<null | GameStatusConstant>(null);
    const [direction, setDirection] = useState<null | MoveTypeConstant>(null);

    const [uspace, setUspace] = useState<Set<number> | null>(null);
    const [space, setSpace] = useState<Set<number> | null>(null);
    const [border, setBorder] = useState<Set<number> | null>(null);
    const [targetPoints, setTargetPoints] = useState<Set<number> | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [isDev, setIsDev] = useState(false);
    const [auto, setAuto] = useState(false);
    const autoRef = useRef(false);

    useEffect(() => {
        gameRef.current = new Game(parseInt(params.level ?? "1"));
        const game = gameRef.current;
        update();
        setUspace(game.getGrid().getUspace());
        setSpace(game.getGrid().getSpace());
        setBorder(game.getGrid().getBorder());
        setTargetPoints(game.getGrid().getTargetPoints());
        setWidth(game.getGrid().getWidth());
        setHeight(game.getGrid().getHeight());

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [params.level]);

    function update() {
        const game = gameRef.current!;
        setMoveNum(game.getMoveNum());
        setBoxPoints(new Set(game.getGrid().getBoxPoints()));
        setPlayerPoint(game.getGrid().getPlayerPoint());
        setStatus(game.getStatus());
    }

    function undo() {
        gameRef.current!.undo();
        update();
    }

    function redo() {
        gameRef.current!.redo();
        update();
    }

    async function toAuto() {
        const game = gameRef.current!;
        const solver = new Solver(game.getGrid());
        const solution = solver.solve();
        if (!solution) {
            return;
        }
        setAuto(true);
        autoRef.current = true;

        while (autoRef.current && solution.length > 0) {
            const step = solution.shift()!;
            moveWithSource(step, MoveSourceConstant.AUTO);
            await sleep();
        }

        setAuto(false);
        autoRef.current = false;
    }

    function stopAuto() {
        setAuto(false);
        autoRef.current = false;
    }

    const onKeyDown = (e: KeyboardEvent) => {
        const code = e.code;

        if (code === "KeyW" || code === "ArrowUp") {
            moveWithSource(MoveTypeConstant.UP, MoveSourceConstant.HUMAN);
        } else if (code === "KeyA" || code === "ArrowLeft") {
            moveWithSource(MoveTypeConstant.LEFT, MoveSourceConstant.HUMAN);
        } else if (code === "KeyS" || code === "ArrowDown") {
            moveWithSource(MoveTypeConstant.DOWN, MoveSourceConstant.HUMAN);
        } else if (code === "KeyD" || code === "ArrowRight") {
            moveWithSource(MoveTypeConstant.RIGHT, MoveSourceConstant.HUMAN);
        } else if (e.ctrlKey && code === "KeyZ") {
            undo();
        }
    };

    function moveWithSource(type: MoveTypeConstant, source: MoveSourceConstant) {
        if (source === MoveSourceConstant.HUMAN && autoRef.current) {
            return;
        }
        move(type);
    }

    function move(type: MoveTypeConstant) {
        const game = gameRef.current!;
        const isMoved = game.move(type);
        if (!isMoved) {
            return;
        }
        update();
        setDirection(type);
        setTimeout(() => {
            setDirection(null);
        }, 200);
    }

    function sleep() {
        return new Promise((resolve) => setTimeout(resolve, 500));
    }

    const windowWidth = window.innerWidth;
    const boardWidth = windowWidth >= 1024 ? windowWidth / 2 : windowWidth;
    const boxWidth = Math.min(Math.floor((boardWidth * 0.9) / width), 48);

    const board = [];
    let line = [];
    for (let i = 0; i < width * height; i++) {
        let e;
        if (i === playerPoint) {
            e = <img src="/player.svg" />;
        } else if (border?.has(i)) {
            e = <img src="/border.png" />;
        } else if (boxPoints?.has(i)) {
            e = <img src="/box.svg" />;
        } else if (targetPoints?.has(i)) {
            e = <img src="/target.png" />;
        } else if (space?.has(i)) {
            e = <img src="/space.png" />;
        } else if (uspace?.has(i)) {
            e = <div />;
        }

        line.push(e);
        if (i % width === width - 1) {
            // TODO 格子的大小响应式
            const b = (
                <div className="flex flex-row gap-0">
                    {line.map((e, i) => (
                        <div key={i} style={{ width: boxWidth, height: boxWidth }}>
                            {e}
                        </div>
                    ))}
                </div>
            );
            board.push(b);
            line = [];
        }
    }

    let modeBtn;
    if (auto) {
        modeBtn = (
            <button
                onClick={stopAuto}
                className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
            >
                <img src="/stop.svg" width={30} height={30} className="mx-auto" />
            </button>
        );
    } else {
        modeBtn = (
            <button
                onClick={toAuto}
                className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
            >
                <img src="/play.svg" width={30} height={30} className="mx-auto" />
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-row justify-center items-center gap-1 mt-12">
                <Helper setIsDev={setIsDev} />
                <h1 className="text-4xl text-gray-500">推&nbsp;&nbsp;箱&nbsp;&nbsp;子</h1>
                <img
                    className="lg:hidden"
                    src="/menu.png"
                    width={30}
                    height={30}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSideOpen(true);
                    }}
                />
                <div className="hidden lg:block w-7.5 h-7.5" />
            </div>
            <div className="flex flex-col">{board}</div>
            <div>
                <Controller move={moveWithSource} direction={direction} />
            </div>
            <div className="flex justify-center gap-2">
                <button
                    onClick={undo}
                    className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
                >
                    <img src="/undo.svg" width={30} height={30} className="mx-auto" />
                </button>
                {isDev && modeBtn}
                <button
                    onClick={redo}
                    className="px-8 py-1 cursor-pointer transition-colors hover:bg-blue-100 rounded-xl active:bg-blue-200"
                >
                    <img src="/restart.svg" width={30} height={30} className="mx-auto" />
                </button>
            </div>
            <div className="flex justify-center">
                <p>步&nbsp;数: {moveNum}</p>
            </div>
            {status === GameStatusConstant.WIN && (
                <div className="text-2xl text-center text-green-500">胜&nbsp;利</div>
            )}
        </div>
    );
}
