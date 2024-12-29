import { useRef, useState } from "react";
import HomeBody from "../components/HomeComponents/HomeBody";
import HomeHeader from "../components/HomeComponents/HomeHeader";
import HomeNav from "../components/HomeComponents/HomeNav";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const Home = () => {
  const ref = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("chronicle");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const navY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (previous > latest && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <div className="w-full h-screen">
        <div
          className="w-full p-4 mb-[150px] md:mb-[100px] overflow-hidden relative grid place-items-center"
          ref={ref}
        >
          <HomeHeader navY={navY} />
        </div>

        <div className="w-full">
          <HomeNav hidden={hidden} setActive={setActive} />
          <HomeBody active={active} />
        </div>
      </div>
    </>
  );
};

export default Home;
