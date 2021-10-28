import { useQuery } from "@apollo/client";
import { Layout } from "components";
import { ItemList } from "components/item-list/item-list";
import { GET_MY_LISTINGS } from "lib/queries";
import { useWeb3 } from "lib/web3";
import React from "react";

function MyListings() {
  const { account } = useWeb3();
  const { data } = useQuery(GET_MY_LISTINGS(account))
  const items = data?.items || []

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="font-semibold text-xl mb-5">My listings</h1>
        <ItemList items={items} />
      </div>
    </Layout>
  )
}

export default MyListings;