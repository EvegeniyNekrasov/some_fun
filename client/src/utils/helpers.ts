type Status = {
    value: number;
    label: string;
};

export const statusList: Status[] = [
    { value: 1, label: "Todo" },
    { value: 2, label: "In Progress" },
    { value: 3, label: "Done" },
];

export function makeAbbreviation(names: string): string {
    const trimmed = names.trim();

    if (trimmed === "") return "";

    const parts = trimmed.split(/[ \t-]+/);

    const initials = parts
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase())
        .join("");

    return initials;
}
