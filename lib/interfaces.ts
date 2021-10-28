export interface Collection {
  id: string;
  name?: string;
}

export interface Item {
  id: string;
  collectionId: string;
  tokenId: string;
  tokenURI?: string;
  owner?: string;
  name?: string;
  description?: string;
  image?: string;
  price?: string;
  priceInPOA?: number;
  listed?: boolean;
  sold?: boolean;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: string;
  from: string;
  amount: string;
  createdAt: number;
}