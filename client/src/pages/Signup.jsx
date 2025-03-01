import { useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";
// import showToast from "../components/Toast";

import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { HiOutlineArrowLongRight } from "react-icons/hi2";

import Loading from "../components/Loading";
import MarkerCircle from "../components/MarkerCircle";

import Transition from "../components/Transition";
import { Link } from "react-router-dom";
import BackBtn from "../components/Elements/BackBtn";

const Signup = () => {
  const [formData, setFormData] = useState({
    userPic: "",
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState("");
  const { signup, loading } = useUserStore();
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordType, setPasswordType] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  // write this cubic bezier as an array down :
  const cubicBezierVar = [1, -0.01, 0.7, 1.04];

  const handleMouseEnter = () => {
    setHovered(true); // Start the animation when the button is hovered
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const fileUploaded = e.dataTransfer.files[0];
    setImage(fileUploaded.name);

    if (fileUploaded) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, userPic: reader.result });
      };

      reader.readAsDataURL(fileUploaded);
    }
  };

  const handleImageChange = (e) => {
    const fileUploaded = e.target.files[0];
    setImage(fileUploaded.name);

    if (fileUploaded) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, userPic: reader.result });
      };

      reader.readAsDataURL(fileUploaded);
    }
  };

  const handlePassShow = () => {
    setPasswordShow(!passwordShow);
    setPasswordType(!passwordType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(formData);
    // console.log(formData);
  };

  return (
    <>
      {/* Go back to home */}
      <BackBtn />
      <motion.div
        className="w-screen h-screen  flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="py-5 px-10 w-[450px] gap-4 h-auto flex flex-col justify-center items-center">
          <div className="w-full h-14 flex justify-center items-center relative">
            <h1
              className="font-bigThird text-4xl text-darker cursor-pointer uppercase relative z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Sign Up
            </h1>
            <MarkerCircle
              hovered={hovered}
              cubicBezierVar={cubicBezierVar}
              width="150px"
              height="150px"
              strokeWidth=".3"
            />
          </div>

          <div className="w-full ">
            <form
              id="formSignup"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit}
            >
              <div
                className={`border-dashed border p-5 text-base font-medium font-smallMedium hover:border-darkest ${
                  dragActive || image ? "border-darkest" : "border-darkish"
                }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="userPic"
                  className="flex flex-col justify-center items-center cursor-pointer text-light"
                >
                  <AiOutlineCloudUpload className="text-3xl mb-2" />
                  <p className="text-dark text-center">
                    <span className="hover:text-darkest">Upload a file </span>
                    or Drag and drop
                  </p>
                  <p className="text-sm">Recommended size : 1:1</p>
                  <p className="text-sm">Max file size : 10mb</p>
                  {image ? (
                    <p className="text-darker w-[90%] text-sm mt-3 text-center">
                      {image}
                    </p>
                  ) : (
                    ""
                  )}
                </label>
                <input
                  id="userPic"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="py-3 px-4 bg-transparent text-dark font-smallMedium font-medium text-base outline-none
               focus:outline-none focus:border-dark border border-darkish placeholder:text-light hover:border-dark "
              />

              <input
                type="text"
                id="email"
                placeholder="User@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="py-3 px-4 bg-transparent text-dark font-smallMedium font-medium text-base outline-none
               focus:outline-none focus:border-dark border border-darkish placeholder:text-light hover:border-dark "
              />

              <div
                className="relative w-full flex justify-between items-center px-4 py-3 border border-darkish
             focus-within:border-dark hover:border-dark "
              >
                <input
                  type={!passwordType ? "password" : "text"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-transparent text-dark font-smallMedium font-medium text-base outline-none 
               focus:outline-none focus:border-dark placeholder:text-light"
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
                      Sign up
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
              <span>Already have an account?</span>
              <Link to="/login">
                <span className="text-darkest underline hover:text-darker">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SignupTransition = (props) => (
  <Transition OgComponent={Signup} {...props} />
);

export default SignupTransition;

// export default Signup;
