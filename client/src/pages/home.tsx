import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        Skviirtl<span className="text-green-500">.</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 text-center">
          <h2 className="text-xl text-zinc-400 mb-2">Онлайн</h2>
          <p className="text-4xl font-bold text-green-400">{stats?.onlineCount || 0} / {stats?.maxPlayers || 100}</p>
        </div>
        
        <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 text-center">
          <h2 className="text-xl text-zinc-400 mb-2">TPS</h2>
          <p className="text-4xl font-bold text-yellow-400">{stats?.tps || "20.0"}</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 text-center">
          <h2 className="text-xl text-zinc-400 mb-2">Версия</h2>
          <p className="text-4xl font-bold text-blue-400">1.21.1</p>
        </div>
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Топ Кланы</h2>
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="p-4 text-zinc-400 font-medium">#</th>
                <th className="p-4 text-zinc-400 font-medium">Название</th>
                <th className="p-4 text-zinc-400 font-medium">Лидер</th>
                <th className="p-4 text-zinc-400 font-medium text-right">KDR</th>
              </tr>
            </thead>
            <tbody>
              {/* This data would come from stats.clans in a real implementation */}
              <tr>
                <td className="p-4 text-zinc-500" colSpan={4}>Загрузка данных...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}