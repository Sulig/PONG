// Shared data types — one source of truth for the frontend

export interface User {
  id: number;
  email: string;
  name: string;
  googleId?: string | null;
  githubId?: string | null;
  password: string;
  createdAt: Date;
}

export type UserResponse = Omit<User, 'password'>;

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  googleId?: string | null;
  githubId?: string | null;
}


export interface Match {
  id: number;
  userId: number;
  guestName: string | null;
  userScore: number;
  opponentScore: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  winPoints: number;
  playMode: 'AI' | 'LOCAL';
  aiLevel: 'EASY' | 'MID' | 'HARD';
  paddle: 'LEFT' | 'RIGHT';
}

export interface MatchResult {
  winnerName: string;
  userScore: number;
  opponentScore: number;
}

export interface LeaderboardEntry {
  userId: number;
  name: string;
  avatarUrl: string;
  level: number;
  wins: number;
  gamesPlayed: number;
  winRate: number;
}

export interface ProfileData {
  userId: number;
  name: string;
  avatarUrl: string;
  bio: string;
  level: number;
  xp: number;
}

export interface StatsData {
  gamesPlayed: number;
  wins: number;
  losses: number;
  rank: number;
  achievements: { id: number; type: string; unlockedAt: string }[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'opponent';
}

export interface UserListItem {
  id: number;
  email: string;
  profile: { name: string; avatarUrl: string } | null;
}

export interface FriendEntry {
  friendshipId: number;
  since: string;
  friend: { id: number; profile: { name: string; avatarUrl: string } };
  isOnline: boolean;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  sender: { id: number; profile: { name: string; avatarUrl: string } };
}

export interface SentRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  receiver: { id: number; profile: { name: string; avatarUrl: string } };
}
