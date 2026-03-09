import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useLanguage } from '../i18n/useLanguage';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import FriendsAPI from '../APIs/friends';
import Auth from '../APIs/auth';
import type { UserListItem, FriendEntry, FriendRequest, SentRequest } from '../types';

const Social = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isOnline } = useSocket();

  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const friendIds = new Set(friends.map(f => f.friend.id));

  const fetchAll = async () => {
    try {
      const [friendsRes, requestsRes, sentRes, usersRes] = await Promise.all([
        FriendsAPI.get('/'),
        FriendsAPI.get('/requests'),
        FriendsAPI.get('/requests/sent'),
        Auth.get('/users'),
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
      setSentIds(new Set((sentRes.data as SentRequest[]).map(s => s.receiverId)));
      setAllUsers(usersRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const sendRequest = async (targetId: number) => {
    try {
      await FriendsAPI.post(`/request/${targetId}`);
      setSentIds(prev => new Set(prev).add(targetId));
    } catch {
      // silent
    }
  };

  const acceptRequest = async (senderId: number) => {
    try {
      await FriendsAPI.put(`/accept/${senderId}`);
      fetchAll();
    } catch {
      // silent
    }
  };

  const removeFriend = async (targetId: number) => {
    try {
      await FriendsAPI.delete(`/${targetId}`);
      fetchAll();
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-accent-purple text-xl animate-pulse">{t.common.loading}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-xl sm:text-2xl font-bold">{t.social.title}</h1>

          {/* Friend Requests */}
          {requests.length > 0 && (
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">{t.social.friendRequests}</h2>
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="flex items-center gap-3">
                    <img
                      src={req.sender.profile?.avatarUrl || '/avatars/avatar_default.png'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <Link to={`/profile/${req.sender.id}`} className="flex-1 text-sm hover:text-accent-purple transition-colors">
                      {req.sender.profile?.name || 'User'}
                    </Link>
                    <Button onClick={() => acceptRequest(req.senderId)} className="text-xs px-3 py-1">
                      {t.social.accept}
                    </Button>
                    <Button variant="danger" onClick={() => removeFriend(req.senderId)} className="text-xs px-3 py-1">
                      {t.social.reject}
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Friends */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t.social.friends}</h2>
            {friends.length === 0 ? (
              <p className="text-text-muted text-sm">{t.social.noFriends}</p>
            ) : (
              <div className="space-y-3">
                {friends.map(f => {
                  const online = f.isOnline || isOnline(f.friend.id);
                  return (
                    <div key={f.friendshipId} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={f.friend.profile?.avatarUrl || '/avatars/avatar_default.png'}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-primary ${online ? 'bg-green-400' : 'bg-gray-500'}`}
                        />
                      </div>
                      <Link to={`/profile/${f.friend.id}`} className="flex-1 text-sm hover:text-accent-purple transition-colors">
                        {f.friend.profile?.name || 'User'}
                      </Link>
                      <span className={`text-xs ${online ? 'text-green-400' : 'text-text-muted'}`}>
                        {online ? t.social.online : t.social.offline}
                      </span>
                      <Button variant="danger" onClick={() => removeFriend(f.friend.id)} className="text-xs px-3 py-1">
                        {t.social.remove}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* All Users */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t.social.allUsers}</h2>
            <div className="space-y-3">
              {allUsers
                .filter(u => u.id !== user?.id)
                .map(u => {
                  const isFriend = friendIds.has(u.id);
                  const isPending = sentIds.has(u.id);
                  const hasIncoming = requests.some(r => r.senderId === u.id);

                  return (
                    <div key={u.id} className="flex items-center gap-3">
                      <img
                        src={u.profile?.avatarUrl || '/avatars/avatar_default.png'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <Link to={`/profile/${u.id}`} className="flex-1 text-sm hover:text-accent-purple transition-colors">
                        {u.profile?.name || 'User'}
                      </Link>
                      {isFriend ? (
                        <span className="text-xs text-text-muted px-3 py-1">{t.social.alreadyFriends}</span>
                      ) : isPending ? (
                        <span className="text-xs text-text-muted px-3 py-1">{t.social.pending}</span>
                      ) : hasIncoming ? (
                        <Button onClick={() => acceptRequest(u.id)} className="text-xs px-3 py-1">
                          {t.social.accept}
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={() => sendRequest(u.id)} className="text-xs px-3 py-1">
                          {t.social.add}
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Social;
