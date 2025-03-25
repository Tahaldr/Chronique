import BackBtn from "../components/Elements/BackBtn";
import Transition from "../components/Transition";
import CreatepostNote from "../components/PostComp/CreatePostComp/CreatepostNote";
import CreatepostForm from "../components/PostComp/CreatePostComp/CreatepostForm";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CreatePost = () => {
  const [type, setType] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    setType(postId !== "null" ? "update" : "create");
  }, [postId]);

  return (
    <>
      <div className="w-full h-full bg-darker">
        <motion.div
          key="create-post-motion" // Ensure it re-renders properly
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1, duration: 0.5, ease: "easeInOut" },
          }}
        >
          {/* Back button */}
          <div className="fixed z-40">
            <BackBtn type={"create"} />
          </div>
          {/* Main Page */}
          <div className="w-full py-20 flex justify-between gap-7 px-5">
            {/* Main side - left */}
            <div className="w-full md:w-3/4">
              <CreatepostForm postId={postId} type={type} />
            </div>
            {/* Note side - right */}
            <div className="w-1/4 hidden md:block">
              <CreatepostNote />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const CreatePostTransition = (props) => (
  <Transition OgComponent={CreatePost} {...props} />
);

export default CreatePostTransition;

// export default CreatePost;
