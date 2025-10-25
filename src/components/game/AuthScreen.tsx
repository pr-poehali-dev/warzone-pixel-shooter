import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
  });
  const { toast } = useToast();

  const handleLogin = () => {
    const user = storage.getUserByEmailOrNickname(formData.nickname);
    
    if (!user) {
      toast({
        title: 'Ошибка входа',
        description: 'Пользователь не найден',
        variant: 'destructive',
      });
      return;
    }

    if (user.password !== formData.password) {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
      return;
    }

    onLogin(user);
  };

  const handleRegister = () => {
    if (!formData.email || !formData.nickname || !formData.password) {
      toast({
        title: 'Ошибка регистрации',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const existingUser = storage.getUserByEmailOrNickname(formData.email);
    if (existingUser) {
      toast({
        title: 'Ошибка регистрации',
        description: 'Email уже используется',
        variant: 'destructive',
      });
      return;
    }

    const existingNickname = storage.getUserByEmailOrNickname(formData.nickname);
    if (existingNickname) {
      toast({
        title: 'Ошибка регистрации',
        description: 'Никнейм уже занят',
        variant: 'destructive',
      });
      return;
    }

    const newUser: User = {
      id: storage.generateNumericId(),
      email: formData.email,
      nickname: formData.nickname,
      password: formData.password,
      balance: 1000,
      donatBalance: 0,
      title: 'Новобранец',
      status: 'Рядовой',
      avatar: '🎮',
      level: 1,
      completedLevels: [],
      completedBonusMissions: false,
      isAdmin: false,
      weapons: [],
      vehicles: [],
      tanks: [],
      friends: [],
    };

    storage.saveUser(newUser);
    toast({
      title: 'Регистрация успешна!',
      description: 'Добро пожаловать в WarZone',
    });
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-darker bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.1)_0%,_transparent_50%)]">
      <Card className="w-full max-w-md mx-4 bg-game-dark/90 border-game-purple shadow-2xl shadow-game-purple/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Crosshair" className="text-game-purple" size={40} />
            <CardTitle className="text-4xl font-bold text-game-gold" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              WARZONE
            </CardTitle>
          </div>
          <p className="text-sm text-gray-300">
            {isRegistering ? 'Регистрация бойца' : 'Вход в зону боевых действий'}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="soldier@warzone.com"
                className="bg-game-darker border-game-purple text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-gray-200">
              {isRegistering ? 'Никнейм' : 'Логин/Никнейм'}
            </Label>
            <Input
              id="nickname"
              placeholder="СолдатУдачи"
              className="bg-military-dark border-military-camo text-white"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-military-dark border-military-camo text-white"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-game-purple hover:bg-game-cyan text-white font-bold"
          >
            {isRegistering ? (
              <>
                <Icon name="UserPlus" className="mr-2" size={18} />
                Зарегистрироваться
              </>
            ) : (
              <>
                <Icon name="LogIn" className="mr-2" size={18} />
                Войти
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-game-cyan hover:text-game-purple hover:bg-game-darker/50"
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Регистрация'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;