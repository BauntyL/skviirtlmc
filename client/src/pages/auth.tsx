import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth, useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Gamepad2 } from "lucide-react";
import { api } from "@shared/routes";

type FormData = z.infer<typeof api.auth.login.input>;

export default function AuthPage() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const login = useLogin();
  const register = useRegister();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const form = useForm<FormData>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    if (activeTab === "login") {
      login.mutate(data, {
        onSuccess: () => setLocation("/dashboard"),
      });
    } else {
      register.mutate(data, {
        onSuccess: () => setLocation("/dashboard"),
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const isPending = login.isPending || register.isPending;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Портал Игрока</h1>
          <p className="text-muted-foreground">Войдите, чтобы управлять аккаунтом и статистикой</p>
        </div>

        <div className="glass-card rounded-2xl p-2 shadow-2xl shadow-black/50">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50 p-1">
              <TabsTrigger value="login" className="data-[state=active]:bg-zinc-800">Вход</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-zinc-800">Регистрация</TabsTrigger>
            </TabsList>
            
            <div className="p-4 sm:p-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Никнейм</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ваш ник в Minecraft" 
                            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Пароль</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-zinc-950 font-bold hover:bg-primary/90 mt-6 h-12"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : activeTab === "login" ? (
                      "Войти"
                    ) : (
                      "Создать аккаунт"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </Tabs>
        </div>
        
        {activeTab === 'register' && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Примечание: Вы также можете зарегистрироваться в игре, используя команду <code className="text-primary bg-primary/10 px-1 rounded">/register пароль</code>
          </p>
        )}
      </div>
    </div>
  );
}
