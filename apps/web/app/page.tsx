"use client";

import { useEffect, useRef } from "react";
import { createBackground } from "../utils/createBackground";

// <div className="h-screen flex bg-conic-180 from-grian-950 via-grian-700 to-grian-950">
const Page = () => {
  const coolBack = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (coolBack.current) {
      createBackground(coolBack.current);
    }
  }, []);
  return (
    <div className="min-h-screen h-full bg-grian-950 text-white space-grotesk">
      <div className="h-screen flex bg-grian-800">
        <section className="m-2 rounded-2xl flex flex-col grow relative  overflow-clip">
          <canvas
            ref={coolBack}
            className="absolute h-full w-full top-10 left-0 z-0"
          >
            {" "}
          </canvas>
          <nav className="w-full p-5 flex justify-between bg-grian-950 rounded-t-2xl">
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
              <h1 className="font-serif text-7xl px-20 font-bold play-fair">
                Create here and grow everywhere
              </h1>
              <div
                className="bg-center bg-cover aspect-square h-96 bg-grian-600/30 bg-blend-darken rounded-l-2xl"
                style={{
                  backgroundImage: "url('https://picsum.photos/1920/1080')",
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
