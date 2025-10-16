import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Prevent CastError by validating input early
  if (!userId || userId === "undefined" || userId === "null") {
    return new Response(
      JSON.stringify({ error: "Missing or invalid userId" }),
      { status: 400 }
    );
  }

  try {
    const chats = await Chat.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate("participants", "firstName lastName profileImage role")
      .lean();

    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (err) {
    console.error("Error fetching user chats:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user chats" }),
      { status: 500 }
    );
  }
}
