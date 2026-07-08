import {
  Download,
  FileSpreadsheet,
  FileUp,
  Upload,
} from "lucide-react";
import { PageHeader, SectionCard, Button } from "@/components/ui/primitives";

export default function ImportExportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titre="Import / Export"
        sousTitre="Gérez votre catalogue en masse via des fichiers CSV ou Excel"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Importer des produits">
          <div className="space-y-4">
            <button className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-slate-400 transition hover:border-primary/50 hover:text-primary-dark">
              <FileUp className="h-8 w-8" />
              <span className="text-sm font-semibold">
                Déposer un fichier CSV ou Excel
              </span>
              <span className="text-xs">Colonnes : nom, sku, prix, stock, catégorie…</span>
            </button>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FileSpreadsheet className="h-4 w-4" /> Modèle d&apos;import
              </div>
              <Button variant="secondary" className="!py-2">
                <Download className="h-4 w-4" /> Télécharger
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Exporter des données">
          <div className="space-y-3">
            {[
              { titre: "Catalogue produits", desc: "Tous les produits et variantes" },
              { titre: "Commandes", desc: "Historique complet des commandes" },
              { titre: "Clients", desc: "Base de données clients" },
              { titre: "Transactions", desc: "Paiements MoMo / OM / carte" },
            ].map((e) => (
              <div
                key={e.titre}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-secondary">{e.titre}</p>
                  <p className="text-xs text-slate-400">{e.desc}</p>
                </div>
                <Button variant="secondary" className="!py-2">
                  <Upload className="h-4 w-4" /> Exporter
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
