import { useClans } from "@/hooks/use-clans";
import { Trophy, Shield, Users, Swords, Plus, LogOut, UserPlus, Info, List as ListIcon, Edit3, Heart, Home, ArrowUpCircle, Wallet, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Clans() {
  const { data: clans, isLoading, error } = useClans();

  const commandGroups = [
    {
      title: "Основы",
      icon: Plus,
      commands: [
        { cmd: "/team create <название>", desc: "Создать новую команду" },
        { cmd: "/team info", desc: "Информация о вашей команде" },
        { cmd: "/team list", desc: "Список всех команд сервера" },
      ]
    },
    {
      title: "Управление",
      icon: Settings,
      commands: [
        { cmd: "/team invite <игрок>", desc: "Пригласить игрока" },
        { cmd: "/team kick <игрок>", desc: "Исключить игрока" },
        { cmd: "/team prefix <префикс>", desc: "Изменить префикс команды" },
        { cmd: "/team promote/demote <игрок>", desc: "Повысить/понизить члена команды" },
      ]
    },
    {
      title: "Экономика",
      icon: Wallet,
      commands: [
        { cmd: "/team deposit <сумма>", desc: "Внести деньги в банк команды" },
        { cmd: "/team withdraw <сумма>", desc: "Снять деньги из банка" },
        { cmd: "/team fee [set/disable] <сумма>", desc: "Плата за вступление" },
      ]
    },
    {
      title: "Дополнительно",
      icon: Swords,
      commands: [
        { cmd: "/team home/sethome", desc: "Точка дома команды" },
        { cmd: "/team pvp", desc: "Переключить дружественный огонь" },
        { cmd: "/team ally/enemy <команда>", desc: "Дипломатия (союзы/войны)" },
        { cmd: "/team leave/disband", desc: "Покинуть или распустить команду" },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6 text-center md:text-left">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full bg-primary/5">
            Система Команд (UltimateTeams)
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 flex items-center justify-center md:justify-start gap-4">
            <Trophy className="w-10 h-10 text-primary" />
            Топ Кланов
          </h1>
          <p className="text-xl text-muted-foreground">Сражайтесь за влияние, объединяйтесь и доминируйте на сервере.</p>
        </div>
        
        <div className="glass-card px-8 py-6 rounded-2xl flex items-center gap-6 border-white/5">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Активных Кланов</span>
            <span className="text-4xl font-display font-bold text-white">
              {isLoading ? "..." : clans?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="mb-24">
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
          <div className="text-center p-12 glass-card rounded-2xl border-white/5">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-white mb-2">Кланов пока нет</h3>
            <p className="text-muted-foreground">Будьте первым, кто создаст свою империю в игре!</p>
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-white/10">
                    <th className="px-8 py-5 text-xs font-bold tracking-widest text-muted-foreground uppercase">Ранг</th>
                    <th className="px-8 py-5 text-xs font-bold tracking-widest text-muted-foreground uppercase">Команда</th>
                    <th className="px-8 py-5 text-xs font-bold tracking-widest text-muted-foreground uppercase">Лидер</th>
                    <th className="px-8 py-5 text-xs font-bold tracking-widest text-muted-foreground uppercase text-center">Участники</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clans?.sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0)).map((clan, idx) => (
                    <tr key={clan.id} className="hover:bg-white/[0.03] transition-all group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner
                          ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : 
                            idx === 1 ? 'bg-gradient-to-br from-zinc-300 to-zinc-500 text-black' : 
                            idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' : 
                            'bg-zinc-800/50 text-muted-foreground border border-white/5'}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-xl group-hover:text-primary transition-colors">{clan.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">ID: {clan.id}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                            <img src={`https://cravatar.eu/helmavatar/${clan.leader}/32.png`} alt={clan.leader || ""} className="w-full h-full" />
                          </div>
                          <span className="text-zinc-200 font-medium">{clan.leader}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-semibold">
                          <Users className="w-3.5 h-3.5" />
                          {clan.membersCount}
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

      {/* Commands Guide Section */}
      <div className="relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Гайд по командам</h2>
          <p className="text-muted-foreground">Всё, что нужно знать для управления вашей командой в игре.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commandGroups.map((group, idx) => (
            <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-md hover:border-primary/30 transition-colors duration-500 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <group.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">{group.title}</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {group.commands.map((cmd, cIdx) => (
                    <div key={cIdx} className="group/item">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <code className="text-primary font-mono text-sm font-bold bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          {cmd.cmd}
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground group-hover/item:text-zinc-300 transition-colors">
                        {cmd.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Совет для лидеров</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Вы можете настраивать разрешения для ваших менеджеров с помощью команды <code className="text-blue-400">/team permission</code>. 
              Это позволит делегировать управление приглашениями и финансами доверенным игрокам.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
