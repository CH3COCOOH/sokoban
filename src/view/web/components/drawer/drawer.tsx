// @ts-ignore
import "./drawer.css";

export function Drawer({ isOpen, setIsOpen, children }: any) {
    return (
        <div className={`flex flex-row h-screen w-screen z-10 absolute ${isOpen ? "" : "hidden"}`}>
            <div className="w-60 bg-white">{children}</div>
            <div
                className="grow bg-gray-600/50"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                }}
            ></div>
        </div>
    );
}
