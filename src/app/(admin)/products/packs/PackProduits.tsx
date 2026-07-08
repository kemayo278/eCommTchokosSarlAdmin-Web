"use client";

import { useEffect, useState } from "react";
import { Package, X } from "lucide-react";
import { produits as tousLesProduits } from "@/lib/data";
import { fcfa } from "@/lib/format";

const MAX_VISIBLE = 3;

// Vignette produit (les produits n'ont pas d'image : placeholder cohérent avec la liste).
function VignetteProduit({ taille = "h-10 w-10" }: { taille?: string }) {
  return (
    <span
      className={`flex ${taille} shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400`}
    >
      <Package className="h-4 w-4" />
    </span>
  );
}

export function PackProduits({
  nomPack,
  produits,
}: {
  nomPack: string;
  produits: string[];
}) {
  const [ouvert, setOuvert] = useState(false);
  const surplus = produits.length - MAX_VISIBLE;
  const visibles = produits.slice(0, MAX_VISIBLE);

  // Fermer avec la touche Échap.
  useEffect(() => {
    if (!ouvert) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ouvert]);

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-slate-400">
        {produits.length} produit(s)
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {visibles.map((prod) => (
          <span
            key={prod}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {prod}
          </span>
        ))}
        {surplus > 0 && (
          <button
            type="button"
            onClick={() => setOuvert(true)}
            className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-dark transition hover:bg-primary/15"
          >
            +{surplus} · voir plus
          </button>
        )}
      </div>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Produits du pack ${nomPack}`}
        >
          <div
            className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
            onClick={() => setOuvert(false)}
          />
          <div className="animate-rise relative flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="font-bold text-secondary">{nomPack}</p>
                <p className="text-xs text-slate-400">
                  {produits.length} produit(s) dans ce pack
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOuvert(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="scroll-slim space-y-2 overflow-y-auto p-5">
              {produits.map((nom) => {
                const info = tousLesProduits.find((p) => p.nom === nom);
                return (
                  <li
                    key={nom}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <VignetteProduit />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-secondary">
                        {nom}
                      </p>
                      {info && (
                        <p className="text-xs text-slate-400">
                          {info.categorie} · {fcfa(info.prix)}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
