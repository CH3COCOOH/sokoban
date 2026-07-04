import { useState } from "react";
import { Board } from "./board/board";
import { LevelSelector } from "./levelselector";
import { Drawer } from "../components/drawer/drawer";

export function Container() {
    const [isSideOpen, setIsSideOpen] = useState(false);
    return (
        <>
            <Drawer isOpen={isSideOpen} setIsOpen={setIsSideOpen}>
                <LevelSelector />
            </Drawer>
            <div className="lg:grid lg:grid-cols-12">
                <div className="lg:col-start-4 lg:col-span-6">
                    <Board setSideOpen={setIsSideOpen} />
                </div>
                <div className="hidden lg:block lg:col-start-10 lg:col-span-3">
                    <LevelSelector />
                </div>
            </div>
        </>
    );
}
