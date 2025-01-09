import Image from "next/image";

function PaymentSuccess() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center">
        {/* Header */}
        <div className="container lg:ml-[450px]">
          <div className="container flex flex-col items-center justify-center gap-4 pt-5 lg:h-[393px] lg:w-[541px]">
            <div className="ml-5">
              <Image src="/success.svg" alt="Success" width={80} height={80} />
              <h2 className="text-[14px] text-third-700">PAYMENT SUCCESS</h2>
              <h1 className="justify-center text-[35px] font-bold leading-[40px] tracking-[-1%] text-second-500">
                Welcom Merry Membership! Thank you for joining us
              </h1>
            </div>
          </div>

          {/* Package Card */}
          <div className="container lg:ml-96 lg:mt-[-350px] lg:w-auto">
            <div className="container flex justify-center pt-5">
              <div className="h-auto min-h-[382px] w-auto min-w-[220px] justify-center rounded-[24px] border-[1px] bg-bg-card p-[16px]">
                <div className="h-[60px] w-[60px]">
                  <img src="/icon.svg" />
                </div>
                <div className="gap-7 pt-3">
                  <h1 className="text-[32px] text-white">Premium</h1>
                  <div className="flex">
                    <h2 className="text-[20px] text-second-100">THB 149.00</h2>
                    <h3 className="text-[20px] text-second-100">/Month</h3>
                  </div>
                </div>

                {/* Detail PackageCard */}
                <div className="border-b border-b-white">
                  <div className="grid gap-4">
                    <div className="space-y-4 pb-10 pt-5">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/checkbox-circle-fill.svg"
                          alt="checkbox-circle-fill.svg"
                          width={24}
                          height={24}
                        />
                        <h1 className="text-second-100">
                          ‘Merry’ more than a daily limited{" "}
                        </h1>
                      </div>
                      <div className="flex items-center gap-4">
                        <Image
                          src="/checkbox-circle-fill.svg"
                          alt="checkbox-circle-fill.svg"
                          width={24}
                          height={24}
                        />
                        <h1 className="text-second-100">
                          Up to 50 Merry per day
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                {/* footer PackageCard */}
                <div>
                  <div className="flex w-full justify-between pt-5">
                    <h1 className="text-second-200">Start Membership</h1>
                    <h1 className="text-white">01/04/2022</h1>
                  </div>
                  <div className="flex w-full justify-between pt-5">
                    <h1 className="text-second-200">Next billing</h1>
                    <h1 className="text-white">01/05/2022</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:mr- container flex justify-center gap-2 pb-10 pt-10 lg:mt-[-150px] lg:w-[364px] lg:items-center lg:pb-40 lg:pt-10">
            <button className="h-auto w-auto gap-[8px] rounded-[99px] bg-red-100 pb-[12px] pl-[24px] pr-[24px] pt-[12px] text-red-600">
              Back to home
            </button>
            <button className="h-auto w-auto gap-[8px] rounded-[99px] bg-red-500 pb-[12px] pl-[24px] pr-[24px] pt-[12px] text-utility-primary">
              Check Membership
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
