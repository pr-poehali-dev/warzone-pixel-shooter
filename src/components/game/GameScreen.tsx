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

interface Entity {
  id: number;
  x: number;
  y: number;
  alive: boolean;
  type: 'soldier' | 'vehicle' | 'tank';
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

const LEVEL_CONFIG = {
  1: { soldiers: 5, vehicles: 0, tanks: 0 },
  2: { soldiers: 7, vehicles: 1, tanks: 0 },
  3: { soldiers: 10, vehicles: 1, tanks: 0 },
  4: { soldiers: 12, vehicles: 2, tanks: 0 },
  5: { soldiers: 15, vehicles: 2, tanks: 1 },
  6: { soldiers: 17, vehicles: 2, tanks: 1 },
  7: { soldiers: 20, vehicles: 3, tanks: 1 },
  8: { soldiers: 22, vehicles: 3, tanks: 2 },
  9: { soldiers: 25, vehicles: 4, tanks: 2 },
  10: { soldiers: 30, vehicles: 5, tanks: 3 },
};

const GameScreen = ({ user, level, onBack, onUpdateUser }: GameScreenProps) => {
  const [enemies, setEnemies] = useState<Entity[]>([]);
  const [allies, setAllies] = useState<Entity[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 });
  const [canShoot, setCanShoot] = useState(true);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const lastClickTimeRef = useRef<number>(0);
  const shootSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    shootSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=');
    explosionSoundRef.current = new Audio('data:audio/wav;base64,UklGRhQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfADAAAAAP7/AQD+/wIA/f8DAP3/BAD8/wUA/P8GAPs/Bw==');
    
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];
    const newEnemies: Entity[] = [];
    let id = 0;

    for (let i = 0; i < config.soldiers; i++) {
      newEnemies.push({
        id: id++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 5,
        alive: true,
        type: 'soldier',
      });
    }

    for (let i = 0; i < config.vehicles; i++) {
      newEnemies.push({
        id: id++,
        x: Math.random() * 75 + 10,
        y: Math.random() * 25 + 5,
        alive: true,
        type: 'vehicle',
      });
    }

    for (let i = 0; i < config.tanks; i++) {
      newEnemies.push({
        id: id++,
        x: Math.random() * 70 + 10,
        y: Math.random() * 20 + 5,
        alive: true,
        type: 'tank',
      });
    }

    setEnemies(newEnemies);

    const allyCount = Math.min(3, Math.floor(level / 2));
    const newAllies: Entity[] = [];
    for (let i = 0; i < allyCount; i++) {
      newAllies.push({
        id: id++,
        x: 50 + (i - 1) * 8,
        y: 75,
        alive: true,
        type: 'soldier',
      });
    }
    setAllies(newAllies);
  }, [level]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExplosions(prev => prev.filter(exp => Date.now() - exp.timestamp < 600));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const now = Date.now();
    const isDoubleClick = now - lastClickTimeRef.current < 300;
    lastClickTimeRef.current = now;

    if (isDoubleClick) {
      handleAirStrike(clickX, clickY);
    } else {
      handleShoot(clickX, clickY);
    }
  };

  const handleShoot = (clickX: number, clickY: number) => {
    if (!canShoot) return;

    setCanShoot(false);
    setTimeout(() => setCanShoot(true), 600);

    if (shootSoundRef.current) {
      shootSoundRef.current.currentTime = 0;
      shootSoundRef.current.play().catch(() => {});
    }

    let hit = false;
    setEnemies(prev => prev.map(enemy => {
      if (!enemy.alive) return enemy;
      
      const hitRadius = enemy.type === 'soldier' ? 3 : enemy.type === 'vehicle' ? 4 : 5;
      const distance = Math.sqrt(Math.pow(enemy.x - clickX, 2) + Math.pow(enemy.y - clickY, 2));
      
      if (distance < hitRadius) {
        hit = true;
        createExplosion(enemy.x, enemy.y);
        return { ...enemy, alive: false };
      }
      return enemy;
    }));

    if (hit) {
      setTimeout(() => checkWinCondition(), 100);
    }
  };

  const handleAirStrike = (clickX: number, clickY: number) => {
    if (explosionSoundRef.current) {
      explosionSoundRef.current.currentTime = 0;
      explosionSoundRef.current.play().catch(() => {});
    }

    createExplosion(clickX, clickY);

    setEnemies(prev => prev.map(enemy => {
      if (!enemy.alive) return enemy;
      
      const distance = Math.sqrt(Math.pow(enemy.x - clickX, 2) + Math.pow(enemy.y - clickY, 2));
      if (distance < 15) {
        createExplosion(enemy.x, enemy.y);
        return { ...enemy, alive: false };
      }
      return enemy;
    }));

    setTimeout(() => checkWinCondition(), 100);
  };

  const createExplosion = (x: number, y: number) => {
    const newExplosion = { id: Date.now() + Math.random(), x, y, timestamp: Date.now() };
    setExplosions(prev => [...prev, newExplosion]);
  };

  const checkWinCondition = () => {
    setEnemies(current => {
      const aliveEnemies = current.filter(e => e.alive);
      if (aliveEnemies.length === 0) {
        handleLevelComplete();
      }
      return current;
    });
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
      const step = 3;
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
    <div className="min-h-screen bg-game-darker text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={onBack} variant="ghost" className="text-game-cyan hover:text-game-purple">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-game-gold">УРОВЕНЬ {level}</h2>
            <p className="text-sm text-game-cyan">Врагов: {aliveEnemies}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-game-gold">💰 {user.balance}</p>
          </div>
        </div>

        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative w-full aspect-video bg-gradient-to-b from-game-dark to-game-darker border-4 border-game-purple rounded-lg overflow-hidden cursor-crosshair shadow-2xl"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(147, 51, 234, 0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        >
          {enemies.map(enemy => enemy.alive && (
            <div
              key={enemy.id}
              className={`absolute ${
                enemy.type === 'soldier' ? 'w-2 h-2 bg-game-explosion' :
                enemy.type === 'vehicle' ? 'w-4 h-3 bg-orange-500' :
                'w-5 h-4 bg-red-600'
              } rounded-sm shadow-lg`}
              style={{ 
                left: `${enemy.x}%`, 
                top: `${enemy.y}%`,
                boxShadow: '0 0 8px currentColor'
              }}
            />
          ))}

          {allies.map(ally => ally.alive && (
            <div
              key={ally.id}
              className="absolute w-2 h-2 bg-game-green rounded-sm shadow-lg"
              style={{ 
                left: `${ally.x}%`, 
                top: `${ally.y}%`,
                boxShadow: '0 0 8px #22c55e'
              }}
            />
          ))}

          <div
            className="absolute w-2 h-2 bg-game-cyan rounded-sm shadow-lg animate-pulse"
            style={{ 
              left: `${playerPos.x}%`, 
              top: `${playerPos.y}%`,
              boxShadow: '0 0 12px #06b6d4'
            }}
          />

          {explosions.map(exp => (
            <div
              key={exp.id}
              className="absolute w-8 h-8 bg-game-explosion rounded-full animate-explosion"
              style={{ 
                left: `${exp.x - 4}%`, 
                top: `${exp.y - 4}%`,
                boxShadow: '0 0 20px #ef4444'
              }}
            />
          ))}

          {gameWon && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center animate-scale-in">
                <h3 className="text-5xl font-bold text-game-gold mb-4 animate-pulse-glow">ПОБЕДА! 🎖️</h3>
                <p className="text-xl text-game-cyan mb-6">+500 монет</p>
                <Button onClick={onBack} className="bg-game-purple hover:bg-game-cyan text-white px-8 py-3">
                  Вернуться в меню
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto md:hidden">
          <div></div>
          <Button onClick={() => handleMove('up')} className="bg-game-dark border-2 border-game-purple">
            <Icon name="ArrowUp" />
          </Button>
          <div></div>
          <Button onClick={() => handleMove('left')} className="bg-game-dark border-2 border-game-purple">
            <Icon name="ArrowLeft" />
          </Button>
          <div className="flex items-center justify-center text-xs text-game-cyan">WASD</div>
          <Button onClick={() => handleMove('right')} className="bg-game-dark border-2 border-game-purple">
            <Icon name="ArrowRight" />
          </Button>
          <div></div>
          <Button onClick={() => handleMove('down')} className="bg-game-dark border-2 border-game-purple">
            <Icon name="ArrowDown" />
          </Button>
          <div></div>
        </div>

        <div className="mt-4 space-y-2 text-center text-sm">
          <p className="text-game-cyan">🎯 Клик = выстрел (КД 0.6с)</p>
          <p className="text-game-explosion">💣 Двойной клик = авиабомба (радиус урона)</p>
          <p className="text-game-green">🎮 WASD / Джойстик = движение</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
