import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Button } from "../ui/button";
import { GripVertical, Loader2, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useInView } from "react-intersection-observer";

export interface Column {
  id: string;
  title: string;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  totalCount?: number; // <--- NEW PROP
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  hasMore,
  onLoadMore,
  totalCount, // <--- Destructure
}: BoardColumnProps) {
  const tasksIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    attributes: { roleDescription: `Column: ${column.title}` },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const getStatusColor = (id: string) => {
    switch (id) {
      case "Pending":
        return "bg-yellow-500 shadow-yellow-500/50";
      case "Processing":
        return "bg-blue-500 shadow-blue-500/50";
      case "Shipped":
        return "bg-purple-500 shadow-purple-500/50";
      case "Delivered":
        return "bg-green-500 shadow-green-500/50";
      case "Cancelled":
        return "bg-red-500 shadow-red-500/50";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex h-full w-[350px] min-w-[350px] flex-col gap-2 rounded-xl border-2 border-transparent transition-colors ${isDragging ? "bg-secondary/20 border-primary/20" : ""}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full shadow-[0_0_8px] ${getStatusColor(column.id)}`}
          />

          <span className="text-sm font-bold tracking-wider text-gray-300 uppercase">
            {column.title}
          </span>

          <span className="bg-foreground flex h-5 min-w-5 items-center justify-center rounded-md px-2 text-[10px] font-bold text-gray-300">
            {/* Display totalCount if available, otherwise fallback to tasks.length */}
            {totalCount !== undefined ? totalCount : tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground h-6 w-6"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="text-muted-foreground h-6 w-6 cursor-grab p-0"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="flex flex-col gap-3 pb-4">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>

          {!isOverlay && hasMore && <ColumnLoader onLoadMore={onLoadMore} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function ColumnLoader({ onLoadMore }: { onLoadMore?: () => void }) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });

  useEffect(() => {
    if (inView && onLoadMore) onLoadMore();
  }, [inView, onLoadMore]);

  return (
    <div ref={ref} className="flex w-full justify-center py-4">
      <Loader2 className="text-primary h-5 w-5 animate-spin" />
    </div>
  );
}

// BoardContainer remains unchanged...
export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();
  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4 h-full ", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-row items-start justify-center gap-4">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
