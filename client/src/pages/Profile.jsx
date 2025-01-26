import { useParams } from "react-router-dom";
import Transition from "../components/Transition";
import { motion } from "framer-motion";
import BackBtn from "../components/Elements/BackBtn";
import { useUserStore } from "../stores/useUserStore";
import { usePostStore } from "../stores/usePostStore";
import { MdOutlineLogout, MdShield } from "react-icons/md";
import { useEffect, useState } from "react";
import formatNumber from "../lib/formatNumber";
import ArrowScrollUp from "../components/Elements/ArrowScrollUp";

const Profile = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const { logout, user } = useUserStore();
  const { getAuthorPost } = usePostStore();
  const [adminHovered, setAdminHovered] = useState(false);

  // const { getAuthorPosts } = usePostStore();

  // useEffect(() => {
  //   console.log(getAuthorPosts(id));
  // }, [getAuthorPosts, id]);

  // Fetch author data
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthorPost(id);
        // console.log("profile data", data);
        setAuthor(data);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };
    if (id) {
      fetchAuthor();
    }
  }, [id, getAuthorPost]);
  // console.log("author", author);

  // console.log(getAuthorPost(id));
  // setAuthor(getAuthorPost(id));
  // console.log("author profile", author);

  return (
    <div className="bg-darker w-full flex items-center justify-center">
      {/* Back to Home button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 z-40"
      >
        <BackBtn />
      </motion.div>
      {/* Profile */}
      <motion.div
        className="w-full flex flex-col justify-center items-center gap-0 mt-8 md:mt-auto"
        initial={{ y: window.innerHeight + 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <ArrowScrollUp />
        {/* Paper cut top */}
        <img
          className="w-full"
          src="/OtherImg/PaperCutPageTop.png"
          alt="paper"
        />
        <div
          className="w-full md:mt-[-2Opx] lg:mt-[-45px]
          bg-[url(/OtherImg/NewsPaper_texture.png)] bg-center"
        >
          {/* Profile content */}
          <div>
            {/* User Info */}
            <div className="flex flex-col justify-center items-center">
              <img
                src={author?.userPic}
                alt="User pfp"
                className="rounded-full object-cover aspect-[1/1] w-1/4 md:w-1/5 lg:w-[14%] mb-4"
              />
              <div className="font-mediumPrimary text-darkest text-2xl flex justify-center items-center gap-2">
                <p>{author?.name || "Unknown"} </p>
                {/* Admin badge */}
                {author?.idAdmin && (
                  <span className="relative">
                    <MdShield
                      className="text-lg md:text-xl hover:text-dark hover:scale-110"
                      onMouseEnter={() => setAdminHovered(true)}
                      onMouseLeave={() => setAdminHovered(false)}
                    />
                    {adminHovered && (
                      <p
                        className="font-smallSemiBold text-xs bg-lightish text-darkish px-1
                      absolute origin-bottom top-[-1.5rem] left-1/2 -translate-x-1/2
                    "
                      >
                        admin
                      </p>
                    )}
                  </span>
                )}
              </div>
              <p className="font-smallMedium text-dark mb-4">
                {formatNumber(author?.totalLikes) || "0"} votes
              </p>
              {user && user._id === id && (
                <button
                  onClick={() => logout()}
                  className="flex justify-center items-center gap-3 font-bigPrimary text-lighter bg-darker hover:bg-red-800 tracking-wide py-1 px-4 text-xs md:text-sm"
                >
                  <span>
                    <MdOutlineLogout className="" />
                  </span>
                  <p>LOGOUT</p>
                </button>
              )}
            </div>
            {/* User Posts */}
            <div className="mt-14 mx-10">
              {/* Posts title */}
              <div className="flex justify-center items-center py-4 border-y border-light">
                <p className="font-bigPrimary text-2xl text-darker">
                  {id === user?._id ? "Your Posts" : `User Posts`}
                </p>
              </div>
              {/* Posts */}
              <div className="h-screen"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProfilePage = (props) => <Transition OgComponent={Profile} {...props} />;
export default ProfilePage;

// export default Profile;
