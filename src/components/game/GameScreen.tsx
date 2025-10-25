import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface GameScreenProps {
  user: User;
  level: number;
  onBack: () => void;
  onUpdateUser: () => void;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  alive: boolean;
}

interface PlayerPosition {
  x: number;
  y: number;
}

const LEVEL_ENEMIES = {
  1: 5, 2: 7, 3: 10, 4: 12, 5: 15, 6: 17, 7: 20, 8: 22, 9: 25, 10: 30,
};

const GameScreen = ({ user, level, onBack, onUpdateUser }: GameScreenProps) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [playerPos, setPlayerPos] = useState<PlayerPosition>({ x: 50, y: 80 });
  const [canShoot, setCanShoot] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [explosions, setExplosions] = useState<{id: number, x: number, y: number}[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const enemyCount = LEVEL_ENEMIES[level as keyof typeof LEVEL_ENEMIES] || 5;
    const newEnemies: Enemy[] = [];
    for (let i = 0; i < enemyCount; i++) {
      newEnemies.push({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 10,
        alive: true,
      });
    }
    setEnemies(newEnemies);
  }, [level]);

  const handleShoot = (e: React.MouseEvent) => {
    if (!canShoot) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setCanShoot(false);
    setTimeout(() => setCanShoot(true), 600);

    let hit = false;
    setEnemies(prev => prev.map(enemy => {
      if (!enemy.alive) return enemy;
      const distance = Math.sqrt(Math.pow(enemy.x - clickX, 2) + Math.pow(enemy.y - clickY, 2));
      if (distance < 8) {
        hit = true;
        setExplosions(exp => [...exp, { id: Date.now(), x: enemy.x, y: enemy.y }]);
        setTimeout(() => setExplosions(exp => exp.filter(e => e.id !== Date.now())), 600);
        return { ...enemy, alive: false };
      }
      return enemy;
    }));

    if (hit && enemies.filter(e => e.alive).length === 1) {
      setTimeout(() => handleLevelComplete(), 500);
    }
  };

  const handleLevelComplete = () => {
    setGameWon(true);
    const updatedUser = { 
      ...user, 
      completedLevels: [...new Set([...user.completedLevels, level])],
      balance: user.balance + 500 
    };
    storage.saveUser(updatedUser);
    onUpdateUser();
    
    toast({
      title: `Уровень ${level} пройден! 🎖️`,
      description: `+500 монет. Враги уничтожены!`,
    });
  };

  const handleMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    setPlayerPos(prev => {
      const step = 5;
      switch (direction) {
        case 'left': return { ...prev, x: Math.max(5, prev.x - step) };
        case 'right': return { ...prev, x: Math.min(95, prev.x + step) };
        case 'up': return { ...prev, y: Math.max(50, prev.y - step) };
        case 'down': return { ...prev, y: Math.min(90, prev.y + step) };
        default: return prev;
      }
    });
  };

  const aliveEnemies = enemies.filter(e => e.alive).length;

  return (
    <div className="min-h-screen bg-military-dark text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={onBack} variant="ghost" className="text-military-gold">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-military-gold">Уровень {level}</h2>
            <p className="text-sm text-gray-300">Врагов осталось: {aliveEnemies}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-military-gold">Баланс: {user.balance}</p>
          </div>
        </div>

        <div
          ref={canvasRef}
          onClick={handleShoot}
          className="relative w-full aspect-video bg-gradient-to-b from-military-camo to-military-dark border-4 border-military-gold rounded-lg overflow-hidden cursor-crosshair"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(61, 74, 44, 0.3) 10px, rgba(61, 74, 44, 0.3) 20px)' }}
        >
          {enemies.map(enemy => enemy.alive && (
            <div
              key={enemy.id}
              className="absolute w-4 h-4 bg-military-danger rounded-sm animate-pulse"
              style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
            />
          ))}

          {explosions.map(exp => (
            <div
              key={exp.id}
              className="absolute w-8 h-8 bg-military-explosion rounded-full animate-explosion"
              style={{ left: `${exp.x}%`, top: `${exp.y}%` }}
            />
          ))}

          <div
            className="absolute w-4 h-4 bg-green-500 rounded-sm"
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          />

          {gameWon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-military-gold mb-4">Победа! 🎖️</h3>
                <Button onClick={onBack} className="bg-military-explosion hover:bg-military-danger">
                  Вернуться в меню
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto md:hidden">
          <div></div>
          <Button onClick={() => handleMove('up')} className="bg-military-camo">
            <Icon name="ArrowUp" />
          </Button>
          <div></div>
          <Button onClick={() => handleMove('left')} className="bg-military-camo">
            <Icon name="ArrowLeft" />
          </Button>
          <div className="flex items-center justify-center text-xs text-gray-400">Джойстик</div>
          <Button onClick={() => handleMove('right')} className="bg-military-camo">
            <Icon name="ArrowRight" />
          </Button>
          <div></div>
          <Button onClick={() => handleMove('down')} className="bg-military-camo">
            <Icon name="ArrowDown" />
          </Button>
          <div></div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Клик - выстрел (КД 0.6с) | Двойной клик - авиабомба | WASD/Джойстик - движение
        </p>
      </div>
    </div>
  );
};

export default GameScreen;
