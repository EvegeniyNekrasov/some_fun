import Sidebar from "@components/Sidebar/Sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
        <div className="grid grid-cols-[300px_minmax(900px,_1fr)_100px] overflow-x-scroll h-full">
            <Sidebar />
            <div className="w-full h-full overflow-scroll">
                <Outlet />
            </div>
        </div>
    );
}
