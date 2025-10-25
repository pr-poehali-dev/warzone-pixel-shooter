import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/storage';

interface MainMenuProps {
  user: User;
  onNavigate: (screen: string) => void;
  onStartLevel: (level: number) => void;
  onLogout: () => void;
}

const MainMenu = ({ user, onNavigate, onStartLevel, onLogout }: MainMenuProps) => {
  const menuItems = [
    { icon: 'User', label: 'Профиль', screen: 'profile' },
    { icon: 'Gamepad2', label: 'Играть', action: () => onStartLevel(1) },
    { icon: 'Users', label: 'Мультиплеер', screen: 'multiplayer' },
    { icon: 'UserPlus', label: 'Друзья', screen: 'friends' },
    { icon: 'ShoppingCart', label: 'Магазин', screen: 'shop' },
    { icon: 'MessageSquare', label: 'Чат', screen: 'chat' },
  ];

  if (user.isAdmin) {
    menuItems.push({ icon: 'Shield', label: 'Админ-панель', screen: 'admin' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-game-darker bg-[radial-gradient(circle_at_50%_50%,_rgba(147,51,234,0.1)_0%,_transparent_50%)]">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold text-game-gold mb-4 animate-pulse-glow drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          WARZONE
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <span className="text-xl">{user.avatar}</span>
          <span className="text-lg text-game-cyan">{user.nickname}</span>
          <span className="text-sm text-game-purple">ID: {user.id}</span>
          <span className="text-sm text-game-gold">| {user.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => item.action ? item.action() : onNavigate(item.screen!)}
            className="h-20 text-lg bg-game-dark hover:bg-game-purple border-2 border-game-purple hover:border-game-cyan text-white font-bold transition-all hover:scale-105 shadow-lg shadow-game-purple/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon name={item.icon as any} className="mr-3" size={24} />
            {item.label}
          </Button>
        ))}
      </div>

      <Button
        onClick={onLogout}
        variant="ghost"
        className="mt-8 text-game-explosion hover:text-red-600 hover:bg-game-dark/50"
      >
        <Icon name="LogOut" className="mr-2" size={18} />
        Выйти
      </Button>
    </div>
  );
};

export default MainMenu;