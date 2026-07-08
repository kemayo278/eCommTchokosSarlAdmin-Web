"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader, SectionCard, Button, Badge } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Field, Toggle } from "@/components/ui/Field";
import { fcfa } from "@/lib/format";

interface Zone {
  zone: string;
  delai: string;
  tarif: number;
  active: boolean;
}

const zones: Zone[] = [
  { zone: "Akwa · Bonanjo", delai: "Même jour", tarif: 1000, active: true },
  { zone: "Deido · Bali", delai: "24 h", tarif: 1500, active: true },
  { zone: "Makepe · Ndokotti", delai: "24 h", tarif: 1500, active: true },
  { zone: "Bonabéri", delai: "48 h", tarif: 2500, active: true },
  { zone: "Périphérie", delai: "48-72 h", tarif: 3500, active: false },
];

const colonnes: Column<Zone>[] = [
  { cle: "zone", entete: "Zone", rendu: (z) => <span className="font-semibold text-secondary">{z.zone}</span> },
  { cle: "delai", entete: "Délai", masquerMobile: true, rendu: (z) => z.delai },
  { cle: "tarif", entete: "Tarif", aligne: "right", rendu: (z) => <span className="font-semibold">{fcfa(z.tarif)}</span> },
  { cle: "active", entete: "Statut", aligne: "right", rendu: (z) => <Badge tone={z.active ? "primary" : "neutral"}>{z.active ? "Active" : "Inactive"}</Badge> },
];

export default function ParametresLivraisonPage() {
  const [gratuite, setGratuite] = useState(true);
  const [seuil, setSeuil] = useState("50000");

  return (
    <div className="space-y-6">
      <PageHeader
        titre="Paramètres de livraison"
        sousTitre="Zones desservies et tarifs"
        action={
          <Button>
            <Plus className="h-4 w-4" /> Ajouter une zone
          </Button>
        }
      />

      <SectionCard title="Livraison gratuite">
        <div className="space-y-4">
          <Toggle
            label="Activer la livraison gratuite"
            description="Au-delà d'un certain montant de commande"
            actif={gratuite}
            onChange={setGratuite}
          />
          {gratuite && (
            <div className="max-w-xs">
              <Field label="Seuil de commande" value={seuil} onChange={setSeuil} suffix="FCFA" type="number" />
            </div>
          )}
        </div>
      </SectionCard>

      <div>
        <h2 className="mb-3 font-bold tracking-tight text-secondary">Zones de livraison</h2>
        <DataTable colonnes={colonnes} lignes={zones} />
      </div>
    </div>
  );
}
