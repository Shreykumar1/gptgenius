import ChatMedic from "@/components/ChatMedic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const ChatPage = () => {
  const queryClient = new QueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatMedic />
    </HydrationBoundary>
  );
};

export default ChatPage;
