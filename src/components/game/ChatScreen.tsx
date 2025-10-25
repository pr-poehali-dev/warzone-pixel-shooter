import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User, storage } from '@/lib/storage';

interface ChatScreenProps {
  user: User;
  onBack: () => void;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: number;
}

const ChatScreen = ({ user, onBack }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages(storage.getChatMessages());
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      username: user.nickname,
      avatar: user.avatar,
      text: newMessage,
      timestamp: Date.now(),
    };

    storage.saveChatMessage(message);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-military-dark p-4">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="ghost" className="text-military-gold mb-4">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <h1 className="text-3xl font-bold text-military-gold mb-6 flex items-center gap-2">
          <Icon name="MessageSquare" className="text-military-explosion" size={32} />
          Боевой чат
        </h1>

        <Card className="bg-military-camo/90 border-military-gold p-4">
          <div className="h-96 overflow-y-auto mb-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`p-3 rounded ${msg.userId === user.id ? 'bg-military-explosion/20 ml-8' : 'bg-military-dark/50 mr-8'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{msg.avatar}</span>
                  <span className="text-sm font-bold text-military-gold">{msg.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-white">{msg.text}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-gray-400 py-20">Чат пуст. Напишите первое сообщение!</p>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-military-dark border-military-camo text-white"
            />
            <Button onClick={handleSendMessage} className="bg-military-explosion">
              <Icon name="Send" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatScreen;
