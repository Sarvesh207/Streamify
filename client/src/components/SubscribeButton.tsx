import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToggleSubscription from "../hooks/useToggleSubscription";
import type { RootState } from "../store/store";

interface SubscribeButtonProps {
  channelId: string;
  isSubscribed?: boolean;
}

export default function SubscribeButton({ channelId, isSubscribed }: SubscribeButtonProps) {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const toggleSubscription = useToggleSubscription();

  // You can't subscribe to yourself
  if (user?._id === channelId) return null;

  const handleClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleSubscription.mutate(channelId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleSubscription.isPending}
      className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 ${
        isSubscribed
          ? "bg-[#2a2a2a] hover:bg-[#3f3f3f] text-gray-300"
          : "bg-white hover:bg-gray-200 text-black"
      }`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
