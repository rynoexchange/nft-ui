import { useQuery } from "@apollo/client";
import { Layout, Loader } from "components";
import { ItemList } from "components/item-list/item-list";
import { useCollection } from "lib/hooks";
import { GET_COLLECTION_ITEMS } from "lib/queries";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return null;

  const collection = useCollection(id);
  const { data, loading } = useQuery(GET_COLLECTION_ITEMS(id));
  const items = data?.items || []

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="font-semibold text-xl mb-5">{collection.name}</h1>
        {loading && <Loader />}
        <ItemList items={items} />
      </div>
    </Layout>
  )
}

export default Index;