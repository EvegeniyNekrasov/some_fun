import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
    component: HomePage,
});

function HomePage() {
    return <div>This is my home page</div>;
}
