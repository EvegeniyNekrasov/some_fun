import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/")({
    component: HomePage,
});

function HomePage() {
    return (
        <div className="w-full h-full overflow-hidden">
            <Kanban />
        </div>
    );
}

const userList: { userId: number; name: string }[] = [
    { userId: 1, name: "John Doe" },
    { userId: 2, name: "John Smith" },
    { userId: 3, name: "John Wagner" },
];

type Card = {
    id: string;
    content: string;
    priority: string;
    userId: number;
};
type Column = { id: string; title: string; cards: Card[] };

const initialData: Column[] = [
    {
        id: "todo",
        title: "Por hacer ",
        cards: [
            {
                id: "c1",
                content: "Investigar api",
                priority: "medium",
                userId: 1,
            },
            {
                id: "c2",
                content: "Configurar entorno",
                priority: "high",
                userId: 1,
            },
        ],
    },
    {
        id: "doing",
        title: "En progreso",
        cards: [
            { id: "c3", content: "Diseño de UI", priority: "low", userId: 3 },
        ],
    },
    {
        id: "done",
        title: "Hecho",
        cards: [],
    },
];

function Column({
    column,
    onDragOver,
    onDrop,
    onDragStart,
}: {
    column: Column;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => void;
    onDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        cardId: string,
        fromColumnId: string
    ) => void;
}) {
    return (
        <div
            className="bg-gray-400 rounded-2xl p-4 min-w-[250px] w-full 
                flex flex-col gap-3 shadow-inner"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}>
            <h2 className="font-semibold mb-2 text-lg">
                {column.title} {column.cards.length}
            </h2>
            {column.cards.map((card) => (
                <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, card.id, column.id)}
                    className="bg-red-600 rounded-xl shadow p-3 
                        select-none cursor-grab active:cursor-grabbing 
                        transition-transform">
                    {card.content}
                    <div className="flex items-center justify-between">
                        <span>Priority: {card.priority}</span>
                        <span>
                            User:{" "}
                            {
                                userList.filter(
                                    (u) => u.userId === card.userId
                                )[0].name
                            }
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Kanban() {
    const [columns, setColumns] = useState<Column[]>(initialData);

    const onDragStart = (
        e: React.DragEvent<HTMLDivElement>,
        cardId: string,
        fromColumnId: string
    ) => {
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ cardId, fromColumnId })
        );
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) =>
        e.preventDefault();

    const onDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData("application/json");
        if (!raw) return;

        const { cardId, fromColumnId } = JSON.parse(raw) as {
            cardId: string;
            fromColumnId: string;
        };

        if (fromColumnId === toColumnId) return;

        setColumns((prev) => {
            let movedCard: Card | undefined;

            const withoutCard = prev.map((col) => {
                if (col.id !== fromColumnId) return col;
                movedCard = col.cards.find((c) => c.id === cardId);
                return {
                    ...col,
                    cards: col.cards.filter((c) => c.id !== cardId),
                };
            });

            if (!movedCard) return prev;

            return withoutCard.map((col) =>
                col.id === toColumnId
                    ? { ...col, cards: [...col.cards, movedCard!] }
                    : col
            );
        });
    };
    return (
        <div className="grid grid-flow-col gap-6 overflow-hidden p-6 w-full h-full">
            {columns.map((column) => (
                <Column
                    key={column.id}
                    column={column}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDragStart={onDragStart}
                />
            ))}
        </div>
    );
}
