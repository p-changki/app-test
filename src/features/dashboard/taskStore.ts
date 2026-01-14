"use client";

import { useSyncExternalStore } from "react";

import { dashboardTaskRows } from "@/data/dashboard";
import type {
  DashboardTaskAttachment,
  DashboardTaskRow,
} from "@/features/dashboard/types";

export type TaskRecord = DashboardTaskRow & {
  id: string;
  status: "진행 중" | "완료";
  statusVariant: "primary" | "success";
  progress: number;
};

type TaskDraftInput = {
  title: string;
  subTitle: string;
  description: string;
  ta: string;
  assigner: string;
  issuedAt?: string;
  priority: DashboardTaskRow["priority"];
  icon?: string;
  avatar?: string;
  assignerAvatar?: string;
  attachments?: DashboardTaskAttachment[];
};

const STORAGE_KEY = "eduops.task-assignments";
let taskState: TaskRecord[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function createTaskId(source: {
  title: string;
  ta: string;
  issuedAt?: string;
}) {
  const slugBase = `${source.title}-${source.ta}-${source.issuedAt ?? ""}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Date.now().toString(36);
  return slugBase ? `${slugBase}-${suffix}` : `task-${suffix}`;
}

function formatIssuedAt(input?: string) {
  if (input) {
    const normalized = input.replaceAll("-", ".");
    return `${normalized} 09:00`;
  }
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function createAvatar(seed: string) {
  return `https://i.pravatar.cc/80?u=${encodeURIComponent(seed)}`;
}

function seedTasks(): TaskRecord[] {
  return dashboardTaskRows.map((task) => ({
    ...task,
    id: createTaskId({
      title: task.title,
      ta: task.ta,
      issuedAt: task.issuedAt,
    }),
    due: task.due ?? "",
    dueDateTime: task.dueDateTime ?? "",
    status: task.status === "완료" ? "완료" : "진행 중",
    statusVariant: task.status === "완료" ? "success" : "primary",
    progress: task.progress ?? 0,
  }));
}

function normalizeTasks(data: unknown) {
  if (!Array.isArray(data)) return null;
  const normalized = data
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const task = item as TaskRecord;
      if (!task.title || !task.ta) return null;
      const status = task.status === "완료" ? "완료" : "진행 중";
      return {
        ...task,
        id:
          task.id ??
          createTaskId({
            title: task.title,
            ta: task.ta,
            issuedAt: task.issuedAt,
          }),
        status,
        statusVariant: status === "완료" ? "success" : "primary",
        progress: Number.isFinite(task.progress) ? task.progress : 0,
        due: task.due ?? "",
        dueDateTime: task.dueDateTime ?? "",
      } satisfies TaskRecord;
    })
    .filter(Boolean) as TaskRecord[];

  return normalized.length ? normalized : null;
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const normalized = normalizeTasks(parsed);
      if (normalized) {
        taskState = normalized;
        initialized = true;
        return;
      }
    }
  } catch {
    // ignore storage errors
  }
  taskState = seedTasks();
  persist(taskState);
  initialized = true;
}

function getClientSnapshot() {
  ensureInit();
  return taskState;
}

function getServerSnapshot() {
  return seedTasks();
}

function persist(data: TaskRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setState(updater: (prev: TaskRecord[]) => TaskRecord[]) {
  const next = updater(getClientSnapshot());
  taskState = next;
  persist(next);
  listeners.forEach((listener) => listener());
}

export function useTaskStore<T = TaskRecord[]>(
  selector?: (tasks: TaskRecord[]) => T
): T {
  const derivedSelector = selector ?? ((state) => state as unknown as T);
  return useSyncExternalStore(
    subscribe,
    () => derivedSelector(getClientSnapshot()),
    () => derivedSelector(getServerSnapshot())
  );
}

export function createTaskRecord(input: TaskDraftInput): TaskRecord {
  const issuedAt = formatIssuedAt(input.issuedAt);
  const status = "진행 중" as const;
  return {
    id: createTaskId({ title: input.title, ta: input.ta, issuedAt }),
    title: input.title.trim() || "신규 업무",
    subTitle: input.subTitle.trim() || "업무 요약",
    icon: input.icon ?? "task",
    ta: input.ta,
    avatar: input.avatar ?? createAvatar(input.ta),
    due: "",
    progress: 0,
    status,
    statusVariant: "primary",
    priority: input.priority,
    issuedAt,
    assigner: input.assigner,
    assignerAvatar: input.assignerAvatar ?? createAvatar(input.assigner),
    dueDateTime: "",
    description: input.description.trim() || "업무 상세 내용이 없습니다.",
    attachments: input.attachments,
  };
}

export function addTasks(records: TaskRecord[]) {
  if (records.length === 0) return;
  setState((prev) => [...records, ...prev]);
}

export function updateTaskStatus(taskId: string, status: "진행 중" | "완료") {
  setState((prev) =>
    prev.map((task) => {
      if (task.id !== taskId) return task;
      const nextStatus = status === "완료" ? "완료" : "진행 중";
      return {
        ...task,
        status: nextStatus,
        statusVariant: nextStatus === "완료" ? "success" : "primary",
        progress: nextStatus === "완료" ? 100 : Math.min(task.progress, 80),
      };
    })
  );
}

export function removeTasks(taskIds: string[]) {
  if (taskIds.length === 0) return;
  setState((prev) => prev.filter((task) => !taskIds.includes(task.id)));
}
