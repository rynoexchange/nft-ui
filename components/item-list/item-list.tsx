import { Item } from "components";

export function ItemList({ items }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map(item => <Item id={item.id} />)}
    </div>
  )
}