import MessagesList from "@/components/admin/MessagesList";
import { listContactMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return <MessagesList initial={messages} />;
}
