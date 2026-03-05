import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Gamepad2, KeyRound } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Никнейм обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

const codeLoginSchema = z.object({
  username: z.string().min(1, "Никнейм обязателен"),
  code: z.string().length(4, "Код должен состоять из 4 цифр"),
});

export default function AuthPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Портал Игрока
          </h1>
          <p className="text-muted-foreground">
            Войдите, чтобы управлять аккаунтом и статистикой
          </p>
        </div>

        <div className="glass-card rounded-2xl p-2 shadow-2xl shadow-black/50">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50 p-1">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-zinc-800"
              >
                Пароль
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-zinc-800"
              >
                Код с сервера
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="code">
              <CodeLoginForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      setLocation("/dashboard");
      toast({ title: "Добро пожаловать!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-4 sm:p-6 pt-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Никнейм</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Steve"
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
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Войти"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function CodeLoginForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof codeLoginSchema>>({
    resolver: zodResolver(codeLoginSchema),
    defaultValues: {
      username: "",
      code: "",
    },
  });

  const codeLoginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof codeLoginSchema>) => {
      const res = await apiRequest("POST", "/api/auth/login-code", data);
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      setLocation("/dashboard");
      toast({ title: "Успешный вход!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-4 sm:p-6 pt-0">
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6 text-sm text-zinc-400">
        <p className="flex items-center gap-2 mb-2 font-medium text-primary">
            <KeyRound className="w-4 h-4" />
            Как получить код?
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-1">
            <li>Зайдите на сервер</li>
            <li>Введите команду <code className="text-white bg-zinc-800 px-1 rounded">/link</code></li>
            <li>Введите полученный код ниже</li>
        </ol>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => codeLoginMutation.mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Никнейм</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Steve"
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Код подтверждения</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234"
                    maxLength={4}
                    className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-primary text-center tracking-[0.5em] text-lg font-mono"
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
            disabled={codeLoginMutation.isPending}
          >
            {codeLoginMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Войти по коду"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
