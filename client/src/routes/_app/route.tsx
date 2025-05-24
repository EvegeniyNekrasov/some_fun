import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import Sidebar from "@/components/Sidebar/Sidebar";

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
        <div className="grid grid-cols-[auto_minmax(900px,1fr)] overflow-auto h-full">
            <Sidebar />
            <div className="min-w-[900px] w-full h-full overflow-x-scroll overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
