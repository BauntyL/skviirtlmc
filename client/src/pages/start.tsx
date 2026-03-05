import { Download, Play, PlusSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Start() {
  const { toast } = useToast();
  const serverIP = "skviirtl.vanilla.cool";

  const copyIp = () => {
    navigator.clipboard.writeText(serverIP);
    toast({ title: "IP Скопирован!", description: "Готов к вставке в игру." });
  };

  const steps = [
    {
      icon: Download,
      title: "1. Скачайте Лаунчер",
      desc: "Если у вас нет Minecraft, скачайте официальный лаунчер или альтернативу, например TLauncher.",
    },
    {
      icon: Play,
      title: "2. Выберите Версию",
      desc: "Выберите любую версию между 1.16.5 и 1.21.11. Мы рекомендуем последнюю версию для лучшего опыта.",
    },
    {
      icon: PlusSquare,
      title: "3. Добавьте Сервер",
      desc: "Зайдите в Сетевая игра > Добавить. Введите любое название и вставьте наш IP адрес ниже.",
      action: (
        <div 
          onClick={copyIp}
          className="mt-4 inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-colors group"
        >
          <span className="font-mono text-white">{serverIP}</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded group-hover:bg-primary group-hover:text-black transition-colors">
            Копия
          </span>
        </div>
      )
    },
    {
      icon: ArrowRight,
      title: "4. Регистрация в игре",
      desc: "После подключения введите /register <пароль> <пароль> в чат для защиты аккаунта. Затем /login <пароль> при входе.",
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Как Подключиться</h1>
        <p className="text-xl text-muted-foreground">Следуйте этим простым шагам, чтобы присоединиться к приключению.</p>
      </div>

      <div className="relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute left-8 top-12 bottom-12 w-0.5 bg-zinc-800" />
        
        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group">
              <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center group-hover:border-primary transition-colors duration-300 shadow-xl">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
                {step.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 p-8 glass-card rounded-2xl text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Нужна Помощь?</h3>
        <p className="text-muted-foreground mb-6">
          Если у вас возникли проблемы с подключением, присоединяйтесь к нашему Telegram сообществу. Админы и игроки помогут вам.
        </p>
        <a href="https://t.me/skviirtl_minecraft" target="_blank" rel="noreferrer">
          <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
            Вступить в Telegram
          </Button>
        </a>
      </div>
    </div>
  );
}
