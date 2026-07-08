import { Layers, Plus } from "lucide-react";
import { PageHeader, Card, Button, Badge } from "@/components/ui/primitives";
import { BadgeActif } from "@/components/ui/statuts";
import { packs } from "@/lib/data";
import { fcfa } from "@/lib/format";
import { PackProduits } from "./PackProduits";

export default function PacksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titre="Packs"
        sousTitre={`${packs.length} packs · regroupez plusieurs produits en une offre`}
        action={
          <Button href="/products/packs/new">
            <Plus className="h-4 w-4" /> Nouveau pack
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {packs.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                  <Layers className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-secondary">{p.nom}</p>
                  <p className="text-sm font-semibold text-primary-dark">{fcfa(p.prix)}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge tone={p.position === "top" ? "info" : "neutral"}>
                  {p.position === "top" ? "Haut de page" : "Bas de page"}
                </Badge>
                <BadgeActif actif={p.actif} />
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">{p.description}</p>

            <PackProduits nomPack={p.nom} produits={p.produits} />
          </Card>
        ))}
      </div>
    </div>
  );
}
