import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map as MapIcon, ExternalLink, Globe, Users } from "lucide-react";

export default function Map() {
  const mapUrl = "http://213.152.43.45:25979/";

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl z-10 overflow-hidden">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <MapIcon className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Интерактивная карта <span className="text-primary">Skviirtl</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Исследуйте мир нашего сервера в реальном времени прямо в браузере. Строения, ландшафт и игроки — всё как на ладони.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Режим</div>
                <div className="text-sm text-white font-medium">3D / 2D Вид</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Игроки</div>
                <div className="text-sm text-white font-medium">Живое отображение</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-10 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Открыть карту
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <p className="text-xs text-muted-foreground">
              Карта откроется в новой вкладке для лучшей производительности
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
