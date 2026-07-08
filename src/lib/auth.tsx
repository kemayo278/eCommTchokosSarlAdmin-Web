"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Admin {
  id: string;
  nom: string;
  email: string;
  poste: string;
  initiales: string;
}

const adminDemo: Admin = {
  id: "adm_001",
  nom: "Admin Dens",
  email: "admin@tchokos.cm",
  poste: "Administrateur",
  initiales: "AD",
};

const identifiants = { email: "admin@tchokos.cm", motDePasse: "tchokos" };

const STORAGE_KEY = "tchokos.admin.session";

interface AuthState {
  admin: Admin | null;
  chargement: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(STORAGE_KEY);
      if (brut) setAdmin(JSON.parse(brut));
    } catch {
      setAdmin(null);
    } finally {
      setChargement(false);
    }
  }, []);

  const connexion = useCallback(async (email: string, motDePasse: string) => {
    await new Promise((r) => setTimeout(r, 650));
    const ok =
      email.trim().toLowerCase() === identifiants.email &&
      motDePasse === identifiants.motDePasse;
    if (!ok) throw new Error("E-mail ou mot de passe incorrect.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminDemo));
    setAdmin(adminDemo);
  }, []);

  const deconnexion = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, chargement, connexion, deconnexion }),
    [admin, chargement, connexion, deconnexion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}

export const identifiantsDemo = identifiants;
