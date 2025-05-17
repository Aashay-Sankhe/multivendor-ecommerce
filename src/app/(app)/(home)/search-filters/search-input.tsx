import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";


interface Props {
    disabled?: boolean;
};

export const SearchInput = ({disabled,}: Props) => {
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
                <Input 
                    className="pl-11 pr-4" 
                    placeholder="Search for products" 
                    disabled={disabled}
                />
            </div>
            {/* TODO: Add Categories Button */}
            {/* TODO: Add library Button */}
        </div>
    )
}