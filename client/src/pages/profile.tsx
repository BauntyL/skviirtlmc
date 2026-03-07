import { useParams, useLocation } from "wouter";
import { useUser } from "@/hooks/use-users";
import { User as UserIcon, Activity, Coins, Wallet, Users, ArrowLeft, Trophy, Swords, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { username } = useParams();
  const [, setLocation] = useLocation();
  const { data: user, isLoading, error } = useUser(username || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Игрок не найден</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Мы не смогли найти игрока с таким ником. Возможно, он еще не заходил на сервер или ник был указан неверно.</p>
        <Button onClick={() => setLocation("/players")} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад к списку
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Profile Header */}
      <div className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-30" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <Button 
            onClick={() => setLocation("/players")} 
            variant="ghost" 
            className="mb-12 text-muted-foreground hover:text-white group p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Вернуться к игрокам
          </Button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-zinc-900/80 border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src={`https://cravatar.eu/helmavatar/${user.username}/256.png`} 
                alt={user.username}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left pt-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1 rounded-full bg-primary/5 font-bold uppercase tracking-widest text-xs">
                  {user.rank || "Игрок"}
                </Badge>
                {user.minecraftUuid && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1 rounded-full text-xs font-bold">
                    <Activity className="w-3.5 h-3.5 mr-2" /> Verified
                  </Badge>
                )}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                {user.username}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto md:mx-0">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Баланс</span>
                  <span className="text-2xl font-mono font-bold text-yellow-500">${(user.balance || 0).toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Клан</span>
                  <span className="text-xl font-bold text-indigo-400 truncate block">{user.clan || "Нет клана"}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Убийства</span>
                  <span className="text-2xl font-bold text-red-500">{user.kills || 0}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2 font-bold">Смерти</span>
                  <span className="text-2xl font-bold text-zinc-400">{user.deaths || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Side */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
            <CardHeader className="bg-white/[0.03] border-b border-white/5">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <Trophy className="w-5 h-5 text-yellow-500" /> Достижения и Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                      <Swords className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-1">Убийств</h4>
                      <p className="text-3xl font-display font-bold text-white">{user.kills || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 rounded-2xl bg-zinc-500/10 text-zinc-400 group-hover:bg-zinc-500/20 transition-colors">
                      <Skull className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-1">Смертей</h4>
                      <p className="text-3xl font-display font-bold text-white">{user.deaths || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                   <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">KDR Ratio</h4>
                   <span className="text-5xl font-display font-bold text-white">
                      {user.deaths && user.deaths > 0 ? (user.kills / user.deaths).toFixed(2) : user.kills || "0.00"}
                   </span>
                   <p className="text-[10px] text-muted-foreground mt-2 uppercase">Коэффициент убийств к смертям</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About or Bio could go here */}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="bg-white/5 border-white/10 border-none shadow-2xl">
             <CardHeader className="bg-white/[0.03] border-b border-white/5">
                <CardTitle className="text-lg flex items-center gap-3 text-white">
                  <Wallet className="w-5 h-5 text-primary" /> Финансы
                </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5 group hover:border-yellow-500/30 transition-colors">
                   <div className="flex items-center gap-3 text-zinc-300">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-sm uppercase">Игровой счет</span>
                   </div>
                   <span className="font-mono font-bold text-white text-xl">${(user.balance || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5 group hover:border-primary/30 transition-colors">
                   <div className="flex items-center gap-3 text-zinc-300">
                      <Wallet className="w-5 h-5 text-primary" />
                      <span className="font-bold text-sm uppercase">Донат баланс</span>
                   </div>
                   <span className="font-mono font-bold text-primary text-xl">{(user.realBalance || 0).toLocaleString()}</span>
                </div>
             </CardContent>
          </Card>

          {user.clan && (
            <Card className="bg-indigo-500/5 border-indigo-500/10 border-none shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => setLocation("/clans")}>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-24 h-24" />
               </div>
               <CardContent className="p-6">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1 font-bold">Команда игрока</span>
                  <h3 className="text-3xl font-display font-bold text-white group-hover:text-indigo-400 transition-colors">{user.clan}</h3>
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 group-hover:text-zinc-300">
                    Перейти к списку кланов <ArrowLeft className="w-3 h-3 rotate-180" />
                  </p>
               </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
