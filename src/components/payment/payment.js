import Image from "next/image";

function PaymentPage() {
  return (
    <>
      <form className="bg-utility-bgMain lg:flex lg:justify-center lg:pb-40 lg:pt-40">
        {/* Package */}
        <div className="bg-fourth-400 lg:h-[318px] lg:w-[358px] lg:rounded-[24px]">
          <div className="containerpt pt-5">
            <div className="w-auto pl-5 pr-5">
              <div className="flex items-center justify-start gap-[12px]">
                <Image src="/Frame.svg" width={24} height={24} />
                <h1 className="ml-2 text-[20px]">Merry Membership</h1>
              </div>
              <div className="h-auto w-auto pb-5 pt-5">
                <div className="flex justify-between">
                  <h1 className="text-[16px]">Package</h1>
                  <h1 className="text-[20px] font-bold">Premium</h1>
                </div>
                <div className="pt-3 lg:pt-8">
                  <div className="h-auto min-h-[76px] flex-col rounded-[8px] bg-white pl-2 pt-4">
                    <li className="text-[16px]">
                      'Merry' more than a daily limited
                    </li>
                    <li className="text-[16px]">Up to 70 Merry per day</li>
                  </div>
                </div>
                <div className="flex justify-between pt-5 lg:pt-8">
                  <h1 className="text-[16px]">Price (Monthly)</h1>
                  <h1 className="text-[20px] font-bold">THB 149.00</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5"></div>
        {/* ฟอมของการกรอกบัตร */}

        <div className="container lg:ml-80 lg:h-[554px] lg:w-[548px] lg:rounded-[24px] lg:border-[1px]">
          <div className="flex items-center justify-between gap-[12px] bg-fourth-400 p-8 lg:rounded-t-[24px]">
            <h1 className="text text-[20px] font-bold text-[#646C80]">
              Credit Card
            </h1>
            <Image src="/Frame 427320879.svg" width={100} height={28} />
          </div>

          {/* กรอกเลขบัตร */}
          <div className="container">
            <div class="flex items-center justify-center lg:border-b-2">
              <div class="w-full max-w-xl space-y-6 rounded-md bg-white p-8">
                {/* Card number*/}
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-tex text-[18px]">
                      Card number <span class="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    class="input input-bordered w-full"
                  />
                </label>
                {/*  Card owner */}
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text text-[18px]">
                      Card owner <span class="text-red-500">*</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Type here"
                    class="input input-bordered w-full"
                  />
                </label>
                {/* Expiry date------CVC/CVV */}
                <div class="flex gap-4">
                  <label class="form-control w-1/2">
                    <div class="label">
                      <span class="label-text text-[18px]">
                        Expiry date <span class="text-red-500">*</span>
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      class="input input-bordered w-full"
                    />
                  </label>
                  <label class="form-control w-1/2">
                    <div class="label">
                      <span class="label-text text-[18px]">
                        CVC/CVV <span class="text-red-500">*</span>
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="123"
                      class="input input-bordered w-full"
                    />
                  </label>
                </div>
              </div>
            </div>
            {/* ปุ่ม button */}
            <div class="container flex justify-between bg-white px-4 pb-20 pt-5 lg:rounded-b-[24px] lg:pb-4">
              <button class="mx-auto h-auto w-auto rounded-[99px] text-[16px] text-primary-500">
                Cancel
              </button>
              <button class="mx-auto h-[48px] w-[177px] rounded-[99px] bg-primary-500 text-[16px] text-white">
                Payment Confirm
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default PaymentPage;
