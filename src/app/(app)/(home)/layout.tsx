//TODO HERE: CREATE THE NAVBAR, SEARCH FILTERS, FOOTER HERE and MOVE ASYNC FROM PAGE TO HERE
import configPromise from '@payload-config'
import { getPayload } from 'payload'


import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";

interface Props {
    children: React.ReactNode; 
};

const Layout = async({ children }: Props) => {
    const payload = await getPayload({
        config: configPromise,
      });
      const data = await payload.find({
        collection: 'categories',
        depth: 1,
        where: {
          parent: {
            exists: false,
          },
        },
      });
    return (
        <div className = "flex flex-col min-h-screen">
            <Navbar />
            <SearchFilters data={data}/>
            {children}
        </div>
    )
}

export default Layout;