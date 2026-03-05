import { Trophy, Shield, Users, Swords } from "lucide-react";

export default function Clans() {
  const topClans = [
    { rank: 1, name: "Dominion", leader: "CraftMaster", kdr: 4.5, members: 12 },
    { rank: 2, name: "VoidWalkers", leader: "DarkSoul", kdr: 3.8, members: 8 },
    { rank: 3, name: "Builders", leader: "BlockKing", kdr: 1.2, members: 24 },
    { rank: 4, name: "PvPGods", leader: "EzKill", kdr: 5.1, members: 5 },
    { rank: 5, name: "Merchants", leader: "RichGuy", kdr: 0.8, members: 15 },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display font-bold text-5xl mb-4 text-white">Кланы</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Создавайте альянсы, сражайтесь за территории и станьте сильнейшим кланом сервера. Используйте <code className="text-primary bg-primary/10 px-1 rounded">/clan help</code> для подробностей.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <ClanFeatureCard 
          icon={<Swords className="w-8 h-8 text-red-400" />}
          title="Войны"
          desc="Объявляйте войны другим кланам и сражайтесь за рейтинг KDR."
        />
        <ClanFeatureCard 
          icon={<Shield className="w-8 h-8 text-blue-400" />}
          title="Альянсы"
          desc="Заключайте союзы с дружественными кланами для защиты и торговли."
        />
        <ClanFeatureCard 
          icon={<Trophy className="w-8 h-8 text-yellow-400" />}
          title="Рейтинг"
          desc="Поднимайтесь в топе кланов, убивая врагов и выживая в битвах."
        />
      </div>

      <div className="bg-card/30 backdrop-blur border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-primary" />
            Топ Кланов
          </h2>
          <span className="text-sm text-muted-foreground">Обновляется в реальном времени</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-muted-foreground uppercase text-sm font-medium">
                <th className="px-6 py-4">Ранг</th>
                <th className="px-6 py-4">Название</th>
                <th className="px-6 py-4">Лидер</th>
                <th className="px-6 py-4 text-right">KDR</th>
                <th className="px-6 py-4 text-right">Участников</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topClans.map((clan) => (
                <tr key={clan.rank} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      clan.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                      clan.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                      clan.rank === 3 ? "bg-amber-700/20 text-amber-700" :
                      "bg-zinc-800 text-zinc-500"
                    }`}>
                      {clan.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-lg">{clan.name}</td>
                  <td className="px-6 py-4 text-primary">{clan.leader}</td>
                  <td className="px-6 py-4 text-right font-mono text-green-400">{clan.kdr}</td>
                  <td className="px-6 py-4 text-right text-gray-400">{clan.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ClanFeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-primary/30 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
