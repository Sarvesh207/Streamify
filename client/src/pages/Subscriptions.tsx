import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { ChannelSummary } from "../api/types";
import SubscribeButton from "../components/SubscribeButton";
import ChannelRow from "../components/ui/ChannelRow";
import { useChannelSubscribers, useSubscribedChannels } from "../hooks/useLibrary";
import type { RootState } from "../store/store";

type Tab = "following" | "subscribers";

export default function Subscriptions() {
  const user = useSelector((state: RootState) => state.user);
  const [tab, setTab] = useState<Tab>("following");

  const following = useSubscribedChannels(user?._id);
  const subscribers = useChannelSubscribers(user?._id);
  const active = tab === "following" ? following : subscribers;
  const channels: ChannelSummary[] = active.data ?? [];

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "following", label: "Subscriptions", count: following.data?.length },
    { id: "subscribers", label: "Your subscribers", count: subscribers.data?.length },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-6 border-b border-gray-800" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className="ml-2 text-gray-500">{t.count}</span>}
          </button>
        ))}
      </div>

      {active.isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      )}
      {active.isError && <p className="text-red-400">Couldn't load channels.</p>}
      {!active.isLoading && !active.isError && channels.length === 0 && (
        <p className="py-20 text-center text-gray-500">
          {tab === "following" ? "You haven't subscribed to any channels yet." : "No subscribers yet."}
        </p>
      )}

      <div className="space-y-1">
        {channels.map((channel) => (
          <ChannelRow
            key={channel._id}
            channel={channel}
            action={tab === "following" ? <SubscribeButton channelId={channel._id} isSubscribed /> : undefined}
          />
        ))}
      </div>
    </div>
  );
}
