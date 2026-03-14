import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Components
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import Start from "@/pages/start";
import Clans from "@/pages/clans";
import Store from "@/pages/store";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Map from "@/pages/map";
import Rules from "@/pages/rules";
import Guides from "@/pages/guides";
import Events from "@/pages/events";
import Players from "@/pages/players";
import Profile from "@/pages/profile";
import GriefReport from "@/pages/grief-report";
import TournamentBracket from "@/pages/tournament-bracket";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/start" component={Start} />
        <Route path="/rules" component={Rules} />
        <Route path="/guides" component={Guides} />
        <Route path="/events" component={Events} />
        <Route path="/tournament-bracket" component={TournamentBracket} />
        <Route path="/players" component={Players} />
        <Route path="/player/:username" component={Profile} />
        <Route path="/clans" component={Clans} />
        <Route path="/map" component={Map} />
        <Route path="/grief-report" component={GriefReport} />
        <Route path="/store" component={Store} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
