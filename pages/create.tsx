import { Button, Input, Layout, Select } from "components";
import { MARKET_ADDRESS } from "lib/constants";
import { useERC721Contract, useMarketContract } from "lib/contracts";
import { useWeb3 } from "lib/web3";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import { range } from 'lodash';
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function Create() {
  const { account, web3, connect } = useWeb3();
  const [ approved, setApproved ] = useState(false);
  const [loading, setLoading] = useState(false);
  const market = useMarketContract();
  const { register, handleSubmit, watch } = useForm<any>({ defaultValues: { duration: "86400", type: "0" } });
  const collection = watch('collection');
  const tokenId = watch('tokenId');
  const type = watch('type');
  const erc721 = useERC721Contract(collection);
  const router = useRouter()

  useEffect(() => {
    if (!collection || !tokenId || !Web3.utils.isAddress(collection)) return;

    async function run() {
      const result = await erc721.methods.getApproved(tokenId).call();
      setApproved(result === MARKET_ADDRESS);
    }

    run();
  }, [tokenId, collection]);

  async function handleCreate(params) {
    if (!account) {
      await connect();
    }

    if (!approved) {
      setLoading(true);
      try {
        await erc721.methods.approve(MARKET_ADDRESS, params.tokenId).send({ from: account });
        setApproved(true);
        toast.success('Approved');
      } catch(e) {}
      setLoading(false);
    } else {
      setLoading(true);
      try {
        await market.methods.createListing(
          collection,
          params.tokenId,
          web3.utils.toWei(params.price)
        ).send({ from: account });

        toast.success('Listing created');
        router.push(`/items/${collection}::${tokenId}`);
      } catch(e) {}
      setLoading(false);
    }
  }

  const buttonLabel = !account ? 'Connect Wallet' : (approved ? 'Create Listing' : 'Approve');

  return (
    <Layout>
      <div className="container my-12">
        <div className="max-w-lg mx-auto bg-gray-900 rounded-sm p-8">
          <h1 className="text-3xl font-semibold text-red-500">Create Listing</h1>
          <p>
            Create an NFT listing using this form.
          </p>
          <hr className="my-8" />
          <form onSubmit={handleSubmit(handleCreate)}>
            <div className="space-y-6">
              <div>
                <Input
                  label="Token contract address"
                  {...register('collection', { required: true })}
                />
              </div>
              <div>
                <Input
                  label="Token ID"
                  {...register('tokenId', { required: true })}
                />
              </div>
              <div>
                <Input
                  label="Price (in POA)"
                  {...register('price', { required: true })}
                />
              </div>
              <Button type="submit" loading={loading}>
                {buttonLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Create;