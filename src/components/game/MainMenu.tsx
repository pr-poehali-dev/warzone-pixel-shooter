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
    <div className="min-h-screen flex flex-col items-center justify-center bg-military-dark bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzNkNGEyYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold text-military-gold mb-4 animate-pulse-glow" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          WARZONE
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <span className="text-xl">{user.avatar}</span>
          <span className="text-lg">{user.nickname}</span>
          <span className="text-sm text-military-gold">| {user.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            onClick={() => item.action ? item.action() : onNavigate(item.screen!)}
            className="h-20 text-lg bg-military-camo hover:bg-military-explosion border-2 border-military-gold text-white font-bold transition-all hover:scale-105"
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
        className="mt-8 text-military-danger hover:text-red-600 hover:bg-military-dark/50"
      >
        <Icon name="LogOut" className="mr-2" size={18} />
        Выйти
      </Button>
    </div>
  );
};

export default MainMenu;
