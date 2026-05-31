"use client";

import { useLayoutEffect } from "react";
import type { ContactMessageRow } from "@/lib/messages";
import { useAdminInbox } from "./AdminInboxProvider";
import MessagesList from "./MessagesList";

export default function MessagesPageClient({
  initial,
}: {
  initial: ContactMessageRow[];
}) {
  const { seed } = useAdminInbox();

  useLayoutEffect(() => {
    seed(initial);
  }, [initial, seed]);

  return <MessagesList />;
}
