import BackBtn from "../components/Elements/BackBtn";
import Transition from "../components/Transition";
import CreatepostNote from "../components/PostComp/CreatePostComp/CreatepostNote";
import CreatepostForm from "../components/PostComp/CreatePostComp/CreatepostForm";

const CreatePost = () => {
  return (
    <div className="w-full h-full bg-darker">
      <div className="fixed z-40">
        <BackBtn type={"create"} />
      </div>
      {/* Back button */}
      {/* Main Page */}
      <div className="w-full py-20 flex justify-between gap-7 px-5">
        {/* Main side - left */}
        <div className="w-full md:w-3/4">
          <CreatepostForm />
        </div>
        {/* Note side - right */}
        <div className="w-1/4 hidden md:block">
          <CreatepostNote />
        </div>
      </div>
    </div>
  );
};

const CreatePostTransition = (props) => (
  <Transition OgComponent={CreatePost} {...props} />
);

export default CreatePostTransition;

// export default CreatePost;
