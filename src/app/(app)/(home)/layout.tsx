
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { dehydrate } from "@tanstack/react-query";
import { Navbar } from "./navbar";
import { SearchFilters, SearchFiltersLoading } from "./search-filters";
import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    children: React.ReactNode;
};

const Layout = async({ children }: Props) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  );
    return (
        <div className = "flex flex-col min-h-screen">
            <Navbar />
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<SearchFiltersLoading />}>
                <SearchFilters />
              </Suspense>
              
            </HydrationBoundary>
            
            {children}
        </div>
    )
}

export default Layout;