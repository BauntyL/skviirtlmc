import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Coins, Wallet, Sparkles, User as UserIcon, Activity, Box, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, logoutMutation } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const playerData = stats?.players?.find((p: any) => p.name === user?.username);

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

  const logout = () => logoutMutation.mutate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display font-bold text-5xl mb-4">Личный кабинет</h1>
        <p className="text-xl text-muted-foreground">Добро пожаловать, <span className="text-primary font-bold">{user?.username}</span>!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card border border-white/5 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/20 to-transparent -z-10" />
            
            <div className="w-32 h-32 mx-auto bg-zinc-900 rounded-xl border-4 border-zinc-800 shadow-xl mb-6 relative overflow-hidden group">
              <img 
                src={`https://mc-heads.net/avatar/${user?.username}/128`}
                alt="Skin"
                className="w-full h-full object-contain pixelated group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{user?.username}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-400 font-medium">
              {playerData?.rank || "Игрок"}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Баланс</div>
                <div className="text-xl font-bold text-green-400">{playerData?.balance || "0"} ₽</div>
              </div>
              <div className="text-center border-l border-white/5">
                <div className="text-sm text-muted-foreground mb-1">Клан</div>
                <div className="text-xl font-bold text-white">{playerData?.clan || "-"}</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Безопасность
            </h3>
            <Button variant="outline" className="w-full justify-start text-left mb-2">
              Сменить пароль
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start text-left"
              onClick={() => logout()}
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* AiPets Vision Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-2xl p-8">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Eye className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold">AiPets Vision</h3>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Скоро
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-lg leading-relaxed">
                Инновационная система взаимодействия с вашим питомцем. Позвольте ему видеть ваш экран и слышать ваш голос в реальном времени прямо через браузер.
              </p>
              
              <Button disabled className="bg-white/10 text-white cursor-not-allowed border border-white/5">
                Запустить интерфейс (В разработке)
              </Button>
            </div>
          </div>

          {/* Recent Activity (Placeholder) */}
          <div className="bg-card border border-white/5 rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-6">История активности</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Регистрация на сайте</div>
                  <div className="text-sm text-muted-foreground">Только что</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
