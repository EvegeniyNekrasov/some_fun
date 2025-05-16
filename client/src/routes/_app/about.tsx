import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/about")({
    component: AboutPage,
});

function AboutPage() {
    return <div>This is my about page</div>;
}
