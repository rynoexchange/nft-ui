import { Button, Input, Layout } from "components";
import { useCollection, useItem } from "lib/hooks";
import { useRouter } from "next/router"
import TimeAgo from "react-timeago";
import Web3 from "web3";
import Link from 'next/link';
import { Clock, ExternalLink } from "react-feather";
import { useWeb3 } from "lib/web3";
import { Fragment, useRef, useState } from "react";
import { useMarketContract } from "lib/contracts";
import dayjs from 'dayjs';

function Item() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return null;

  const item = useItem(id);
  const collection = useCollection(item.collectionId);
  const inputRef = useRef<HTMLInputElement>();
  const { account, connect } = useWeb3();
  const [loading, setLoading] = useState(false);
  const marketContract = useMarketContract();

  async function handleAction() {
    if (!account) {
      await connect();
      return;
    }

    setLoading(true);
    try {
      if (item.owner === account) {
        await marketContract.methods.removeListing(item.collectionId, item.tokenId).send({ from: account });
      } else {
        await marketContract.methods.buyListing(item.collectionId, item.tokenId).send({ from: account, value: item.price });
      }
    } catch(e) {}
    setLoading(false);
  }

  const buttonLabel = account ? (item.owner === account ? 'Remove listing' : 'Buy now') : 'Connect Wallet';

  return (
    <Layout>
      <div className="container py-8">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="mb-8 md:mb-0">
            <div className="bg-gray-800 border border-gray-800 mb-8">
              <img src={item.image} className="w-full rounded-sm shadow-xl" />
            </div>
            {item.priceInPOA > 0 && (
              <Fragment>
                <div className="bg-gray-800 border border-gray-700 rounded-sm grid grid-cols-2 divide-x divide-gray-700">
                  <div className="p-4 text-center">
                    <p className="uppercase font-bold text-sm mb-1 text-red-600">
                      Item Price
                    </p>
                    <p className="font-mono text-xl leading-none">
                      {item.priceInPOA.toLocaleString()} POA
                    </p>
                  </div>
                  <div className="p-3 flex flex-col justify-center items-center">
                    <Button onClick={handleAction} loading={loading} block>{buttonLabel}</Button>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="bg-gray-800s lg:border-l border-gray-700 border-dashesd lg:pl-8 rounded-sm">
              <p className="text-lg font-medium">
                <Link href={`/collections/${item.collectionId}`}>
                  <a>{collection.name}</a>
                </Link>
              </p>
              <h1 className="text-4xl font-bold">{item.name}</h1>
              <p className="mb-8 w-full">
                <span className="mr-1">Owened by</span>
                <a
                  href={`https://blockscout.com/poa/core/address/${item?.owner}`}
                  target="_blank"
                  className="font-mono text-red-200 border-b border-dashed border-gray-700 truncate block">
                  {item.owner}
                </a>
              </p>
              <h3 className="mb-3 font-semibold text-lg">Details</h3>
              <div className="mb-8 bg-gray-900 p-4 rounded-sm space-y-4">
                <div>
                  <span className="font-bold text-sm block">Description</span>
                  {item.description}
                </div>
                <div>
                  <span className="font-bold text-sm block">Token URI</span>
                  <a href={item.tokenURI} target="_blank" className="truncate block">
                    {item.tokenURI}
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <span className="font-bold text-sm block">Contract</span>
                    <a href={`https://blockscout.com/poa/core/token/${item.collectionId}`} target="_blank" className="truncate block">
                      {item.collectionId}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Token ID</span>
                    {item.tokenId}
                  </div>
                </div>
              </div>
              <h3 className="mb-3 font-semibold text-lg">History</h3>
              <div className="bg-gray-900 rounded-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <td className="px-4 py-3">Type</td>
                      <td className="px-4 py-3">From</td>
                      <td className="text-right px-4 py-3">Price</td>
                      <td className="text-right px-4 py-3">Time</td>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {item.transactions?.map(transaction => (
                      <tr>
                        <td className="border-t border-gray-800 px-4 py-3">
                          <a href={`https://blockscout.com/poa/core/tx/${transaction.id}`} target="_blank" className="flex items-center space-x-1">
                            <span>{transaction.type}</span>
                            <ExternalLink size="0.85em" />
                          </a>
                        </td>
                        <td className="relative w-1/4 border-t border-gray-800">
                          <span className="absolute inset-0 truncate px-4 py-3">
                            {transaction.from}
                          </span>
                        </td>
                        <td className="relative w-1/4 border-t border-gray-800 px-4 py-3 text-right">
                          {Number(transaction.amount) ? `${Web3.utils.fromWei(transaction.amount, 'ether')} POA` : '-'}
                        </td>
                        <td className="text-right border-t border-gray-800 px-4 py-3">
                          <TimeAgo date={new Date(transaction.createdAt * 1000)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Item;