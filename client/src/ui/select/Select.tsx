import { Fragment } from "react";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type Option<T> = {
    value: T;
    label: string;
    icon: LucideIcon;
};

interface SelectProps<T extends string | number> {
    title?: string;
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
    disabled?: boolean;
}

export default function Select<T extends string | number>({
    title,
    options,
    value,
    onChange,
    placeholder = "Selecciona...",
    className = "",
    labelClassName = "",
    disabled = false,
}: SelectProps<T>) {
    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className={clsx(className)}>
            {title && (
                <span
                    className={clsx(
                        "block mb-1 font-medium text-white",
                        labelClassName
                    )}>
                    {title}
                </span>
            )}
            <Listbox
                as="div"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="relative">
                <ListboxButton
                    className={clsx(
                        `relative w-full bg-transparent border border-gray-300
                         rounded-md pl-3 pr-10 py-2 text-left cursor-pointer`,
                        `focus:outline-none focus:ring-2 focus:ring-blue-500 
                         disabled:opacity-50 disabled:cursor-not-allowed`
                    )}>
                    <span className="flex items-center">
                        {selectedOption && (
                            <selectedOption.icon className="text-white" />
                        )}
                        <span
                            className={clsx(
                                "block truncate",
                                !selectedOption && "text-gray-400"
                            )}>
                            {selectedOption?.label || placeholder}
                        </span>
                    </span>
                    <ChevronDown
                        className="absolute inset-y-0 right-2 h-10 w-6 
                        text-white pointer-events-none"
                    />
                </ListboxButton>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <ListboxOptions
                        className="absolute z-10 mt-1 w-full 
                        bg-zinc-600 shadow-lg max-h-60 rounded-md py-1 
                        text-base ring-1 ring-black ring-opacity-5 
                        overflow-auto focus:outline-none">
                        {/* TODO: refactor this, active is marked as deprecated */}
                        {options.map((o) => (
                            <ListboxOption
                                key={String(o.value)}
                                value={o.value}
                                className={({ active }) =>
                                    clsx(
                                        active ? "bg-zinc-700" : "",
                                        `cursor-pointer select-none relative 
                                            py-2 pl-3 pr-9 flex items-center`
                                    )
                                }>
                                {({ selected, active }) => (
                                    <>
                                        <o.icon />
                                        <span
                                            className={clsx(
                                                "block truncate",
                                                selected
                                                    ? "font-semibold"
                                                    : "font-normal"
                                            )}>
                                            {o.label}
                                        </span>
                                        {selected && (
                                            <span
                                                className={clsx(
                                                    active
                                                        ? "text-blue-600"
                                                        : "text-blue-600",
                                                    `absolute inset-y-0 right-0 
                                                     flex items-center pr-4`
                                                )}>
                                                <Check color="white" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Transition>
            </Listbox>
        </div>
    );
}
