import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Star,
  Heart,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ArrowLeft,
  Tag,
  ChevronRight,
  Eye,
  CreditCard,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  Copy,
  Palette,
  Coffee,
  Shirt,
  BookOpen,
  PenTool,
  Monitor,
  Layers,
  BadgeCheck,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

/* ═══════════════════════ TYPES ═══════════════════════ */

interface LumiStoreProps {
  onNavigate: (section: string) => void;
}

type Category = "all" | "branded" | "office" | "creator" | "merch" | "accessories" | "productivity";

type StoreView = "catalog" | "product" | "cart" | "checkout" | "tracking";

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  rating: number;
  reviews: number;
  tags: string[];
  branded?: boolean;
  bestseller?: boolean;
  new?: boolean;
  colors?: string[];
  sizes?: string[];
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "confirmed" | "preparing" | "shipped" | "delivered";
  date: string;
  trackingCode?: string;
  paymentMethod: string;
}

/* ═══════════════════════ DATA ═══════════════════════ */

const products: Product[] = [
  {
    id: "1", name: "Caneca Lumiflow ∞", description: "Caneca de cerâmica premium com logo Lumiflow",
    longDescription: "Caneca de cerâmica de alta qualidade com acabamento fosco e logo Lumiflow gravado. Capacidade 350ml, ideal para seu café durante as sessões criativas. Microondas e lava-louças safe.",
    price: 69.90, image: "https://images.unsplash.com/photo-1770615674580-24736c2a593f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBicmFuZGVkJTIwY29mZmVlJTIwbXVnJTIwZGVza3xlbnwxfHx8fDE3NzMxMTQ4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "branded", rating: 4.9, reviews: 128, tags: ["Lumiflow", "Cerâmica"], branded: true, bestseller: true,
    colors: ["Preto", "Branco", "Roxo"], stock: 150,
  },
  {
    id: "2", name: "Camiseta Lumiflow Team", description: "Camiseta premium para equipes criativas",
    longDescription: "Camiseta de algodão orgânico com fit moderno e logo Lumiflow estampado. Perfeita para uniformes de equipe ou uso casual. Tecido macio e durável com acabamento premium.",
    price: 89.90, originalPrice: 119.90, image: "https://images.unsplash.com/photo-1722310752951-4d459d28c678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1vY2t1cCUyMG1pbmltYWx8ZW58MXx8fHwxNzczMTE0ODg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "merch", rating: 4.8, reviews: 95, tags: ["Vestuário", "Equipe"], branded: true, bestseller: true,
    colors: ["Branco", "Preto", "Cinza"], sizes: ["P", "M", "G", "GG"], stock: 200,
  },
  {
    id: "3", name: "Planner Criativo Lumiflow", description: "Caderno/agenda para planejamento de conteúdo",
    longDescription: "Planner de 200 páginas com layout exclusivo para planejamento de conteúdo social media. Inclui calendário editorial, brainstorm pages, grids de postagem e métricas de performance. Capa dura com acabamento soft-touch.",
    price: 79.90, image: "https://images.unsplash.com/photo-1609353898029-d5408b6a93ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMGpvdXJuYWwlMjBwbGFubmVyJTIwZGVza3xlbnwxfHx8fDE3NzMxMTQ4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "productivity", rating: 4.7, reviews: 210, tags: ["Planner", "Conteúdo"], branded: true, new: true, stock: 180,
  },
  {
    id: "4", name: "Kit Workspace Premium", description: "Conjunto completo para seu setup criativo",
    longDescription: "Kit premium com organizador de mesa, suporte para monitor, bandeja para cables e porta-canetas. Design minimalista em MDF com acabamento fosco. Eleve seu workspace para o próximo nível.",
    price: 249.90, originalPrice: 329.90, image: "https://images.unsplash.com/photo-1758640920659-0bb864175983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNrJTIwYWNjZXNzb3JpZXMlMjB3b3Jrc3BhY2UlMjBzZXR1cHxlbnwxfHx8fDE3NzMxMTQ4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "office", rating: 4.9, reviews: 67, tags: ["Setup", "Premium"], bestseller: true, stock: 45,
  },
  {
    id: "5", name: "Kit Canetas Creator", description: "Set de canetas e marcadores para brainstorm",
    longDescription: "Kit com 12 canetas fine-liner coloridas, 4 marcadores brush pen e 2 canetas gel pretas. Ideal para brainstorm sessions, mind mapping e anotações criativas. Estojo com logo Lumiflow.",
    price: 59.90, image: "https://images.unsplash.com/photo-1768729797971-472ce92e7a71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW4lMjBzdHlsdXMlMjBjcmVhdGl2ZSUyMHRvb2xzJTIwZGVza3xlbnwxfHx8fDE3NzMxMTQ4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "creator", rating: 4.6, reviews: 143, tags: ["Canetas", "Brainstorm"], branded: true, stock: 220,
  },
  {
    id: "6", name: "Garrafa Lumiflow 750ml", description: "Garrafa térmica com logo gravado a laser",
    longDescription: "Garrafa de aço inoxidável dupla parede com isolamento térmico. Mantém bebidas geladas por 24h e quentes por 12h. Logo Lumiflow gravado a laser. Tampa anti-vazamento.",
    price: 99.90, image: "https://images.unsplash.com/photo-1664714628878-9d2aa898b9e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMHN0YWlubGVzcyUyMHN0ZWVsJTIwbWluaW1hbHxlbnwxfHx8fDE3NzMxMTQ4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "branded", rating: 4.8, reviews: 89, tags: ["Hidratação", "Lumiflow"], branded: true, stock: 130,
    colors: ["Preto", "Branco", "Roxo"],
  },
  {
    id: "7", name: "Organizador de Mesa Multi", description: "Organizador modular para escritório criativo",
    longDescription: "Organizador de mesa em 3 módulos encaixáveis. Compartimentos para canetas, cartões, smartphone e acessórios. Material bamboo sustentável com detalhes em roxo Lumiflow.",
    price: 129.90, image: "https://images.unsplash.com/photo-1758876202124-cc941ebb8446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwb3JnYW5pemVyJTIwbW9kZXJuJTIwb2ZmaWNlfGVufDF8fHx8MTc3MzExNDg5MHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "office", rating: 4.5, reviews: 54, tags: ["Organização", "Desk"], new: true, stock: 75,
  },
  {
    id: "8", name: "Desk Mat Lumiflow XL", description: "Mouse pad estendido com design exclusivo",
    longDescription: "Desk mat de 90x40cm com superfície de microfibra premium e base anti-derrapante. Design exclusivo com padrão Lumiflow em tom roxo sutil. Bordas costuradas para durabilidade.",
    price: 149.90, image: "https://images.unsplash.com/photo-1604504219246-6a4b59012b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VzZXBhZCUyMGRlc2slMjBtYXQlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzczMTE0ODkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories", rating: 4.7, reviews: 176, tags: ["Desk", "Setup"], branded: true, bestseller: true, stock: 160,
  },
  {
    id: "9", name: "Tote Bag Creator", description: "Bolsa canvas para creators em movimento",
    longDescription: "Tote bag em canvas resistente com alças reforçadas e bolso interno para laptop até 14\". Estampa minimalista Lumiflow. Perfeita para levar seu setup para o café ou coworking.",
    price: 69.90, image: "https://images.unsplash.com/photo-1669975106195-df79bd67e483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwY2FudmFzJTIwbWluaW1hbCUyMGRlc2lnbnxlbnwxfHx8fDE3NzMxMTQ4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "merch", rating: 4.4, reviews: 62, tags: ["Bolsa", "Creator"], branded: true, stock: 90,
    colors: ["Natural", "Preto"],
  },
  {
    id: "10", name: "Pack Stickers Lumiflow", description: "Kit de adesivos para personalizar seu setup",
    longDescription: "Pack com 15 adesivos de vinil de alta qualidade com designs exclusivos Lumiflow. Resistentes à água. Perfeitos para laptop, garrafa, notebook e qualquer superfície.",
    price: 29.90, image: "https://images.unsplash.com/photo-1595770681185-15cadc0f42b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGlja2VyJTIwc2V0JTIwdmlueWwlMjBsYXB0b3B8ZW58MXx8fHwxNzczMTE0ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "accessories", rating: 4.6, reviews: 312, tags: ["Stickers", "Personalização"], branded: true, new: true, stock: 500,
  },
];

const categories: { id: Category; label: string; icon: typeof ShoppingBag }[] = [
  { id: "all", label: "Todos", icon: Layers },
  { id: "branded", label: "Lumiflow", icon: BadgeCheck },
  { id: "office", label: "Escritório", icon: Monitor },
  { id: "creator", label: "Creator Tools", icon: PenTool },
  { id: "merch", label: "Vestuário", icon: Shirt },
  { id: "accessories", label: "Acessórios", icon: Palette },
  { id: "productivity", label: "Produtividade", icon: BookOpen },
];

const mockOrders: Order[] = [
  {
    id: "LMF-2026-0847", items: [], total: 239.70, status: "shipped", date: "06/03/2026",
    trackingCode: "BR9284712934BR", paymentMethod: "Pix",
  },
  {
    id: "LMF-2026-0691", items: [], total: 149.90, status: "delivered", date: "22/02/2026",
    paymentMethod: "Cartão de Crédito",
  },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */

export function LumiStore({ onNavigate }: LumiStoreProps) {
  const [view, setView] = useState<StoreView>("catalog");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);

  const filtered = useMemo(() =>
    products
      .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
      .filter((p) =>
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [selectedCategory, searchQuery]
  );

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const toggleFavorite = (id: string) => setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) return prev.map((c) => c.product.id === product.id ? { ...c, quantity: c.quantity + qty } : c);
      return [...prev, { product, quantity: qty, selectedColor, selectedSize }];
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((c) => c.product.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    toast.info("Produto removido do carrinho");
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors?.[0] || "");
    setSelectedSize(product.sizes?.[0] || "");
    setView("product");
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setCheckoutStep(2);
    setCart([]);
    toast.success("Pedido realizado com sucesso!");
  };

  /* ─────────────── CATALOG VIEW ─────────────── */
  const renderCatalog = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#7B61FF]" />
            Lumiflow Store
          </h1>
          <p className="text-muted-foreground mt-1">Produtos curados para creators e profissionais de social media</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView("tracking")} className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border/50 rounded-xl text-sm hover:bg-muted/50 transition-colors">
            <Package className="w-4 h-4" /> Meus Pedidos
          </button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setView("cart")}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-[#7B61FF] text-white rounded-xl text-sm font-medium">
            <ShoppingCart className="w-4 h-4" /> Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[#7B61FF] text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] p-6 lg:p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-[60px]" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm text-white/80 font-medium">Coleção Lumiflow 2026</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Produtos exclusivos para creators</h2>
            <p className="text-white/70 text-sm max-w-md">
              Canecas, camisetas, planners e acessórios com identidade Lumiflow. Eleve seu workspace criativo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-white/20 text-white rounded-xl text-sm font-medium backdrop-blur-sm">
              Frete grátis acima de R$ 199
            </span>
          </div>
        </div>
      </div>

      {/* Search + Categories */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar produtos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30 transition-all" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id ? "bg-[#7B61FF] text-white shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}>
              <cat.icon className="w-3.5 h-3.5" /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Truck, label: "Frete Grátis", sub: "Acima de R$ 199" },
          { icon: Shield, label: "Compra Segura", sub: "Pix ou Cartão" },
          { icon: Package, label: "Produtos Exclusivos", sub: "Coleção Lumiflow" },
          { icon: Tag, label: "Desconto Elite", sub: "10% para assinantes" },
        ].map((badge) => (
          <div key={badge.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
            <badge.icon className="w-5 h-5 text-[#7B61FF] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">{badge.label}</p>
              <p className="text-[10px] text-muted-foreground">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product, idx) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }} whileHover={{ y: -4 }}
            className="rounded-2xl bg-card border border-border/50 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => openProduct(product)}>
            <div className="relative h-44 overflow-hidden">
              <ImageWithFallback src={product.image} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.branded && (
                  <span className="px-2 py-0.5 bg-[#7B61FF] text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> LUMIFLOW
                  </span>
                )}
                {product.bestseller && (
                  <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-md">MAIS VENDIDO</span>
                )}
                {product.new && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md">NOVO</span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
              </div>
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through ml-1.5">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="w-9 h-9 rounded-xl bg-[#7B61FF] text-white flex items-center justify-center hover:bg-[#6B4FEF] transition-colors">
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );

  /* ─────────────── PRODUCT DETAIL VIEW ─────────────── */
  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    const p = selectedProduct;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => setView("catalog")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar à loja
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
            <ImageWithFallback src={p.image} alt={p.name} className="w-full h-[400px] object-cover" />
          </div>
          {/* Info */}
          <div className="space-y-5">
            <div>
              {p.branded && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#7B61FF]/10 text-[#7B61FF] text-xs font-medium rounded-lg mb-2">
                  <Sparkles className="w-3 h-3" /> Produto Lumiflow Oficial
                </span>
              )}
              <h1 className="text-2xl font-bold">{p.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(p.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{p.rating} ({p.reviews} avaliações)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">R$ {p.price.toFixed(2).replace(".", ",")}</span>
              {p.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">R$ {p.originalPrice.toFixed(2).replace(".", ",")}</span>
              )}
              {p.originalPrice && (
                <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-md">
                  -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{p.longDescription}</p>

            {/* Colors */}
            {p.colors && p.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Cor: <span className="text-muted-foreground">{selectedColor}</span></p>
                <div className="flex items-center gap-2">
                  {p.colors.map((c) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-sm border-2 transition-all ${
                        selectedColor === c ? "border-[#7B61FF] bg-[#7B61FF]/5 font-medium" : "border-border hover:border-[#7B61FF]/30"
                      }`}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {p.sizes && p.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Tamanho: <span className="text-muted-foreground">{selectedSize}</span></p>
                <div className="flex items-center gap-2">
                  {p.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 rounded-xl text-sm border-2 flex items-center justify-center transition-all ${
                        selectedSize === s ? "border-[#7B61FF] bg-[#7B61FF]/5 font-bold" : "border-border hover:border-[#7B61FF]/30"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>{p.stock > 50 ? "Em estoque" : `Apenas ${p.stock} unidades`}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { addToCart(p); setView("cart"); }}
                className="flex-1 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Comprar Agora
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(p)}
                className="px-5 py-3 bg-card border border-border/50 rounded-xl font-medium hover:bg-muted/50 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </motion.button>
              <button onClick={() => toggleFavorite(p.id)}
                className="w-12 h-12 rounded-xl border border-border/50 flex items-center justify-center hover:bg-muted/50 transition-colors">
                <Heart className={`w-5 h-5 ${favorites.includes(p.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {p.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted/50 text-xs text-muted-foreground rounded-lg">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /* ─────────────── CART VIEW ─────────────── */
  const renderCart = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <button onClick={() => setView("catalog")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Continuar comprando
      </button>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingCart className="w-7 h-7 text-[#7B61FF]" /> Carrinho ({cartCount} {cartCount === 1 ? "item" : "itens"})
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card border border-border/50">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setView("catalog")}
            className="px-6 py-2.5 bg-[#7B61FF] text-white rounded-xl text-sm font-medium">
            Explorar Produtos
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm line-clamp-1">{item.product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.selectedColor && `Cor: ${item.selectedColor}`}
                    {item.selectedSize && ` · Tam: ${item.selectedSize}`}
                  </p>
                  <p className="text-sm font-bold text-[#7B61FF] mt-1">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(item.product.id, -1)}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.product.id, 1)}
                    className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl bg-card border border-border/50 p-5 h-fit sticky top-24 space-y-4">
            <h3 className="font-bold">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className={cartTotal >= 199 ? "text-emerald-500" : ""}>
                  {cartTotal >= 199 ? "Grátis" : "R$ 19,90"}
                </span>
              </div>
              {cartTotal < 199 && (
                <p className="text-[10px] text-[#7B61FF]">
                  Faltam R$ {(199 - cartTotal).toFixed(2).replace(".", ",")} para frete grátis
                </p>
              )}
              <div className="border-t border-border/50 pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>R$ {(cartTotal + (cartTotal >= 199 ? 0 : 19.90)).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setView("checkout"); setCheckoutStep(0); setOrderPlaced(false); }}
              className="w-full py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20">
              Finalizar Compra
            </motion.button>
            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Pagamento 100% seguro
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );

  /* ─────────────── CHECKOUT VIEW ─────────────── */
  const renderCheckout = () => {
    const shipping = cartTotal >= 199 ? 0 : 19.90;
    const total = cartTotal + shipping;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
        {!orderPlaced && (
          <button onClick={() => setView("cart")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
          </button>
        )}

        {/* Steps */}
        <div className="flex items-center justify-center gap-2">
          {["Endereço", "Pagamento", "Confirmação"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i <= checkoutStep ? "bg-[#7B61FF] text-white" : "bg-muted text-muted-foreground"
              }`}>
                {i < checkoutStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= checkoutStep ? "font-medium" : "text-muted-foreground"}`}>{step}</span>
              {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Address */}
          {checkoutStep === 0 && (
            <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl bg-card border border-border/50 p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-[#7B61FF]" /> Endereço de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground block mb-1">CEP</label>
                  <input type="text" defaultValue="01310-100" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground block mb-1">Endereço</label>
                  <input type="text" defaultValue="Av. Paulista, 1578" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Número</label>
                  <input type="text" defaultValue="Sala 402" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Cidade / Estado</label>
                  <input type="text" defaultValue="São Paulo - SP" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCheckoutStep(1)}
                className="w-full py-3 bg-[#7B61FF] text-white rounded-xl font-medium flex items-center justify-center gap-2">
                Continuar para Pagamento <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {checkoutStep === 1 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4">
              {/* Order Summary Mini */}
              <div className="rounded-2xl bg-card border border-border/50 p-5">
                <h3 className="font-bold text-sm mb-3">Resumo ({cartCount} itens)</h3>
                <div className="space-y-2 text-sm">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between">
                      <span className="text-muted-foreground truncate mr-2">{item.quantity}x {item.product.name}</span>
                      <span className="font-medium whitespace-nowrap">R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/50 pt-2 flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className={shipping === 0 ? "text-emerald-500 font-medium" : ""}>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-[#7B61FF]">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl bg-card border border-border/50 p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#7B61FF]" /> Método de Pagamento</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setPaymentMethod("pix")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "pix" ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"
                    }`}>
                    <QrCode className={`w-6 h-6 ${paymentMethod === "pix" ? "text-[#7B61FF]" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className="text-sm font-bold">Pix</p>
                      <p className="text-[10px] text-muted-foreground">Aprovação instantânea</p>
                    </div>
                  </button>
                  <button onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === "card" ? "border-[#7B61FF] bg-[#7B61FF]/5" : "border-border hover:border-[#7B61FF]/30"
                    }`}>
                    <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-[#7B61FF]" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className="text-sm font-bold">Cartão</p>
                      <p className="text-[10px] text-muted-foreground">Até 12x sem juros</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === "pix" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center space-y-3">
                    <div className="w-40 h-40 mx-auto bg-background border-2 border-border rounded-xl flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código</p>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border/50">
                      <code className="text-xs text-muted-foreground flex-1 truncate">00020126580014br.gov.bcb.pix...</code>
                      <button onClick={() => toast.success("Código Pix copiado!")} className="text-[#7B61FF] hover:text-[#6B4FEF]">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> Válido por 30 minutos
                    </p>
                  </motion.div>
                )}

                {paymentMethod === "card" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Número do Cartão</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">Validade</label>
                        <input type="text" placeholder="MM/AA" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-1">CVV</label>
                        <input type="text" placeholder="123" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Nome no Cartão</label>
                      <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Parcelas</label>
                      <select className="w-full p-3 rounded-xl bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <option key={i}>
                            {i + 1}x de R$ {(total / (i + 1)).toFixed(2).replace(".", ",")} {i === 0 ? "à vista" : "sem juros"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => setCheckoutStep(0)} className="px-5 py-3 bg-muted/50 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                    <ArrowLeft className="w-4 h-4 inline mr-1" /> Voltar
                  </button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> Confirmar Pagamento — R$ {total.toFixed(2).replace(".", ",")}
                  </motion.button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Seus dados estão protegidos com criptografia de ponta
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Confirmation */}
          {checkoutStep === 2 && orderPlaced && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-card border border-border/50 p-8 text-center space-y-5">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Pedido Confirmado!</h2>
                <p className="text-muted-foreground">Seu pedido <span className="font-mono font-bold text-foreground">LMF-2026-{Math.floor(Math.random() * 9000 + 1000)}</span> foi realizado com sucesso</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span className="font-medium">{paymentMethod === "pix" ? "Pix" : "Cartão de Crédito"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prazo estimado</span>
                  <span className="font-medium">5-7 dias úteis</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setView("tracking")}
                  className="px-6 py-2.5 bg-[#7B61FF] text-white rounded-xl text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" /> Acompanhar Pedido
                </motion.button>
                <button onClick={() => setView("catalog")} className="px-6 py-2.5 bg-muted/50 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  Continuar Comprando
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  /* ─────────────── ORDER TRACKING VIEW ─────────────── */
  const renderTracking = () => {
    const statusConfig: Record<string, { label: string; color: string; step: number }> = {
      confirmed: { label: "Confirmado", color: "text-blue-500", step: 0 },
      preparing: { label: "Em preparação", color: "text-amber-500", step: 1 },
      shipped: { label: "Enviado", color: "text-[#7B61FF]", step: 2 },
      delivered: { label: "Entregue", color: "text-emerald-500", step: 3 },
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button onClick={() => setView("catalog")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar à loja
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-7 h-7 text-[#7B61FF]" /> Meus Pedidos
        </h1>

        <div className="space-y-4">
          {mockOrders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <div key={order.id} className="rounded-2xl bg-card border border-border/50 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold font-mono">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.date} · {order.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${status.color} bg-current/10`}
                      style={{ backgroundColor: "transparent" }}>
                      <span className={status.color}>{status.label}</span>
                    </span>
                    <span className="text-sm font-bold">R$ {order.total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="flex items-center gap-0">
                  {["Confirmado", "Preparando", "Enviado", "Entregue"].map((step, i) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        i <= status.step
                          ? "bg-[#7B61FF] text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {i < status.step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      {i < 3 && (
                        <div className={`flex-1 h-1 mx-1 rounded-full ${i < status.step ? "bg-[#7B61FF]" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                  {["Confirmado", "Preparando", "Enviado", "Entregue"].map((s) => <span key={s}>{s}</span>)}
                </div>

                {order.trackingCode && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30 text-sm">
                    <Truck className="w-4 h-4 text-[#7B61FF]" />
                    <span className="text-muted-foreground">Código de rastreio:</span>
                    <code className="font-mono font-bold">{order.trackingCode}</code>
                    <button onClick={() => toast.success("Código copiado!")} className="text-[#7B61FF] ml-auto">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  /* ─────────────── MAIN RENDER ─────────────── */
  return (
    <AnimatePresence mode="wait">
      {view === "catalog" && <div key="catalog">{renderCatalog()}</div>}
      {view === "product" && <div key="product">{renderProductDetail()}</div>}
      {view === "cart" && <div key="cart">{renderCart()}</div>}
      {view === "checkout" && <div key="checkout">{renderCheckout()}</div>}
      {view === "tracking" && <div key="tracking">{renderTracking()}</div>}
    </AnimatePresence>
  );
}
