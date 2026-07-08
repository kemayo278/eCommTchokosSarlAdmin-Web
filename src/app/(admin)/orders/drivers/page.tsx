import { Phone, Plus, Star } from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui/primitives";
import { BadgeActif } from "@/components/ui/statuts";
import { livreurs } from "@/lib/data";

export default function LivreursPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titre="Livreurs"
        sousTitre={`${livreurs.length} livreurs enregistrés`}
        action={
          <Button href="/orders/drivers/new">
            <Plus className="h-4 w-4" /> Ajouter un livreur
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        {livreurs.map((l) => (
          <Card key={l.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {l.nom.split(" ").map((m) => m[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="font-bold text-secondary">{l.nom}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="h-3.5 w-3.5 fill-warn text-warn" /> {l.note.toFixed(1)} ·{" "}
                    {l.livraisons} livraisons
                  </p>
                </div>
              </div>
              <BadgeActif actif={l.actif} />
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4 text-slate-400" /> {l.telephone}
            </p>

            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-400">Zones affectées</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {l.zones.map((z) => (
                  <span
                    key={z}
                    className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-dark"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
