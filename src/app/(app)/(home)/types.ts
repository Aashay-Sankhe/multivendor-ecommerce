import { Category } from "@/payload-types";

export type customCategory = Category & {
    subcategories: Category[];
};
