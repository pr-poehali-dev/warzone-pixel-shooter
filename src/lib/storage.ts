export interface User {
  id: string;
  email: string;
  nickname: string;
  password: string;
  balance: number;
  donatBalance: number;
  title: string;
  status: string;
  avatar: string;
  level: number;
  completedLevels: number[];
  completedBonusMissions: boolean;
  isAdmin: boolean;
  weapons: string[];
  friends: string[];
}

export interface GameProgress {
  currentLevel: number;
  completedLevels: number[];
  completedBonusMissions: boolean;
}

const STORAGE_KEYS = {
  USERS: 'warzone_users',
  CURRENT_USER: 'warzone_current_user',
  CHAT_MESSAGES: 'warzone_chat',
  MULTIPLAYER_MATCHES: 'warzone_matches',
};

export const storage = {
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User) => {
    const users = storage.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserByEmailOrNickname: (emailOrNickname: string): User | null => {
    const users = storage.getUsers();
    return users.find(u => u.email === emailOrNickname || u.nickname === emailOrNickname) || null;
  },

  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userId) return null;
    
    const users = storage.getUsers();
    return users.find(u => u.id === userId) || null;
  },

  setCurrentUser: (userId: string | null) => {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  initAdmin: () => {
    const users = storage.getUsers();
    const adminExists = users.find(u => u.nickname === 'plutka');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'Dev-Team',
        email: 'admin@warzone.dev',
        nickname: 'plutka',
        password: 'user',
        balance: 999999,
        donatBalance: 999999,
        title: 'Администратор',
        status: 'Dev-Team',
        avatar: '👑',
        level: 10,
        completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        completedBonusMissions: true,
        isAdmin: true,
        weapons: [],
        friends: [],
      };
      storage.saveUser(adminUser);
    }
  },

  getChatMessages: () => {
    const messages = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return messages ? JSON.parse(messages) : [];
  },

  saveChatMessage: (message: any) => {
    const messages = storage.getChatMessages();
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
  },
};

storage.initAdmin();
