import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Gift, Timer, Flower2 } from "lucide-react";

export default function Events() {
  const events = [
    {
      title: "Весеннее приключение (8 Марта)",
      status: "Завершен",
      endDate: "",
      description: "В честь международного женского дня на сервере проходит особый ивент! Собирайте Весенние цветы и обменивайте их на ценные награды у специального торговца.",
      image: "/merchant.png",
      location: "Спавн сервера",
      features: [
        "Шанс выпадения цветка 25% при сборе обычных цветов",
        "Уникальные награды: Элитры, Трезубец, Отделки брони",
        "Защита от дюпа (только натуральные цветы)"
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-pink-500/20 text-pink-400 px-4 py-1 rounded-full bg-pink-500/5 font-bold uppercase tracking-widest text-xs">
            События сервера
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Текущие <span className="text-primary">Ивенты</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Участвуйте в ограниченных по времени событиях, выполняйте задания и получайте эксклюзивные предметы.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {events.map((event, idx) => (
          <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-none shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative aspect-video lg:aspect-auto overflow-hidden group">
                <img 
                  src={event.image} 
                  alt="Торговец" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold">
                    {event.status}
                  </Badge>

                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-pink-500/20">
                    <Flower2 className="w-6 h-6 text-pink-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{event.title}</h2>
                </div>

                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Где найти торговца?</h4>
                      <p className="text-zinc-500 text-sm">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white/5 text-primary">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Особенности ивента</h4>
                      <ul className="text-zinc-500 text-xs space-y-1 mt-1 list-disc list-inside">
                        {event.features.map((f, fIdx) => (
                          <li key={fIdx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </Card>
        ))}

        {/* Info Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-white/10 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Хотите больше ивентов?</h3>
          <p className="text-muted-foreground">Предлагайте свои идеи в нашем Telegram-канале!</p>
        </div>
      </div>
    </div>
  );
}
