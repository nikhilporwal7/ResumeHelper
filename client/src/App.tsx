import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ResumeBuilder from "@/pages/resume-builder";
import ResumeView from "@/pages/resume-view";
import ArweaveResumes from "@/pages/arweave-resumes";
import { ThemeProvider } from "next-themes";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { ResumeProvider } from "@/context/ResumeContext";
import { ArweaveProvider } from "@/context/ArweaveContext";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/builder" component={ResumeBuilder} />
          <Route path="/builder/:id" component={ResumeBuilder} />
          <Route path="/view/:id" component={ResumeView} />
          <Route path="/arweave" component={ArweaveResumes} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ArweaveProvider>
            <ResumeProvider>
              <Toaster />
              <Router />
            </ResumeProvider>
          </ArweaveProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
