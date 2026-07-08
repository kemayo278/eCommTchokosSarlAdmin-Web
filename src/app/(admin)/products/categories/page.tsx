import { CornerDownRight, FolderTree, Plus } from "lucide-react";
import { PageHeader, Button, Card, Badge } from "@/components/ui/primitives";
import { BadgeActif } from "@/components/ui/statuts";
import { categories } from "@/lib/data";

export default function CategoriesProduitsPage() {
  const racines = categories.filter((c) => c.parent === null);

  return (
    <div className="space-y-6">
      <PageHeader
        titre="Catégories"
        sousTitre={`${categories.length} catégories`}
        action={
          <Button href="/products/categories/new">
            <Plus className="h-4 w-4" /> Nouvelle catégorie
          </Button>
        }
      />

      <div className="space-y-3">
        {racines.map((cat) => {
          const enfants = categories.filter((c) => c.parent === cat.nom);
          return (
            <Card key={cat.id} className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-dark">
                    <FolderTree className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-secondary">{cat.nom}</p>
                    <p className="text-xs text-slate-400">
                      /{cat.slug} · {cat.nbProduits} produits
                    </p>
                  </div>
                </div>
                <BadgeActif actif={cat.actif} />
              </div>

              {enfants.length > 0 && (
                <div className="divide-y divide-slate-50 border-t border-slate-100 bg-slate-50/40">
                  {enfants.map((enf) => (
                    <div key={enf.id} className="flex items-center justify-between gap-3 px-5 py-3 pl-10">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="h-4 w-4 text-slate-300" />
                        <div>
                          <p className="text-sm font-semibold text-secondary">{enf.nom}</p>
                          <p className="text-xs text-slate-400">/{enf.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone="neutral">{enf.nbProduits}</Badge>
                        <BadgeActif actif={enf.actif} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
