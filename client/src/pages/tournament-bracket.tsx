import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Sword, Shield, Crown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface Match {
  id: number;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: 1 | 2;
  status: 'pending' | 'live' | 'completed';
}

interface Round {
  name: string;
  matches: Match[];
}

export default function TournamentBracket() {
  const { data: user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Protect the route - only admins for now as requested
  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      setLocation("/events");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || user?.role !== 'admin') {
    return null;
  }

  const rounds: Round[] = [
    {
      name: "1/4 Финала",
      matches: [
        { id: 1, player1: "TBD", player2: "TBD", status: 'pending' },
        { id: 2, player1: "TBD", player2: "TBD", status: 'pending' },
        { id: 3, player1: "TBD", player2: "TBD", status: 'pending' },
        { id: 4, player1: "TBD", player2: "TBD", status: 'pending' },
      ]
    },
    {
      name: "Полуфинал",
      matches: [
        { id: 5, player1: "TBD", player2: "TBD", status: 'pending' },
        { id: 6, player1: "TBD", player2: "TBD", status: 'pending' },
      ]
    },
    {
      name: "Финал",
      matches: [
        { id: 7, player1: "TBD", player2: "TBD", status: 'pending' },
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full bg-yellow-500/5 font-bold uppercase tracking-widest text-xs">
            Турнирная сетка
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Турнир по <span className="text-primary">Дуэлям</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Следите за ходом сражений в реальном времени. Победитель получит всё!
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {rounds.map((round, rIdx) => (
            <div key={rIdx} className="space-y-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center justify-center gap-2">
                  {rIdx === rounds.length - 1 ? <Crown className="w-5 h-5 text-yellow-400" /> : <Sword className="w-5 h-5 text-primary" />}
                  {round.name}
                </h3>
                <div className="h-1 w-12 bg-primary/50 mx-auto mt-2 rounded-full" />
              </div>

              <div className={`flex flex-col justify-around h-full min-h-[400px] space-y-8`}>
                {round.matches.map((match) => (
                  <Card key={match.id} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-none shadow-xl hover:bg-white/10 transition-colors relative group">
                    <div className="p-4 space-y-3">
                      {/* Player 1 */}
                      <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === 1 ? 'bg-primary/20 text-white' : 'bg-black/20 text-zinc-400'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-bold">{match.player1}</span>
                        </div>
                        {match.score1 !== undefined && <span className="font-mono font-bold">{match.score1}</span>}
                      </div>

                      {/* VS Divider */}
                      <div className="flex items-center gap-2 px-2">
                        <div className="h-[1px] flex-1 bg-white/5" />
                        <span className="text-[10px] font-black text-zinc-600 uppercase">VS</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                      </div>

                      {/* Player 2 */}
                      <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === 2 ? 'bg-primary/20 text-white' : 'bg-black/20 text-zinc-400'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-bold">{match.player2}</span>
                        </div>
                        {match.score2 !== undefined && <span className="font-mono font-bold">{match.score2}</span>}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {match.status === 'live' && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-red-500 animate-pulse border-none text-[10px]">LIVE</Badge>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Connectors (Simplified for now, can be improved with SVG if needed) */}
        </div>

        {/* Legend/Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/20 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Честная игра</h4>
              <p className="text-zinc-500 text-sm">Все дуэли проходят под присмотром модераторов.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Главный приз</h4>
              <p className="text-zinc-500 text-sm">Уникальный титул "Чемпион Дуэлей" и 5000 монет.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">Участники</h4>
              <p className="text-zinc-500 text-sm">Регистрация открыта для всех игроков сервера.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
