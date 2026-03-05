import { Copy, ArrowRight, Pickaxe, Gem, Shield, Users, ShoppingCart, Check, Coins, Gift, Shirt, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const serverIP = "skviirtl.vanilla.cool";

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const copyIp = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    toast({
      title: "IP скопирован!",
      description: "Вставьте его в меню сетевой игры Minecraft.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background with parallax-like effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.jpg')",
            filter: "brightness(0.4) blur(4px)",
            transform: "scale(1.1)", // Scale up slightly to prevent blur edges from showing
            backgroundPosition: "center 20%", // Focus on upper part
            backgroundSize: "cover", // Fill screen
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display font-bold text-6xl md:text-8xl text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              Skviirtl<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light">
              Ванильное выживание с экономикой. <br/>
              <span className="text-primary font-medium">Версии 1.16.5 - 1.21.11</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/start">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
                  Начать играть
                </Button>
              </Link>
              
              <div 
                className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/10 cursor-pointer hover:bg-black/50 transition-colors"
                onClick={copyIp}
              >
                {copied ? <Check className="text-green-400" /> : <Copy className="text-gray-400" />}
                <span className="text-lg font-mono text-white">skviirtl.vanilla.cool</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-400 bg-green-900/20 py-2 px-4 rounded-full w-fit mx-auto border border-green-500/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-medium">{stats?.onlineCount || 0} игроков онлайн</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <h2 className="font-display text-4xl font-bold text-center mb-12">Почему мы?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Shield className="w-10 h-10 text-primary" />}
            title="Честная игра"
            description="Никаких кастомных зачарований или дисбалансных предметов. Только классический Minecraft опыт с удобными дополнениями."
          />
          <FeatureCard 
            icon={<Coins className="w-10 h-10 text-primary" />}
            title="Экономика"
            description="Развитая экономика с Аукционом (/ah), Скупщиком (/seller) и возможностью аренды предметов (/rent)."
          />
          <FeatureCard 
            icon={<Users className="w-10 h-10 text-primary" />}
            title="Система кланов"
            description="Создавайте кланы, сражайтесь за первенство и развивайте своё сообщество. Подробности в /clan help."
          />
          <FeatureCard 
            icon={<Gift className="w-10 h-10 text-primary" />}
            title="Награды"
            description="Получайте ежедневные бонусы с помощью команды /rewards. Мы ценим вашу активность!"
          />
          <FeatureCard 
            icon={<Shirt className="w-10 h-10 text-primary" />}
            title="Скины"
            description="Меняйте свой облик прямо в игре командой /skin. Доступно всем игрокам бесплатно."
          />
          <FeatureCard 
            icon={<Zap className="w-10 h-10 text-primary" />}
            title="Оптимизация"
            description="Стабильный TPS и отсутствие лагов. Мы используем мощное оборудование для комфортной игры."
          />
        </div>
      </section>

      {/* Community CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-900/40 to-primary/20 border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Присоединяйтесь к сообществу</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Следите за новостями, общайтесь с игроками и участвуйте в ивентах в нашем Telegram канале.
            </p>
            <a 
              href="https://t.me/skviirtl_minecraft" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2 border-blue-500/50 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300">
                Перейти в Telegram
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-card/50 backdrop-blur-sm border border-white/5 p-6 rounded-xl hover:border-primary/50 transition-colors"
    >
      <div className="mb-4 bg-background/50 w-fit p-3 rounded-lg border border-white/5">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
