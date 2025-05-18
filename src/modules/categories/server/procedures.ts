import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

// Define the return type explicitly
export type CategoryWithSubcategories = Omit<Category, 'subcategories'> & {
    subcategories?: CategoryWithSubcategories[];
};

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ctx}): Promise<CategoryWithSubcategories[]> => {
        const data = await ctx.db.find({
            collection: 'categories',
            depth: 1,
            pagination: false,
            where: {
                parent: {
                    exists: false,
                },
            },
            sort: "name"
        }); 
        
        const formattedData = data.docs.map((doc): CategoryWithSubcategories => ({
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((subdoc): CategoryWithSubcategories => ({
                ...(subdoc as Category),
                subcategories: undefined,
            }))
        }));
        
        return formattedData;
    }),
});