import { Download, Gamepad2, Wifi, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Start() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display font-bold text-5xl mb-4">Как начать играть</h1>
        <p className="text-xl text-muted-foreground">Присоединяйтесь к нашему серверу за 3 простых шага.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 z-0" />

        <StepCard 
          number="1"
          title="Скачайте Лаунчер"
          description="Вы можете использовать любой лаунчер (TLauncher, KLauncher, Mister Launcher) или официальный Minecraft лаунчер."
          icon={<Download className="w-8 h-8 text-primary" />}
        />

        <StepCard 
          number="2"
          title="Выберите Версию"
          description="Наш сервер поддерживает версии от 1.16.5 до 1.21.11. Мы рекомендуем использовать новейшую версию для лучшего опыта."
          icon={<Gamepad2 className="w-8 h-8 text-primary" />}
        />

        <StepCard 
          number="3"
          title="Подключитесь"
          description={
            <span>
              Добавьте сервер по адресу <span className="text-primary font-mono font-bold bg-primary/10 px-1 rounded">skviirtl.vanilla.cool</span> и присоединяйтесь! Не забудьте зарегистрироваться командой <code className="bg-zinc-800 px-1 rounded text-sm">/register пароль пароль</code>.
            </span>
          }
          icon={<Wifi className="w-8 h-8 text-primary" />}
        />
      </div>

      <div className="mt-20 bg-zinc-900/50 border border-white/5 rounded-2xl p-8 max-w-3xl mx-auto">
        <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="text-blue-400" />
          Полезные команды
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <CommandItem cmd="/menu" desc="Открыть главное меню сервера" /> */}
          <CommandItem cmd="/rtp" desc="Случайная телепортация в мире" />
          <CommandItem cmd="/sethome" desc="Установить точку дома" />
          <CommandItem cmd="/home" desc="Телепортироваться домой" />
          <CommandItem cmd="/tpa <ник>" desc="Отправить запрос на телепортацию к игроку" />
          <CommandItem cmd="/skin <ник>" desc="Установить скин по нику" />
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: React.ReactNode, icon: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 bg-card border border-white/5 p-8 rounded-2xl text-center hover:border-primary/50 transition-colors"
    >
      <div className="w-16 h-16 mx-auto bg-background rounded-full border-2 border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        {icon}
      </div>
      <div className="absolute top-4 right-4 text-4xl font-display font-bold text-white/5 select-none">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function CommandItem({ cmd, desc }: { cmd: string, desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <code className="text-primary font-mono font-bold whitespace-nowrap">{cmd}</code>
      <span className="text-sm text-gray-400">{desc}</span>
    </div>
  );
}
