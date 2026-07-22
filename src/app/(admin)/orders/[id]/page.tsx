"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  User as UserIcon,
  X,
} from "lucide-react";
import { PageHeader, SectionCard, Button } from "@/components/ui/primitives";
import {
  BadgeOrderStatus,
  BadgePaymentStatus,
  BadgePaymentMethod,
} from "@/components/ui/statuts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorAlert from "@/components/ui/ErrorAlert";
import axiosClient from "@/lib/api/axiosClient";
import { handleApiError } from "@/lib/api/handleApiError";
import { useToast } from "@/hooks/use-toast";
import { fcfa } from "@/lib/format";
import type { OrderDetail } from "@/types/order";
import type { User } from "@/types/user";

const AVATAR_COLORS = [
  "bg-primary text-white", "bg-info-soft text-info", "bg-warn-soft text-warn",
  "bg-danger-soft text-danger", "bg-primary-soft text-primary-dark",
];
function avatarColor(id: number) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Row({
  label,
  valeur,
  accent,
}: {
  label: string;
  valeur: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={
          accent
            ? "font-semibold text-primary-dark"
            : "font-medium text-secondary"
        }
      >
        {valeur}
      </dd>
    </div>
  );
}

function initiales(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DetailCommandePage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [creatingDelivery, setCreatingDelivery] = useState(false);

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driverSearch, setDriverSearch] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  const loadDrivers = useCallback(() => {
    setSelectedDriverId(null);
    setDriverSearch("");
    setLoadingDrivers(true);
    axiosClient
      .get<{ data: User[] } | User[]>("/v1/admin/users", {
        params: { per_page: 100, role: "livreur" },
      })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.data;
        setDrivers(list.filter((u) => u.roles.includes("livreur") && u.isActive));
      })
      .catch(() => setDrivers([]))
      .finally(() => setLoadingDrivers(false));
  }, []);

  const openDeliveryDialog = useCallback(() => {
    setShowDeliveryDialog(true);
    loadDrivers();
  }, [loadDrivers]);

  const openAssignDialog = useCallback(() => {
    setShowAssignDialog(true);
    loadDrivers();
  }, [loadDrivers]);

  const handleAssignDriver = async () => {
    if (!order || selectedDriverId === null) return;
    const delivery = (order.deliveries ?? []).find((d) => d.status !== "failed");
    if (!delivery) return;
    setAssigning(true);
    try {
      const endpoint =
        delivery.livreurId === null
          ? `/v1/admin/deliveries/${delivery.id}/force-assign`
          : `/v1/deliveries/${delivery.id}/assign`;
      await axiosClient.post(endpoint, { livreur_id: selectedDriverId });
      const driver = drivers.find((d) => d.id === selectedDriverId);
      toast({
        title: "Livreur assigné",
        description: `${driver?.name ?? "Le livreur"} a été affecté à la commande ${order.orderNumber}.`,
      });
      setShowAssignDialog(false);
      fetchOrder();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Impossible d'assigner le livreur.";
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setAssigning(false);
    }
  };

  const fetchOrder = useCallback(() => {
    setLoading(true);
    axiosClient
      .get<OrderDetail>(`/v1/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) =>
        setError(handleApiError(err, "Impossible de charger la commande"))
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleCreateDelivery = async () => {
    if (!order) return;
    setCreatingDelivery(true);
    const driver = drivers.find((d) => d.id === selectedDriverId);
    try {
      await axiosClient.post("/v1/deliveries", {
        order_id: order.id,
        ...(selectedDriverId !== null && { livreur_id: selectedDriverId }),
      });
      toast({
        title: "Livraison créée",
        description: driver
          ? `Livraison créée et assignée à ${driver.name}.`
          : `Le processus de livraison pour ${order.orderNumber} a démarré.`,
      });
      setShowDeliveryDialog(false);
      fetchOrder();
    } catch (err: any) {
      const status: number = err?.response?.status;
      const msg: string = err?.response?.data?.message ?? "";
      const alreadyExists =
        status === 422 && msg.toLowerCase().includes("déjà en cours");

      // Livraison existante + livreur sélectionné → refetch puis force-assign
      if (alreadyExists && selectedDriverId !== null) {
        try {
          const { data: fresh } = await axiosClient.get<OrderDetail>(`/v1/orders/${order.id}`);
          const existing = (fresh.deliveries ?? []).find((d) => d.status !== "failed");
          if (existing) {
            await axiosClient.post(
              `/v1/admin/deliveries/${existing.id}/force-assign`,
              { livreur_id: selectedDriverId }
            );
            toast({
              title: "Livreur assigné",
              description: `${driver?.name ?? "Le livreur"} a été affecté à la livraison existante.`,
            });
            setShowDeliveryDialog(false);
            fetchOrder();
            return;
          }
        } catch (assignErr: any) {
          const assignMsg =
            assignErr?.response?.data?.message ?? "Impossible d'assigner le livreur.";
          toast({ title: "Erreur", description: assignMsg, variant: "destructive" });
          return;
        }
      }

      toast({
        title: "Erreur",
        description: msg || "Impossible de créer la livraison.",
        variant: "destructive",
      });
    } finally {
      setCreatingDelivery(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorAlert message={error} />;
  if (!order)  return null;

  const addr = order.shippingAddress;

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" href="/orders" className="!px-2.5">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          titre={`Commande ${order.orderNumber}`}
          sousTitre={`Passée le ${formatDate(order.createdAt)}`}
          action={<BadgeOrderStatus statut={order.status} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="space-y-4 lg:col-span-2">

          {/* Articles */}
          <SectionCard title="Articles">
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                      {item.quantity}×
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-secondary">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-400">{item.productSku}</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-secondary">
                    {fcfa(item.subtotal)}
                  </p>
                </div>
              ))}

              {order.items.length === 0 && (
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <Package className="h-4 w-4" /> Aucun article
                </p>
              )}
            </div>

            {/* Totaux */}
            <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <Row label="Sous-total"  valeur={fcfa(order.subtotal)}    />
              <Row label="Livraison"   valeur={fcfa(order.shippingCost)} />
              {order.taxAmount > 0 && (
                <Row label="Taxes" valeur={fcfa(order.taxAmount)} />
              )}
              {order.discount > 0 && (
                <Row label="Remise" valeur={`- ${fcfa(order.discount)}`} accent />
              )}
              <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                <dt className="font-bold text-secondary">Total</dt>
                <dd className="text-lg font-extrabold text-primary-dark">
                  {fcfa(order.total)}
                </dd>
              </div>
            </dl>
          </SectionCard>

          {/* Notes */}
          {order.notes && (
            <SectionCard title="Notes du client">
              <p className="text-sm text-slate-600">{order.notes}</p>
            </SectionCard>
          )}

          {/* Payments history */}
          {order.payments.length > 0 && (
            <SectionCard title="Historique des paiements">
              <div className="space-y-2">
                {order.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 text-slate-500">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      <BadgePaymentMethod method={p.method} />
                      {p.transactionId && (
                        <span className="text-xs text-slate-400">
                          #{p.transactionId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <BadgePaymentStatus statut={p.status} />
                      <span className="font-semibold text-secondary">
                        {fcfa(p.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {order.status === "pending" && (
              <Button onClick={openDeliveryDialog}>
                Marquer comme en traitement
              </Button>
            )}
            {order.status === "processing" && (
              <Button>Marquer comme expédiée</Button>
            )}
            {order.status === "shipped" && (
              <Button>Marquer comme livrée</Button>
            )}
            {(order.deliveries ?? []).some((d) => d.status !== "failed") && (
              <Button variant="secondary" onClick={openAssignDialog}>
                <Truck className="h-4 w-4" />
                Assigner un livreur
              </Button>
            )}
            {order.status !== "cancelled" && order.status !== "delivered" && (
              <Button variant="ghost" className="text-danger!">
                Annuler la commande
              </Button>
            )}
          </div>
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Client / Adresse */}
          <SectionCard title="Destinataire">
            {addr ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                    {initiales(addr.fullName)}
                  </span>
                  <div>
                    <p className="font-bold text-secondary">{addr.fullName}</p>
                    <p className="text-xs text-slate-400">Client #{order.userId}</p>
                  </div>
                </div>

                {addr.phone && (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    {addr.phone}
                  </p>
                )}

                <p className="flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                    <br />
                    {addr.city}
                    {addr.state && `, ${addr.state}`}
                    {addr.postalCode && ` ${addr.postalCode}`}
                    <br />
                    {addr.country}
                  </span>
                </p>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <UserIcon className="h-4 w-4" /> Adresse non renseignée
              </p>
            )}
          </SectionCard>

          {/* Paiement */}
          <SectionCard title="Paiement">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <CreditCard className="h-4 w-4 text-slate-400" /> Méthode
                </span>
                <BadgePaymentMethod method={order.paymentMethod} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Statut</span>
                <BadgePaymentStatus statut={order.paymentStatus} />
              </div>
            </div>
          </SectionCard>

          {/* Livraison */}
          <SectionCard title="Livraison">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Truck className="h-4 w-4 text-slate-400" /> Frais
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {fcfa(order.shippingCost)}
                </span>
              </div>
              {addr?.city && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-slate-400" /> Ville
                  </span>
                  <span className="text-sm font-semibold text-secondary">
                    {addr.city}
                  </span>
                </div>
              )}
              {(order.deliveries ?? []).length > 0 && (() => {
                const delivery = (order.deliveries ?? []).find((d) => d.status !== "failed");
                if (!delivery) return null;
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Code livraison</span>
                      <span className="font-mono text-xs font-semibold text-secondary">
                        {delivery.deliveryCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Livreur</span>
                      {delivery.livreur ? (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(delivery.livreur.id)}`}>
                            {initiales(delivery.livreur.name)}
                          </span>
                          {delivery.livreur.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={openAssignDialog}
                          className="text-sm font-semibold text-primary hover:underline"
                        >
                          Assigner →
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Dialog : assigner un livreur ─────────────────────────────────── */}
      <Dialog open={showAssignDialog} onOpenChange={(o) => { if (!o) setShowAssignDialog(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assigner un livreur</DialogTitle>
            <DialogDescription>
              Sélectionnez un livreur actif pour la commande{" "}
              <strong>{order.orderNumber}</strong>.
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={driverSearch}
              onChange={(e) => setDriverSearch(e.target.value)}
              placeholder="Rechercher par nom, téléphone…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-surface pl-9 pr-9 text-sm text-secondary placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {driverSearch && (
              <button
                type="button"
                onClick={() => setDriverSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Driver list */}
          <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-100">
            {loadingDrivers ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : (() => {
              const q = driverSearch.trim().toLowerCase();
              const filtered = drivers.filter(
                (d) =>
                  !q ||
                  d.name.toLowerCase().includes(q) ||
                  (d.phone ?? "").includes(q)
              );
              if (filtered.length === 0)
                return (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Aucun livreur disponible
                  </p>
                );
              return filtered.map((driver) => (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => setSelectedDriverId(driver.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    selectedDriverId === driver.id
                      ? "bg-primary-soft ring-1 ring-inset ring-primary/30"
                      : ""
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(driver.id)}`}
                  >
                    {initiales(driver.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-secondary">
                      {driver.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      {driver.phone && (
                        <><Phone className="h-3 w-3" />{driver.phone}</>
                      )}
                      {driver.zones.length > 0 && (
                        <span className="ml-1">
                          · {driver.zones.map((z) => z.name).join(", ")}
                        </span>
                      )}
                    </p>
                  </div>
                  {selectedDriverId === driver.id && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </button>
              ));
            })()}
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowAssignDialog(false)}
              disabled={assigning}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleAssignDriver}
              disabled={selectedDriverId === null || assigning}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {assigning && <Loader2 className="h-4 w-4 animate-spin" />}
              Assigner
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : créer une livraison ──────────────────────────────────── */}
      <Dialog open={showDeliveryDialog} onOpenChange={(o) => { if (!o) setShowDeliveryDialog(false); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Démarrer la livraison</DialogTitle>
            <DialogDescription>
              Assignez optionnellement un livreur maintenant pour la commande{" "}
              <strong>{order.orderNumber}</strong>. Le client sera notifié.
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={driverSearch}
              onChange={(e) => setDriverSearch(e.target.value)}
              placeholder="Rechercher un livreur…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-surface pl-9 pr-9 text-sm text-secondary placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {driverSearch && (
              <button type="button" onClick={() => setDriverSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Driver list */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100">
            {loadingDrivers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : (() => {
              const q = driverSearch.trim().toLowerCase();
              const filtered = drivers.filter(
                (d) => !q || d.name.toLowerCase().includes(q) || (d.phone ?? "").includes(q)
              );
              if (filtered.length === 0)
                return <p className="py-8 text-center text-sm text-slate-400">Aucun livreur disponible</p>;
              return [
                /* "Sans livreur" option */
                <button
                  key="none"
                  type="button"
                  onClick={() => setSelectedDriverId(null)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 border-b border-slate-50 ${selectedDriverId === null ? "bg-primary-soft ring-1 ring-inset ring-primary/30" : ""}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-slate-500">Sans livreur pour l'instant</p>
                  {selectedDriverId === null && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </button>,
                ...filtered.map((driver) => (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${selectedDriverId === driver.id ? "bg-primary-soft ring-1 ring-inset ring-primary/30" : ""}`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(driver.id)}`}>
                      {initiales(driver.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-secondary">{driver.name}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        {driver.phone && <><Phone className="h-3 w-3" />{driver.phone}</>}
                        {driver.zones.length > 0 && <span className="ml-1">· {driver.zones.map((z) => z.name).join(", ")}</span>}
                      </p>
                    </div>
                    {selectedDriverId === driver.id && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                )),
              ];
            })()}
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowDeliveryDialog(false)}
              disabled={creatingDelivery}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateDelivery}
              disabled={creatingDelivery}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {creatingDelivery && <Loader2 className="h-4 w-4 animate-spin" />}
              {selectedDriverId !== null ? "Créer et assigner" : "Créer sans livreur"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
