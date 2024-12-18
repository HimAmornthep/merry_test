import { GoHeartFill } from "react-icons/go";
import {
  HiMiniMapPin,
  HiMiniChatBubbleOvalLeftEllipsis,
} from "react-icons/hi2";
import { IoMdEye } from "react-icons/io";

import { NavBar, Footer } from "@/components/NavBar";
import React, { useState } from "react";

function MerryCountBox({ count = 0, text = "Merry", twoHearts = false }) {
  return (
    <div className="flex w-[12.5rem] flex-col gap-1 rounded-2xl border-2 border-fourth-200 bg-utility-primary px-6 py-4">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-primary-500">{count}</p>
        <div className="relative flex text-primary-400">
          <div className="relative">
            {twoHearts === true ? (
              <>
                <GoHeartFill className="size-6" />
                <div className="absolute left-[18px] top-0 flex">
                  <GoHeartFill className="z-10 size-6" />
                  <GoHeartFill className="absolute right-[1px] size-6 translate-y-[0.3px] -rotate-[4deg] scale-x-[1.1] scale-y-[1.2] text-utility-primary" />
                </div>
              </>
            ) : (
              <GoHeartFill className="size-6" />
            )}
          </div>
        </div>
      </div>

      <p className="font-medium text-fourth-700">{text}</p>
    </div>
  );
}

function ProfileBox() {
  const ActionButton = ({ Icon, onClick }) => {
    return (
      <button
        className="flex size-12 items-center justify-center rounded-2xl bg-utility-primary text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105"
        onClick={onClick}
      >
        <Icon className="size-6" />
      </button>
    );
  };

  const buttonIcon = [HiMiniChatBubbleOvalLeftEllipsis, IoMdEye];

  const detailList = [
    "Sexual identities",
    "Sexual preferences",
    "Racial preferences",
    "Meeting interests",
  ];

  const profileData = ["Female", "Male", "Indefinite", "Long-term commitment"];

  const [merryToggle, setMerryToggle] = useState(true);

  return (
    <div className="flex justify-between gap-10">
      <div className="flex gap-10">
        {/* Profile picture */}
        <figure className="relative aspect-square w-[11rem] overflow-hidden rounded-3xl">
          <img
            src="/images/test1.png"
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-0 left-0 flex h-[1.5rem] w-[5.5rem] justify-end rounded-tr-xl bg-second-100 pr-2 pt-1 text-xs text-second-600">
            Merry today
          </div>
        </figure>

        <div className="flex flex-col justify-between text-fourth-900">
          {/* Profile name */}
          <div className="flex gap-5">
            <p className="text-2xl font-bold">
              Daeny <span className="text-fourth-700">24</span>
            </p>

            <div className="flex items-center gap-1 text-fourth-700">
              <HiMiniMapPin className="size-4 text-primary-200" />
              <p>Bangkok, Thailand</p>
            </div>
          </div>

          {/* Profile detail */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-3">
              {detailList.map((list, index) => (
                <p
                  key={index}
                  className="text-sm font-semibold text-fourth-900"
                >
                  {list}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {profileData.map((data, index) => (
                <p key={index} className="text-sm text-fourth-700">
                  {data}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col items-end gap-5">
        {/* Merry match/Not match */}
        <div className="flex items-center gap-1 rounded-full border-2 border-primary-500 px-4 py-[0.1rem] text-primary-500">
          {/* Two hearts icon */}
          <div className="relative w-[21.5px] text-primary-400">
            <GoHeartFill className="size-3" />
            <div className="absolute left-[10px] top-0 flex">
              <GoHeartFill className="z-10 size-3" />
              <GoHeartFill className="absolute right-[1px] size-3 translate-y-[0.3px] -rotate-[4deg] scale-x-[1.1] scale-y-[1.2] text-utility-primary" />
            </div>
          </div>
          <p className="font-extrabold">Merry Match!</p>
        </div>

        <div className="flex gap-4">
          {buttonIcon.map((Icon, index) => (
            <ActionButton key={index} Icon={Icon} onClick={() => {}} />
          ))}

          {/* Merry button */}
          <button
            className={`flex size-12 items-center justify-center rounded-2xl text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105 ${merryToggle ? "bg-primary-500 text-utility-primary" : "bg-utility-primary"}`}
            onClick={() => setMerryToggle(!merryToggle)}
          >
            <GoHeartFill className={`size-6`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MerryList() {
  return (
    <main className="flex flex-col bg-utility-bgMain">
      <NavBar />

      <section className="container mx-auto flex flex-col gap-12 p-20">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-semibold uppercase text-third-700">Merry list</p>
            <p className="text-4xl font-extrabold text-second-500">
              Let's know each other with Merry!
            </p>
          </div>

          {/* Merry count section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              <MerryCountBox count="16" text="Merry to you" />
              <MerryCountBox count="3" text="Merry match" twoHearts={true} />
            </div>

            <div className="flex flex-col">
              <p className="text-fourth-700">
                Merry limit today <span className="text-primary-400">2/20</span>
              </p>
              <p className="self-end text-sm text-fourth-600">
                Reset in 12h...
              </p>
            </div>
          </div>
        </header>

        {/* Match profile section */}
        <div className="flex flex-col gap-10">
          <ProfileBox />
          <div className="h-[1px] w-full bg-fourth-300"></div>
          <ProfileBox />
          <div className="h-[1px] w-full bg-fourth-300"></div>
          <ProfileBox />
        </div>
      </section>

      <Footer />
    </main>
  );
}
