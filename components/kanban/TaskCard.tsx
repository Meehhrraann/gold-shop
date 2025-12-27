import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, CalendarDays, Box, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Task {
  id: UniqueIdentifier;
  columnId: string;
  content: string;
  orderData?: any;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "group relative flex flex-col bg-foreground text-gray-300 border-white/10 gap-3 rounded-xl border overflow-hidden  p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20",
    {
      variants: {
        dragging: {
          default: "border-border",
          over: "ring-2 ring-primary/30 opacity-40 blur-[1px]",
          overlay:
            "ring-2 ring-primary shadow-2xl scale-[1.02] cursor-grabbing z-50",
        },
      },
    },
  );

  // Styling Helpers
  const statusColors: Record<string, string> = {
    Pending: "from-yellow-500/50 to-transparent",
    Processing: "from-blue-500/50 to-transparent",
    Shipped: "from-purple-500/50 to-transparent",
    Delivered: "from-green-500/50 to-transparent",
    Cancelled: "from-red-500/50 to-transparent",
  };
  const gradientClass = statusColors[task.columnId] || "from-gray-500/20";

  const price = task.orderData?.totalAmount
    ? new Intl.NumberFormat("fa-IR").format(task.orderData.totalAmount)
    : "0";

  const date = task.orderData?.createdAt
    ? new Date(task.orderData.createdAt).toLocaleDateString("fa-IR")
    : "";

  return (
    <div
      dir="rtl"
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : "default",
      })}
    >
      {/* --- Top Gradient Line (Subtle Status Indication) --- */}
      <div
        className={`absolute top-0 right-0 left-0 h-1 rounded-t-xl bg-gradient-to-r ${gradientClass}`}
      />

      {/* --- Header: ID & Actions --- */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground/70 font-mono text-[10px] font-medium tracking-widest uppercase">
            {task.orderData?.orderID} :ID
          </span>
          {/* Customer Name or Order Title */}
          <span className="text-muted-foreground line-clamp-1 text-xs font-medium text-white/50">
            {task.content !== `Order #${task.orderData?.orderID}`
              ? task.content
              : "سفارش محصول"}
          </span>
        </div>

        {/* Drag Handle (Visible on Hover) */}
        <Button
          variant="ghost"
          size="icon"
          {...attributes}
          {...listeners}
          className="text-muted-foreground/20 text-primary hover:text-primary/80 -mt-2 -mr-2 h-6 w-6 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 hover:bg-transparent"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* --- Body: Price (Hero) --- */}
      <div className="mt-1 flex items-center justify-end gap-2">
        <span className="text-primary bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
          تومان
        </span>
        <span className="text-primary text-lg font-semibold tracking-tight">
          {price}
        </span>
      </div>

      {/* --- Footer: Meta Info --- */}
      <div className="border-border/50 mt-1 flex items-center justify-between border-t pt-3">
        {/* Date */}
        <div className="text-muted-foreground flex items-start gap-1.5 text-xs text-white/50">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>

        {/* Items Count Badge */}
        <Badge
          variant="secondary"
          className="hover:bg-secondary gap-1.5 px-2 py-0.5 text-xs font-normal"
        >
          <Box className="text-foreground/70 h-3 w-3" />
          <span>تعداد اقلام {task.orderData?.items?.length || 0} </span>
        </Badge>
      </div>
    </div>
  );
}
