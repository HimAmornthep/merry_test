import connectionPool from "@/utils/db"; // ใช้ connectionPool ที่คุณกำหนดไว้

export default async function handler(req, res) {
  const { id } = req.query; // รับ ID จาก URL

  if (req.method === "GET") {
    try {
      // ตรวจสอบว่ามี id หรือไม่
      if (!id) {
        return res.status(400).json({ error: "Complaint ID is required" });
      }

      // Query ดึงข้อมูลตาม ID
      const query = `
        SELECT 
          complaint.complaint_id,
          user_profiles.name AS user_name,
          complaint.user_id,
          complaint.issue,
          complaint.description,
          complaint.submited_date,
          complaint_admin.status,
          complaint_admin.resolve_date,
          complaint_admin.canceled_date,
          complaint_admin.resolve_by_admin_id,
          complaint_admin.canceled_by_admin_id
        FROM 
          complaint
        LEFT JOIN 
          complaint_admin ON complaint.complaint_id = complaint_admin.complaint_id
        LEFT JOIN 
          user_profiles ON complaint.user_id = user_profiles.user_id
        WHERE 
          complaint.complaint_id = $1
      `;

      // ใช้ connectionPool ดึงข้อมูลจาก Database
      const result = await connectionPool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Complaint not found" });
      }

      res.status(200).json(result.rows[0]); // ส่งข้อมูล complaint
    } catch (error) {
      console.error("Error fetching complaint detail:", error.message);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  } else if (req.method === "PATCH") {
    try {
      const { status, adminId } = req.body;

      if (!status || !adminId) {
        return res
          .status(400)
          .json({ error: "Status and adminId are required" });
      }
      {
        /* 
   
      // เตรียมคำสั่ง SQL และพารามิเตอร์
      let query;
      const params = [status];

      if (status === "Resolved") {
        query = `
          UPDATE complaint_admin 
          SET status = $1, resolve_date = $2 
          WHERE complaint_id = $3
        `;
        params.push(new Date().toISOString(), id);
      } else if (status === "Cancel") {
        query = `
          UPDATE complaint_admin 
          SET status = $1, canceled_date = $2 
          WHERE complaint_id = $3
        `;
        params.push(new Date().toISOString(), id);
      } else {
        query = `
          UPDATE complaint_admin 
          SET status = $1 
          WHERE complaint_id = $2
        `;
        params.push(id);
      }

      await connectionPool.query(query, params);
*/
      }
      let query = `
      UPDATE complaint_admin 
      SET status = $1, 
    `;
      const params = [status];

      if (status === "Resolved") {
        query += `resolve_date = $2, resolve_by_admin_id = $3 WHERE complaint_id = $4`;
        params.push(new Date().toISOString(), adminId, id);
      } else if (status === "Cancel") {
        query += `canceled_date = $2, canceled_by_admin_id = $3 WHERE complaint_id = $4`;
        params.push(new Date().toISOString(), adminId, id);
      } else {
        query = `
          UPDATE complaint_admin 
          SET status = $1 
          WHERE complaint_id = $2
        `;
        params.push(id);
      }

      await connectionPool.query(query, params);

      res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating status:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"], ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
