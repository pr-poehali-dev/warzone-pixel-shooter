import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface ShopScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: () => void;
}

const WEAPONS = [
  { id: 'pistol', name: 'Пистолет M9', price: 500, icon: '🔫' },
  { id: 'rifle', name: 'Автомат AK-47', price: 1500, icon: '🔫' },
  { id: 'sniper', name: 'Снайперская винтовка', price: 3000, icon: '🎯' },
  { id: 'grenade', name: 'Граната', price: 200, icon: '💣' },
  { id: 'missile', name: 'Боеголовка', price: 5000, icon: '🚀' },
];

const VEHICLES = [
  { id: 'jeep', name: 'Военный джип', price: 3500, icon: '🚙' },
  { id: 'truck', name: 'Грузовик', price: 5000, icon: '🚚' },
  { id: 'apc', name: 'БТР', price: 8000, icon: '🚐' },
  { id: 'hummer', name: 'Хаммер', price: 10000, icon: '🛻' },
];

const TANKS = [
  { id: 't72', name: 'Т-72', price: 15000, icon: '🛡️' },
  { id: 't90', name: 'Т-90', price: 25000, icon: '🛡️' },
  { id: 'abrams', name: 'M1 Abrams', price: 35000, icon: '🛡️' },
  { id: 'leopard', name: 'Leopard 2', price: 45000, icon: '🛡️' },
];

const ShopScreen = ({ user, onBack, onUpdateUser }: ShopScreenProps) => {
  const [activeTab, setActiveTab] = useState('weapons');
  const { toast } = useToast();

  const handlePurchase = (itemId: string, price: number, category: 'weapons' | 'vehicles' | 'tanks') => {
    if (user.balance < price) {
      toast({
        title: 'Недостаточно средств',
        description: 'Пройдите уровни, чтобы заработать больше монет',
        variant: 'destructive',
      });
      return;
    }

    const updatedUser = {
      ...user,
      balance: user.balance - price,
      [category]: [...user[category], itemId],
    };
    storage.saveUser(updatedUser);
    onUpdateUser();

    toast({
      title: 'Покупка успешна! 🎖️',
      description: 'Товар добавлен в арсенал',
    });
  };

  const renderItems = (items: any[], category: 'weapons' | 'vehicles' | 'tanks') => {
    return items.map(item => {
      const owned = user[category].includes(item.id);
      return (
        <Card key={item.id} className="p-6 bg-game-dark/90 border-game-purple hover:border-game-cyan transition-all">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-bold text-white">{item.name}</h3>
            <p className="text-2xl text-game-gold font-bold mt-2">{item.price} 💰</p>
          </div>
          <Button
            onClick={() => handlePurchase(item.id, item.price, category)}
            disabled={owned}
            className={`w-full ${owned ? 'bg-gray-600' : 'bg-game-purple hover:bg-game-cyan'}`}
          >
            {owned ? (
              <>
                <Icon name="Check" className="mr-2" />
                Куплено
              </>
            ) : (
              <>
                <Icon name="ShoppingCart" className="mr-2" />
                Купить
              </>
            )}
          </Button>
        </Card>
      );
    });
  };

  return (
    <div className="min-h-screen bg-game-darker p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="text-game-cyan">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          <div className="text-right">
            <p className="text-sm text-gray-400">Баланс</p>
            <p className="text-2xl text-game-gold font-bold">{user.balance} 💰</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-game-gold mb-6 text-center">ВОЕННЫЙ МАГАЗИН</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-game-dark">
            <TabsTrigger value="weapons" className="data-[state=active]:bg-game-purple">
              🔫 Оружие
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-game-purple">
              🚙 Машины
            </TabsTrigger>
            <TabsTrigger value="tanks" className="data-[state=active]:bg-game-purple">
              🛡️ Танки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weapons" className="grid md:grid-cols-3 gap-4">
            {renderItems(WEAPONS, 'weapons')}
          </TabsContent>

          <TabsContent value="vehicles" className="grid md:grid-cols-2 gap-4">
            {renderItems(VEHICLES, 'vehicles')}
          </TabsContent>

          <TabsContent value="tanks" className="grid md:grid-cols-2 gap-4">
            {renderItems(TANKS, 'tanks')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopScreen;
