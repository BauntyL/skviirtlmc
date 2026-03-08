import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGriefReportSchema } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { AlertCircle, CheckCircle2, Clock, MapPin, ShieldAlert, History, User as UserIcon, Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowUpDown } from "lucide-react";

export default function GriefReport() {
  const { data: user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: reports, refetch } = useQuery({
    queryKey: [api.grief.list.path],
    enabled: !!user,
  });

  const form = useForm({
    resolver: zodResolver(insertGriefReportSchema),
    defaultValues: {
      userId: user?.id || 0,
      username: user?.username || "",
      minecraftUuid: user?.minecraftUuid || "",
      coordinates: "",
      time: "",
      description: "",
    },
  });

  // Обновляем форму, когда данные пользователя загружены
  useEffect(() => {
    if (user) {
      form.reset({
        userId: user.id,
        username: user.username,
        minecraftUuid: user.minecraftUuid || "",
        coordinates: form.getValues("coordinates"),
        time: form.getValues("time"),
        description: form.getValues("description"),
      });
    }
  }, [user, form]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await fetch(buildUrl(api.grief.updateStatus.path, { id }), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка при обновлении статуса");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Успех", description: "Статус заявки обновлен" });
      refetch();
    },
    onError: (error: Error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.grief.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка при отправке");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена!",
        description: "Администрация рассмотрит вашу жалобу в ближайшее время.",
      });
      form.reset({
        userId: user?.id || 0,
        username: user?.username || "",
        minecraftUuid: user?.minecraftUuid || "",
        coordinates: "",
        time: "",
        description: "",
      });
      refetch();
    },
    onError: (error: Error) => {
      console.error("Grief report submission error:", error);
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <ShieldAlert className="w-16 h-16 text-primary mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-white mb-2">Требуется авторизация</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Для подачи жалобы на гриферство необходимо войти в свой аккаунт на сайте.
        </p>
        <Button onClick={() => setLocation("/auth")} className="bg-primary text-black font-bold">
          Войти или зарегистрироваться
        </Button>
      </div>
    );
  }

  if (!user.minecraftUuid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Аккаунт не привязан</h2>
        <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
          Мы не можем принять жалобу, пока ваш аккаунт на сайте не связан с игровым персонажем. 
          Это необходимо для подтверждения владения постройками.
        </p>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
          <p className="text-sm text-white font-medium mb-2">Как привязать аккаунт?</p>
          <ol className="text-sm text-muted-foreground text-left space-y-2 list-decimal list-inside">
            <li>Зайдите на сервер Minecraft.</li>
            <li>Введите команду <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">/link</code> в чат.</li>
            <li>Получите код и введите его в личном кабинете на сайте.</li>
          </ol>
        </div>
        <Button onClick={() => setLocation("/dashboard")} className="bg-primary text-black font-bold px-8">
          Перейти в личный кабинет
        </Button>
      </div>
    );
  }

  const filteredReports = reports?.filter((report: any) => {
    const matchesSearch = report.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.coordinates.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-background pb-20">
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-background" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Badge variant="outline" className="mb-4 border-red-500/20 text-red-500 px-4 py-1 rounded-full bg-red-500/5 font-bold uppercase tracking-widest text-xs">
            {user.role === 'admin' ? "Панель управления" : "Помощь игрокам"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            {user.role === 'admin' ? "Управление" : "Меня"} <span className="text-red-500">{user.role === 'admin' ? "Жалобами" : "Загриферили"}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {user.role === 'admin' 
              ? "Рассматривайте заявки, восстанавливайте постройки и следите за порядком на сервере." 
              : "Обнаружили повреждения вашей постройки? Оставьте заявку, и наши модераторы помогут восстановить её и наказать виновных."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {user.role === "admin" ? (
          <div className="space-y-8">
            {/* Admin Console */}
            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg px-6">Все ({reports?.length || 0})</TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-lg px-6">Новые ({reports?.filter((r: any) => r.status === 'pending').length || 0})</TabsTrigger>
                  <TabsTrigger value="resolved" className="rounded-lg px-6">Решенные</TabsTrigger>
                  <TabsTrigger value="rejected" className="rounded-lg px-6">Отклоненные</TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    placeholder="Поиск по нику или коордам..." 
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {["all", "pending", "resolved", "rejected"].map((status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports?.filter((r: any) => status === 'all' || r.status === status).map((report: any) => (
                      <Card key={report.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-all duration-300 group overflow-hidden border-none shadow-xl">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge 
                              variant="secondary" 
                              className={
                                report.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                report.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                'bg-red-500/10 text-red-500'
                              }
                            >
                              {report.status === 'pending' ? 'В очереди' :
                               report.status === 'resolved' ? 'Решено' : 'Отклонено'}
                            </Badge>
                            <span className="text-[10px] text-zinc-500 font-mono">#{report.id}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white font-bold text-lg mb-1">
                            <UserIcon className="w-4 h-4 text-primary" />
                            {report.username}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {report.coordinates}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-black/20 text-xs text-zinc-300 leading-relaxed border border-white/5 italic">
                              "{report.description || 'Описание отсутствует'}"
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                              <Clock className="w-3 h-3" />
                              Указанное время: {report.time}
                            </div>
                            
                            {report.status === 'pending' && (
                              <div className="flex gap-2 pt-2 border-t border-white/5">
                                <Button 
                                  className="flex-1 bg-green-500 text-white hover:bg-green-600 font-bold h-9"
                                  onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'resolved' })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <Check className="w-4 h-4 mr-1" /> Решить
                                </Button>
                                <Button 
                                  variant="destructive"
                                  className="flex-1 font-bold h-9"
                                  onClick={() => updateStatusMutation.mutate({ id: report.id, status: 'rejected' })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  <X className="w-4 h-4 mr-1" /> Отказать
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {(!filteredReports || filteredReports.filter((r: any) => status === 'all' || r.status === status).length === 0) && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                      <ShieldAlert className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 font-medium">Ничего не найдено</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Form for Admin too */}
            <div className="pt-12 border-t border-white/10">
               <h2 className="text-2xl font-bold text-white mb-6 text-center">Создать новую заявку</h2>
               <div className="max-w-3xl mx-auto">
                  <GriefForm form={form} createMutation={createMutation} />
               </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-none shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Подать жалобу</CardTitle>
                </CardHeader>
                <CardContent>
                  <GriefForm form={form} createMutation={createMutation} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-none shadow-2xl h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" /> Мои жалобы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!reports || reports.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-muted-foreground text-sm italic">У вас пока нет активных жалоб</p>
                      </div>
                    ) : (
                      reports.map((report: any) => (
                        <div key={report.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <Badge 
                              variant="secondary" 
                              className={
                                report.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                report.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                'bg-red-500/10 text-red-500'
                              }
                            >
                              {report.status === 'pending' ? 'В очереди' :
                               report.status === 'resolved' ? 'Решено' : 'Отклонено'}
                            </Badge>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              #{report.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white mb-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            {report.coordinates}
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 italic">
                            "{report.description || 'Без описания'}"
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GriefForm({ form, createMutation }: { form: any, createMutation: any }) {
  return (
    <form onSubmit={form.handleSubmit((data: any) => createMutation.mutate(data))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="coordinates" className="text-zinc-400">Координаты (X, Y, Z)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-primary opacity-50" />
            <Input 
              id="coordinates" 
              placeholder="Напр: 1500, 64, -2300" 
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
              {...form.register("coordinates")}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="text-zinc-400">Примерное время</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 w-4 h-4 text-primary opacity-50" />
            <Input 
              id="time" 
              placeholder="Напр: Сегодня в 14:00" 
              className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
              {...form.register("time")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-zinc-400">Что именно произошло?</Label>
        <Textarea 
          id="description" 
          placeholder="Опишите масштаб повреждений или пропавшие предметы..." 
          className="min-h-[120px] bg-white/5 border-white/10 focus:border-primary/50"
          {...form.register("description")}
        />
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary font-bold mr-1">Внимание:</span> 
          Ложные вызовы могут привести к временной блокировке возможности подавать жалобы. 
          Убедитесь, что территория действительно была загриферена, а не повреждена вашими друзьями.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={createMutation.isPending}
        className="w-full bg-primary text-black font-bold h-12 text-lg hover:scale-[1.02] transition-transform"
      >
        {createMutation.isPending ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
