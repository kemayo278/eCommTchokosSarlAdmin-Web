"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { PageHeader, SectionCard, Button, Card } from "@/components/ui/primitives";
import { BadgeCommande, BadgePaiement } from "@/components/ui/statuts";
import { getCommande } from "@/lib/data";
import { fcfa } from "@/lib/format";
import type { MethodePaiement } from "@/lib/types";

const methodeLabel: Record<MethodePaiement, string> = {
  momo: "MTN Mobile Money",
  om: "Orange Money",
  carte: "Carte bancaire",
  especes: "Espèces",
};

export default function DetailCommandePage() {
  const { id } = useParams<{ id: string }>();
  const commande = getCommande(id);

  if (!commande) {
    return (
      <div className="py-20 text-center">
        <p className="font-semibold text-secondary">Commande introuvable</p>
        <Button variant="secondary" href="/orders" className="mt-3">
          Retour aux commandes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" href="/orders" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          titre={`Commande ${commande.numero}`}
          sousTitre={`Passée le ${commande.creeLe}`}
          action={<BadgeCommande statut={commande.statut} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Articles">
            <div className="space-y-3">
              {commande.articles.map((a, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                      {a.quantite}×
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-secondary">{a.nom}</p>
                      <p className="text-xs text-slate-400">{a.sku}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-secondary">
                    {fcfa(a.prixUnitaire * a.quantite)}
                  </p>
                </div>
              ))}
            </div>

            <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <Row label="Sous-total" valeur={fcfa(commande.sousTotal)} />
              <Row label="Livraison" valeur={fcfa(commande.livraison)} />
              {commande.remise > 0 && (
                <Row label="Remise" valeur={`- ${fcfa(commande.remise)}`} accent />
              )}
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <dt className="font-bold text-secondary">Total</dt>
                <dd className="text-lg font-extrabold text-primary-dark">
                  {fcfa(commande.total)}
                </dd>
              </div>
            </dl>
          </SectionCard>

          {commande.notes && (
            <SectionCard title="Notes du client">
              <p className="text-sm text-slate-600">{commande.notes}</p>
            </SectionCard>
          )}

          <div className="flex flex-wrap gap-2">
            <Button>Marquer comme expédiée</Button>
            <Button variant="secondary">Assigner un livreur</Button>
            <Button variant="ghost" className="!text-danger">Annuler la commande</Button>
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title="Client">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                  {commande.client.split(" ").map((m) => m[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="font-bold text-secondary">{commande.client}</p>
                  <p className="text-xs text-slate-400">Client</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4 text-slate-400" /> {commande.telephone}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-slate-400" /> {commande.quartier}, Douala
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Paiement">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <CreditCard className="h-4 w-4 text-slate-400" /> Méthode
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {methodeLabel[commande.methode]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Statut</span>
                <BadgePaiement statut={commande.statutPaiement} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Livraison">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Truck className="h-4 w-4 text-slate-400" /> Livreur
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {commande.livreur ?? "Non assigné"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <User className="h-4 w-4 text-slate-400" /> Quartier
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {commande.quartier}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function Row({ label, valeur, accent }: { label: string; valeur: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={accent ? "font-semibold text-primary-dark" : "font-medium text-secondary"}>
        {valeur}
      </dd>
    </div>
  );
}
