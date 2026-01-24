export const NoDataToDisplay = ({ title }: { title: string }) => {
  return (
    <div
      className="
        rounded-xl border border-border
        bg-surface/80 backdrop-blur-sm
        p-6 text-center text-muted
      "
    >
      {title}
    </div>
  );
};
