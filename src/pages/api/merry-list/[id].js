import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // ดึงค่า id จาก Dynamic Route
      const { id: user_master } = req.query;

      // ตรวจสอบค่า user_master
      if (!user_master) {
        return res.status(400).json({ error: "Missing user_master in route" });
      }

      console.log("User Master ID:", user_master);

      // Query Match List
      const matchQuery = `
      SELECT 
        User_Profiles.name AS name,
        User_Profiles.age AS age,
        Gender.gender_name AS sexual_identity,
        SexualPreference.gender_name AS sexual_preference,
        Meeting_Interest.meeting_name AS meeting_interest,
        Racial_Identity.racial_name AS racial_identity,
        Matching.is_match AS is_match
      FROM Matching
      JOIN User_Profiles ON Matching.user_second = User_Profiles.profile_id
      JOIN Gender ON User_Profiles.gender_id = Gender.gender_id
      JOIN Gender AS SexualPreference ON User_Profiles.sexual_preference_id = SexualPreference.gender_id
      JOIN Meeting_Interest ON User_Profiles.meeting_interest_id = Meeting_Interest.meeting_interest_id
      JOIN Racial_Identity ON User_Profiles.racial_identity_id = Racial_Identity.racial_id
      WHERE Matching.user_master = $1;
    `;

      console.log("Executing Query:", matchQuery);

      // ดึงข้อมูลจากฐานข้อมูล
      const { rows } = await connectionPool.query(matchQuery, [user_master]);

      // แสดงผลลัพธ์
      console.log("Query Result:", rows);

      res.status(200).json({ matches: rows });
    } catch (error) {
      console.error("Error fetching match list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
  }
}
