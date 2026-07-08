"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, FolderTree, ImagePlus } from "lucide-react";
import { PageHeader, Button, SectionCard, Card } from "@/components/ui/primitives";
import { Field, Textarea, Select, Toggle } from "@/components/ui/Field";
import { categories } from "@/lib/data";

export default function NouvelleCategoriePage() {
  const router = useRouter();
  const [enregistre, setEnregistre] = useState(false);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [parent, setParent] = useState("");
  const [ordre, setOrdre] = useState("");
  const [actif, setActif] = useState(true);

  const racines = categories.filter((c) => c.parent === null);
  const enfants = parent ? categories.filter((c) => c.parent === parent) : [];

  const slug = nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => router.push("/products/categories"), 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/products/categories" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader titre="Nouvelle catégorie" sousTitre="Créer une catégorie racine ou une sous-catégorie" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Informations">
            <div className="space-y-4">
              <Field label="Nom de la catégorie" value={nom} onChange={setNom} placeholder="Sacs à main" />
              {slug && <p className="text-xs text-slate-400">Slug : /{slug}</p>}
              <Textarea label="Description" value={description} onChange={setDescription} rows={3} placeholder="Description de la catégorie" />
              <Field label="Ordre d'affichage" value={ordre} onChange={setOrdre} placeholder="1" type="number" />
            </div>
          </SectionCard>

          <SectionCard title="Hiérarchie">
            <Select
              label="Catégorie parente"
              value={parent}
              onChange={setParent}
              options={[
                { valeur: "", libelle: "Racine (aucun parent)" },
                ...racines.map((c) => ({ valeur: c.nom, libelle: c.nom })),
              ]}
            />
            <Card className="mt-4 bg-slate-50 p-4">
              {parent ? (
                <div className="text-sm">
                  <p className="flex items-center gap-2 font-semibold text-secondary">
                    <FolderTree className="h-4 w-4 text-primary" /> {parent}
                  </p>
                  <p className="mt-1 pl-6 text-slate-500">
                    └─ {nom || "Nouvelle sous-catégorie"}
                  </p>
                  {enfants.length > 0 && (
                    <p className="mt-2 pl-6 text-xs text-slate-400">
                      {enfants.length} sous-catégorie(s) déjà dans « {parent} »
                    </p>
                  )}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <FolderTree className="h-4 w-4 text-slate-400" />
                  Catégorie racine (niveau supérieur)
                </p>
              )}
            </Card>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Visibilité">
            <Toggle label="Catégorie active" description="Visible sur la boutique" actif={actif} onChange={setActif} />
          </SectionCard>

          <SectionCard title="Image">
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400 transition hover:border-primary/50 hover:text-primary-dark"
            >
              <ImagePlus className="h-7 w-7" />
              <span className="text-sm font-semibold">Ajouter une image</span>
            </button>
          </SectionCard>

          <Button type="submit" className="w-full">
            {enregistre ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : (
              "Créer la catégorie"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
