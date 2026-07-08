"use client";

import { QrCode } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { BadgeLivraison } from "@/components/ui/statuts";
import { livraisonsAdmin } from "@/lib/data";
import type { LivraisonAdmin } from "@/lib/types";
import { Truck } from "lucide-react";

const colonnes: Column<LivraisonAdmin>[] = [
  { cle: "code", entete: "Code", rendu: (l) => <span className="font-mono font-semibold text-secondary">{l.code}</span> },
  { cle: "commande", entete: "Commande", rendu: (l) => l.commande },
  {
    cle: "livreur",
    entete: "Livreur",
    masquerMobile: true,
    rendu: (l) => (l.livreur ? l.livreur : <span className="text-warn">Non assigné</span>),
  },
  { cle: "quartier", entete: "Quartier", masquerMobile: true, rendu: (l) => l.quartier },
  { cle: "date", entete: "Planifiée", masquerMobile: true, rendu: (l) => l.planifieeLe },
  { cle: "statut", entete: "Statut", aligne: "right", rendu: (l) => <BadgeLivraison statut={l.statut} /> },
];

export default function LivraisonsAdminPage() {
  const enTransit = livraisonsAdmin.filter((l) => l.statut === "en_transit").length;
  const nonAssignees = livraisonsAdmin.filter((l) => !l.livreur).length;

  return (
    <div className="space-y-6">
      <PageHeader titre="Livraisons" sousTitre="Suivi et affectation des livraisons" />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="En transit" valeur={String(enTransit)} icon={<Truck className="h-5 w-5" />} tone="primary" />
        <StatCard label="Non assignées" valeur={String(nonAssignees)} icon={<Truck className="h-5 w-5" />} tone="warn" />
        <StatCard label="Validation QR" valeur="Active" icon={<QrCode className="h-5 w-5" />} tone="info" />
      </div>

      <DataTable colonnes={colonnes} lignes={livraisonsAdmin} />
    </div>
  );
}