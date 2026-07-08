"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { BadgeCommande, BadgePaiement } from "@/components/ui/statuts";
import { commandes } from "@/lib/data";
import { fcfa } from "@/lib/format";
import type { Commande, StatutCommande } from "@/lib/types";

type Filtre = "toutes" | StatutCommande;
const filtres: { cle: Filtre; label: string }[] = [
  { cle: "toutes", label: "Toutes" },
  { cle: "en_attente", label: "En attente" },
  { cle: "en_traitement", label: "En traitement" },
  { cle: "expediee", label: "Expédiées" },
  { cle: "livree", label: "Livrées" },
  { cle: "annulee", label: "Annulées" },
];

const colonnes: Column<Commande>[] = [
  { cle: "numero", entete: "Commande", rendu: (c) => <span className="font-semibold text-secondary">{c.numero}</span> },
  {
    cle: "client",
    entete: "Client",
    rendu: (c) => (
      <div>
        <p className="font-medium text-secondary">{c.client}</p>
        <p className="text-xs text-slate-400">{c.quartier}</p>
      </div>
    ),
  },
  { cle: "date", entete: "Date", masquerMobile: true, rendu: (c) => c.creeLe },
  { cle: "paiement", entete: "Paiement", aligne: "center", masquerMobile: true, rendu: (c) => <BadgePaiement statut={c.statutPaiement} /> },
  { cle: "total", entete: "Total", aligne: "right", rendu: (c) => <span className="font-semibold">{fcfa(c.total)}</span> },
  { cle: "statut", entete: "Statut", aligne: "right", rendu: (c) => <BadgeCommande statut={c.statut} /> },
];

export default function CommandesPage() {
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  const liste = useMemo(
    () => (filtre === "toutes" ? commandes : commandes.filter((c) => c.statut === filtre)),
    [filtre]
  );

  return (
    <div className="space-y-6">
      <PageHeader titre="Commandes" sousTitre={`${commandes.length} commandes au total`} />

      <div className="scroll-slim -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
        {filtres.map((f) => (
          <button
            key={f.cle}
            onClick={() => setFiltre(f.cle)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              filtre === f.cle
                ? "bg-secondary text-white"
                : "border border-slate-200 bg-surface text-slate-500 hover:text-secondary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable colonnes={colonnes} lignes={liste} lien={(c) => `/orders/${c.id}`} />
    </div>
  );
}
