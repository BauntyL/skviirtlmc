import { useClans } from "@/hooks/use-clans";
import { Trophy, Shield, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Clans() {
  const { data: clans, isLoading, error } = useClans();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-4">
            <Trophy className="w-10 h-10 text-primary" />
            Топ Кланов
          </h1>
          <p className="text-xl text-muted-foreground">Лучшие фракции, сражающиеся за доминирование на сервере.</p>
        </div>
        
        <div className="glass-card px-6 py-4 rounded-xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Всего Кланов</span>
            <span className="text-2xl font-bold text-white">
              {isLoading ? "..." : clans?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl bg-zinc-900/50" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-12 glass-card rounded-2xl">
          <p className="text-destructive font-medium">Не удалось загрузить таблицу лидеров. Пожалуйста, попробуйте позже.</p>
        </div>
      ) : clans?.length === 0 ? (
        <div className="text-center p-12 glass-card rounded-2xl">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Кланов пока нет</h3>
          <p className="text-muted-foreground">Будьте первым, кто создаст клан в игре!</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-white/10">
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">Ранг</th>
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">Название Клана</th>
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">Лидер</th>
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">Замы</th>
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase text-center">Уровень</th>
                  <th className="px-6 py-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase text-center">Участники</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clans?.map((clan, idx) => (
                  <tr key={clan.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                          idx === 1 ? 'bg-zinc-300/20 text-zinc-300' : 
                          idx === 2 ? 'bg-amber-700/20 text-amber-600' : 
                          'bg-zinc-800 text-muted-foreground'}`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-white text-lg">{clan.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary font-medium">{clan.leader}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {clan.coLeaders || "Нет"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-white font-mono text-sm">
                        Lvl {clan.level}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{clan.membersCount}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
