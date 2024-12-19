import { NavBar, Footer } from "@/components/NavBar";
// import PaymentSuccess from "@/components/payment/paymentsuccess";
import PaymentPage from "@/components/payment/payment";

export default function Homepage() {
  return (
    <>
      <NavBar />
      <PaymentPage/>
      {/* <PaymentSuccess /> */}
      <Footer />
    </>
  );
}
