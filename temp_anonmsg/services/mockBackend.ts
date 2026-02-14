import { User, Message } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'anonmsg_users';
const MESSAGES_KEY = 'anonmsg_messages';
const SESSION_KEY = 'anonmsg_session';

// Helper to delay response to simulate network
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get data
const getDB = () => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const messages: Message[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  return { users, messages };
};

const saveDB = (users?: User[], messages?: Message[]) => {
  if (users) localStorage.setItem(USERS_KEY, JSON.stringify(users));
  if (messages) localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const MockAuthService = {
  loginWithGoogle: async (): Promise<User> => {
    await delay(800);
    // Simulate a successful Google Auth response
    const mockGoogleId = "google_123456789";
    const mockEmail = "demo@example.com";
    
    const { users } = getDB();
    let user = users.find(u => u.googleId === mockGoogleId);
    
    if (!user) {
      user = {
        _id: crypto.randomUUID(),
        googleId: mockGoogleId,
        email: mockEmail,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveDB(users);
    }
    
    localStorage.setItem(SESSION_KEY, user._id);
    return user;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    
    const { users } = getDB();
    return users.find(u => u._id === userId) || null;
  },

  logout: async () => {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const MockUserService = {
  checkUsernameAvailability: async (username: string): Promise<boolean> => {
    await delay(300);
    const { users } = getDB();
    return !users.some(u => u.username?.toLowerCase() === username.toLowerCase());
  },

  updateProfile: async (userId: string, username: string, photoUrl: string): Promise<User> => {
    await delay(1000);
    const { users } = getDB();
    const userIndex = users.findIndex(u => u._id === userId);
    
    if (userIndex === -1) throw new Error("User not found");
    
    // Check uniqueness one last time
    if (users.some(u => u._id !== userId && u.username?.toLowerCase() === username.toLowerCase())) {
      throw new Error("Username already taken");
    }

    const updatedUser = {
      ...users[userIndex],
      username,
      profilePhoto: photoUrl
    };
    
    users[userIndex] = updatedUser;
    saveDB(users);
    return updatedUser;
  },

  getPublicProfile: async (username: string): Promise<{ username: string; profilePhoto?: string; _id: string } | null> => {
    await delay(500);
    const { users } = getDB();
    const user = users.find(u => u.username?.toLowerCase() === username.toLowerCase());
    if (!user) return null;
    return {
      _id: user._id,
      username: user.username!,
      profilePhoto: user.profilePhoto
    };
  }
};

export const MockMessageService = {
  sendMessage: async (receiverId: string, messageText: string) => {
    await delay(800);
    const { messages } = getDB();
    
    const newMessage: Message = {
      _id: crypto.randomUUID(),
      receiverId,
      message: messageText,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    messages.push(newMessage);
    saveDB(undefined, messages);
    return newMessage;
  },

  getMyMessages: async (userId: string): Promise<Message[]> => {
    await delay(500);
    const { messages } = getDB();
    // Sort by newest first
    return messages
      .filter(m => m.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteMessage: async (messageId: string) => {
    await delay(300);
    const { messages } = getDB();
    const newMessages = messages.filter(m => m._id !== messageId);
    saveDB(undefined, newMessages);
  }
};