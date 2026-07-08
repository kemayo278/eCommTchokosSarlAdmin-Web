"use client";

import { useMemo, useState } from "react";
import { Package, Plus, Search, Star } from "lucide-react";
import { PageHeader, StatCard, Button, Badge } from "@/components/ui/primitives";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { BadgeActif } from "@/components/ui/statuts";
import { categories, produits } from "@/lib/data";
import { fcfa } from "@/lib/format";
import type { Produit } from "@/lib/types";

function stockBadge(stock: number) {
  if (stock === 0) return <Badge tone="danger">Rupture</Badge>;
  if (stock < 10) return <Badge tone="warn">{stock} en stock</Badge>;
  return <Badge tone="neutral">{stock} en stock</Badge>;
}

const colonnes: Column<Produit>[] = [
  {
    cle: "nom",
    entete: "Produit",
    rendu: (p) => (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
          <Package className="h-4 w-4" />
        </span>
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-secondary">
            {p.nom}
            {p.enVedette && <Star className="h-3.5 w-3.5 fill-warn text-warn" />}
          </p>
          <p className="text-xs text-slate-400">{p.sku}</p>
        </div>
      </div>
    ),
  },
  { cle: "cat", entete: "Catégorie", masquerMobile: true, rendu: (p) => p.categorie },
  {
    cle: "prix",
    entete: "Prix",
    aligne: "right",
    rendu: (p) => (
      <div className="text-right">
        <p className="font-semibold text-secondary">{fcfa(p.prix)}</p>
        {p.prixCompare && (
          <p className="text-xs text-slate-400 line-through">{fcfa(p.prixCompare)}</p>
        )}
      </div>
    ),
  },
  { cle: "stock", entete: "Stock", aligne: "center", masquerMobile: true, rendu: (p) => stockBadge(p.stock) },
  { cle: "statut", entete: "Statut", aligne: "right", rendu: (p) => <BadgeActif actif={p.actif} /> },
];

export default function ProduitsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("toutes");

  const liste = useMemo(() => {
    return produits.filter((p) => {
      const okQ =
        p.nom.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase());
      const okCat = cat === "toutes" || p.categorie === cat;
      return okQ && okCat;
    });
  }, [q, cat]);

  const actifs = produits.filter((p) => p.actif).length;
  const rupture = produits.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        titre="Produits"
        sousTitre={`${produits.length} produits au catalogue`}
        action={
          <Button href="/products/new">
            <Plus className="h-4 w-4" /> Ajouter un produit
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Produits actifs" valeur={String(actifs)} icon={<Package className="h-5 w-5" />} tone="primary" />
        <StatCard label="En rupture" valeur={String(rupture)} icon={<Package className="h-5 w-5" />} tone="danger" />
        <StatCard label="Catégories" valeur={String(categories.length)} icon={<Package className="h-5 w-5" />} tone="info" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par nom ou SKU…"
            className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="toutes">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.nom}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <DataTable colonnes={colonnes} lignes={liste} />
    </div>
  );
}
