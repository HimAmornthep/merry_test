import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";


export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }        
    try {

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user_id = decodedToken.id;

      if (req.method === "GET") {
      const limitQuery = `
        SELECT 
          user_id, 
          reset_time, 
          hours_reset_time, 
          matches_remaining, 
          total_limit 
        FROM 
          user_match_subscription
        WHERE 
          user_id = $1;
      `;

      // ส่ง user_id เป็นพารามิเตอร์
      const result = await connectionPool.query(limitQuery, [user_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        message: "Success",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
