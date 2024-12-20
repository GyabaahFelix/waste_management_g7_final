// @ts-nocheck
'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Recycle, Users, Coins, MapPin, Leaf, LucideRecycle, RecycleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import ContractInteraction from '@/components/ContractInteraction';
import { getRecentReports, getAllRewards, getWasteCollectionTasks } from '@/utils/db/actions';

const poppins = Poppins({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
});

function AnimatedGlobe() {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-300 to-blue-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-200 to-blue-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-gradient-to-r from-purple-100 to-blue-200 opacity-80 animate-bounce"></div>
      <RecycleIcon className="absolute inset-0 m-auto h-12 w-12 sm:h-16 sm:w-16 text-purple-600 animate-pulse" />
    </div>
  );
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const reports = await getRecentReports(100);
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(100);

        const wasteCollected = tasks.reduce((total, task) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);

        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce((total, reward) => total + (reward.points || 0), 0);
        const co2Offset = wasteCollected * 0.5;

        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10) / 10,
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10) / 10
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0
        });
      }
    }

    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div className={`container mx-auto px-4 py-8 sm:py-16 ${poppins.className}`}>
      <section className="text-center mb-10 sm:mb-20">
        <AnimatedGlobe />
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">
          Group7 <span className="text-blue-600">Waste Management</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
          Become part of our community to enhance waste management efficiency and make it more rewarding!
        </p>
        {!loggedIn ? (
          <Button
            onClick={login}
            className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-purple-600 hover:to-blue-500 text-white text-md sm:text-lg py-4 sm:py-6 px-6 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        ) : (
          <Link href="/report">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-purple-600 hover:to-blue-500 text-white text-md sm:text-lg py-4 sm:py-6 px-6 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg">
              Report Waste
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mb-10 sm:mb-20">
        <FeatureCard
          icon={RecycleIcon}
          title="Eco-Friendly"
          description="Help create a cleaner environment by reporting and gathering waste."
          bgClass="bg-gradient-to-b from-purple-100 to-blue-50"
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Earn tokens for your participation in waste management initiatives."
          bgClass="bg-gradient-to-b from-yellow-100 to-orange-50"
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Join a thriving community dedicated to sustainable practices."
          bgClass="bg-gradient-to-b from-blue-100 to-purple-50"
        />
      </section>

      <section className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg mb-10 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center text-gray-800">Our Influence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ImpactCard title="Waste Retrieved" value={`${impactData.wasteCollected} kg`} icon={Recycle} />
          <ImpactCard title="Reports Dispatched" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
          <ImpactCard title="Tokens Accumulated" value={impactData.tokensEarned.toString()} icon={Coins} />
          <ImpactCard title="CO2 Mitigation" value={`${impactData.co2Offset} kg`} icon={Leaf} />
        </div>
      </section>
    </div>
  );
}

function ImpactCard({ title, value, icon: Icon }) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-b from-gray-50 to-purple-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-lg">
      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 mb-2 sm:mb-4" />
      <p className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, bgClass }) {
  return (
    <div className={`p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center ${bgClass}`}>
      <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}