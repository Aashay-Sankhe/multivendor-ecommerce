//TODO HERE: CREATE THE NAVBAR, SEARCH FILTERS, FOOTER HERE and MOVE ASYNC FROM PAGE TO HERE
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {Category} from '@/payload-types'


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
        pagination: false,
        where: {
          parent: {
            exists: false,
          },
        },
      });

      const formattedData = data.docs.map((doc)=> ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((doc)=> ({
          ...(doc as Category),
          subcategories: undefined,
        }))
      }))

    return (
        <div className = "flex flex-col min-h-screen">
            <Navbar />
            <SearchFilters data={formattedData}/>
            {children}
        </div>
    )
}

export default Layout;