import { useEffect, useState, type ChangeEvent } from "react";

export function Helper({ setIsDev }: any) {
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        const closeHelper = () => setIsShow(false);
        window.addEventListener("mousedown", closeHelper);
        return () => window.removeEventListener("mousedown", closeHelper);
    }, []);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.toLowerCase();
        setIsDev(val === "dfs");
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsShow(true)}
            onMouseLeave={() => setIsShow(false)}
            onMouseDown={(e) => {
                e.stopPropagation();
                setIsShow(true);
            }}
        >
            <img src="/help.svg" width={30} height={30} className="cursor-pointer" />
            <div
                className={`absolute flex flex-col gap-4 items-center rounded-xl p-3 border bg-white ${!isShow && "hidden"}`}
            >
                <div>将箱子移动到指定地点</div>
                <img src="/demo.gif" />
                <input
                    type="text"
                    onChange={handleChange}
                    className="border rounded-xl px-2"
                    onKeyDown={(e) => {
                        e.stopPropagation();
                    }}
                />
            </div>
        </div>
    );
}
