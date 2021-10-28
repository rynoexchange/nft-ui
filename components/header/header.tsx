import logo from 'lib/assets/logo-white.svg';
import { useWeb3 } from 'lib/web3';
import { Fragment } from 'react';
import Link from 'next/link';

export function Header() {
  const { account, connect } = useWeb3();

  return (
    <div className="bg-gray-900 border-b border-gray-800 text-white text-sm font-mono">
      <div className="container py-4 md:flex items-center">
        <div className="flex-1 mb-3 md:mb-0">
          <a href="/">
            <img src={logo.src} style={{ height: 22 }} />
          </a>
        </div>
        <div className="flex space-x-6 items-center">
          {account ? (
            <Fragment>
              <Link href="/create">
                <a>Create</a>
              </Link>
              <Link href="/my">
                <a>My Listings</a>
              </Link>
              <div className="bg-gray-800 flex-1 md:w-36 rounded-sm px-3 py-2 truncate">{account}</div>
            </Fragment>
          ) : (
            <a onClick={connect} className="border border-red-500 px-3 py-2">Connect Wallet</a>
          )}
        </div>
      </div>
    </div>
  )
}