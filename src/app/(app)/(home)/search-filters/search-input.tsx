"use client";

import { Input } from "@/components/ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { customCategory } from "../types";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";



interface Props {
    disabled?: boolean;
};

export const SearchInput = ({disabled}: Props) => {
    const[isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex items-center gap-2 w-full">
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen}/>
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
                <Input 
                    className="pl-11 pr-4" 
                    placeholder="Search for products" 
                    disabled={disabled}
                />
            </div>
            <Button
                variant="elevated"
                className="size-12 shrink-0 flex lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
            
            >
                <ListFilterIcon />
            </Button>
            {/* TODO: Add library Button */}
        </div>
    )
}