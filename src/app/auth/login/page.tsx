"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth, identifiantsDemo } from "@/lib/auth";

export default function LoginPage() {
  const { admin, chargement, connexion } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!chargement && admin) router.replace("/dashboard");
  }, [chargement, admin, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await connexion(email, motDePasse);
      router.replace("/dashboard");
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setEnvoi(false);
    }
  }

  function remplirDemo() {
    setEmail(identifiantsDemo.email);
    setMotDePasse(identifiantsDemo.motDePasse);
  }

  useEffect(() => {
    setEmail(identifiantsDemo.email);
    setMotDePasse(identifiantsDemo.motDePasse);
  }, []);

  return (
    <div className="grid min-h-screen bg-aurora lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-secondary p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-1 h-9 bg-primary rounded-full" />
          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-black text-[22px] tracking-tight text-white leading-none">
              TCHOKOS<span className="text-primary">.</span>
            </span>
            <span className="text-[9px] font-semibold tracking-[0.4em] text-slate-400 uppercase">
              SARL
            </span>
          </div>
        </Link>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Pilotez tout le site,
            <br />
            <span className="text-primary">depuis un seul endroit.</span>
          </h1>
          <p className="mt-4 text-slate-300">
            Produits, commandes, paiements MoMo/OM, vidéos et statistiques —
            l&apos;administration complète de votre boutique en ligne.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Espace réservé à l&apos;administration · Douala, Cameroun
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm animate-rise">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-1 h-9 bg-primary rounded-full" />
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-black text-[22px] tracking-tight text-gray-900 leading-none">
                  TCHOKOS<span className="text-primary">.</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.4em] text-gray-400 uppercase">
                  SARL
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              Espace d&apos;administration
            </p>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur">
            <h2 className="text-xl font-bold tracking-tight">Connexion admin</h2>
            <p className="mt-1 text-sm text-slate-500">
              Accédez au tableau de bord de gestion.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-secondary">
                  E-mail
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tchokos.cm"
                    className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-secondary">
                  Mot de passe
                </span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type={voir ? "text" : "password"}
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setVoir((v) => !v)}
                    className="text-slate-400 transition hover:text-secondary"
                    aria-label={voir ? "Masquer" : "Afficher"}
                  >
                    {voir ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-primary transition hover:text-primary-dark"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {erreur && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
                  {erreur}
                </p>
              )}

              <button
                type="submit"
                disabled={envoi}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
              >
                {envoi && <Loader2 className="h-4 w-4 animate-spin" />}
                {envoi ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Accès sécurisé · Tchokos Sarl
          </p>
        </div>
      </section>
    </div>
  );
}
