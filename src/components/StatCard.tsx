import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
}

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-md border border-border bg-card transition-colors duration-200 hover:border-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground before:mr-1 before:text-primary before:content-['>_']">
              {label}
            </p>
            <p className="mono mt-1 text-2xl font-bold tabular-nums text-foreground">
              {value}
            </p>
            {trend && (
              <p className="mono mt-1 text-[11px] text-muted-foreground">{trend}</p>
            )}
          </div>
          {icon && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-primary [&_svg]:h-4 [&_svg]:w-4">
                {icon}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
