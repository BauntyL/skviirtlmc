import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Users, Swords, ScrollText, AlertTriangle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Rules() {
  return (
    <div className="min-h-screen w-full bg-background pb-20">
      {/* Header Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary px-4 py-1 rounded-full bg-primary/5">
            Свод законов Skviirtl
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Правила <span className="text-primary">Сервера</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Справедливость и комфорт для всех. Мы создали правила, которые позволяют мирно сосуществовать строителям и воинам.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-white/5 border border-white/10 rounded-2xl mb-12">
            <TabsTrigger value="general" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
              <Shield className="w-4 h-4" /> Общие
            </TabsTrigger>
            <TabsTrigger value="gameplay" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
              <Heart className="w-4 h-4" /> Геймплей
            </TabsTrigger>
            <TabsTrigger value="clans" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
              <Users className="w-4 h-4" /> Кланы
            </TabsTrigger>
            <TabsTrigger value="raids" className="py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex gap-2">
              <Swords className="w-4 h-4" /> Нападения
            </TabsTrigger>
          </TabsList>

          {/* General Rules */}
          <TabsContent value="general">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <ScrollText className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Фундаментальные правила</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">1.1. Использование читов и стороннего ПО</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      Запрещено использование любых модификаций клиента, дающих преимущество над другими игроками (X-Ray, KillAura, Fly и т.д.). 
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Перманентный бан.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">1.2. Ошибки и баги (Дюпы)</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Запрещено использование багов игры или плагинов для личной выгоды (особенно дюп предметов). О найденных багах необходимо сообщать администрации.
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Бан от 30 дней до перманентного.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">1.3. Поведение в чате</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Запрещены оскорбления, флуд, спам, реклама сторонних ресурсов и разжигание ненависти. Уважайте друг друга.
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Мут от 1 часа до бана на неделю.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gameplay (PVP/PVE) */}
          <TabsContent value="gameplay">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Heart className="w-5 h-5 text-green-500" />
                  </div>
                  <CardTitle className="text-xl text-white">Мирное сосуществование (PVE/PVP)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Для PVE игроков
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Вы можете отключить режим PVP в настройках. Запрещено намеренно мешать строительству или "запирать" мирных игроков. Гриферство в приватах запрещено.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                      <Swords className="w-4 h-4" /> Для PVP игроков
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Сражения разрешены только между игроками с включенным PVP. Убийство новичков (в течение 1 часа после первого захода) не приветствуется.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-amber-500 font-bold text-sm uppercase">Важно про гриферство</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Разрушение чужих построек, даже если они не запривачены, считается гриферством, если это не является частью официально объявленного рейда кланов.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clans Rules */}
          <TabsContent value="clans">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl text-white">Устав кланов</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">3.1. Создание и управление</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Клан должен иметь уникальное название и четкую структуру. Лидер несет ответственность за действия всех участников клана.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">3.2. Дипломатия и союзы</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Кланы могут заключать союзы или объявлять войну. Все дипломатические изменения должны быть зафиксированы (если это предусмотрено системой).
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6">3.3. Предательство</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Кража ресурсов клана участником ("инсайд") наказывается баном. Мы за честную игру внутри команд.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Raid Rules */}
          <TabsContent value="raids">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Swords className="w-5 h-5 text-red-500" />
                  </div>
                  <CardTitle className="text-xl text-white">Правила рейдов и захватов</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Объявление рейда</h4>
                      <p className="text-sm text-muted-foreground">Рейд считается легитимным только если между кланами официально объявлена война. Беспричинный снос базы запрещен.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Лимит разрушений</h4>
                      <p className="text-sm text-muted-foreground">Цель рейда — захват ресурсов, а не полное уничтожение ландшафта. Запрещено заливать базу лавой или водой "просто так".</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Время отдыха</h4>
                      <p className="text-sm text-muted-foreground">После успешного рейда у проигравшего клана есть 48 часов "мирного времени" на восстановление, в течение которых их нельзя атаковать повторно.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="mt-12 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-white font-medium mb-2">Незнание правил не освобождает от ответственности.</p>
          <p className="text-sm text-muted-foreground">Администрация оставляет за собой право изменять правила с уведомлением игроков в Telegram.</p>
        </div>
      </div>
    </div>
  );
}
