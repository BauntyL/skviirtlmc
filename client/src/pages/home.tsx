import { Copy, ArrowRight, Pickaxe, Gem, Shield, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  const serverIP = "skviirtl.vanilla.cool";

  const copyIp = () => {
    navigator.clipboard.writeText(serverIP);
    toast({
      title: "IP Скопирован!",
      description: "Вставьте его в меню мультиплеера Minecraft.",
    });
  };

  const features = [
    { icon: Gem, title: "Награды", description: "Получайте ежедневные и еженедельные награды командой /rewards." },
    { icon: ShoppingCart, title: "Аукцион", description: "Торгуйте безопасно с игроками через глобальный рынок /ah." },
    { icon: Users, title: "Кланы", description: "Создавайте альянсы, повышайте уровень и доминируйте в топе." },
    { icon: Pickaxe, title: "Работы и Скупщик", description: "Зарабатывайте, продавая ресурсы (/seller) или выполняя работы." },
    { icon: Shield, title: "Приваты", description: "Защитите свои постройки легко с помощью системы /rent." },
    { icon: Users, title: "Скины", description: "Установите свой HD скин командой /skin [url] в любое время." },
  ];

  return (
    <div className="w-full relative min-h-screen">
      {/* Background Image with Blur */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-20 scale-105"
        style={{ 
          backgroundImage: "url('/background.png')",
          filter: "blur(8px) brightness(0.6)",
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Версия 1.16.5 - 1.21.11
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight drop-shadow-xl">
              Добро пожаловать на <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 text-glow">Skviirtl</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              Ванильное выживание в лучшем виде. Присоединяйтесь к растущему сообществу, создавайте кланы и развивайте экономику.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div 
                onClick={copyIp}
                className="group relative flex items-center justify-between gap-4 bg-black/60 backdrop-blur-md border border-white/10 hover:border-primary/50 rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 w-full sm:w-auto box-glow hover:-translate-y-1"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">IP Сервера</span>
                  <span className="font-mono text-lg text-white font-bold">{serverIP}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black text-primary transition-colors">
                  <Copy className="w-5 h-5" />
                </div>
              </div>

              <Link href="/start">
                <Button size="lg" className="h-[74px] px-8 rounded-xl bg-white text-black hover:bg-gray-200 text-lg font-bold w-full sm:w-auto shadow-xl transition-all hover:-translate-y-1">
                  Как начать играть <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/40 backdrop-blur-sm border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">Все, что вам нужно.</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Мы создали ванильный сервер с улучшениями качества жизни, которые делают игру более приятной и интересной.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 hover:bg-black/60"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
