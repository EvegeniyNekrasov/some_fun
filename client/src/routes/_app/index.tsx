import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
    component: HomePage,
});

function HomePage() {
    return <div className="page w-full h-full overflow-hidden">Homa page</div>;
}
