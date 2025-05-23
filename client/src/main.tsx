import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuth, AuthProvider } from "./context/AuthContext";
import "./index.css";

const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const queryClient = new QueryClient();

const MainApp = () => {
    const auth = useAuth();
    return (
        <RouterProvider
            router={router}
            context={{ auth }}
        />
    );
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <MainApp />
                </QueryClientProvider>
            </AuthProvider>
        </StrictMode>
    );
}
