import { useState } from "react";
import type { useSupabaseSession } from "./hooks/useSupabaseSession.ts";

interface AdminLoginProps {
  loginFn: ReturnType<typeof useSupabaseSession>["login"];
  sendMagicLinkFn: ReturnType<typeof useSupabaseSession>["sendMagicLink"];
  error: string | null;
  setError: (err: string | null) => void;
}

type LoginMode = "password" | "magic";

export function AdminLogin({
  loginFn,
  sendMagicLinkFn,
  error,
  setError,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<LoginMode>("password");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);

    if (mode === "password") {
      const err = await loginFn(email, password);
      if (err) setError(err.message);
    } else {
      const err = await sendMagicLinkFn(email);
      if (err) {
        setError(err.message);
      } else {
        setSent(true);
      }
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-soft p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-warm-accent text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text-primary font-heading">Revisa tu correo</h2>
          <p className="mt-2 text-sm text-text-muted font-body">
            Te enviamos un link mágico a <strong>{email}</strong>. Si no lo ves, revisa tu bandeja de spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="bg-card-bg rounded-2xl shadow-sm border border-border-soft p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-text-primary font-heading">Admin Libia</h1>
          <p className="mt-1 text-sm text-text-muted font-body">Inicia sesión para administrar el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5 font-body">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary placeholder-text-muted/60 font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
              placeholder="ejemplo@correo.com"
            />
          </div>

          {mode === "password" && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5 font-body">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-card-bg border border-border-soft rounded-xl text-sm text-text-primary placeholder-text-muted/60 font-body focus:outline-none focus:ring-2 focus:ring-warm-accent/30 focus:border-warm-accent"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2 font-body">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-warm-accent hover:bg-warm-accent-hover text-white font-semibold text-sm py-3 px-4 rounded-full shadow-sm hover:shadow-md transition-all duration-200 font-body"
          >
            {mode === "password" ? "Iniciar sesión" : "Enviar link mágico"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "password" ? "magic" : "password");
              setError(null);
            }}
            className="text-sm text-text-muted hover:text-warm-accent underline underline-offset-2 font-body transition-colors"
          >
            {mode === "password"
              ? "Prefiero usar un link mágico"
              : "Prefiero usar contraseña"}
          </button>
        </div>
      </div>
    </div>
  );
}
