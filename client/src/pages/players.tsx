import { useUsers } from "@/hooks/use-users";
import { User as UserIcon, Search, Users, Coins, Activity, Shield, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Players() {
  const { data: users, isLoading, error } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div className="flex-1">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full bg-primary/5">
            Жители сервера
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-4">
            <Users className="w-10 h-10 text-primary" />
            Игроки
          </h1>
          <p className="text-xl text-muted-foreground">Список всех зарегистрированных искателей приключений.</p>
        </div>
        
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по нику..."
            className="pl-10 bg-white/5 border-white/10 rounded-xl h-12 focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl bg-zinc-900/50" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-12 glass-card rounded-2xl">
          <p className="text-destructive font-medium">Не удалось загрузить список игроков. Пожалуйста, попробуйте позже.</p>
        </div>
      ) : filteredUsers?.length === 0 ? (
        <div className="text-center p-20 glass-card rounded-3xl border-white/5">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold text-white mb-2">Игрок не найден</h3>
          <p className="text-muted-foreground">Попробуйте изменить поисковый запрос.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers?.map((player) => (
            <Link key={player.id} href={`/player/${player.username}`}>
              <div className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center mb-4 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                    <img 
                        src={`https://cravatar.eu/helmavatar/${player.username}/64.png`} 
                        alt={player.username}
                        className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{player.username}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-white/5 text-[10px] text-muted-foreground border-white/5">
                      {player.rank || "Игрок"}
                    </Badge>
                    {player.minecraftUuid && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                        <Activity className="w-2.5 h-2.5 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>

                  <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Баланс</span>
                      <span className="text-sm font-bold text-yellow-500 font-mono">${(player.balance || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-white/[0.02]">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Клан</span>
                      <span className="text-sm font-bold text-indigo-400 truncate w-full px-1">{player.clan || "—"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Профиль <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
