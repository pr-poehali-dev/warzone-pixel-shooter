import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from '@/lib/storage';

interface MultiplayerScreenProps {
  user: User;
  onBack: () => void;
}

const MultiplayerScreen = ({ user, onBack }: MultiplayerScreenProps) => {
  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="text-military-gold mb-4">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold text-military-gold mb-6 text-center">Мультиплеер 2x2</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 bg-military-camo/90 border-military-gold">
            <Icon name="Search" className="text-military-explosion mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Поиск матча</h3>
            <p className="text-gray-300 mb-4">Автоматический подбор противников 2 на 2</p>
            <Button className="w-full bg-military-explosion hover:bg-military-danger">
              <Icon name="Play" className="mr-2" />
              Искать матч
            </Button>
          </Card>

          <Card className="p-6 bg-military-camo/90 border-military-gold">
            <Icon name="Users" className="text-military-gold mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Играть с друзьями</h3>
            <p className="text-gray-300 mb-4">Пригласите друзей в команду</p>
            <Button className="w-full bg-military-camo hover:bg-military-dark border-2 border-military-gold">
              <Icon name="UserPlus" className="mr-2" />
              Пригласить друзей
            </Button>
          </Card>
        </div>

        <div className="mt-6 text-center text-gray-400">
          <p>В сети: {Math.floor(Math.random() * 100 + 50)} игроков</p>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerScreen;
