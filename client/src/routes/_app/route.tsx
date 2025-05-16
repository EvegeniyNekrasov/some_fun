import {
    createFileRoute,
    Link,
    Outlet,
    redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: "/login",
                search: { redirect: location.href },
            });
        }
    },
    component: AppLayout,
});

function AppLayout() {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <Outlet />
        </div>
    );
}
