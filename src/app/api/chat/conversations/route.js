import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  // Prevent invalid IDs from reaching Mongoose
  if (!user1 || !user2 || user1 === "undefined" || user2 === "undefined") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid user IDs" }),
      { status: 400 }
    );
  }

  try {
    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [user1, user2], $size: 2 }
    });

    // If no chat found, create new one
    if (!chat) {
      chat = await Chat.create({ participants: [user1, user2] });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.error("Error in /api/chat/conversations:", err);
    return new Response(
      JSON.stringify({ error: "Server error creating/finding chat" }),
      { status: 500 }
    );
  }
}
