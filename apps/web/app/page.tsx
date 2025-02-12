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
        <section className="m-2 rounded-2xl flex flex-col grow relative bg-grian-950 ">
          <canvas
            ref={coolBack}
            className="absolute h-full w-full top-0 left-0 z-0"
          >
            {" "}
          </canvas>
          <nav className="w-full p-5 flex justify-between bg-grian-950/90 backdrop-blur-sm rounded-2xl border-b border-grian-900 z-10">
            <header>Codemon</header>
            <div className="hidden gap-7 md:flex">
              <a href="#">About Me</a>
              <a href="#">Blogs</a>
              <a href="#">Contact Us</a>
              <a href="#">Achivements</a>
              <a href="#">Job Openings</a>
            </div>
          </nav>
          <div className="h-full w-full relative">
            <div className="flex h-full md:flex-row flex-col z-20">
              <div className="relative md:basis-2/3 flex flex-col mt-20 md:mt-0 md:justify-center items-center mb-32 h-fit self-center">
                <h1 className="font-serif lg:text-6xl md:text-5xl leading-12 md:leading-16 text-5xl xl:text-7xl md:px-20 px-10 font-bold play-fair text-grian-300 p-5 rounded-xl z-10">
                  Create here and grow everywhere
                </h1>
                <p className="space-grotesk text-sm md:text-base lg:text-lg text-grian-400 z-10 w-full pl-10 md:pl-20 md:pr-56 pr-10">
                  A safe space for programming ethusiasts to create and learn.
                  This platfrom can be used to create and share your projects
                  with the world.
                </p>
                <button className="bg-grian-700 text-grian-950 font-semibold p-2 md:p-3 rounded-xl z-10 mt-5 self-start mx-10 md:mx-20">
                  Get Started{" "}
                </button>
                <div className=" bg-linear-to-b blur-sm from-grian-950/90 rounded-3xl z-0 via-grian-950 to-grian-950/90 w-full h-[120%] absolute top-0"></div>
              </div>
              <div
                className="bg-center bg-contain bg-no-repeat grow h-full md:basis-1/3 brightness-90 "
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
