import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  user: User;
  onBack: () => void;
}

const AdminPanel = ({ user, onBack }: AdminPanelProps) => {
  const [targetUser, setTargetUser] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const { toast } = useToast();

  const handleGiveBalance = () => {
    const target = storage.getUserByEmailOrNickname(targetUser);
    if (!target) {
      toast({ title: 'Ошибка', description: 'Пользователь не найден', variant: 'destructive' });
      return;
    }

    const amount = parseInt(balanceAmount);
    if (isNaN(amount)) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }

    const updatedUser = { ...target, balance: target.balance + amount };
    storage.saveUser(updatedUser);
    toast({ title: 'Успешно', description: `Выдано ${amount} монет пользователю ${target.nickname}` });
  };

  const handleGrantAdmin = () => {
    const target = storage.getUserByEmailOrNickname(targetUser);
    if (!target) {
      toast({ title: 'Ошибка', description: 'Пользователь не найден', variant: 'destructive' });
      return;
    }

    const updatedUser = { ...target, isAdmin: true, id: 'Dev-Team', status: 'Dev-Team' };
    storage.saveUser(updatedUser);
    toast({ title: 'Успешно', description: `${target.nickname} получил права администратора` });
  };

  const allUsers = storage.getUsers();

  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-6xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="text-military-gold mb-4">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold text-military-gold mb-6 flex items-center gap-2">
          <Icon name="Shield" className="text-military-explosion" size={32} />
          Админ-панель
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-military-camo/90 border-military-gold">
            <h3 className="text-xl font-bold text-white mb-4">Выдать баланс</h3>
            <div className="space-y-3">
              <Input
                placeholder="Никнейм или ID"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                className="bg-military-dark border-military-camo text-white"
              />
              <Input
                placeholder="Сумма"
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="bg-military-dark border-military-camo text-white"
              />
              <Button onClick={handleGiveBalance} className="w-full bg-military-explosion">
                <Icon name="DollarSign" className="mr-2" />
                Выдать баланс
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-military-camo/90 border-military-gold">
            <h3 className="text-xl font-bold text-white mb-4">Выдать админку</h3>
            <div className="space-y-3">
              <Input
                placeholder="Никнейм или ID"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                className="bg-military-dark border-military-camo text-white"
              />
              <Button onClick={handleGrantAdmin} className="w-full bg-military-danger">
                <Icon name="Shield" className="mr-2" />
                Назначить админом
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-military-camo/90 border-military-gold mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Все пользователи ({allUsers.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allUsers.map(u => (
              <div key={u.id} className="bg-military-dark p-3 rounded flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{u.nickname}</p>
                  <p className="text-xs text-gray-400">{u.id} | Баланс: {u.balance}</p>
                </div>
                {u.isAdmin && <span className="text-military-gold">👑 Админ</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
