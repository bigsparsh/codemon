"use client";

import { useEffect, useRef } from "react";
import { createBackground } from "../utils/createBackground";

const Page = () => {
  const coolBack = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (coolBack.current) {
      createBackground(coolBack.current);
    }
  }, []);
  return (
    <div className="min-h-screen h-full bg-grian-950 text-white space-grotesk">
      <div className="h-screen flex bg-linear-to-b from-grian-700 via-grian-700 to-grian-950">
        <section className="m-2 rounded-2xl flex flex-col grow relative bg-grian-950  overflow-clip">
          <canvas
            ref={coolBack}
            className="absolute h-full w-full top-18 left-0 z-0"
          >
            {" "}
          </canvas>
          <nav className="w-full p-5 flex justify-between bg-grian-950 rounded-t-2xl border-b border-grian-900">
            <header>Codemon</header>
            <div className="flex gap-7">
              <a href="#">About Me</a>
              <a href="#">Blogs</a>
              <a href="#">Contact Us</a>
              <a href="#">Achivements</a>
              <a href="#">Job Openings</a>
            </div>
          </nav>
          <div className="h-full w-full relative">
            <div className="grid grid-cols-2 h-full text-midnight place-items-center z-20">
              <div className="relative flex flex-col justify-center items-center mb-32">
                <h1 className="font-serif lg:text-6xl md:text-5xl leading-16 sm:text-3xl xl:text-7xl px-20 font-bold play-fair text-grian-300 p-5 rounded-xl z-10">
                  Create here and grow everywhere
                </h1>
                <p className="space-grotesk text-grian-400 text-lg z-10 w-full pl-20 pr-56">
                  A safe space for programming ethusiasts to create and learn.
                  This platfrom can be used to create and share your projects
                  with the world.
                </p>
                <button className="bg-grian-700 text-grian-950 font-semibold p-3 rounded-xl z-10 mt-5 self-start mx-20">
                  Get Started{" "}
                </button>
                <div className=" bg-linear-to-b from-grian-950/90 blur-lg z-0 via-grian-950 to-grian-950/90 w-full h-[120%] absolute top-0"></div>
              </div>
              <div
                className="bg-center bg-cover w-[700px] brightness-90 aspect-square"
                style={{
                  backgroundImage: "url('computer.svg')",
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Page;
