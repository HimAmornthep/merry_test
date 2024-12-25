import { db } from "@/utils/adminFirebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const chatRoomRef = db.collection("chat_rooms").doc(id);
    const chatRoomDoc = await chatRoomRef.get();

    if (!chatRoomDoc.exists) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const chatRoomData = chatRoomDoc.data();
    return res.status(200).json({ messages: chatRoomData.messages || [] });
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return res.status(500).json({ error: "Failed to fetch chat room" });
  }
}
