import { useParams, useNavigate } from "react-router-dom";
import { levelMap } from "../../../backend/level";

export function LevelSelector() {
    const navigate = useNavigate();

    const params = useParams();
    const cur = parseInt(params.level ?? "1");
    const num = levelMap.size;
    const buttons = [];

    for (let i = 1; i <= num; i++) {
        if (i === cur) {
            buttons.push(
                <button key={i} className="w-16 rounded-xl py-0.5 bg-gray-100">
                    {i}
                </button>,
            );
        } else {
            buttons.push(
                <button
                    key={i}
                    onClick={() => navigate(`/${i}`)}
                    className="w-16 rounded-xl py-0.5 bg-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                    {i}
                </button>,
            );
        }
    }
    return (
        <div className="mt-20 px-12">
            <div className="text-gray-700 text-xl text-center mb-4">关&nbsp;&nbsp;卡</div>
            <div className="flex flex-row flex-wrap justify-center gap-4">{buttons}</div>
        </div>
    );
}
