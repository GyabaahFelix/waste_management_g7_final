'use client';
import { useState, useEffect } from 'react';
import { getAllRewards, getUserByEmail } from '@/utils/db/actions';
import { Loader, Award, User, Trophy, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Reward = {
  id: number;
  userId: number;
  points: number;
  level: number;
  createdAt: Date;
  userName: string | null;
};

export default function LeaderboardPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: number; email: string; name: string; } | null>(null);

  useEffect(() => {
    const fetchRewardsAndUser = async () => {
      setLoading(true);
      try {
        const fetchedRewards = await getAllRewards();
        setRewards(fetchedRewards);

        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            toast.error('User not found. Please log in again.');
          }
        } else {
          toast.error('User not logged in. Please log in.');
        }
      } catch (error) {
        console.error('Error fetching rewards and user:', error);
        toast.error('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsAndUser();
  }, []);

  return (
    <div className="">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Ranking Board </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-gray-600" />
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex justify-between items-center text-white">
                <Trophy className="h-10 w-10" />
                <span className="text-2xl font-bold">Leading Contributors</span>
                <Award className="h-10 w-10" />
              </div>
            </div>
              <div className="overflow-x-auto sm:rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6">User</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6">Points</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:px-6">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward, index) => (
                      <tr key={reward.id} className={`hover:bg-gray-50 ${user && user.id === reward.userId ? 'bg-indigo-50' : ''}`}>
                        <td className="px-4 py-2 sm:px-6">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <Crown className={`h-6 w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
                            ) : (
                              <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 sm:px-6 flex items-center">
                          <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 p-1" />
                          <span className="ml-2 text-sm sm:text-base">{reward.userName}</span>
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-gray-700 sm:px-6">
                          <Award className="h-5 w-5 text-indigo-500 mr-2" />
                          {reward.points.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 sm:px-6">
                          <span className="text-sm sm:text-base bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Level {reward.level}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

          </div>
        )}
      </div>
    </div>
  );
}