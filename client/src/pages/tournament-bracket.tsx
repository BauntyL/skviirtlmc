import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Sword, Shield, Crown, Edit2, RotateCcw, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Match {
  id: number;
  round: number;
  position: number;
  player1: string | null;
  player2: string | null;
  score1: number;
  score2: number;
  winner: number | null;
  status: 'pending' | 'live' | 'completed';
}

export default function TournamentBracket() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const isAdmin = user?.role === 'admin';

  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: [api.tournament.list.path],
  });

  const { data: users } = useQuery<any[]>({
    queryKey: [api.users.list.path],
    enabled: isAdmin, // Only fetch users for admin dropdown
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await fetch(buildUrl(api.tournament.updateMatch.path, { id }), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update match");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournament.list.path] });
      toast({ title: "Успех", description: "Матч обновлен" });
      setEditingMatch(null);
    },
    onError: (err: Error) => {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    }
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.tournament.reset.path, { method: 'POST' });
      if (!res.ok) throw new Error("Failed to reset tournament");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tournament.list.path] });
      toast({ title: "Сброс", description: "Турнир сброшен" });
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const rounds = [
    { name: "1/4 Финала", roundNum: 1 },
    { name: "Полуфинал", roundNum: 2 },
    { name: "Финал", roundNum: 3 }
  ];

  const handleUpdateMatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMatch) return;
    
    const formData = new FormData(e.currentTarget);
    const p1 = formData.get("player1");
    const p2 = formData.get("player2");
    const data = {
      player1: p1 === "null" ? null : p1,
      player2: p2 === "null" ? null : p2,
      score1: parseInt(formData.get("score1") as string) || 0,
      score2: parseInt(formData.get("score2") as string) || 0,
      winner: formData.get("winner") === "null" ? null : parseInt(formData.get("winner") as string),
      status: formData.get("status"),
    };

    updateMatchMutation.mutate({ id: editingMatch.id, data });
  };

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className={`mb-4 border-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full bg-yellow-500/5 font-bold uppercase tracking-widest text-xs`}>
            {isAdmin ? "Админ-панель турнира" : "Сетка турнира"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Турнир по <span className="text-primary">Дуэлям</span>
          </h1>
          {isAdmin && (
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-red-500/10 hover:text-red-500"
                onClick={() => {
                  if (confirm("Вы уверены, что хотите полностью сбросить сетку?")) {
                    resetMutation.mutate();
                  }
                }}
                disabled={resetMutation.isPending}
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
                Сбросить всё
              </Button>
            </div>
          )}
          {!isAdmin && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Следите за ходом сражений в реальном времени. Победитель получит всё!
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        {matchesLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
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

                <div className={`flex flex-col justify-around h-full min-h-[500px] space-y-8`}>
                  {matches?.filter(m => m.round === round.roundNum).map((match) => (
                    <Card key={match.id} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-none shadow-xl hover:bg-white/10 transition-colors relative group">
                      <div className="p-4 space-y-3">
                        {/* Player 1 */}
                        <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === 1 ? 'bg-primary/20 text-white border border-primary/30' : 'bg-black/20 text-zinc-400'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="font-bold truncate max-w-[120px]">{match.player1 || "Ожидание..."}</span>
                          </div>
                          <span className="font-mono font-bold">{match.score1}</span>
                        </div>

                        {/* VS Divider */}
                        <div className="flex items-center gap-2 px-2">
                          <div className="h-[1px] flex-1 bg-white/5" />
                          <span className="text-[10px] font-black text-zinc-600 uppercase">VS</span>
                          <div className="h-[1px] flex-1 bg-white/5" />
                        </div>

                        {/* Player 2 */}
                        <div className={`flex items-center justify-between p-2 rounded-lg ${match.winner === 2 ? 'bg-primary/20 text-white border border-primary/30' : 'bg-black/20 text-zinc-400'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="font-bold truncate max-w-[120px]">{match.player2 || "Ожидание..."}</span>
                          </div>
                          <span className="font-mono font-bold">{match.score2}</span>
                        </div>
                      </div>

                      {/* Status Badge & Edit Button */}
                      <div className="absolute top-2 right-2 flex gap-2">
                        {match.status === 'live' && (
                          <Badge className="bg-red-500 animate-pulse border-none text-[10px]">LIVE</Badge>
                        )}
                        {isAdmin && (
                          <Dialog open={editingMatch?.id === match.id} onOpenChange={(open) => !open && setEditingMatch(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setEditingMatch(match)}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-950 border-white/10 text-white">
                              <DialogHeader>
                                <DialogTitle>Редактировать матч #{match.id}</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateMatch} className="space-y-6 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Участник 1</Label>
                                    <Select name="player1" defaultValue={match.player1 || "null"}>
                                      <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Выберите игрока" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                        <SelectItem value="null">Пусто</SelectItem>
                                        {users?.map(u => (
                                          <SelectItem key={u.id} value={u.username}>{u.username}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Счет 1</Label>
                                    <Input name="score1" type="number" defaultValue={match.score1} className="bg-white/5 border-white/10" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Участник 2</Label>
                                    <Select name="player2" defaultValue={match.player2 || "null"}>
                                      <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue placeholder="Выберите игрока" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                        <SelectItem value="null">Пусто</SelectItem>
                                        {users?.map(u => (
                                          <SelectItem key={u.id} value={u.username}>{u.username}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Счет 2</Label>
                                    <Input name="score2" type="number" defaultValue={match.score2} className="bg-white/5 border-white/10" />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Победитель</Label>
                                  <Select name="winner" defaultValue={match.winner?.toString() || "null"}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                      <SelectValue placeholder="Не определен" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                      <SelectItem value="null">Не определен</SelectItem>
                                      <SelectItem value="1">Участник 1</SelectItem>
                                      <SelectItem value="2">Участник 2</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Статус</Label>
                                  <Select name="status" defaultValue={match.status}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                                      <SelectItem value="pending">Ожидание</SelectItem>
                                      <SelectItem value="live">В эфире (LIVE)</SelectItem>
                                      <SelectItem value="completed">Завершен</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-white font-bold" disabled={updateMatchMutation.isPending}>
                                  {updateMatchMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                  Сохранить изменения
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info for Admin */}
        {isAdmin && (
          <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Инструкция для администратора
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-400">
              <ul className="space-y-3 list-disc list-inside">
                <li>Используйте кнопку <Edit2 className="w-3 h-3 inline" /> на карточке матча для изменения участников и счета.</li>
                <li>Для 6 команд: заполните 2 матча в 1/4 финала. Победители пройдут в полуфинал.</li>
                <li>Вы можете заранее вписать "Bye" или оставить участников пустыми для тех, кто проходит без боя.</li>
              </ul>
              <ul className="space-y-3 list-disc list-inside">
                <li>Статус "LIVE" добавит пульсирующий бейдж на карточку матча.</li>
                <li>После завершения матча выберите победителя, чтобы подсветить его карточку.</li>
                <li>Кнопка "Сбросить всё" очистит все данные и создаст новую пустую сетку.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
