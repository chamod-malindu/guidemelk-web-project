"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MessagesTab({ userDetails, messages }) {
  const router = useRouter();

  const myId = userDetails?._id || userDetails?.id;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Messages
      </h2>

      {userDetails && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((chat) => {
            const otherUser = chat.participants?.find(
              (participant) => participant._id !== myId
            );

            return (
              <div
                key={chat._id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    Chat with:{" "}
                    {otherUser
                      ? `${otherUser.firstName} ${otherUser.lastName}`
                      : "Unknown"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => router.push(`/chat?chatId=${chat._id}`)}
                >
                  Open Chat
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No active chats found.</p>
      )}
    </div>
  );
}
