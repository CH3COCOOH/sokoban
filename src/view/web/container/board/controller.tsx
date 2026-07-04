import { MoveTypeConstant } from "../../../../backend/constant/move_type";
import { MoveSourceConstant } from "./board";

export function Controller({ move, direction }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-row justify-center">
                <img
                    src="/up.png"
                    className={`cursor-pointer transition-colors hover:bg-blue-100 p-1 rounded-2xl ${direction === MoveTypeConstant.UP && "bg-blue-200"} `}
                    onClick={() => move(MoveTypeConstant.UP, MoveSourceConstant.HUMAN)}
                />
            </div>
            <div className="flex flex-row gap-4 justify-center">
                <img
                    src="/left.png"
                    className={`cursor-pointer transition-colors hover:bg-blue-100 p-1 rounded-2xl ${direction === MoveTypeConstant.LEFT && "bg-blue-200"} `}
                    onClick={() => move(MoveTypeConstant.LEFT, MoveSourceConstant.HUMAN)}
                />
                <img
                    src="/down.png"
                    className={`cursor-pointer transition-colors hover:bg-blue-100 p-1 rounded-2xl ${direction === MoveTypeConstant.DOWN && "bg-blue-200"} `}
                    onClick={() => move(MoveTypeConstant.DOWN, MoveSourceConstant.HUMAN)}
                />
                <img
                    src="/right.png"
                    className={`cursor-pointer transition-colors hover:bg-blue-100 p-1 rounded-2xl ${direction === MoveTypeConstant.RIGHT && "bg-blue-200"} `}
                    onClick={() => move(MoveTypeConstant.RIGHT, MoveSourceConstant.HUMAN)}
                />
            </div>
        </div>
    );
}
