import { createContext, useContext, useState } from "react";
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import canUseDom from 'can-use-dom';

const Web3Context = createContext<{ account: string, web3: Web3, connect: () => Promise<void> }>(null);

const web3Modal = canUseDom && new Web3Modal({
  network: 'poa-core',
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          99: 'https://core.poa.network'
        },
        chainId: 99,
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true
      }
    }
  }
});

function defaultWeb3() {
  return new Web3('https://core.poa.network');
}

function Web3Provider({ children }) {
  const [account, setAccount] = useState<string>(null);
  const [web3, setWeb3] = useState<Web3>(defaultWeb3());

  async function handleConnect() {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    setWeb3(web3);

    setAccount((await web3.eth.getAccounts())[0].toLowerCase());

    provider.on("accountsChanged", (accounts) => {
      setAccount(accounts[0].toLowerCase());
    });

    provider.on("disconnect", () => {
      setAccount(null);
    });
  }

  return (
    <Web3Context.Provider value={{ account, web3, connect: handleConnect }}>
      {children}
    </Web3Context.Provider>
  )
}

function useWeb3() {
  return useContext(Web3Context)
}

export { Web3Context, Web3Provider, useWeb3 };