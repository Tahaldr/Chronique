import { useEffect, useRef, useState } from "react";
import BackBtn from "../components/Elements/BackBtn";
import Transition from "../components/Transition";
import { AiOutlineCloudUpload } from "react-icons/ai";

const CreatePost = () => {
  const textareasRef = useRef([]);
  const [categorySelected, setCategorySelected] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [post, setPost] = useState({
    title: "",
    description: "",
    category: "",
    postPic: "",
    content: "",
    tags: [],
  });

  // Categories
  const categories = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Sports" },
    { id: 3, name: "History" },
    { id: 4, name: "Science" },
    { id: 5, name: "Art and Design" },
    { id: 6, name: "Culture" },
    { id: 7, name: "Entertainment" },
    { id: 8, name: "Politics" },
    { id: 9, name: "Education" },
    { id: 10, name: "Health" },
    { id: 11, name: "Business" },
    { id: 12, name: "Fun and Hobbies" },
  ];

  // Auto expand textarea
  useEffect(() => {
    textareasRef.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, []);

  // Auto expand textarea
  const handleInput = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Expand dynamically
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
    setImageSelected(fileUploaded.name);

    if (fileUploaded) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPost({ ...post, postPic: reader.result });
      };

      reader.readAsDataURL(fileUploaded);
    }
  };

  const handleImageChange = (e) => {
    const fileUploaded = e.target.files[0];
    setImageSelected(fileUploaded.name);

    if (fileUploaded) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPost({ ...post, postPic: reader.result });
      };

      reader.readAsDataURL(fileUploaded);
    }
  };

  return (
    <div className="w-screen h-full bg-darker">
      {/* Back button */}
      <div className="fixed z-40">
        <BackBtn type={"create"} />
      </div>
      {/* Main Page */}
      <div className="w-full relative top-20 flex justify-between gap-7 px-5">
        {/* Main side - left */}
        <div className="w-full md:w-3/4">
          <form id="createpost-form" className="w-full flex flex-col gap-7">
            {/* post title */}
            <textarea
              ref={(el) => (textareasRef.current[0] = el)}
              type="text"
              placeholder="Title"
              className="w-full py-2 px-10 text-6xl bg-transparent text-lightest placeholder-text-darkish font-bigThird
                border-l border-darkish-50 resize-none overflow-hidden outline-none
              "
              rows={1}
              value={post.title}
              onChange={(e) => {
                setPost({ ...post, title: e.target.value });
              }}
              onInput={handleInput}
            />

            {/* post description */}
            <textarea
              ref={(el) => (textareasRef.current[1] = el)}
              type="text"
              placeholder="Description"
              className="w-full py-2 px-10 text-4xl bg-transparent text-lightest placeholder-text-darkish font-bigThird
                border-l border-darkish-50 resize-none overflow-hidden outline-none
              "
              rows={1}
              value={post.description}
              onChange={(e) => {
                setPost({ ...post, description: e.target.value });
              }}
              onInput={handleInput}
            />

            {/* post category */}
            <div className="w-full flex flex-col gap-5">
              <h5 className=" text-3xl text-lighter font-bigThird">Category</h5>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    htmlFor={category.name}
                    className={`flex items-center justify-center gap-3 cursor-pointer py-2 px-5 font-smallMedium
                      transition-colors duration-300 ease-in-out ${
                        categorySelected === category.name
                          ? "text-lighter border border-lighter"
                          : "text-darkish border border-darkish"
                      }`}
                  >
                    <input
                      type="radio"
                      id={category.name}
                      checked={categorySelected === category.name}
                      className="hidden"
                      value={category.name}
                      onChange={() => {
                        setCategorySelected(category.name);
                        setPost({ ...post, category: category.name });
                      }}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* post image */}
            <div
              className={`w-full aspect-[8/5] bg-dark flex justify-center items-center ${
                imageSelected || dragActive
                  ? "border border-lighter border-opacity-100"
                  : "border border-light border-opacity-50"
              }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor="postPic"
                className="flex flex-col justify-center w-full items-center gap-2 cursor-pointer text-lightish font-smallMedium"
              >
                <div className="flex justify-center items-center gap-2 text-darkish">
                  <AiOutlineCloudUpload className="text-2xl" />
                  <p className="text-center">
                    <span className="hover:text-lighter">Upload a file </span>
                    or Drag and drop
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p>Recommended size : 1:1</p>
                  <p>Max file size : 10mb</p>
                </div>
                {imageSelected ? (
                  <p className="text-lightest w-[90%] mt-3 text-center">
                    {imageSelected}
                  </p>
                ) : (
                  ""
                )}
              </label>
              <input
                id="postPic"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </form>
        </div>
        {/* Note side - right */}
        <div className="w-1/4 hidden md:block">
          <div className="w-full flex flex-col gap-5 py-7 p-5 border border-lighter border-opacity-50 text-lighter">
            <h6 className="font-mediumPrimary text-lg">Advice</h6>
            <p className="font-mediumSecondary leading-tight">
              Write as they did in the old days— bold, clear, and rich with
              meaning. Let your words carry weight, your sentences flow with
              grace, and your story stand the test of time. This is not just a
              post; it is a chronicle. Make it worthy.
            </p>
          </div>
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
