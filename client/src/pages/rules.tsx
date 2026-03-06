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
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">1.1. Использование читов и стороннего ПО</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      Запрещено использование любых модификаций клиента, дающих преимущество над другими игроками (X-Ray, KillAura, Fly и т.д.). Разрешены только косметические моды (MiniMap без пещер, FullBright, ReplayMod).
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Перманентный бан по IP и UUID.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">1.2. Ошибки и баги (Дюпы)</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Запрещено использование багов игры или плагинов для личной выгоды (особенно дюп предметов). О найденных багах необходимо сообщать администрации. За сокрытие критического бага — бан.
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Бан от 30 дней до перманентного.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">1.3. Поведение в чате</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Запрещены оскорбления, флуд, спам, реклама сторонних ресурсов и разжигание ненависти. Уважайте друг друга. Запрещена продажа игровых ресурсов за реальные деньги (кроме официального доната).
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Мут от 1 часа до бана на неделю.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">1.4. Аккаунты и Скины</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Разрешено иметь не более 2-х аккаунтов на одного игрока. Использование дополнительных аккаунтов для обхода бана или массового фарма ресурсов запрещено. Скины не должны содержать эротических элементов или пропаганды запрещенных организаций.
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Бан лишних аккаунтов / Кик до смены скина.
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
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary text-primary-foreground font-bold">/pvp</div>
                    <p className="text-sm text-white">Используйте эту команду, чтобы включить или выключить режим сражений в любой момент!</p>
                  </div>
                  <Badge className="bg-primary text-white">Основная команда</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Для PVE игроков
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Вы можете полностью отключить PVP и спокойно строить.</li>
                      <li>Запрещено убивать игроков ловушками, лавой или мобами, если у них выключен PVP.</li>
                      <li>Гриферство в приватах и воровство ресурсов запрещено.</li>
                    </ul>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                      <Swords className="w-4 h-4" /> Для PVP игроков
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Сражения разрешены только между игроками с включенным статусом.</li>
                      <li>Запрещено "PVP-бегство" (выход из игры во время боя). Система накажет вас автоматически.</li>
                      <li>Честный бой — основа сервера. Запрещено использование сторонних программ.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-amber-500 font-bold text-sm uppercase">Территории и строительство</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Порча ландшафта (столбы из земли, ямы 1х1, разлитие воды/лавы) вокруг чужих баз приравнивается к гриферству. Уважайте труд других игроков и красоту окружающего мира.
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
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">3.1. Создание и управление</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Клан должен иметь уникальное название без мата и оскорблений. Лидер несет полную ответственность за действия участников. Если участник клана нарушает правила сервера — клан может получить предупреждение.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">3.2. Дипломатия и союзы</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Кланы могут заключать союзы. Предательство союзника (нападение без расторжения союза) считается нарушением игровой этики и может караться временным исключением клана из системы войн.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-white/10 px-6">
                    <AccordionTrigger className="text-white hover:text-primary py-6 text-left">3.3. Предательство (Инсайд)</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6">
                      Кража ресурсов из сундуков клана его же участником с целью ухода или передачи другому клану запрещена. Мы ценим верность своей команде.
                      <br /><br />
                      <span className="text-red-400 font-bold">Наказание:</span> Бан участника, возврат ресурсов (по возможности).
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
                      <p className="text-sm text-muted-foreground">Рейд считается легитимным только при наличии войны. Нападение на PVE-игроков или их постройки запрещено и карается как гриферство.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Разрушения и Взрывы</h4>
                      <p className="text-sm text-muted-foreground">Использование TNT разрешено только для пробития стен к сундукам. Запрещено полное уничтожение базы ("вайп под ноль") и ландшафта вокруг нее.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Воровство и Трофеи</h4>
                      <p className="text-sm text-muted-foreground">Вы имеете право забрать любые ресурсы. Однако запрещено сжигать или выбрасывать то, что вы не можете унести, просто чтобы ресурсы пропали.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 font-bold">4</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Мирное время</h4>
                      <p className="text-sm text-muted-foreground">После рейда у клана есть 48 часов защиты. Повторный рейд в это время невозможен.</p>
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
