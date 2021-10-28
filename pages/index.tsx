import { useQuery } from "@apollo/client";
import { Layout, Loader } from "components";
import { ItemList } from "components/item-list/item-list";
import { GET_ITEMS } from "lib/queries";

function Index() {
  const { data, loading } = useQuery(GET_ITEMS);
  const items = data?.items || []

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="font-semibold text-xl mb-5">New items</h1>
        {loading && <Loader />}
        <ItemList items={items} />
      </div>
    </Layout>
  )
}

export default Index;