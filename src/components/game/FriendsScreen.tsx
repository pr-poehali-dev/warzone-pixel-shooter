import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface FriendsScreenProps {
  user: User;
  onBack: () => void;
}

const FriendsScreen = ({ user, onBack }: FriendsScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery) return;
    const foundUser = storage.getUserByEmailOrNickname(searchQuery);
    setSearchResults(foundUser ? [foundUser] : []);
  };

  const handleAddFriend = (friendId: string) => {
    const updatedUser = {
      ...user,
      friends: [...new Set([...user.friends, friendId])],
    };
    storage.saveUser(updatedUser);
    toast({ title: 'Друг добавлен!', description: 'Теперь вы можете играть вместе' });
  };

  const friends = storage.getUsers().filter(u => user.friends.includes(u.id));

  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="text-military-gold mb-4">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold text-military-gold mb-6">Друзья</h1>

        <Card className="p-4 bg-military-camo/90 border-military-gold mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Поиск по нику или ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-military-dark border-military-camo text-white"
            />
            <Button onClick={handleSearch} className="bg-military-explosion">
              <Icon name="Search" />
            </Button>
          </div>

          {searchResults.map(result => (
            <div key={result.id} className="mt-4 flex justify-between items-center bg-military-dark p-3 rounded">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{result.avatar}</span>
                <div>
                  <p className="text-white font-bold">{result.nickname}</p>
                  <p className="text-xs text-gray-400">{result.id}</p>
                </div>
              </div>
              <Button onClick={() => handleAddFriend(result.id)} size="sm" className="bg-military-gold text-military-dark">
                <Icon name="UserPlus" className="mr-1" size={14} />
                Добавить
              </Button>
            </div>
          ))}
        </Card>

        <div className="space-y-3">
          {friends.map(friend => (
            <Card key={friend.id} className="p-4 bg-military-camo/90 border-military-camo">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{friend.avatar}</span>
                  <div>
                    <p className="text-white font-bold">{friend.nickname}</p>
                    <p className="text-sm text-military-gold">{friend.title}</p>
                  </div>
                </div>
                <Button size="sm" className="bg-military-explosion">
                  <Icon name="Gamepad2" className="mr-1" size={14} />
                  Пригласить в матч
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {friends.length === 0 && (
          <p className="text-center text-gray-400 mt-8">У вас пока нет друзей. Найдите товарищей по оружию!</p>
        )}
      </div>
    </div>
  );
};

export default FriendsScreen;
