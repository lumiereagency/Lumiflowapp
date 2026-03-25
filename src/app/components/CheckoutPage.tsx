import { motion } from "motion/react";
import { useState } from "react";
import { CreditCard, Lock, Check, ArrowLeft, QrCode } from "lucide-react";

interface CheckoutPageProps {
  selectedPlan: string;
  onBack: () => void;
  onSuccess: () => void;
}

const planDetails: Record<string, { name: string; price: string; savings?: string }> = {
  starter: { name: "Starter", price: "R$ 49,00" },
  pro: { name: "Pro", price: "R$ 149,00", savings: "R$ 50 de economia anual" },
  enterprise: { name: "Enterprise", price: "R$ 399,00", savings: "R$ 150 de economia anual" },
};

export function CheckoutPage({ selectedPlan, onBack, onSuccess }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const plan = planDetails[selectedPlan] || planDetails.pro;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl bg-background rounded-3xl shadow-2xl my-8 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Form */}
          <div className="p-8 lg:p-12">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos planos
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Finalizar Assinatura</h2>
              <p className="text-muted-foreground">
                Complete os dados para ativar seu plano {plan.name}
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Método de Pagamento</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#7B61FF] bg-purple-50 dark:bg-purple-950/20"
                      : "border-border hover:border-[#7B61FF]/50"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Cartão</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "pix"
                      ? "border-[#7B61FF] bg-purple-50 dark:bg-purple-950/20"
                      : "border-border hover:border-[#7B61FF]/50"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">Pix</span>
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {paymentMethod === "card" ? (
                <>
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value.replace(/\s/g, "")))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                      required
                    />
                  </div>

                  {/* Card Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="João Silva"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                      required
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Validade</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 4) {
                            setExpiryDate(value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value);
                          }
                        }}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#7B61FF] transition-all"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Pix Payment */
                <div className="text-center py-8">
                  <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950/30 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-[#7B61FF]" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Escaneie o QR Code acima com seu app de banco
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-xs font-mono">
                      00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-1234567890ab5204000053039865802BR5925Lumiflow Tecnologia Ltda6009SAO PAULO62070503***6304ABCD
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirmar Pagamento
                  </>
                )}
              </motion.button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Pagamento Seguro</span>
                </div>
                <span>•</span>
                <span>SSL Criptografado</span>
                <span>•</span>
                <span>PCI Compliant</span>
              </div>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-8 lg:p-12 border-l border-border">
            <div className="sticky top-8">
              <h3 className="text-xl font-bold mb-6">Resumo do Pedido</h3>

              {/* Plan Details */}
              <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Plano {plan.name}</h4>
                    <p className="text-sm text-muted-foreground">Cobrança mensal</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{plan.price}</div>
                    <div className="text-xs text-muted-foreground">/mês</div>
                  </div>
                </div>

                {plan.savings && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {plan.savings}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{plan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto período teste</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">-{plan.price}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total hoje</span>
                  <span className="text-2xl font-bold">R$ 0,00</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Você será cobrado {plan.price} após os 15 dias de teste grátis
                </p>
              </div>

              {/* Features Included */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Incluído no plano:</h4>
                {[
                  "Mapas mentais ilimitados",
                  "Colaboração em tempo real",
                  "Exportar em múltiplos formatos",
                  "Suporte prioritário",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-[#7B61FF] flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Garantia de 30 dias - Cancele a qualquer momento
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}