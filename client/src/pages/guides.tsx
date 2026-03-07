import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Mic, Shield, ExternalLink, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Guides() {
  const guides = [
    {
      title: "Приват территории",
      category: "Основы",
      icon: Shield,
      description: "Для защиты своего дома используйте деревянный топор (команда //wand). Выделите две точки (ЛКМ и ПКМ) и введите /rg claim <название>. Это создаст защищенную зону, где только вы и ваши друзья сможете строить.",
      links: [
        { label: "Подробнее в правилах", url: "/rules" }
      ]
    },
    {
      title: "Plasmo Voice",
      category: "Моды",
      icon: Mic,
      description: "На нашем сервере установлен плагин на голосовой чат. Для работы необходимо установить мод Plasmo Voice на свой клиент (Fabric/Forge). Нажмите 'V' в игре после установки, чтобы открыть меню настроек.",
      links: [
        { label: "Скачать мод", url: "https://modrinth.com/plugin/plasmo-voice" }
      ]
    },
    {
      title: "Экономика и Аукцион",
      category: "Геймплей",
      icon: BookOpen,
      description: "Зарабатывайте деньги, продавая ресурсы скупщику или другим игрокам. Используйте /ah для открытия аукциона, /ah sell <цена> чтобы выставить предмет в руке на продажу. Проверить баланс можно командой /money.",
      links: [
        { label: "Все команды", url: "/rules" }
      ]
    },
    {
      title: "Команды /team",
      category: "Кланы",
      icon: Users,
      description: "Объединяйтесь в команды с друзьями! Используйте /team create <название> для создания клана. Командный банк, общая точка дома и дипломатия помогут вам стать сильнейшей фракцией сервера.",
      links: [
        { label: "Список команд", url: "/clans" }
      ]
    },
    {
      title: "Ивент 8 Марта",
      category: "Ивенты",
      icon: Play,
      description: "В честь праздника по всему миру можно найти особые Весенние цветы. Собирайте обычные цветы в лесах и полях — с шансом 25% вам выпадет ивентовый предмет. Обменяйте его у Торговца на спавне на ценные призы!",
      links: [
        { label: "Открыть магазин", url: "#" }
      ]
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full bg-primary/5 font-bold uppercase tracking-widest text-xs">
            База знаний
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Полезные <span className="text-primary">Материалы</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Краткие инструкции и полезные ссылки, которые помогут вам быстрее освоиться на сервере.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, idx) => (
          <Card key={idx} className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-none shadow-2xl flex flex-col hover:bg-white/[0.07] transition-colors duration-300">
            <CardHeader className="pt-8 px-8">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-black tracking-tighter">
                  {guide.category}
                </Badge>
                <div className="p-2 rounded-xl bg-white/5">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white tracking-tight">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between px-8 pb-8">
              <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                {guide.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {guide.links.map((link, lIdx) => (
                  <a key={lIdx} href={link.url} target={link.url.startsWith('http') ? "_blank" : "_self"} rel="noreferrer">
                    <Button variant="outline" size="sm" className="border-white/10 hover:bg-primary hover:text-black hover:border-primary text-xs font-bold transition-all">
                      {link.label.includes('Скачать') ? <Download className="w-3 h-3 mr-2" /> : <ExternalLink className="w-3 h-3 mr-2" />}
                      {link.label}
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Wiki/Help Banner */}
        <div className="md:col-span-2 mt-8 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen className="w-32 h-32" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Остались вопросы?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Если вы не нашли нужную информацию, загляните в раздел правил или спросите в нашем чате игроков.
          </p>
          <div className="flex justify-center gap-4">
             <a href="/rules"><Button className="bg-primary text-black font-bold">Правила сервера</Button></a>
             <a href="https://t.me/skviirtl_minecraft" target="_blank" rel="noreferrer"><Button variant="outline" className="border-white/20">Telegram чат</Button></a>
          </div>
        </div>
      </div>
    </div>
  );
}
