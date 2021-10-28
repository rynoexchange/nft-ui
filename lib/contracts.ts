import { MARKET_ADDRESS } from "./constants";
import { useWeb3 } from "./web3";
import marketAbi from './abis/market.json';
import erc721Abi from './abis/erc721.json';

export function useMarketContract() {
  const { web3 } = useWeb3();
  return new web3.eth.Contract(marketAbi as any, MARKET_ADDRESS);
}

export function useERC721Contract(address: string) {
  const { web3 } = useWeb3();
  if (!web3.utils.isAddress(address)) return;
  return new web3.eth.Contract(erc721Abi as any, address);
}