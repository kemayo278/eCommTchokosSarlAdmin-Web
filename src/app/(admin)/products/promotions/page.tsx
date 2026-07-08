"use client";

import { Plus, Ticket } from "lucide-react";
import { PageHeader, Button, Badge } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { BadgeActif } from "@/components/ui/statuts";
import { coupons } from "@/lib/data";
import { fcfa } from "@/lib/format";
import type { Coupon } from "@/lib/types";

const colonnes: Column<Coupon>[] = [
  {
    cle: "code",
    entete: "Code",
    rendu: (c) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warn-soft text-warn">
          <Ticket className="h-4 w-4" />
        </span>
        <span className="font-mono font-bold text-secondary">{c.code}</span>
      </div>
    ),
  },
  {
    cle: "valeur",
    entete: "Réduction",
    rendu: (c) => (c.type === "pourcentage" ? `${c.valeur} %` : fcfa(c.valeur)),
  },
  { cle: "min", entete: "Min. commande", masquerMobile: true, rendu: (c) => fcfa(c.minCommande) },
  {
    cle: "usage",
    entete: "Utilisations",
    aligne: "center",
    masquerMobile: true,
    rendu: (c) => (
      <Badge tone={c.utilisations >= c.maxUtilisations ? "danger" : "neutral"}>
        {c.utilisations}/{c.maxUtilisations}
      </Badge>
    ),
  },
  { cle: "expire", entete: "Expire le", masquerMobile: true, rendu: (c) => c.expireLe },
  { cle: "statut", entete: "Statut", aligne: "right", rendu: (c) => <BadgeActif actif={c.actif} /> },
];

export default function PromotionsPage() {
  const actifs = coupons.filter((c) => c.actif).length;
  return (
    <div className="space-y-6">
      <PageHeader
        titre="Promotions"
        sousTitre={`${actifs} coupon(s) actif(s) sur ${coupons.length}`}
        action={
          <Button href="/products/promotions/new">
            <Plus className="h-4 w-4" /> Nouvelle promotion
          </Button>
        }
      />
      <DataTable colonnes={colonnes} lignes={coupons} />
    </div>
  );
}