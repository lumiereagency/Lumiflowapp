import { motion } from "motion/react";
import { Network, Plus, Calendar } from "lucide-react";

interface MindMap {
  id: string;
  title: string;
  nodes: number;
  date: string;
  color: string;
}

interface MindMapsGridProps {
  onOpenMap: (title: string) => void;
}

const mindMaps: MindMap[] = [
  {
    id: "1",
    title: "Roadmap de Produto Q1",
    nodes: 47,
    date: "12 fev, 2026",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    title: "Ideias de Campanha Marketing",
    nodes: 32,
    date: "10 fev, 2026",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    title: "Insights de Pesquisa",
    nodes: 25,
    date: "8 fev, 2026",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "4",
    title: "Estratégia de Marca 2026",
    nodes: 61,
    date: "5 fev, 2026",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "5",
    title: "Brainstorming de Recursos",
    nodes: 38,
    date: "3 fev, 2026",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "6",
    title: "Calendário de Conteúdo",
    nodes: 19,
    date: "30 jan, 2026",
    color: "from-rose-500 to-pink-500",
  },
];

export function MindMapsGrid({ onOpenMap }: MindMapsGridProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus Mapas Mentais</h1>
          <p className="text-muted-foreground">
            Organize suas ideias e colabore com seu time
          </p>
        </div>

        {/* Create New Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenMap("Novo Mapa Mental")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B14EFF] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Criar Novo Mapa
        </motion.button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mindMaps.map((map, index) => (
          <motion.div
            key={map.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onOpenMap(map.title)}
            className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer"
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${map.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Network className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-3 group-hover:text-[#7B61FF] transition-colors">
              {map.title}
            </h3>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-[#7B61FF]" />
                <span>{map.nodes} nós</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{map.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}