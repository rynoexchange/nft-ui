import { useWeb3 } from "lib/web3";
import Link from 'next/link';
import { useItem } from "lib/hooks";
import cx from 'classnames';

export function Item({ id }: { id: string }) {
  const item = useItem(id);

  return (
    <Link href={`/items/${item.id}`}>
      <a className={cx('text-white bg-gray-900 overflow-hidden rounded-sm block', { 'animate-pulse': item.price === undefined })}>
        <span
          className="block bg-cover bg-center"
          style={{ width: '100%', paddingBottom: '100%', backgroundImage: `url(${item.image})` }}
        />
        <span className={cx('block p-4', { 'invisible': !item.price })}>
          <span className="font-semibold">{item.name}</span>
          <hr className="mt-2.5 mb-3 border-gray-700 border-dashed" />
          <span className="font-mono block">
            <span className="text-sm">
              {Number(item.priceInPOA).toLocaleString()} POA
            </span>
          </span>
        </span>
      </a>
    </Link>
  )
}