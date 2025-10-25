import { useState, useEffect } from 'react';
import MainMenu from '@/components/game/MainMenu';
import AuthScreen from '@/components/game/AuthScreen';
import GameScreen from '@/components/game/GameScreen';
import ProfileScreen from '@/components/game/ProfileScreen';
import MultiplayerScreen from '@/components/game/MultiplayerScreen';
import FriendsScreen from '@/components/game/FriendsScreen';
import ShopScreen from '@/components/game/ShopScreen';
import AdminPanel from '@/components/game/AdminPanel';
import ChatScreen from '@/components/game/ChatScreen';
import { storage, User } from '@/lib/storage';

type Screen = 'auth' | 'menu' | 'game' | 'profile' | 'multiplayer' | 'friends' | 'shop' | 'admin' | 'chat';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('menu');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user.id);
    setCurrentScreen('menu');
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setCurrentScreen('auth');
  };

  const handleStartLevel = (level: number) => {
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const updateCurrentUser = () => {
    const updated = storage.getCurrentUser();
    if (updated) {
      setCurrentUser(updated);
    }
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-military-dark">
      {currentScreen === 'menu' && (
        <MainMenu
          user={currentUser}
          onNavigate={setCurrentScreen}
          onStartLevel={handleStartLevel}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'game' && (
        <GameScreen
          user={currentUser}
          level={selectedLevel}
          onBack={handleBackToMenu}
          onUpdateUser={updateCurrentUser}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          user={currentUser}
          onBack={handleBackToMenu}
          onUpdateUser={updateCurrentUser}
        />
      )}

      {currentScreen === 'multiplayer' && (
        <MultiplayerScreen
          user={currentUser}
          onBack={handleBackToMenu}
        />
      )}

      {currentScreen === 'friends' && (
        <FriendsScreen
          user={currentUser}
          onBack={handleBackToMenu}
        />
      )}

      {currentScreen === 'shop' && (
        <ShopScreen
          user={currentUser}
          onBack={handleBackToMenu}
          onUpdateUser={updateCurrentUser}
        />
      )}

      {currentScreen === 'admin' && currentUser.isAdmin && (
        <AdminPanel
          user={currentUser}
          onBack={handleBackToMenu}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen
          user={currentUser}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default Index;
