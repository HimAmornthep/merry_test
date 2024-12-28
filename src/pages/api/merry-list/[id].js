import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // ดึง user_master จาก Dynamic Route
      const { id: user_master } = req.query;

      if (!user_master) {
        return res.status(400).json({ error: "Missing user_master in route" });
      }

      console.log("User Master ID:", user_master);

      // Query 1: Match List
      const matchQuery = `
        SELECT 
          User_Profiles.name AS name,
          User_Profiles.age AS age,
          Gender.gender_name AS sexual_identity,
          SexualPreference.gender_name AS sexual_preference,
          Meeting_Interest.meeting_name AS meeting_interest,
          Racial_Identity.racial_name AS racial_preference,
          City.city_name AS city_name,
          Location.location_name AS location_name,
          Image_Profiles.image_profile_url AS profile_image,
          Matching.is_match AS is_match
        FROM Matching
        JOIN User_Profiles ON Matching.user_other = User_Profiles.profile_id
        JOIN Gender ON User_Profiles.gender_id = Gender.gender_id
        JOIN Gender AS SexualPreference ON User_Profiles.sexual_preference_id = SexualPreference.gender_id
        JOIN Meeting_Interest ON User_Profiles.meeting_interest_id = Meeting_Interest.meeting_interest_id
        JOIN Racial_Identity ON User_Profiles.racial_preference_id = Racial_Identity.racial_id
        JOIN City ON User_Profiles.city_id = City.city_id
        JOIN Location ON City.location_id = Location.location_id
        LEFT JOIN Image_Profiles ON User_Profiles.profile_id = Image_Profiles.profile_id
          AND Image_Profiles.is_primary = true
        WHERE Matching.user_master = $1
        ORDER BY Matching.is_match DESC, User_Profiles.name ASC;
      `;

      // Query 2: Count True/False
      const countQuery = `
        SELECT 
          SUM(CASE WHEN is_match = true THEN 1 ELSE 0 END) AS total_true,
          SUM(CASE WHEN is_match = false THEN 1 ELSE 0 END) AS total_false
        FROM (
          SELECT DISTINCT user_master, user_other, is_match
          FROM Matching
          WHERE user_master = $1
        ) AS subquery;
      `;

      const [matchesResult, countResult] = await Promise.all([
        connectionPool.query(matchQuery, [user_master]),
        connectionPool.query(countQuery, [user_master]),
      ]);

      const matches = matchesResult.rows;
      const { total_true, total_false } = countResult.rows[0];

      console.log("Matches Result:", matches);
      console.log("Count Result:", { total_true, total_false });

      res.status(200).json({
        matches,
        total_true,
        total_false,
      });
    } catch (error) {
      console.error("Error fetching match list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // ดึง user_master จาก Dynamic Route
      const { id: user_master } = req.query;
      // ดึง user_other จาก Body
      const { user_other } = req.body;

      // ตรวจสอบพารามิเตอร์
      if (!user_master || !user_other) {
        return res.status(400).json({ error: "Missing user_master in route or user_other in body" });
      }

      // Query สำหรับลบข้อมูล
      const deleteQuery = `
        DELETE FROM Matching
        WHERE user_master = $1 AND user_other = $2
        RETURNING user_master, user_other;
      `;

      // Execute Query
      const result = await connectionPool.query(deleteQuery, [user_master, user_other]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "No match found to delete" });
      }

      console.log("Deleted Match:", { user_master, user_other });

      res.status(200).json({
        message: "Match deleted successfully",
        deletedRecord: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting match:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
  }
}
