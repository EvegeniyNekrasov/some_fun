import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

interface LoginFomsProps {
    onLoginSubmit: (username: string, password: string) => void;
}

type Inputs = {
    username: string;
    password: string;
};

export default function LoginForm({ onLoginSubmit }: LoginFomsProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (data.password && data.username) {
            const { username, password } = data;
            onLoginSubmit(username, password);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form
                className="flex flex-col gap-2 bg-neutral-100 w-[400px] h-fit p-5"
                onSubmit={handleSubmit(onSubmit)}>
                <h2>Login</h2>
                <input
                    className="px-4 py-2 rounded bg-white"
                    {...register("username", { required: true })}
                    placeholder="username"
                    type="text"
                />
                <input
                    className="px-4 py-2 rounded bg-white"
                    {...register("password", { required: true })}
                    placeholder="password"
                    type="password"
                />
                <input
                    className="bg-green-200 px-4 py-2 rounded cursor-pointer hover:bg-green-300"
                    type="submit"
                />
            </form>
        </div>
    );
}
