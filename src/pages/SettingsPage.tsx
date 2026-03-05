import React, { useContext } from 'react';
import { motion } from 'motion/react';
import { AuthContext } from '../context/AuthContext';
import { User, Bell, Shield, Key } from 'lucide-react';

export const SettingsPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and settings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20">
            <User className="w-5 h-5" />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Shield className="w-5 h-5" />
            Privacy
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Key className="w-5 h-5" />
            Security
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#14141B] p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <button className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium mb-2">
                  Change Avatar
                </button>
                <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button type="button" className="px-8 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#14141B] p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6 text-red-400">Danger Zone</h2>
            <p className="text-gray-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-3 rounded-xl font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
