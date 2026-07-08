"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ReactSelect, { components, type OptionProps } from "react-select";
import { ArrowLeft, Check, ImagePlus, Package, X } from "lucide-react";
import { PageHeader, Button, SectionCard } from "@/components/ui/primitives";
import { Field, Textarea, Select, Toggle } from "@/components/ui/Field";
import { produits } from "@/lib/data";
import { fcfa } from "@/lib/format";

interface OptionProduit {
  value: string;
  label: string;
}

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

// Option personnalisée : image + nom + catégorie dans le menu déroulant.
function OptionAvecImage(props: OptionProps<OptionProduit, true>) {
  const produit = produits.find((p) => p.id === props.data.value);
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <VignetteProduit taille="h-8 w-8" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-secondary">
            {props.data.label}
          </p>
          {produit && (
            <p className="text-xs text-slate-400">{produit.categorie}</p>
          )}
        </div>
      </div>
    </components.Option>
  );
}

export default function NouveauPackPage() {
  const router = useRouter();
  const [enregistre, setEnregistre] = useState(false);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [position, setPosition] = useState("top");
  const [actif, setActif] = useState(true);
  const [produitsChoisis, setProduitsChoisis] = useState<string[]>([]);

  const options: OptionProduit[] = useMemo(
    () => produits.map((p) => ({ value: p.id, label: p.nom })),
    []
  );

  const valeurSelection = options.filter((o) =>
    produitsChoisis.includes(o.value)
  );

  const produitsSelectionnes = produits.filter((p) =>
    produitsChoisis.includes(p.id)
  );

  const valeurTotale = produitsSelectionnes.reduce((s, p) => s + p.prix, 0);

  function retirerProduit(id: string) {
    setProduitsChoisis((ids) => ids.filter((x) => x !== id));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => router.push("/products/packs"), 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/products/packs" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader titre="Nouveau pack" sousTitre="Regroupez plusieurs produits en une offre" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Informations">
            <div className="space-y-4">
              <Field label="Nom du pack" value={nom} onChange={setNom} placeholder="Pack Rentrée Mode" />
              <Textarea label="Description" value={description} onChange={setDescription} rows={3} placeholder="Décrivez ce que contient le pack" />
              <Field label="Prix du pack" value={prix} onChange={setPrix} placeholder="42000" suffix="FCFA" type="number" />
            </div>
          </SectionCard>

          <SectionCard title="Produits du pack">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-secondary">
                Ajouter des produits
              </span>
              <ReactSelect<OptionProduit, true>
                isMulti
                options={options}
                value={valeurSelection}
                onChange={(vals) =>
                  setProduitsChoisis(vals.map((v) => v.value))
                }
                components={{ Option: OptionAvecImage }}
                controlShouldRenderValue={false}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                placeholder="Choisir un produit…"
                noOptionsMessage={() => "Aucun produit"}
                classNamePrefix="rs"
                unstyled
                classNames={{
                  control: ({ isFocused }) =>
                    `rounded-xl border bg-white px-3 py-1 text-sm transition ${
                      isFocused
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-slate-200"
                    }`,
                  placeholder: () => "text-slate-400",
                  input: () => "text-sm",
                  menu: () =>
                    "mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",
                  menuList: () => "max-h-64 scroll-slim",
                  option: ({ isFocused, isSelected }) =>
                    `cursor-pointer px-3 py-2 ${
                      isSelected
                        ? "bg-primary-soft"
                        : isFocused
                        ? "bg-slate-50"
                        : ""
                    }`,
                  dropdownIndicator: () => "text-slate-400 px-1",
                  clearIndicator: () => "text-slate-400 px-1",
                  indicatorSeparator: () => "bg-slate-200",
                }}
              />
            </label>

            {produitsSelectionnes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {produitsSelectionnes.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <VignetteProduit />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-secondary">
                        {p.nom}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.categorie} · {fcfa(p.prix)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => retirerProduit(p.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-danger-soft hover:text-danger"
                      aria-label={`Retirer ${p.nom}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {produitsChoisis.length > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-500">
                  Valeur cumulée ({produitsChoisis.length} produit(s))
                </span>
                <span className="font-semibold text-secondary">{fcfa(valeurTotale)}</span>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Affichage">
            <div className="space-y-4">
              <Select
                label="Position sur le site"
                value={position}
                onChange={setPosition}
                options={[
                  { valeur: "top", libelle: "Haut de page (top)" },
                  { valeur: "bottom", libelle: "Bas de page (bottom)" },
                ]}
              />
              <div className="border-t border-slate-100 pt-4">
                <Toggle label="Pack actif" description="Visible sur la boutique" actif={actif} onChange={setActif} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Visuel">
            <button
              type="button"
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400 transition hover:border-primary/50 hover:text-primary-dark"
            >
              <ImagePlus className="h-7 w-7" />
              <span className="text-sm font-semibold">Image du pack</span>
            </button>
          </SectionCard>

          <Button type="submit" className="w-full">
            {enregistre ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : (
              "Créer le pack"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
