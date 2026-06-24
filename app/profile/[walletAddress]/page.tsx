"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, Copy, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function PublicProfilePage() {
  const params = useParams();
  const walletAddress = params.walletAddress as string;

  const [copied, setCopied] = useState(false);

  // Mock data
  const profile = {
    avatar: "https://i.pravatar.cc/150?u=" + walletAddress,
    displayName: "Green Earth Foundation",
    bio: "Dedicated to providing clean water and renewable energy to rural communities across the globe. Join us in making a difference.",
    walletAddress: walletAddress || "GABC...1234",
    isVerified: true,
    totalRaised: 45000,
    joinedDate: "October 2023",
    location: "Global",
  };

  const activeCampaigns = [
    {
      id: "1",
      title: "Clean Water Initiative in Northern Ghana",
      image: "https://images.unsplash.com/photo-1541888086225-ee53fb3035a5?auto=format&fit=crop&q=80&w=800",
      raised: 12450,
      target: 25000,
      donors: 87,
      category: "Water",
    },
    {
      id: "2",
      title: "Solar Panels for Rural Schools",
      image: "https://images.unsplash.com/photo-1509391366360-1e97d5259e86?auto=format&fit=crop&q=80&w=800",
      raised: 3200,
      target: 15000,
      donors: 24,
      category: "Energy",
    },
  ];

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(profile.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cover Image */}
      <div className="h-64 w-full bg-gradient-to-r from-green-500 to-teal-600 object-cover"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        {/* Profile Header Card */}
        <Card className="p-8 relative shadow-xl bg-white rounded-3xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {profile.isVerified && (
                <div className="absolute bottom-2 right-2 bg-white rounded-full p-0.5">
                  <BadgeCheck className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {profile.displayName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1.5 rounded-full inline-flex cursor-pointer hover:bg-gray-200 transition" onClick={handleCopyWallet}>
                    <span>{profile.walletAddress.substring(0, 6)}...{profile.walletAddress.substring(profile.walletAddress.length - 4)}</span>
                    <Copy className="w-4 h-4" />
                    {copied && <span className="text-green-600 text-xs ml-1">Copied!</span>}
                  </div>
                </div>
                
                <div className="bg-green-50 px-6 py-4 rounded-2xl border border-green-100 text-center min-w-[160px]">
                  <p className="text-sm font-medium text-green-800 mb-1">Total Raised</p>
                  <p className="text-3xl font-bold text-green-600">${profile.totalRaised.toLocaleString()}</p>
                </div>
              </div>

              <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
                {profile.bio}
              </p>

              <div className="flex gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {profile.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Campaigns Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Active Campaigns</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCampaigns.map(campaign => {
              const progress = Math.min(100, Math.round((campaign.raised / campaign.target) * 100));
              return (
                <Link href={`/campaigns/${campaign.id}`} key={campaign.id} className="block group">
                  <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 border-gray-200">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={campaign.image} 
                        alt={campaign.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {campaign.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {campaign.title}
                      </h3>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-green-600">${campaign.raised.toLocaleString()} raised</span>
                          <span className="text-gray-500">of ${campaign.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{progress}% funded</span>
                          <span>{campaign.donors} donors</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          {activeCampaigns.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <p className="text-gray-500">This creator has no active campaigns at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
