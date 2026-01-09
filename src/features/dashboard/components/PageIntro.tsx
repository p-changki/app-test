type PageIntroProps = {
  title: string;
  description: string;
};

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <div className="flex flex-col gap-1 pb-2">
      <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
