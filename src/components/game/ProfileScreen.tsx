import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onUpdateUser: () => void;
}

const ProfileScreen = ({ user, onBack, onUpdateUser }: ProfileScreenProps) => {
  const [newNickname, setNewNickname] = useState(user.nickname);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNickname = () => {
    const updatedUser = { ...user, nickname: newNickname };
    storage.saveUser(updatedUser);
    onUpdateUser();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-2xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="text-military-gold mb-4">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад в меню
        </Button>

        <Card className="bg-military-camo/90 border-military-gold">
          <CardHeader>
            <CardTitle className="text-2xl text-military-gold flex items-center gap-2">
              <span className="text-4xl">{user.avatar}</span>
              Профиль бойца
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
                <p className="text-xs text-gray-400">ID</p>
                <p className="text-lg text-white font-mono">{user.id}</p>
              </div>

              <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
                <p className="text-xs text-gray-400">Статус</p>
                <p className="text-lg text-military-gold">{user.status}</p>
              </div>

              <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
                <p className="text-xs text-gray-400">Баланс</p>
                <p className="text-lg text-green-400">{user.balance} 💰</p>
              </div>

              <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
                <p className="text-xs text-gray-400">Донат баланс</p>
                <p className="text-lg text-military-explosion">{user.donatBalance} 💎</p>
              </div>
            </div>

            <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
              <p className="text-xs text-gray-400 mb-2">Титул</p>
              <p className="text-xl text-military-gold font-bold">
                {user.completedBonusMissions ? '🎖️ Ветеран войны' : user.title}
              </p>
            </div>

            <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
              <p className="text-xs text-gray-400 mb-2">Никнейм</p>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="bg-military-dark border-military-camo text-white"
                  />
                  <Button onClick={handleSaveNickname} size="sm" className="bg-military-explosion">
                    Сохранить
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-lg text-white">{user.nickname}</p>
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                    <Icon name="Edit" size={16} />
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-military-dark/50 p-4 rounded border border-military-camo">
              <p className="text-xs text-gray-400 mb-2">Прогресс</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white">Пройдено уровней:</span>
                  <span className="text-military-gold font-bold">{user.completedLevels.length}/10</span>
                </div>
                <div className="w-full bg-military-dark rounded-full h-3">
                  <div 
                    className="bg-military-explosion h-3 rounded-full transition-all"
                    style={{ width: `${(user.completedLevels.length / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
