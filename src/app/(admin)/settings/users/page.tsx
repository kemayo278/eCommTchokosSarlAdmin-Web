"use client";

import { Plus, ShieldCheck } from "lucide-react";
import { PageHeader, Button, Badge, type Tone } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { BadgeActif } from "@/components/ui/statuts";

interface Utilisateur {
  nom: string;
  email: string;
  role: "Administrateur" | "Gestionnaire" | "Support" | "Livreur";
  actif: boolean;
}

const roleTone: Record<Utilisateur["role"], Tone> = {
  Administrateur: "primary",
  Gestionnaire: "info",
  Support: "warn",
  Livreur: "neutral",
};

const utilisateurs: Utilisateur[] = [
  { nom: "Awa Tchoumi", email: "admin@tchokos.cm", role: "Administrateur", actif: true },
  { nom: "Jean Ekwalla", email: "jean@tchokos.cm", role: "Gestionnaire", actif: true },
  { nom: "Sandra Mbarga", email: "sandra@tchokos.cm", role: "Support", actif: true },
  { nom: "Junior Mbappé", email: "junior@tchokos.cm", role: "Livreur", actif: true },
  { nom: "Franck Talla", email: "franck@tchokos.cm", role: "Livreur", actif: false },
];

const colonnes: Column<Utilisateur>[] = [
  {
    cle: "nom",
    entete: "Utilisateur",
    rendu: (u) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
          {u.nom.split(" ").map((m) => m[0]).join("").slice(0, 2)}
        </span>
        <div>
          <p className="font-semibold text-secondary">{u.nom}</p>
          <p className="text-xs text-slate-400">{u.email}</p>
        </div>
      </div>
    ),
  },
  { cle: "role", entete: "Rôle", rendu: (u) => <Badge tone={roleTone[u.role]}>{u.role}</Badge> },
  { cle: "actif", entete: "Statut", aligne: "right", rendu: (u) => <BadgeActif actif={u.actif} /> },
];

export default function UtilisateursPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titre="Utilisateurs & rôles"
        sousTitre="Gérez les accès à l'administration"
        action={
          <Button>
            <Plus className="h-4 w-4" /> Inviter un utilisateur
          </Button>
        }
      />

      <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-surface p-4 text-sm text-slate-500">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Les permissions dépendent du rôle attribué à chaque utilisateur.
      </div>

      <DataTable colonnes={colonnes} lignes={utilisateurs} />
    </div>
  );
}