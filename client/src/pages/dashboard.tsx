import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Coins, Wallet, Sparkles, User as UserIcon, Activity, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useAuth();

  // Redirect if not logged in
  if (!isLoading && !user) {
    setLocation("/auth");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Player Dashboard</h1>
        <p className="text-muted-foreground">Manage your account, view stats, and access features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10 flex flex-col items-center text-center pb-6 border-b border-white/10">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mb-4 shadow-xl">
                {/* Fallback avatar - in a real app, might use a craftatar/minotar URL based on username */}
                <UserIcon className="w-12 h-12 text-zinc-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 mt-2">
                <Activity className="w-3 h-3 mr-1" />
                Online/Active
              </span>
            </div>
            
            <div className="pt-6 relative z-10 space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">In-Game Balance</span>
                </div>
                <span className="font-mono font-bold text-white">${(user.balance || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">Clan</span>
                </div>
                <span className="font-mono font-bold text-indigo-400">{user.clan || "No Clan"}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-medium">Real Balance</span>
                </div>
                <span className="font-mono font-bold text-primary">{(user.realBalance || 0).toLocaleString()} Credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AiPets Vision</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Next-generation AI companions that follow you in-game and assist with tasks. Coming soon to Skviirtl Server.
              </p>
              <Button disabled className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed">
                Currently Inactive
              </Button>
            </div>
            
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Box className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Claim Rewards</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Link your Discord or Telegram account to claim your weekly voting keys and exclusive cosmetics.
              </p>
              <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                Link Account
              </Button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            
            <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
              <Activity className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 font-medium">No recent activity found.</p>
              <p className="text-xs text-zinc-600 mt-1">Play on the server to see your stats here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
