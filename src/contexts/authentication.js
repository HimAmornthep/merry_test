// import axios from "axios";
// import React, { useState } from "react";

// import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// import { useRouter } from "next/router";

// // import jwtDecode from "jwt-decode";

// const AuthContext = React.createContext();

// function AuthProvider(props) {
//   const [state, setState] = useState({
//     loading: null,
//     error: null,
//     user: null,
//   });

//   const router = useRouter();
//   const { push } = useRouter();

//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // ตรวจสอบการใช้งาน localStorage ในฝั่ง client
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       setIsAuthenticated(Boolean(token));
//     }
//   }, []);

//   const register = async (data) => {
//     console.log("data", data);
//     try {
//       // ส่งข้อมูลไปยังเซิร์ฟเวอร์
//       await axios.post("http://localhost:3000/api/auth/register", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       // เมื่อการสมัครสมาชิกสำเร็จ จะทำการนำทางไปที่หน้า login
//       push("/login"); // ใช้ push แทน navigate
//     } catch (error) {
//       console.error("Registration failed:", error);
//       // สามารถแสดงข้อความแสดงข้อผิดพลาดที่นี่
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ state, register, isAuthenticated }}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// }

// // this is a hook that consume AuthContext
// const useAuth = () => React.useContext(AuthContext);
// export { AuthProvider, useAuth };
