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
      title: "IP Copied!",
      description: "Paste it in your Minecraft multiplayer menu.",
    });
  };

  const features = [
    { icon: Gem, title: "Rewards", description: "Get daily and weekly rewards using /rewards command in-game." },
    { icon: ShoppingCart, title: "Auction House", description: "Trade items securely with players via the /ah global market." },
    { icon: Users, title: "Clans", description: "Form alliances, level up, and dominate the server leaderboard." },
    { icon: Pickaxe, title: "Jobs & Seller", description: "Earn money by selling resources (/seller) or picking up jobs." },
    { icon: Shield, title: "Rent Regions", description: "Claim and protect your builds easily using the /rent system." },
    { icon: Users, title: "Custom Skins", description: "Set your own HD skin using the /skin [url] command anytime." },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Supports 1.16.5 - 1.21.11
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 text-glow">Skviirtl</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Vanilla gameplay at its finest. Join a growing community, form powerful clans, and dominate the economy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div 
                onClick={copyIp}
                className="group relative flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 hover:border-primary/50 rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 w-full sm:w-auto box-glow hover:-translate-y-1"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Server IP</span>
                  <span className="font-mono text-lg text-white font-bold">{serverIP}</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-zinc-950 text-primary transition-colors">
                  <Copy className="w-5 h-5" />
                </div>
              </div>

              <Link href="/start">
                <Button size="lg" className="h-[74px] px-8 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-lg font-bold w-full sm:w-auto shadow-xl transition-all hover:-translate-y-1">
                  How to Connect <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-950/50 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Everything you need.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've carefully curated a vanilla-plus experience with quality of life improvements that make gameplay smoother and more engaging.
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
                className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
