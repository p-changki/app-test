import type { ResourceItem } from "@/features/learning-resources/types";
import { cn } from "@/lib/utils";

type ResourceTableProps = {
  resources: ResourceItem[];
  iconClass: (extra?: string, filled?: boolean) => string;
};

const ResourceTable = ({ resources, iconClass }: ResourceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
            <th className="w-12 p-4">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary focus:ring-primary/20"
              />
            </th>
            <th className="min-w-75 p-4 font-medium">자료명</th>
            <th className="min-w-30 p-4 font-medium">과목/분류</th>
            <th className="min-w-30 p-4 font-medium">등록자</th>
            <th className="min-w-[120px] p-4 font-medium">등록일</th>
            <th className="min-w-[100px] p-4 font-medium">크기</th>
            <th className="w-[120px] p-4 text-center font-medium">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm dark:divide-slate-700">
          {resources.map((resource) => (
            <ResourceRow
              key={resource.id}
              resource={resource}
              iconClass={iconClass}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

type ResourceRowProps = {
  resource: ResourceItem;
  iconClass: (extra?: string, filled?: boolean) => string;
};

const ResourceRow = ({ resource, iconClass }: ResourceRowProps) => (
  <tr className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <td className="p-4">
      <input
        type="checkbox"
        className="rounded border-slate-300 text-primary focus:ring-primary/20"
      />
    </td>
    <td className="p-4">
      <div className="flex items-start gap-3">
        <div className={cn("shrink-0 rounded-lg p-2", resource.icon.className)}>
          <span className={iconClass("text-[24px]")}>{resource.icon.name}</span>
        </div>
        <div>
          <p className="cursor-pointer font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
            {resource.title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {resource.description}
          </p>
        </div>
      </div>
    </td>
    <td className="p-4">
      <span className={resource.subject.className}>
        {resource.subject.label}
      </span>
    </td>
    <td className="p-4 text-slate-600 dark:text-slate-300">
      <div className="flex items-center gap-2">
        {resource.uploader.avatarUrl ? (
          <div
            className="size-6 shrink-0 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${resource.uploader.avatarUrl}')`,
            }}
          />
        ) : (
          <div className="size-6 flex shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600">
            <span className={iconClass("text-sm text-slate-500")}>
              {resource.uploader.fallbackIcon}
            </span>
          </div>
        )}
        <span>{resource.uploader.name}</span>
      </div>
    </td>
    <td className="p-4 text-slate-500 dark:text-slate-400">{resource.date}</td>
    <td className="p-4 text-slate-500 dark:text-slate-400">{resource.size}</td>
    <td className="p-4">
      <div className="flex items-center justify-center gap-2">
        <button
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
          title={resource.previewIcon.title}
        >
          <span className={iconClass("text-[20px]")}>
            {resource.previewIcon.name}
          </span>
        </button>
        <button
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
          title={resource.downloadIcon.title}
        >
          <span className={iconClass("text-[20px]")}>
            {resource.downloadIcon.name}
          </span>
        </button>
      </div>
    </td>
  </tr>
);

export default ResourceTable;
