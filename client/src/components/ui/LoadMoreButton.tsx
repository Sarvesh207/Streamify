import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onClick: () => void;
}

export default function LoadMoreButton({ hasNextPage, isFetchingNextPage, onClick }: LoadMoreButtonProps) {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={onClick}
        disabled={isFetchingNextPage}
        className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3f3f3f] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
      >
        {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </button>
    </div>
  );
}
