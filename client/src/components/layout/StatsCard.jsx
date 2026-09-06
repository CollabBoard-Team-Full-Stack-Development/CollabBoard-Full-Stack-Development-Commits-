import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ title, count, icon: Icon, color, percentage, description }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-5 border border-border/70 hover:border-purple/40 transition-colors shadow-card-glow relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mt-2 tracking-tight">
            {count}
          </h3>
        </div>

        <div
          className="p-3 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}1A`, color: color }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {percentage && (
          <span className="font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded-md">
            {percentage}
          </span>
        )}
        <span className="text-text-muted">{description}</span>
      </div>

      {/* Decorative gradient blur circle */}
      <div
        className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-20"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

export default StatsCard;