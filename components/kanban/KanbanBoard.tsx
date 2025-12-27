"use client";

import { useMemo, useState, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { BoardColumn, BoardContainer, Column } from "./BoardColumn";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Task, TaskCard } from "./TaskCard";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import {
  updateOrderStatus,
  fetchOrdersByColumn,
} from "@/lib/actions/order.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultCols: Column[] = [
  { id: "Pending", title: "Pending" },
  { id: "Processing", title: "Processing" },
  { id: "Shipped", title: "Shipped" },
  { id: "Delivered", title: "Delivered" },
  { id: "Cancelled", title: "Cancelled" },
];

export type ColumnId = string;

interface KanbanBoardProps {
  userId: string;
}

export function KanbanBoard({ userId }: KanbanBoardProps) {
  // --- State ---
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultCols.map((c) => c.id),
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  // Pagination & Loading
  const [pagination, setPagination] = useState<Record<string, number>>({});
  const [hasMoreMap, setHasMoreMap] = useState<Record<string, boolean>>({});
  const [isLoadingMap, setIsLoadingMap] = useState<Record<string, boolean>>({});

  // NEW: Store Total Counts per column
  const [totalCounts, setTotalCounts] = useState<Record<string, number>>({});

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- Fetch Data ---
  const loadColumnData = useCallback(
    async (colId: string, page: number, search: string, isReset: boolean) => {
      if (!userId) return;

      setIsLoadingMap((prev) => ({ ...prev, [colId]: true }));

      try {
        // Destructure 'total' from response
        const { orders, hasMore, total } = await fetchOrdersByColumn({
          userId,
          status: colId,
          page,
          search,
        });

        const newTasks: Task[] = orders.map((o: any) => ({
          id: o._id,
          columnId: colId,
          content: `Order #${o.orderID}`,
          orderData: o,
        }));

        setTasks((prev) => {
          if (isReset) {
            const otherTasks = prev.filter((t) => t.columnId !== colId);
            return [...otherTasks, ...newTasks];
          }
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNew = newTasks.filter((t) => !existingIds.has(t.id));
          return [...prev, ...uniqueNew];
        });

        setHasMoreMap((prev) => ({ ...prev, [colId]: hasMore }));
        setPagination((prev) => ({ ...prev, [colId]: page }));

        // NEW: Update total count for this column
        setTotalCounts((prev) => ({ ...prev, [colId]: total }));
      } catch (error) {
        console.error(`Error loading column ${colId}:`, error);
      } finally {
        setIsLoadingMap((prev) => ({ ...prev, [colId]: false }));
      }
    },
    [userId],
  );

  useEffect(() => {
    visibleColumns.forEach((colId) => {
      loadColumnData(colId, 1, debouncedSearch, true);
    });
  }, [debouncedSearch, visibleColumns.length, loadColumnData]);

  const handleLoadMore = (colId: string) => {
    if (isLoadingMap[colId]) return;
    const nextPage = (pagination[colId] || 1) + 1;
    loadColumnData(colId, nextPage, debouncedSearch, false);
  };

  // --- Dnd Kit ---
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);
  const dndContextId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredColumns = useMemo(
    () => columns.filter((c) => visibleColumns.includes(c.id)),
    [columns, visibleColumns],
  );
  const columnsId = useMemo(
    () => filteredColumns.map((col) => col.id),
    [filteredColumns],
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 px-4 text-gray-300 md:px-5">
        <div className="relative w-full max-w-sm">
          <Input
            dir="rtl"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-primary border pl-8"
          />
          <Search className="text-muted-foreground text-primary absolute top-2.5 left-2 h-4 w-4" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-primary gap-2 p-5"
            >
              <Filter className="h-4 w-4" /> فیلتر
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-foreground text-white/70"
            align="end"
          >
            <DropdownMenuLabel>نمایش ستون‌ها</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={visibleColumns.includes(col.id)}
                onCheckedChange={(checked) => {
                  setVisibleColumns((prev) =>
                    checked
                      ? [...prev, col.id]
                      : prev.filter((id) => id !== col.id),
                  );
                }}
              >
                {col.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DndContext
        id={dndContextId}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {filteredColumns.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
                hasMore={hasMoreMap[col.id]}
                onLoadMore={() => handleLoadMore(col.id)}
                // NEW: Pass the total count
                totalCount={totalCounts[col.id]}
              />
            ))}
          </SortableContext>
        </BoardContainer>

        {mounted &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  isOverlay
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id,
                  )}
                  totalCount={totalCounts[activeColumn.id]}
                />
              )}
              {activeTask && <TaskCard task={activeTask} isOverlay />}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") setActiveColumn(data.column);
    if (data?.type === "Task") setActiveTask(data.task);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;
    if (activeData?.type === "Task") {
      const task = tasks.find((t) => t.id === activeId);
      if (task) {
        updateOrderStatus(activeId.toString(), task.columnId);
      }
    }

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId,
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Task over Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          // NEW: Optimistically update total counts when crossing columns
          const sourceCol = activeTask.columnId;
          const targetCol = overTask.columnId;

          setTotalCounts((prev) => ({
            ...prev,
            [sourceCol]: Math.max(0, (prev[sourceCol] || 0) - 1),
            [targetCol]: (prev[targetCol] || 0) + 1,
          }));

          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Task over Column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          // NEW: Optimistically update total counts
          const sourceCol = activeTask.columnId;
          const targetCol = overId as string;

          if (sourceCol !== targetCol) {
            setTotalCounts((prev) => ({
              ...prev,
              [sourceCol]: Math.max(0, (prev[sourceCol] || 0) - 1),
              [targetCol]: (prev[targetCol] || 0) + 1,
            }));
          }

          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}
