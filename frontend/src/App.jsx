import React, { useState, useEffect } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import {
  C, useFonts, btn, Modal
} from './components/Shared';
import { Landing } from "./pages/Landing";
import { AuthPage } from "./pages/Auth";
import { PatientDashboard } from "./pages/PatientDashboard";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { HospitalDashboard } from "./pages/HospitalDashboard";
import { PharmacyDashboard } from "./pages/PharmacyDashboard";
import { ComponentsShowcase } from "./pages/ComponentsShowcase";
import { AboutPage } from "./pages/About";
import Header from "./components/Header";
import { authStorage, fetchCurrentUser, logoutUser } from "./api/auth";

export default function HumaNexPrototype() {
  useFonts();
  const [view, setView] = useState("landing");
  const [authRole, setAuthRole] = useState("patient");
  const [authMode, setAuthMode] = useState("signin");
  const [user, setUser] = useState(() => authStorage.getUser());
  const [authWarning, setAuthWarning] = useState(null);

  // Check and restore user session on mount
  useEffect(() => {
    async function verifySession() {
      const activeUser = await fetchCurrentUser();
      if (activeUser) {
        setUser(activeUser);
      } else if (!authStorage.getToken()) {
        setUser(null);
      }
    }
    verifySession();
  }, []);

  function openAuth(role, mode) {
    setAuthRole(role);
    setAuthMode(mode);
    setView("auth");
  }

  function handleAuthSuccess(role, authedUser) {
    setUser(authedUser);
    setView(role === "hospital" ? "hospital" : role);
  }

  async function handleSignOut() {
    await logoutUser();
    setUser(null);
    setView("landing");
  }

  // Role-Based Authorization Guard for Views
  function handleNavigate(targetView) {
    const roleProtectedViews = {
      patient: "patient",
      doctor: "doctor",
      hospital: "hospital",
    };

    const requiredRole = roleProtectedViews[targetView];

    // If it's not a role-protected dashboard, allow navigation directly
    if (!requiredRole) {
      setView(targetView);
      return;
    }

    // If not logged in, prompt to log in with that role
    if (!user) {
      setAuthWarning({
        title: "Authentication Required",
        message: `You must sign in as a ${requiredRole === "hospital" ? "Hospital Admin" : requiredRole} to access this dashboard.`,
        actionLabel: "Sign In",
        action: () => {
          setAuthWarning(null);
          openAuth(requiredRole, "signin");
        },
      });
      return;
    }

    // If logged in with the wrong role, enforce Authorization
    if (user.role !== requiredRole) {
      const roleNames = {
        patient: "Patient",
        doctor: "Doctor",
        hospital: "Hospital Admin",
      };
      setAuthWarning({
        title: "Access Denied (Unauthorized)",
        message: `This dashboard is restricted to ${roleNames[requiredRole]}s only. You are currently logged in as a ${roleNames[user.role] || user.role}.`,
        actionLabel: "Switch Account",
        action: () => {
          setAuthWarning(null);
          openAuth(requiredRole, "signin");
        },
      });
      return;
    }

    // Authorized!
    setView(targetView);
  }

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }}>
      <Header 
        view={view} 
        setView={handleNavigate} 
        openAuth={openAuth} 
        user={user} 
        onSignOut={handleSignOut} 
      />

      {view === "landing" && (
        <Landing 
          onSignIn={(r) => openAuth(r, "signin")} 
          onGetStarted={(r) => openAuth(r, "register")} 
        />
      )}

      {view === "about" && <AboutPage />}

      {view === "auth" && (
        <AuthPage
          role={authRole}
          setRole={setAuthRole}
          mode={authMode}
          setMode={setAuthMode}
          onEnter={handleAuthSuccess}
          onBackHome={() => setView("landing")}
        />
      )}

      {view === "patient" && <PatientDashboard onSignOut={handleSignOut} user={user} />}
      {view === "doctor" && <DoctorDashboard onSignOut={handleSignOut} user={user} />}
      {view === "hospital" && <HospitalDashboard onSignOut={handleSignOut} user={user} />}
      {view === "pharmacy" && <PharmacyDashboard onSignOut={handleSignOut} user={user} />}
      {view === "components" && <ComponentsShowcase />}

      {/* Authorization & Access Control Modal */}
      {authWarning && (
        <Modal title={authWarning.title} onClose={() => setAuthWarning(null)} width={400}>
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ 
              width: 50, 
              height: 50, 
              borderRadius: "50%", 
              background: "#FEE2E2", 
              color: "#DC2626", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 16px" 
            }}>
              <Lock size={24} />
            </div>
            <div style={{ fontSize: 14, color: C.inkSoft, marginBottom: 22, lineHeight: 1.5 }}>
              {authWarning.message}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button 
                onClick={() => setAuthWarning(null)} 
                style={{ ...btn.outline, flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={authWarning.action} 
                style={{ ...btn.primary, flex: 1 }}
              >
                {authWarning.actionLabel}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
