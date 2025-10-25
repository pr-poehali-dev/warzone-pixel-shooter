import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  { id: 'tank', name: 'Танк Т-90', price: 10000, icon: '🛡️' },
];

const ShopScreen = ({ user, onBack, onUpdateUser }: ShopScreenProps) => {
  const { toast } = useToast();

  const handlePurchase = (weaponId: string, price: number) => {
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
      weapons: [...user.weapons, weaponId],
    };
    storage.saveUser(updatedUser);
    onUpdateUser();

    toast({
      title: 'Покупка успешна! 🎖️',
      description: 'Оружие добавлено в арсенал',
    });
  };

  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="text-military-gold">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          <div className="text-right">
            <p className="text-sm text-gray-400">Баланс</p>
            <p className="text-2xl text-green-400 font-bold">{user.balance} 💰</p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-military-gold mb-6 text-center">Военный магазин</h1>

        <div className="grid md:grid-cols-3 gap-4">
          {WEAPONS.map(weapon => {
            const owned = user.weapons.includes(weapon.id);
            return (
              <Card key={weapon.id} className="p-6 bg-military-camo/90 border-military-gold">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{weapon.icon}</div>
                  <h3 className="text-lg font-bold text-white">{weapon.name}</h3>
                  <p className="text-2xl text-military-gold font-bold mt-2">{weapon.price} 💰</p>
                </div>
                <Button
                  onClick={() => handlePurchase(weapon.id, weapon.price)}
                  disabled={owned}
                  className={`w-full ${owned ? 'bg-gray-600' : 'bg-military-explosion hover:bg-military-danger'}`}
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopScreen;
