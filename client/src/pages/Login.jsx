import { motion } from "framer-motion";
import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
// import showToast from "../components/Toast";

import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
// import { TbArrowBackUp } from "react-icons/tb";

import { Toaster } from "react-hot-toast";
import Loading from "../components/Loading";
import MarkerCircle from "../components/MarkerCircle";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loading } = useUserStore();
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordType, setPasswordType] = useState(false);
  const [hovered, setHovered] = useState(false);

  // write this cubic bezier as an array down :
  const cubicBezierVar = [1, -0.01, 0.7, 1.04];

  const handleMouseEnter = () => {
    setHovered(true); // Start the animation when the button is hovered
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handlePassShow = () => {
    setPasswordShow(!passwordShow);
    setPasswordType(!passwordType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
    // console.log(formData);
  };

  return (
    <>
      <Toaster />
      {/* Go back to home */}
      <p className="w-fit font-bigPrimary py-1 px-3 rounded-full flex justify-center items-center gap-2 border border-dark hover:border-darkest text-dark hover:text-darkest absolute top-5 left-5">
        <a href="/" className="text-sm md:text-base flex items-center gap-2">
          <HiOutlineArrowLongRight className="text-lg md:text-xl rotate-180" />
          Back
        </a>
      </p>
      <motion.div
        className="w-screen h-screen  flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="py-5 px-10 w-[450px] gap-4 h-auto flex flex-col justify-center items-center">
          <div className="w-full h-14 flex justify-center items-center relative">
            <h1
              className="font-bigThird text-5xl text-darker cursor-pointer uppercase relative z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Log In
            </h1>

            <MarkerCircle
              hovered={hovered}
              cubicBezierVar={cubicBezierVar}
              width="140px"
              height="140px"
              strokeWidth=".3"
            />
          </div>

          <div className="w-full ">
            <form
              id="formLogin"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                id="email"
                placeholder="User@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  console.log(formData);
                }}
                className="py-3 px-4 bg-transparent text-dark font-smallMedium font-medium text-base outline-none
               focus:outline-none focus:border-dark border border-darkish placeholder:text-light hover:border-dark autofill:shadow-[inset_0_0_0px_1000px_rgb(204,204,204)]"
              />

              <div
                className="relative w-full flex justify-between items-center px-4 py-3 border border-darkish
             focus-within:border-dark hover:border-dark "
              >
                <input
                  type={!passwordType ? "password" : "text"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    console.log(formData);
                  }}
                  className="bg-transparent text-dark font-smallMedium font-medium text-base outline-none 
               focus:outline-none focus:border-dark placeholder:text-light autofill:shadow-[inset_0_0_0px_1000px_rgb(204,204,204)]"
                  placeholder="••••••••"
                />
                {!passwordShow ? (
                  <VscEye
                    onClick={handlePassShow}
                    className="eye text-dark hover:text-light"
                  />
                ) : (
                  <VscEyeClosed
                    onClick={handlePassShow}
                    className="eye text-light hover:text-dark"
                  />
                )}
              </div>

              <motion.button
                className="cursor-pointer overflow-hidden w-full py-6 text-lg flex justify-center items-center relative bg-dark text-lightest font-medium font-smallSemiBold hover:bg-light hover:text-dark"
                type="submit"
                whileHover="hover"
              >
                {loading ? (
                  <Loading size="3xl" color="lightest" />
                ) : (
                  <>
                    <motion.span
                      className="absolute"
                      initial={{ x: 0 }}
                      variants={{
                        hover: {
                          x: 250,
                        },
                      }}
                      transition={{
                        duration: 0.5,
                        ease: cubicBezierVar,
                      }}
                    >
                      Log in
                    </motion.span>

                    <motion.div
                      className="text-3xl absolute"
                      initial={{ x: -250 }}
                      variants={{
                        hover: {
                          x: 0,
                        },
                      }}
                      transition={{
                        duration: 0.5,
                        ease: cubicBezierVar,
                      }}
                    >
                      <HiOutlineArrowLongRight />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </form>

            <p className=" text-dark font-mediumPrimary pt-3 flex justify-center items-center gap-2">
              <span>Don&apos;t have an account?</span>
              <a
                href="/signup"
                className="text-darkest underline hover:text-darker"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
