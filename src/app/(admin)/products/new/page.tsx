"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, ImagePlus } from "lucide-react";
import { PageHeader, Button, SectionCard } from "@/components/ui/primitives";
import { Field, Textarea, Select, Toggle, FormRow } from "@/components/ui/Field";
import { categories } from "@/lib/data";

export default function NouveauProduitPage() {
  const router = useRouter();
  const [enregistre, setEnregistre] = useState(false);

  const [nom, setNom] = useState("");
  const [sku, setSku] = useState("");
  const [codeBarres, setCodeBarres] = useState("");
  const [categorie, setCategorie] = useState(categories[0].nom);
  const [prix, setPrix] = useState("");
  const [prixCompare, setPrixCompare] = useState("");
  const [stock, setStock] = useState("");
  const [poids, setPoids] = useState("");
  const [descCourte, setDescCourte] = useState("");
  const [description, setDescription] = useState("");
  const [metaTitre, setMetaTitre] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [actif, setActif] = useState(true);
  const [vedette, setVedette] = useState(false);

  const slug = nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => router.push("/products"), 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/products" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader titre="Ajouter un produit" sousTitre="Renseignez les informations du produit" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Informations générales">
            <div className="space-y-4">
              <Field label="Nom du produit" value={nom} onChange={setNom} placeholder="Sac à main cuir premium" />
              {slug && <p className="text-xs text-slate-400">Slug : /products/{slug}</p>}
              <Textarea label="Description courte" value={descCourte} onChange={setDescCourte} rows={2} placeholder="Résumé affiché sur la fiche produit" />
              <Textarea label="Description complète" value={description} onChange={setDescription} placeholder="Détails, matières, entretien…" />
            </div>
          </SectionCard>

          <SectionCard title="Prix & stock">
            <div className="space-y-4">
              <FormRow>
                <Field label="Prix" value={prix} onChange={setPrix} placeholder="18900" suffix="FCFA" type="number" />
                <Field label="Prix barré (optionnel)" value={prixCompare} onChange={setPrixCompare} placeholder="24000" suffix="FCFA" type="number" />
              </FormRow>
              <FormRow>
                <Field label="Quantité en stock" value={stock} onChange={setStock} placeholder="34" type="number" />
                <Field label="Poids" value={poids} onChange={setPoids} placeholder="0.5" suffix="kg" type="number" />
              </FormRow>
              <FormRow>
                <Field label="SKU" value={sku} onChange={setSku} placeholder="SAC-001" />
                <Field label="Code-barres" value={codeBarres} onChange={setCodeBarres} placeholder="6001234567890" />
              </FormRow>
            </div>
          </SectionCard>

          <SectionCard title="Référencement (SEO)">
            <div className="space-y-4">
              <Field label="Meta titre" value={metaTitre} onChange={setMetaTitre} placeholder="Sac à main cuir premium — Tchokos" />
              <Textarea label="Meta description" value={metaDesc} onChange={setMetaDesc} rows={2} placeholder="Description pour les moteurs de recherche" />
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
                options={categories.map((c) => ({ valeur: c.nom, libelle: c.nom }))}
              />
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <Toggle label="Produit actif" description="Visible sur la boutique" actif={actif} onChange={setActif} />
                <Toggle label="Mettre en vedette" description="Affiché en page d'accueil" actif={vedette} onChange={setVedette} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Images">
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400 transition hover:border-primary/50 hover:text-primary-dark"
            >
              <ImagePlus className="h-7 w-7" />
              <span className="text-sm font-semibold">Ajouter des images</span>
              <span className="text-xs">PNG, JPG jusqu'à 5 Mo</span>
            </button>
          </SectionCard>

          <Button type="submit" className="w-full">
            {enregistre ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : (
              "Enregistrer le produit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
