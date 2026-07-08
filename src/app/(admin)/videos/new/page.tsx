"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, UploadCloud } from "lucide-react";
import { PageHeader, Button, SectionCard } from "@/components/ui/primitives";
import { Field, Textarea, Select, Toggle } from "@/components/ui/Field";
import { produits } from "@/lib/data";

export default function NouvelleVideoPage() {
  const router = useRouter();
  const [enregistre, setEnregistre] = useState(false);

  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("Mode");
  const [produit, setProduit] = useState("");
  const [description, setDescription] = useState("");
  const [publier, setPublier] = useState(true);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => router.push("/videos"), 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/videos" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader titre="Ajouter une vidéo" sousTitre="Publiez une vidéo produit sur le site" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Fichier vidéo">
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-slate-400 transition hover:border-primary/50 hover:text-primary-dark"
            >
              <UploadCloud className="h-8 w-8" />
              <span className="text-sm font-semibold">Déposer une vidéo</span>
              <span className="text-xs">MP4, MOV jusqu&apos;à 100 Mo</span>
            </button>
          </SectionCard>

          <SectionCard title="Détails">
            <div className="space-y-4">
              <Field label="Titre de la vidéo" value={titre} onChange={setTitre} placeholder="Nouvelle collection wax été" />
              <Textarea label="Description" value={description} onChange={setDescription} placeholder="Texte affiché sous la vidéo" />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Organisation">
            <div className="space-y-4">
              <Select
                label="Catégorie"
                value={categorie}
                onChange={setCategorie}
                options={["Sacs", "Sacs à main", "Sacs à dos", "Draps", "Parures de lit", "Couvertures"].map((c) => ({ valeur: c, libelle: c }))}
              />
              <Select
                label="Produit lié (optionnel)"
                value={produit}
                onChange={setProduit}
                options={[{ valeur: "", libelle: "Aucun" }, ...produits.map((p) => ({ valeur: p.nom, libelle: p.nom }))]}
              />
              <div className="border-t border-slate-100 pt-4">
                <Toggle label="Publier immédiatement" description="Sinon enregistrée en brouillon" actif={publier} onChange={setPublier} />
              </div>
            </div>
          </SectionCard>

          <Button type="submit" className="w-full">
            {enregistre ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : (
              "Enregistrer la vidéo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
