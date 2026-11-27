import React from "react";
import { sans, serif, C } from "./Shared";
import logoImg from "../assets/logo.jpg";
import { LogOut, User, Stethoscope, Building2 } from "lucide-react";

export default function Header({ view, setView, openAuth, user, onSignOut }) {
  const tabs = [
    { id: "landing", label: "Home" },
    { id: "patient", label: "Patient dashboard", requiredRole: "patient" },
    { id: "doctor", label: "Clinician dashboard", requiredRole: "doctor" },
    { id: "hospital", label: "Hospital management", requiredRole: "hospital" },
    { id: "pharmacy", label: "Medicine supply", requiredRole: null },
    { id: "about", label: "About", requiredRole: null }
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case "doctor": return <Stethoscope size={13} color="#fff" />;
      case "hospital": return <Building2 size={13} color="#fff" />;
      default: return <User size={13} color="#fff" />;
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case "doctor": return "Doctor";
      case "hospital": return "Hospital Admin";
      case "patient": return "Patient";
      default: return role;
    }
  };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: C.ink, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: sans, borderBottom: `1px solid ${C.line}` }}>
      
      {/* LEFT MOST: Logo and Name */}
      <div 
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setView("landing")}
      >
        <img src={logoImg} alt="HumaNex Logo" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
        <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: "#fff" }}>HumaNex</span>
      </div>

      {/* CENTER: Navigation Links */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              border: "none", cursor: "pointer", fontFamily: sans, fontSize: 13, fontWeight: 600,
              padding: "7px 14px", borderRadius: 20,
              background: view === t.id ? "#fff" : "transparent",
              color: view === t.id ? C.ink : "#C7D6D2",
              transition: "background 0.2s"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* RIGHT MOST: Auth State Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8, 
                padding: "4px 12px 4px 6px", 
                background: "rgba(255, 255, 255, 0.12)", 
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.18)"
              }}
            >
              <div 
                style={{ 
                  width: 26, 
                  height: 26, 
                  borderRadius: "50%", 
                  background: C.teal, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                {getRoleIcon(user.role)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </span>
                <span style={{ color: "#A0B5B1", fontSize: 10.5 }}>
                  {getRoleDisplay(user.role)}
                </span>
              </div>
            </div>

            <button 
              onClick={onSignOut} 
              title="Sign out"
              style={{ 
                border: "1px solid rgba(255, 255, 255, 0.3)", 
                background: "transparent", 
                color: "#fff", 
                fontFamily: sans, 
                fontSize: 12.5, 
                fontWeight: 600, 
                cursor: "pointer", 
                padding: "6px 12px", 
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease"
              }}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={() => openAuth("patient", "signin")} 
              style={{ border: "none", background: "transparent", color: "#fff", fontFamily: sans, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "7px 14px", borderRadius: 20 }}
            >
              Sign in / Register
            </button>
            <button 
              onClick={() => openAuth("patient", "register")} 
              style={{ border: "none", background: C.teal, color: "#fff", fontFamily: sans, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "7px 18px", borderRadius: 20 }}
            >
              Get Started
            </button>
          </>
        )}
      </div>

    </div>
  );
}
