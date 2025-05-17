export default function SlideOver({
    open,
    toggle,
    children,
}: {
    open: boolean;
    toggle: (val: boolean) => void;
    children: React.ReactNode;
}) {
    // TODO: for now it always opens from right side
    // Make prop side to choose how you want to open the slide from bottom, left...
    // also maybe need a prop size?
    return (
        <>
            <div
                aria-hidden="true"
                onClick={() => toggle(false)}
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                className={`fixed right-0 top-0 z-50 h-full w-[600px] p-4
                    max-w-full transform shadow-xl transition-transform bg-zinc-900
                    duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                {children}
            </aside>
        </>
    );
}
