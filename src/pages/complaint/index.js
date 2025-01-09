import { Footer, NavBar } from "@/components/NavBar";
import { useState } from "react";
import { CustomButton, CardImage } from "@/components/CustomUi";
import axios from "axios";
import ShowAlertAndOpenModal from "@/components/Alertbox"; // ปรับ path ให้ตรง

export default function Complaint() {
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [modalMessage, setModalMessage] = useState(""); // เพิ่ม state สำหรับข้อความใน modal
  const [modalNotice, setModalNotice] = useState(""); // เพิ่ม state สำหรับ notice
  const [isModalOpen, setIsModalOpen] = useState(false); // ใช้ state ควบคุมการเปิด modal

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลที่กรอก
    if (!issue || !description) {
      setModalNotice("Missing Information");
      setModalMessage("Please fill in all required fields so we can assist you better.");
      setIsModalOpen(true); // เปิด modal เมื่อกรอกข้อมูลไม่ครบ
      return; // ไม่ให้ส่งข้อมูลเมื่อกรอกไม่ครบ
    }

    const complaintData = { issue, description };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setModalNotice("Error");
        setModalMessage("Please log in first!");
        setIsModalOpen(true); // เปิด modal เมื่อไม่พบ token
        return;
      }

      const res = await axios.post("/api/complaint", complaintData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        setModalNotice("Success!");
        setModalMessage("Complaint submitted. We’ll review it soon");
        setIsModalOpen(true); // เปิด modal เมื่อส่งข้อมูลสำเร็จ
        setIssue("");
        setDescription("");
      } else {
        const errorMessage = res.data?.error || "Unexpected error";
        setModalNotice("Error");
        setModalMessage(`Error: ${errorMessage}`);
        setIsModalOpen(true); // เปิด modal เมื่อเกิดข้อผิดพลาด
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setModalNotice("Error");
      setModalMessage(`${errorMessage}`);
      setIsModalOpen(true); // เปิด modal เมื่อเกิดข้อผิดพลาดจากการเชื่อมต่อ
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen gap-32 bg-utility-primary pt-10 lg:flex lg:flex-row lg:items-center lg:justify-center lg:pb-48">
        <figure className="flex items-center justify-center lg:order-2 lg:px-12">
          <CardImage className="h-[25rem] w-[15rem] lg:h-[40rem] lg:w-[25rem]">
            <img
              src="/images/login_page_man.jpg"
              alt="Man smiling while using laptop"
              className="h-full w-full object-cover object-right grayscale"
            />
          </CardImage>
        </figure>

        <div className="w-full max-w-md rounded-lg bg-white p-6 lg:order-1">
          <h3 className="mb-1 text-sm font-medium uppercase text-third-700">
            Complaint
          </h3>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-second-500">
            If you have any trouble <br /> Don&apos;t be afraid to tell us!
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="issue"
                className="mb-2 block font-medium text-gray-700"
              >
                Issue
              </label>
              <input
                type="text"
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please enter the subject of your issue"
                className="w-full rounded-lg border-2 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="mb-2 block font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share more information about the issue"
                rows="5"
                className="w-full resize-none rounded-lg border-2 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            <CustomButton type="submit" buttonType="primary" className="w-full lg:w-24 ">
              Submit
            </CustomButton>
          </form>
        </div>
      </div>

      <Footer />

      {/* เรียกใช้งาน ShowAlertAndOpenModal */}
      <ShowAlertAndOpenModal
        modalId="modal_complaint"
        notice={modalNotice}
        message={modalMessage}
        isOpen={isModalOpen} // ส่ง state isModalOpen เพื่อควบคุมการเปิด modal
        closeModal={() => setIsModalOpen(false)} // ฟังก์ชันปิด modal
      />
    </>
  );
}
