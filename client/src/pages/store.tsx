import { ShoppingCart, Star, Crown, Zap, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Store() {
  const items = [
    { name: "VIP", price: 150, image: "https://i.imgur.com/5Xk5M5r.png", type: "Привилегия" },
    { name: "Premium", price: 350, image: "https://i.imgur.com/2Xk5M5r.png", type: "Привилегия" },
    { name: "Elite", price: 600, image: "https://i.imgur.com/3Xk5M5r.png", type: "Привилегия" },
    { name: "100 Монет", price: 50, image: "https://i.imgur.com/4Xk5M5r.png", type: "Валюта" },
    { name: "Кейс с Документами", price: 100, image: "https://i.imgur.com/6Xk5M5r.png", type: "Кейс" },
    { name: "Разбан", price: 200, image: "https://i.imgur.com/7Xk5M5r.png", type: "Услуга" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display font-bold text-5xl mb-4">Магазин</h1>
        <p className="text-xl text-muted-foreground">Покупайте привилегии и игровые ресурсы.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1">
            <div className="h-48 bg-zinc-900 flex items-center justify-center">
              {/* Placeholder for image */}
              <div className="text-6xl text-white/10 font-bold">{item.name[0]}</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{item.type}</span>
                  <h3 className="text-2xl font-bold mt-1">{item.name}</h3>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full font-mono font-bold">
                  {item.price} ₽
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                Купить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
