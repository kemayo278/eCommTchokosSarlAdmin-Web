import { Heart, Play, Plus, Eye } from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui/primitives";
import { BadgeVideo } from "@/components/ui/statuts";
import { videos } from "@/lib/data";
import { nombre } from "@/lib/format";

export default function VideosPage() {
  const publiees = videos.filter((v) => v.statut === "publiee").length;

  return (
    <div className="space-y-6">
      <PageHeader
        titre="Vidéos"
        sousTitre={`${publiees} publiée(s) · ${videos.length} au total`}
        action={
          <Button href="/videos/new">
            <Plus className="h-4 w-4" /> Ajouter une vidéo
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <Card key={v.id} className="overflow-hidden">
            <div className="relative flex h-40 items-center justify-center bg-secondary">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                <Play className="h-6 w-6" />
              </span>
              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-semibold text-white">
                {v.duree}
              </span>
              <span className="absolute left-2 top-2">
                <BadgeVideo statut={v.statut} />
              </span>
            </div>
            <div className="p-4">
              <p className="truncate font-bold text-secondary">{v.titre}</p>
              <p className="text-xs text-slate-400">
                {v.categorie}
                {v.produitLie ? ` · ${v.produitLie}` : ""}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {nombre(v.vues)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> {nombre(v.likes)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
