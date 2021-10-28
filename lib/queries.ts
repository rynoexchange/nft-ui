import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query items {
    items(first: 12, orderBy: createdAt, orderDirection: desc, where: { price_gt: 0 }) {
      id
      price
    }
  }
`;

export const GET_COLLECTION_ITEMS = collectionId => gql`
  query items {
    items(first: 12, orderBy: createdAt, orderDirection: desc, where: { collection: "${collectionId}", price_gt: 0 }) {
      id
      price
    }
  }
`;

export const GET_MY_LISTINGS = (address: string) => gql`
  query listings {
    items(orderBy: listedAt, orderDirection: desc, where: { owner: "${address}" }) {
      id
      price
      owner
    }
  }
`

export const GET_ITEM = (id: string) => gql`
  query item {
    items(where: { id: "${id}" }) {
      id
      price
      owner
      transactions(orderBy: "createdAt", orderDirection: "desc") {
        id
        from
        amount
        type
        createdAt
      }
    }
  }
`;