"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ReactSelect, { components, type OptionProps } from "react-select";
import { ArrowLeft, Check, Package, X } from "lucide-react";
import { PageHeader, Button, SectionCard } from "@/components/ui/primitives";
import { Field, Select, Toggle, FormRow } from "@/components/ui/Field";
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

export default function NouvellePromotionPage() {
  const router = useRouter();
  const [enregistre, setEnregistre] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState("pourcentage");
  const [valeur, setValeur] = useState("");
  const [minCommande, setMinCommande] = useState("");
  const [maxUtil, setMaxUtil] = useState("");
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
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

  function retirerProduit(id: string) {
    setProduitsChoisis((ids) => ids.filter((x) => x !== id));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => router.push("/products/promotions"), 900);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/products/promotions" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader titre="Nouvelle promotion" sousTitre="Créez un coupon applicable à un ou plusieurs produits" />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Coupon">
            <div className="space-y-4">
              <FormRow>
                <Field label="Code du coupon" value={code} onChange={(v) => setCode(v.toUpperCase())} placeholder="RENTREE10" />
                <Select
                  label="Type de réduction"
                  value={type}
                  onChange={setType}
                  options={[
                    { valeur: "pourcentage", libelle: "Pourcentage (%)" },
                    { valeur: "fixe", libelle: "Montant fixe (FCFA)" },
                  ]}
                />
              </FormRow>
              <FormRow>
                <Field
                  label="Valeur"
                  value={valeur}
                  onChange={setValeur}
                  placeholder={type === "pourcentage" ? "10" : "1500"}
                  suffix={type === "pourcentage" ? "%" : "FCFA"}
                  type="number"
                />
                <Field label="Montant minimum de commande" value={minCommande} onChange={setMinCommande} placeholder="20000" suffix="FCFA" type="number" />
              </FormRow>
              <FormRow>
                <Field label="Nombre max d'utilisations" value={maxUtil} onChange={setMaxUtil} placeholder="500" type="number" />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Début" value={debut} onChange={setDebut} type="date" />
                  <Field label="Fin" value={fin} onChange={setFin} type="date" />
                </div>
              </FormRow>
            </div>
          </SectionCard>

          <SectionCard title="Produits concernés">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-secondary">
                Ajouter des produits à la promotion
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

            <p className="mt-3 text-xs text-slate-400">
              {produitsChoisis.length === 0
                ? "Aucun produit : la promotion s'appliquera à toute la boutique."
                : `${produitsChoisis.length} produit(s) sélectionné(s).`}
            </p>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Statut">
            <Toggle label="Promotion active" description="Utilisable dès maintenant" actif={actif} onChange={setActif} />
          </SectionCard>

          <Button type="submit" className="w-full">
            {enregistre ? (
              <>
                <Check className="h-4 w-4" /> Enregistré
              </>
            ) : (
              "Créer la promotion"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
