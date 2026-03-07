import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import { Coins, Wallet, Sparkles, User as UserIcon, Activity, Box, Users, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, refetch } = useAuth();
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const { toast } = useToast();

  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(api.auth.generateCode.method, api.auth.generateCode.path, {});
      return await res.json();
    },
    onSuccess: (data) => {
      setLinkCode(data.code);
    },
    onError: (error: Error) => {
        console.error("Generate code error details:", error);
        toast({ title: "Ошибка", description: `Не удалось сгенерировать код: ${error.message}`, variant: "destructive" });
    }
  });

  useEffect(() => {
    if (!linkCode || user?.minecraftUuid) return;
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [linkCode, user?.minecraftUuid, refetch]);

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
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Профиль игрока</h1>
        <p className="text-muted-foreground">Управление аккаунтом, статистика и привязка.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10 flex flex-col items-center text-center pb-6 border-b border-white/10">
              <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mb-4 shadow-xl overflow-hidden">
                {/* Avatar from Cravatar based on Minecraft username */}
                <img 
                    src={`https://cravatar.eu/helmavatar/${user.username}/96.png`} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
                />
                <UserIcon className="w-12 h-12 text-zinc-500 hidden" />
              </div>
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 mt-2">
                <Activity className="w-3 h-3 mr-1" />
                {user.minecraftUuid ? "Аккаунт привязан" : "Не привязан"}
              </span>
            </div>
            
            <div className="pt-6 relative z-10 space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Баланс</span>
                </div>
                <span className="font-mono font-bold text-white">${(user.balance || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span className="font-medium">Клан</span>
                </div>
                <span className="font-mono font-bold text-indigo-400">{user.clan || "Нет клана"}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-medium">Донат валюта</span>
                </div>
                <span className="font-mono font-bold text-primary">{(user.realBalance || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Link Account Card */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <LinkIcon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Привязка аккаунта</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Привяжите свой Minecraft аккаунт, чтобы подтвердить владение и синхронизировать данные.
              </p>
              
              <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 cursor-pointer pointer-events-auto relative z-50"
                    >
                        {user.minecraftUuid ? "Перепривязать аккаунт" : "Привязать аккаунт"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-zinc-800 bg-zinc-950/90 text-white">
                    <DialogHeader>
                        <DialogTitle>Привязка Minecraft аккаунта</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Выполните следующие действия на сервере для привязки.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        {generateCodeMutation.isPending ? (
                            <div className="flex justify-center p-4">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : linkCode ? (
                            <div className="space-y-4">
                                <div className="text-sm text-zinc-300">
                                    1. Зайдите на сервер <b>Skviirtl</b>.
                                </div>
                                <div className="text-sm text-zinc-300">
                                    2. Введите команду в чат:
                                </div>
                                <div 
                                    className="bg-black/50 p-4 rounded-lg border border-primary/20 flex items-center justify-between cursor-pointer hover:bg-black/70 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`/link ${linkCode}`);
                                        toast({ title: "Скопировано!", description: "Команда скопирована в буфер обмена." });
                                    }}
                                >
                                    <code className="text-xl font-mono text-primary">/link {linkCode}</code>
                                    <Copy className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div className="text-xs text-zinc-500 text-center">
                                    Нажмите на команду, чтобы скопировать.
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <Button 
                                    className="bg-primary text-black hover:bg-primary/90 w-full"
                                    onClick={() => generateCodeMutation.mutate()}
                                >
                                    Сгенерировать код
                                </Button>
                                {generateCodeMutation.isError && (
                                    <div className="text-red-400 text-center text-sm">Ошибка генерации кода. Попробуйте еще раз.</div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AiPets (Скоро)</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Умные питомцы на базе ИИ, которые следуют за вами и помогают в игре.
              </p>
              <Button disabled className="w-full bg-zinc-800 text-zinc-500 cursor-not-allowed">
                В разработке
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
