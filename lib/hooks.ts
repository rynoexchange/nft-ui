import { useQuery } from "@apollo/client";
import axios from "axios";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMarketContract, useERC721Contract } from "./contracts";
import { Collection, Item } from "./interfaces";
import { GET_ITEM } from "./queries";
import { useWeb3 } from "./web3";

export function useCollection(id: string): Collection {
  const [data, setData] = useState<Collection>({ id });
  const collectionContract = useERC721Contract(id);

  useEffect(() => {
    async function run() {
      const name = await collectionContract.methods.name().call();
      setData({ ...data, name });
    }

    run();
  }, [id]);

  return data;
}

export function useItem(id: string) {
  const { data: response } = useQuery(GET_ITEM(id));
  const [collection, tokenId] = id.split('::');
  const collectionContract = useERC721Contract(collection);
  const [data, setData] = useState<Item>({
    id,
    tokenId,
    collectionId: collection
  });

  useEffect(() => {
    if (!response) return;
    setData(data => ({
      ...data,
      ...response.items[0],
      priceInPOA: Number(Web3.utils.fromWei(response?.items[0]?.price || '0', 'ether'))
    }));
  }, [response]);

  useEffect(() => {
    async function run() {
      const uri = await collectionContract.methods.tokenURI(tokenId).call();
      const { data: details } = await axios.get<Item>(uri);
      details.tokenURI = uri;
      setData(data => ({ ...data, ...details }));
    }

    run();
  }, [id]);

  return data;
}

export function useListingActions(collection: string, tokenId: string) {
  const { account } = useWeb3();
  const marketContract = useMarketContract();

  async function create({ minOffer, maxOffer, duration }) {
    await marketContract.methods.createListing(
      collection, tokenId, minOffer, maxOffer, duration
    ).send({ from: account });
  }

  async function remove() {
    await marketContract.methods.removeListing(collection, tokenId).send({ from: account });
  }

  async function bid({ amount }) {
    await marketContract.methods.bid(collection, tokenId).send({ from: account, value: amount });
  }

  return { create, remove, bid };
}