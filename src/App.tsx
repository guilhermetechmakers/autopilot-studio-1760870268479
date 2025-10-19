import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import IntakeWizard from "@/pages/IntakeWizard";
import ProposalGenerator from "@/pages/ProposalGenerator";
import ProjectSpace from "@/pages/ProjectSpace";
import TasksPage from "@/pages/TasksPage";
import SettingsPage from "@/pages/SettingsPage";
import TimeTrackingPage from "@/pages/TimeTrackingPage";
import AICopilotPage from "@/pages/AICopilotPage";
import HandoverPackPage from "@/pages/HandoverPackPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/intake" element={<IntakeWizard />} />
          <Route path="/proposals/:id?" element={<ProposalGenerator />} />
          <Route path="/projects/:id" element={<ProjectSpace />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/time-tracking" element={<TimeTrackingPage />} />
          <Route path="/copilot" element={<AICopilotPage />} />
          <Route path="/handover" element={<HandoverPackPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
