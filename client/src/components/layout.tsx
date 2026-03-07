import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Gamepad2, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useAuth();
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/start", label: "Как начать" },
    { href: "/rules", label: "Правила" },
    { href: "/guides", label: "Гайды" },
    { href: "/players", label: "Игроки" },
    { href: "/clans", label: "Кланы" },
    { href: "/map", label: "Карта" },
    // { href: "/store", label: "Магазин" }, // Hidden for now
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">
                  Skviirtl<span className="text-primary">.</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-24 h-10 bg-muted animate-pulse rounded-md" />
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{user.username}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => logout()}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
                    Вход / Играть
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-background pb-4 px-4">
            <div className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium p-2 rounded-md ${
                    location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-2 text-foreground font-medium"
                    >
                      <UserIcon className="w-5 h-5 text-primary" />
                      Dashboard ({user.username})
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      Вход / Регистрация
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-white">Skviirtl</span>
          </div>
          <p className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Skviirtl Server. All rights reserved. <br/> Not affiliated with Mojang AB.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/skviirtl_minecraft" 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-2"
            >
              Вступайте в наш Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
