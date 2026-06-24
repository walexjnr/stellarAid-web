"use client";

import React, { useState, useRef } from "react";
import { Camera, Save, Twitter, Globe, Github } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui";

export default function ProfileSettingsPage() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    displayName: "Green Earth Foundation",
    bio: "Dedicated to providing clean water and renewable energy to rural communities across the globe.",
    profileImage: "https://i.pravatar.cc/150?u=test",
    socialLinks: {
      website: "https://greenearth.org",
      twitter: "@greenearth",
      github: "greenearth-dev"
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // 1. Get Cloudinary signature from API (Simulated)
      // const sigRes = await fetch('/api/cloudinary/sign');
      // const { signature, timestamp } = await sigRes.json();
      
      // 2. Upload to Cloudinary (Simulated)
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('signature', signature);
      // const uploadRes = await fetch('https://api.cloudinary.com/...', { method: 'POST', body: formData });
      // const { secure_url } = await uploadRes.json();
      
      // Simulated upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      const fakeUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, profileImage: fakeUrl }));
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // Simulate wallet signature
      console.log("Requesting wallet signature for profile update payload...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const payload = {
        ...form,
        signature: "simulated_wallet_signature_123abc",
        timestamp: Date.now()
      };
      
      // Simulate API call to save profile
      // await fetch('/api/user-data/profile', { method: 'PUT', body: JSON.stringify(payload) });
      console.log("Saving payload to API:", payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-2">Update your public profile information so donors can recognize and trust you.</p>
      </div>

      <Card className="p-8 shadow-sm">
        <div className="space-y-8">
          
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Profile Image</label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {form.profileImage ? (
                  <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload new image
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended size: 400x400px. JPG, PNG or GIF.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="e.g. Green Earth Foundation"
                className="max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell donors about yourself and your mission..."
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 500 characters.</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    value={form.socialLinks.website}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, website: e.target.value } 
                    }))}
                    placeholder="Website URL"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Twitter className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    value={form.socialLinks.twitter}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value } 
                    }))}
                    placeholder="Twitter Handle"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    value={form.socialLinks.github}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, github: e.target.value } 
                    }))}
                    placeholder="GitHub Username"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button 
              onClick={handleSaveProfile}
              isLoading={isLoading}
              className="px-8"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}
