"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface LoadingProps {
  type?: "default" | "content" | "minimal";
}

export const Loading = ({ type = "minimal" }: LoadingProps) => {
  if (type === "content") {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-8 w-3/4 max-w-2xl" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-4 w-4 bg-brand-200 rounded-full"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.2,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

