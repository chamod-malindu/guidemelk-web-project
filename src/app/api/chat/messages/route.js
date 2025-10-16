import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  // Prevent CastError
  if (!chatId || chatId === "undefined" || chatId === "null") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid chatId" }),
      { status: 400 }
    );
  }

  try {
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    // Always return an array to the client
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
      { status: 500 }
    );
  }
}
