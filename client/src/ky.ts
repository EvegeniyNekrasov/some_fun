import ky from "ky";

function getToken(): string | null {
    return localStorage.getItem("token");
}

export const http = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    hooks: {
        beforeRequest: [
            (request) => {
                const token = getToken();
                if (token) {
                    request.headers.set("Authorization", `Bearer ${token}`);
                }
            },
        ],
        beforeError: [
            (error) => {
                const { response } = error;
                error.message = `Request failed [${response.status}] ${response.statusText}`;
                return error;
            },
        ],
    },
});
