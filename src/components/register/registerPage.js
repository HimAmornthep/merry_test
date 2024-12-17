// import { useState } from "react";
// import { useRouter } from "next/router";
// import { CustomButton } from "@/components/CustomUi";
// import { IoMdArrowBack } from "react-icons/io";
// import BackgroundPage from "@/components/BackgroundPage";
// import { NavBar } from "@/components/NavBar";
// import CustomSelect from "./CustomSelect.js";

// export default function RegisterPage() {
//   const router = useRouter();

//   //useState
//   // เก็บข้อมูลฟอร์มทั้งหมด
//   const [formData, setFormData] = useState({
//     name: "",
//     date: "",
//     location: "",
//     city: "",
//     username: "",
//     email: "",
//     password: "",
//     confirm: "",
//     sexualIdentities: "",
//     sexualPreferences: "",
//     racialPreferences: "",
//     meetingInterests: "",
//     hobbies: [],
//     profilePictures: [],
//   });

//   console.log("test00", formData);

//   //useState
//   // เก็บสถานะของขั้นตอน (step)
//   const [step, setStep] = useState(1);

//   // ไปหน้าถัดไป
//   const goToNextStep = (e) => {
//     e.preventDefault(); // หยุดการรีเฟรชหน้าเพจ
//     if (step < 3) {
//       setStep(step + 1);
//     } else {
//       console.log("Submitting data: ", formData);
//       // router.push("/register/complete"); // เปลี่ยนเส้นทางไปยังหน้าสำเร็จ
//     }
//   };

//   //Step Navigation Function
//   // ย้อนกลับไปหน้าก่อนหน้า
//   const goToPrevStep = (e) => {
//     e.preventDefault(); // หยุดการรีเฟรชหน้าเพจ
//     if (step > 1) {
//       setStep(step - 1);
//     }
//   };

//   //ใช้ Form Handling
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     // ถ้าค่าที่เลือกเป็นไฟล์ (กรณีไฟล์ เช่น รูปโปรไฟล์)
//     if (files) {
//       setFormData((prevData) => ({
//         ...prevData,
//         profilePictures: [...prevData.profilePictures, ...Array.from(files)], // เพิ่มไฟล์ใหม่ใน profilePictures
//       }));
//     }
//     // กรณีเป็น input ธรรมดา
//     else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value, // อัปเดตค่าของ field ที่ตรงกับ name
//       }));
//     }
//   };

//   const updateHobbies = (selectedOptions) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       hobbies: selectedOptions || [], // อัปเดต hobbies ใน formData
//     }));
//   };

//   const handleRemoveFile = (fileIndex) => {
//     setAvatars((prevData) => ({
//       ...prevData,
//       avatars: {
//         ...prevData.avatars, // รักษาค่าของ avatars เดิม
//         [fileIndex]: null, // ตั้งค่า avatars ที่ index ที่ต้องการให้เป็น null
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // คุณสามารถส่งข้อมูลฟอร์มไปที่ API และอัปโหลดรูปโปรไฟล์ไปยัง Cloudinary
//     const formDataToSend = new FormData();
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("date", formData.date);
//     formDataToSend.append("location", formData.location);
//     formDataToSend.append("city", formData.city);
//     formDataToSend.append("username", formData.username);
//     formDataToSend.append("email", formData.email);
//     formDataToSend.append("password", formData.password);
//     formDataToSend.append("confirm", formData.confirm);
//     formDataToSend.append("sexualIdentities", formData.sexualIdentities);
//     formDataToSend.append("sexualPreferences", formData.sexualPreferences);
//     formDataToSend.append("racialPreferences", formData.racialPreferences);
//     formDataToSend.append("meetingInterests", formData.meetingInterests);
//     formDataToSend.append("hobbies", JSON.stringify(formData.hobbies));

//     if (formData.profilePictures) {
//       formDataToSend.append("profilePictures", formData.profilePictures);
//     }

//     const response = await fetch("/api/register", {
//       method: "POST",
//       body: formDataToSend,
//     });

//     const result = await response.json();
//     if (result.success) {
//       // ทำอะไรกับผลลัพธ์ที่ได้รับจากการสมัคร
//       console.log("Registration successful");
//     } else {
//       console.log("Error:", result.error);
//     }
//   };

//   return (
//     <>
//       <NavBar />
//       <BackgroundPage className="flex items-center justify-center bg-utility-bgMain">
//         <div className="">
//           <div className="ml-3 lg:mt-[-300px]">
//             {" "}
//             <div className="lg:mt-32 lg:flex lg:h-[145px] lg:w-full lg:items-center lg:justify-between lg:px-8">
//               {/* Header */}
//               <div className="">
//                 <div className="lg:head lg:mr-8 lg:h-[145px] lg:w-[453px] lg:text-left">
//                   <h2 className="font-nunito text-[14px] font-semibold">
//                     Register
//                   </h2>
//                   <h1 className="font-nunito text-[32px] font-extrabold text-second-500 lg:text-[46px]">
//                     Join us and start matching
//                   </h1>
//                 </div>
//               </div>

//               {/* Step Indicator นับตัวเลยหน้าใช้.map*/}
//               <div className="mt-5 flex justify-center gap-[16px] lg:h-[80px] lg:w-[430px]">
//                 {[1, 2, 3].map((num) => (
//                   <div
//                     key={num}
//                     className={`tab relative flex h-auto w-auto items-center justify-start rounded-[8px] border-[1px] lg:tab lg:relative lg:h-[80px] lg:gap-[8px] lg:rounded-[16px] ${
//                       step === num ? "border-second-500" : "border-gray-200"
//                     } transform transition-all duration-300 ease-in-out ${
//                       step === num ? "scale-105" : "scale-100"
//                     }`}
//                   >
//                     {/* หมายเลข (1, 2, 3) อยู่ตรงกลางด้านซ้าย */}
//                     <span
//                       className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-fourth-200 text-center font-nunito text-[24px] font-bold leading-[30px] tracking-[-2%] text-second-500 lg:h-[50px] lg:w-[50px] lg:space-x-[12px] ${
//                         step === num
//                           ? "bg-fourth-200 text-second-500"
//                           : "bg-gray-200 text-gray-500"
//                       } ml-0 transition-all duration-300 ease-in-out`}
//                     >
//                       {num}
//                     </span>

//                     {/* Step และข้อความที่เกี่ยวข้องจะอยู่ทางขวา */}
//                     {step === num && (
//                       <div className="transition-all duration-300 ease-in-out lg:ml-auto">
//                         <h2 className="text-left font-nunito font-medium lg:text-[12px] lg:leading-[18px]">
//                           Step {num}/3
//                         </h2>
//                         {num === 1 && (
//                           <div className="flex w-full items-center justify-between">
//                             <h1 className="text-center font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
//                               Basic Information
//                             </h1>
//                           </div>
//                         )}
//                         {num === 2 && (
//                           // <h1 className="text-center font-nunito text-[16px] font-extrabold text-second-500 lg:text-right lg:leading-[24px]">
//                           //   Identities and Interests
//                           // </h1>

//                           <h1 className="font-nunito text-[12px] font-extrabold text-second-500 lg:text-[12px] lg:leading-[24px]">
//                             Identities and Interests
//                           </h1>
//                         )}
//                         {num === 3 && (
//                           <h1 className="font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
//                             Upload Photos
//                           </h1>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="mt-5 px-4 lg:mt-10 lg:w-full lg:max-w-4xl">
//             {step === 1 && (
//               <div className="grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
//                 <label className="form-control">
//                   <span className="label-text">Name</span>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                     placeholder="Name"
//                   />
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Date of Birth</span>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                   />
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Location</span>
//                   <select
//                     name="location"
//                     value={formData.location}
//                     onChange={(e) => handleChange(e)}
//                     className="select select-bordered h-[48px] rounded-[8px] border-[1px]"
//                   >
//                     <option disabled selected>
//                       Location
//                     </option>
//                     <option>Star Wars</option>
//                     <option>Harry Potter</option>
//                   </select>
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">City</span>
//                   <select
//                     name="city"
//                     value={formData.city}
//                     onChange={(e) => handleChange(e)}
//                     className="select select-bordered h-[48px] rounded-[8px] border-[1px]"
//                   >
//                     <option disabled selected>
//                       City
//                     </option>
//                     <option>New York</option>
//                     <option>Los Angeles</option>
//                   </select>
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Username</span>
//                   <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                     placeholder="Username"
//                   />
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Email</span>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                     placeholder="Email"
//                   />
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Password</span>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                     placeholder="Password"
//                   />
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Confirm Password</span>
//                   <input
//                     type="password"
//                     name="confirm"
//                     value={formData.confirm}
//                     onChange={(e) => handleChange(e)}
//                     className="input input-bordered h-[48px] rounded-[8px] border-[1px]"
//                     placeholder="Confirm Password"
//                   />
//                 </label>
//               </div>
//             )}
//             {step === 2 && (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                 <label className="form-control">
//                   <span className="label-text">Sexual identities </span>
//                   <select
//                     className="select select-bordered"
//                     name="sexualIdentities"
//                     value={formData.sexualIdentities}
//                     onChange={(e) => handleChange(e)}
//                   >
//                     <option disabled selected>
//                       Male
//                     </option>
//                     <option>Han Solo</option>
//                     <option>Greedo</option>
//                   </select>
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Sexual preferences</span>
//                   <select
//                     className="select select-bordered"
//                     name="sexualPreferences"
//                     value={formData.sexualPreferences}
//                     onChange={(e) => handleChange(e)}
//                   >
//                     <option disabled selected>
//                       Male
//                     </option>
//                     <option>Han Solo</option>
//                     <option>Greedo</option>
//                   </select>
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Racial preferences</span>
//                   <select
//                     className="select select-bordered"
//                     name="racialPreferences"
//                     value={formData.racialPreferences}
//                     onChange={(e) => handleChange(e)}
//                   >
//                     <option disabled selected>
//                       Male
//                     </option>
//                     <option>Han Solo</option>
//                     <option>Greedo</option>
//                   </select>
//                 </label>
//                 <label className="form-control">
//                   <span className="label-text">Meeting interests</span>
//                   <select
//                     className="select select-bordered"
//                     name="meetingInterests"
//                     value={formData.meetingInterests}
//                     onChange={(e) => handleChange(e)}
//                   >
//                     <option disabled selected>
//                       Male
//                     </option>
//                     <option>Han Solo</option>
//                     <option>Greedo</option>
//                   </select>
//                 </label>
//                 <div>
//                   <CustomSelect
//                     formData={formData.hobbies}
//                     updateHobbies={updateHobbies}
//                   />
//                 </div>
//               </div>
//             )}
//             {step === 3 && (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                 <form className="w-full max-w-4xl space-y-4 rounded-lg p-6">
//                   <h1 className="mb-4 font-nunito text-2xl text-[24px] font-bold leading-[30px] tracking-[-2%] text-second-500">
//                     Profile pictures
//                   </h1>

//                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                     <label className="form-control">
//                       <span className="label-text">
//                         Upload at least 2 photos
//                       </span>
//                     </label>
//                   </div>
//                   <div className="mx-auto flex h-auto w-full flex-wrap gap-4 rounded-lg border-gray-300 p-4 lg:w-[931px]">
//                     <div className="relative h-[120px] w-[120px] cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]">
//                       <label
//                         htmlFor="avatar" // เชื่อมโยง label กับ input
//                         className="flex h-full w-full items-center justify-center text-sm text-gray-500"
//                       >
//                         {formData.profilePictures.length === 0 ? (
//                           <span>คลิกเพื่อเลือกไฟล์</span>
//                         ) : (
//                           <span>เลือกไฟล์ใหม่</span>
//                         )}
//                         <input
//                           id="avatar"
//                           name="avatar"
//                           type="file"
//                           onChange={(e) => handleChange(e)}
//                           multiple
//                           className="absolute z-10 h-full w-full cursor-pointer opacity-0" // ซ่อน input แต่ยังคงทำงานได้
//                         />
//                       </label>
//                       <div className="absolute left-0 top-0 h-full w-full">
//                         {formData.profilePictures.map((file, index) => (
//                           <div key={index} className="relative h-full w-full">
//                             <img
//                               src={URL.createObjectURL(file)}
//                               alt={`profile-${index}`}
//                               className="h-full w-full rounded-lg object-cover" // ใช้ object-cover เพื่อให้รูปภาพเต็มกรอบ
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveFile(index)}
//                               className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
//                             >
//                               x
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {Array(4) // จำนวนกรอบเพิ่มเติม
//                       .fill()
//                       .map((_, index) => (
//                         <div
//                           key={index}
//                           className="relative h-[120px] w-[120px] rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]"
//                         >
//                           <button
//                             type="button"
//                             className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
//                           >
//                             x
//                           </button>
//                         </div>
//                       ))}
//                   </div>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer Navigation */}
//         <footer className="absolute left-1/2 top-[850px] flex h-[112px] w-full -translate-x-1/2 items-center justify-between border-t border-gray-300 bg-white lg:w-full">
//           <div className="ml-10">
//             <span>{step}/3</span> {/* ข้อความ step/3 ชิดซ้าย */}
//           </div>
//           <div className="mr-10 flex space-x-4">
//             <button
//               disabled={step === 1}
//               onClick={goToPrevStep}
//               className="flex h-[48px] w-[80px] items-center justify-center rounded-full border-2 text-primary-500"
//             >
//               <IoMdArrowBack className="mr-2" />
//               Back
//             </button>
//             <CustomButton
//               className="w-[80px]"
//               buttonType="primary"
//               onClick={goToNextStep}
//             >
//               {step < 3 ? "Next Step" : "Submit"}
//             </CustomButton>
//           </div>
//         </footer>
//       </BackgroundPage>
//     </>
//   );
// }
