// ItemList コンポーネント（Jest テスト用）
interface Item {
  id: string;
  name: string;
  category: string;
  quantity: string;
  status: string;
  registered_by: string;
  party_id: string;
}

interface ItemListProps {
  items: Item[];
  currentUserId: string;
  onStatusToggle?: (item: Item) => void;
}

export default function ItemList({ items, currentUserId, onStatusToggle }: ItemListProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>品名</th>
          <th>カテゴリ</th>
          <th>数量</th>
          <th>担当者</th>
          <th>ステータス</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>{item.registered_by}</td>
            <td>
              <button onClick={() => onStatusToggle?.(item)}>
                {item.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
