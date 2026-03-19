"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GuideMessagesCard({ currentUser, chats }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Messages</CardTitle>
        <CardDescription>Communicate with tourists in real-time</CardDescription>
      </CardHeader>

      <CardContent>
        {currentUser && chats.length > 0 ? (
          <div className="space-y-4">
            {chats.map((chat) => {
              const myId = currentUser?._id || currentUser?.id;

              const otherUser = chat.participants?.find(
                (p) => p._id !== myId
              );

              return (
                <div
                  key={chat._id}
                  className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium dark:text-gray-100">
                      Chat with:{" "}
                      {otherUser
                        ? `${otherUser.firstName} ${otherUser.lastName}`
                        : "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {chat.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() =>
                      router.push(`/chat?chatId=${chat._id}`)
                    }
                  >
                    Open Chat
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No active chats found.</p>
        )}
      </CardContent>
    </Card>
  );
}
