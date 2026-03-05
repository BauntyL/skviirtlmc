import { ShoppingCart, Star, Crown, Zap, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORE_ITEMS = [
  {
    id: 1,
    name: "VIP Rank",
    price: "4.99",
    icon: Star,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    features: ["Colored chat name", "Set 3 homes", "Access to /feed", "Keep XP on death"],
  },
  {
    id: 2,
    name: "Premium Rank",
    price: "9.99",
    icon: Zap,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    features: ["All VIP perks", "Set 5 homes", "Access to /heal", "Custom nickname", "Skip queue"],
    popular: true,
  },
  {
    id: 3,
    name: "Elite Rank",
    price: "19.99",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    features: ["All Premium perks", "Set 10 homes", "Access to /fly", "Colored signs", "Exclusive tag"],
  },
  {
    id: 4,
    name: "Mystery Crate Keys",
    price: "2.99",
    icon: Box,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    features: ["5x Mystery Keys", "Chance for rare items", "Spawners & Money", "Cosmetic drops"],
  },
];

export default function Store() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-6">
          <ShoppingCart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Server Store</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Support the server and get exclusive perks. All purchases go towards server hosting and development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STORE_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className={`relative flex flex-col glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${item.popular ? 'border-primary/50 shadow-primary/10' : 'hover:border-white/20'}`}
          >
            {item.popular && (
              <div className="absolute top-0 inset-x-0 bg-primary py-1 text-center text-xs font-bold text-zinc-950 uppercase tracking-wider">
                Most Popular
              </div>
            )}
            
            <div className={`p-8 ${item.popular ? 'pt-10' : ''} flex-1`}>
              <div className={`w-14 h-14 rounded-xl ${item.bg} ${item.border} border flex items-center justify-center mb-6`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white">${item.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {item.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20">
              {/* Note: This is a mock store per instructions */}
              <Button 
                className={`w-full font-bold ${item.popular ? 'bg-primary text-zinc-950 hover:bg-primary/90' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                onClick={() => alert("This is a mock store. Purchasing is disabled.")}
              >
                Purchase Rank
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
