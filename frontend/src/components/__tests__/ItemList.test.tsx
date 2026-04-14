// frontend/src/components/__tests__/ItemList.test.tsx
import { render, screen } from '@testing-library/react';
import ItemList from '../ItemList';

const mockItems = [
  { id: '1', name: '唐揚げ', category: '料理', quantity: '4人前', status: '準備中', registered_by: 'user1', party_id: 'p1' },
  { id: '2', name: 'ビール', category: '飲み物', quantity: '6本', status: '完了', registered_by: 'user2', party_id: 'p1' },
];

test('アイテム一覧が表示される', () => {
  render(<ItemList items={mockItems} currentUserId="user1" />);
  expect(screen.getByText('唐揚げ')).toBeInTheDocument();
  expect(screen.getByText('ビール')).toBeInTheDocument();
});

test('完了アイテムに完了バッジがつく', () => {
  render(<ItemList items={mockItems} currentUserId="user1" />);
  expect(screen.getByText('完了')).toBeInTheDocument();
});
