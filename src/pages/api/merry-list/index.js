import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userMasterId = decodedToken.id; // ดึง ID จาก Token

    if (req.method === "GET") {
      try {
        // Query Fetch Matches
        const matchQuery = `
SELECT 
    Matching.user_other AS user_other,
    User_Profiles.name AS name,
    User_Profiles.age AS age,
    Gender.gender_name AS sexual_identity,
    SexualPreference.gender_name AS sexual_preference,
    Meeting_Interest.meeting_name AS meeting_interest,
    Racial_Identity.racial_name AS racial_preference,
    City.city_name AS city_name,
    Location.location_name AS location_name,
    Image_Profiles.image_profile_url AS profile_image,
    Matching.is_match AS is_match,
    Matching.date_match AS date_match
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
ORDER BY 
    CASE 
        WHEN Matching.date_match::date = CURRENT_DATE THEN 1 -- แมทวันนี้ แสดงบนสุด
        ELSE 2
    END,
    Matching.date_match DESC, -- แมทล่าสุดขึ้นบนเสมอ
    Matching.is_match DESC, -- ตามด้วยแมทที่สำเร็จ
    User_Profiles.name ASC; -- ชื่อเรียงลำดับตัวอักษร

        `;

        const countQuery = `
          SELECT 
            SUM(CASE WHEN is_match = true THEN 1 ELSE 0 END) AS total_true,
            SUM(CASE WHEN is_match = false THEN 1 ELSE 0 END) AS total_false
          FROM Matching
          WHERE user_master = $1;
        `;

        // Query Limit Info
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

        const detailProfileQuery = `
        SELECT 
    User_Profiles.user_id AS user_id,
    User_Profiles.name AS name,
    User_Profiles.age AS age,
    Gender.gender_name AS sexual_identity,
    SexualPreference.gender_name AS sexual_preference,
    Meeting_Interest.meeting_name AS meeting_interest,
    Racial_Identity.racial_name AS racial_preference,
    City.city_name AS city_name,
    Location.location_name AS location_name,
    (
        SELECT ARRAY_AGG(hobbies.hobby_name ORDER BY hobbies.hobby_name)
        FROM hobbies_profiles
        JOIN hobbies ON hobbies_profiles.hobbies_id = hobbies.hobbies_id
        WHERE hobbies_profiles.profile_id = User_Profiles.profile_id
    ) AS hobbies,
    (
        SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
                'image_profile_id', ip.image_profile_id,
                'image_url', ip.image_profile_url,
                'is_primary', ip.is_primary
            )
        )
        FROM Image_Profiles AS ip
        WHERE ip.profile_id = User_Profiles.profile_id
    ) AS profile_images
FROM Matching
JOIN User_Profiles ON Matching.user_other = User_Profiles.profile_id
JOIN Gender ON User_Profiles.gender_id = Gender.gender_id
JOIN Gender AS SexualPreference ON User_Profiles.sexual_preference_id = SexualPreference.gender_id
JOIN Meeting_Interest ON User_Profiles.meeting_interest_id = Meeting_Interest.meeting_interest_id
JOIN Racial_Identity ON User_Profiles.racial_preference_id = Racial_Identity.racial_id
JOIN City ON User_Profiles.city_id = City.city_id
JOIN Location ON City.location_id = Location.location_id
WHERE Matching.user_master = $1
ORDER BY 
    CASE 
        WHEN Matching.date_match::date = CURRENT_DATE THEN 1 -- แมทวันนี้ แสดงบนสุด
        ELSE 2
    END,
    Matching.date_match DESC, -- แมทล่าสุดขึ้นบนเสมอ
    User_Profiles.name ASC; -- ชื่อเรียงลำดับตัวอักษร

        `;

        const [matchesResult, countResult, limitResult, detailProfileResult] = await Promise.all([
          connectionPool.query(matchQuery, [userMasterId]),
          connectionPool.query(countQuery, [userMasterId]),
          connectionPool.query(limitQuery, [userMasterId]),
          connectionPool.query(detailProfileQuery, [userMasterId]),
        ]);

        if (limitResult.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
          matches: matchesResult.rows,
          total_true: countResult.rows[0]?.total_true || 0,
          total_false: countResult.rows[0]?.total_false || 0,
          limit_info: limitResult.rows[0],
          detail_profile: detailProfileResult.rows[0],
        });
      } catch (error) {
        console.error("Error fetching match list or limit info:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else if (req.method === "DELETE") {
      try {
        const { users_to_delete } = req.body;
        if (!Array.isArray(users_to_delete) || users_to_delete.length === 0) {
          return res.status(400).json({
            error: "Invalid input: users_to_delete must be a non-empty array.",
          });
        }

        const deleteQuery = `
          DELETE FROM Matching
          WHERE user_master = $1 AND user_other = ANY($2::int[]) 
          RETURNING user_master, user_other;
        `;

        const result = await connectionPool.query(deleteQuery, [
          userMasterId,
          users_to_delete,
        ]);

        res.status(200).json({
          message: "Matches deleted successfully",
          deletedRecords: result.rows,
        });
      } catch (error) {
        console.error("Error deleting matches:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed.` });
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
