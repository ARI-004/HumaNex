import logoImg from "../assets/logo.jpg";
import authBg3 from "../assets/auth_bg3.jpg";
import React, { useState } from "react";
import {
  User, Stethoscope, Building2, AlertCircle, CheckCircle2, Loader2,
} from "lucide-react";

import {
  C, serif, sans, btn, TextField, Waveform
} from '../components/Shared';
import { loginUser, signupUser } from "../api/auth";

export function AuthPage({ role, setRole, mode, setMode, onEnter, onBackHome }) {
  const roles = [
    { id: "patient", label: "Patient", icon: User },
    { id: "doctor", label: "Doctor", icon: Stethoscope },
    { id: "hospital", label: "Hospital admin", icon: Building2 },
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const extraLabel = role === "doctor" ? "Medical registration number" : role === "hospital" ? "Hospital / organization name" : "Date of birth";
  const extraPlaceholder = role === "doctor" ? "e.g. MED-84920" : role === "hospital" ? "e.g. Apex Health Systems" : "YYYY-MM-DD";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const response = await loginUser({ email, password, role });
        setSuccessMessage("Signed in successfully! Redirecting...");
        setTimeout(() => {
          onEnter(response.user.role, response.user);
        }, 500);
      } else {
        const response = await signupUser({ name, email, password, role, extra });
        setSuccessMessage("Account created successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          onEnter(response.user.role, response.user);
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 680, fontFamily: sans, color: C.ink }}>
      {/* BRAND PANEL */}
      <div style={{ 
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 15%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 85%), url(${authBg3})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "56px 48px", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between" 
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", width: "100%" }} onClick={onBackHome}>
          <img src={logoImg} alt="HumaNex Logo" style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }} />
          <span style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, color: "#10262A" }}>HumaNex</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
          <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1.25, fontWeight: 600, marginBottom: 18, maxWidth: 450, color: "#0A2540" }}>
            One account. Your vitals, records, medication and care team, all in the same place.
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: 18 }}>
            <Waveform width={300} height={70} stroke="#3FA294" />
          </div>
          <div style={{ fontSize: 12.5, color: "#4C6265" }}>Secure Cloud Authentication &bull; Medical Data Encryption</div>
        </div>
      </div>

      {/* FORM PANEL */}
      <div style={{ background: C.paper, padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", width: "100%" }}>
          <div style={{ fontFamily: serif, fontSize: 25, fontWeight: 600, marginBottom: 6 }}>
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </div>
          <div style={{ fontSize: 13.5, color: C.inkSoft, marginBottom: 20 }}>
            {mode === "signin" ? "Sign in to continue to your dashboard." : "It takes less than a minute."}
          </div>

          {/* Role selector tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {roles.map((r) => (
              <button 
                type="button"
                key={r.id} 
                onClick={() => { setRole(r.id); setErrorMessage(""); }} 
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 6px",
                  border: `1.5px solid ${role === r.id ? C.teal : C.line}`, borderRadius: 10, cursor: "pointer",
                  background: role === r.id ? C.tealPale : C.panel,
                  transition: "all 0.15s ease",
                }}
              >
                <r.icon size={17} color={role === r.id ? C.tealDark : C.inkSoft} />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: role === r.id ? C.tealDark : C.inkSoft }}>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px",
              background: "#FEE2E2", border: "1px solid #F87171", borderRadius: 8,
              color: "#991B1B", fontSize: 13, marginBottom: 16
            }}>
              <AlertCircle size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{errorMessage}</div>
            </div>
          )}

          {/* Success notification */}
          {successMessage && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              background: "#D1FAE5", border: "1px solid #34D399", borderRadius: 8,
              color: "#065F46", fontSize: 13, marginBottom: 16
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <TextField 
                label="Full name" 
                placeholder="Your full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            )}
            <TextField 
              label="Email address" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <TextField 
              label="Password" 
              type="password" 
              placeholder="Enter your password (min 6 chars)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {mode === "register" && (
              <TextField 
                label={extraLabel} 
                placeholder={extraPlaceholder} 
                value={extra} 
                onChange={(e) => setExtra(e.target.value)} 
                required 
              />
            )}

            {mode === "signin" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: -4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.inkSoft }}>
                  <input type="checkbox" defaultChecked /> Keep me signed in
                </label>
                <span style={{ fontSize: 12.5, color: C.teal, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                ...btn.primary, 
                width: "100%", 
                padding: "12px 20px", 
                marginTop: 6,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />}
              {mode === "signin" ? (loading ? "Signing in..." : "Sign in") : (loading ? "Creating account..." : "Create account")}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: 13, color: C.inkSoft, marginTop: 20 }}>
            {mode === "signin" ? "New to HumaNex? " : "Already have an account? "}
            <span 
              style={{ color: C.teal, fontWeight: 600, cursor: "pointer" }} 
              onClick={() => {
                setMode(mode === "signin" ? "register" : "signin");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              {mode === "signin" ? "Create an account" : "Sign in instead"}
            </span>
          </div>
          <div style={{ textAlign: "center", fontSize: 12.5, color: C.inkSoft, marginTop: 14, cursor: "pointer" }} onClick={onBackHome}>
            &larr; Back to homepage
          </div>
        </div>
      </div>
    </div>
  );
}
