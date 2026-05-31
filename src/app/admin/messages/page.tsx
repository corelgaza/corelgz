import MessagesPageClient from "@/components/admin/MessagesPageClient";
import { listContactMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return <MessagesPageClient initial={messages} />;
}
