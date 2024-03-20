import { cx } from "class-variance-authority";
import type { ClassValue } from "class-variance-authority/types";
import { twMerge } from "tailwind-merge";

export * from "class-variance-authority";

export type * from "class-variance-authority";

export const cn = (...args: ClassValue[]) => twMerge(cx(args));
