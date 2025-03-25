import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { usePostStore } from "../../../stores/usePostStore";
import Loading from "../../Loading";
import PropTypes from "prop-types";

const CreatepostForm = ({ postId, type }) => {
  const textareasRef = useRef([]);
  const [categorySelected, setCategorySelected] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [tag, setTag] = useState(null);
  const [post, setPost] = useState({
    title: "",
    description: "",
    category: "",
    postPic: "",
    content: "",
    tags: [],
  });
  const [postLength, setPostLength] = useState({
    title: 0,
    description: 0,
    content: 0,
  });
  const postMaxLength = {
    title: 130,
    description: 500,
    content: 10000,
  };
  const [isFocused, setIsFocused] = useState({
    title: false,
    description: false,
    content: false,
  });

  const { createPost, updatePost, getOnePost, loading } = usePostStore();

  // Get post if Update type
  useEffect(() => {
    if (type === "update" && postId !== "null") {
      // Make the useEffect async to await the result
      const fetchData = async () => {
        const data = await getOnePost(postId); // Wait for the result
        // console.log("data", data);

        // Only set state if data exists
        if (data) {
          setPost({
            title: data.title,
            description: data.description,
            category: data.category,
            postPic: data.postPic,
            content: data.content,
            tags: data.tags,
          });
        }

        // Set categorySelected to the fetched category
        setCategorySelected(data.category);
      };

      fetchData(); // Call the function to fetch data
    }
  }, [type, postId]);

  useEffect(() => {
    console.log("post", post);
  }, [post]);

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tag.trim()) {
        setPost({ ...post, tags: [...post.tags, tag.trim()] });
        setTag("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    type === "create" ? createPost(post) : updatePost(postId, post);
  };

  return (
    <div className="w-full">
      <form
        id="createpost-form"
        className="w-full flex flex-col gap-10"
        onSubmit={handleSubmit}
      >
        {/* post title */}
        <div
          className={`border-l transition-colors duration-500 ease-in-out ${
            isFocused.title ? "border-light" : "border-darkish-50"
          }`}
        >
          <textarea
            ref={(el) => (textareasRef.current[0] = el)}
            type="text"
            placeholder="Title"
            className="w-full py-2 pl-10 text-6xl bg-transparent text-lightest placeholder-text-darkish font-bigThird
                resize-none overflow-hidden outline-none
              "
            rows={1}
            maxLength={postMaxLength.title}
            value={post.title}
            onChange={(e) => {
              setPost({ ...post, title: e.target.value });
              setPostLength({ ...postLength, title: e.target.value.length });
            }}
            onInput={handleInput}
            onFocus={() => setIsFocused({ ...isFocused, title: true })}
            onBlur={() => setIsFocused({ ...isFocused, title: false })}
          />
          <div className="flex justify-end pl-10 pt-2">
            <p className="font-smallMedium text-light">
              {postLength.title}/{postMaxLength.title}
            </p>
          </div>
        </div>

        {/* post description */}
        <div
          className={`border-l transition-colors duration-500 ease-in-out ${
            isFocused.description ? "border-light" : "border-darkish-50"
          }`}
        >
          <textarea
            ref={(el) => (textareasRef.current[1] = el)}
            type="text"
            placeholder="Description"
            className="w-full py-2 pl-10 text-3xl bg-transparent text-lightest placeholder-text-darkish font-smallMedium placeholder:font-bigThird
               resize-none overflow-hidden outline-none"
            rows={1}
            maxLength={postMaxLength.description}
            value={post.description}
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
              setPostLength({
                ...postLength,
                description: e.target.value.length,
              });
            }}
            onInput={handleInput}
            onFocus={() => setIsFocused({ ...isFocused, description: true })}
            onBlur={() => setIsFocused({ ...isFocused, description: false })}
          />
          <div className="flex justify-end pl-10 pt-2">
            <p className="font-smallMedium text-light">
              {postLength.description}/{postMaxLength.description}
            </p>
          </div>
        </div>

        {/* post category */}
        <div className="w-full flex flex-col gap-5">
          <h5 className=" text-3xl text-lighter font-bigThird">Category</h5>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                htmlFor={category.name}
                className={`flex items-center justify-center gap-3 cursor-pointer py-2 px-5 font-smallMedium
                      transition-colors duration-500 ease-in-out ${
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

        {/* Post Image Upload */}
        <div
          className={`w-full aspect-[8/5] bg-dark flex justify-center items-center relative ${
            imageSelected || dragActive
              ? "border border-lighter border-opacity-100"
              : "border border-light border-opacity-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Label & Input */}
          <label
            htmlFor="postPic"
            className="w-full h-full cursor-pointer text-lightish font-smallMedium z-10 relative"
          >
            {post.postPic === "" && (
              <div className="flex flex-col justify-center w-full h-full items-center gap-2">
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
              </div>
            )}
          </label>

          {/* Image Preview - Keep it Clickable */}
          {post.postPic !== "" && (
            <div className="w-full h-full absolute">
              <img
                src={post.postPic}
                className="w-full h-full object-cover z-0"
                alt=""
              />
              <button
                className="absolute top-3 right-3 z-20 bg-dark bg-opacity-70 text-lightest px-2 py-2 rounded-full
                     hover:bg-opacity-100 transition-colors duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setPost({ ...post, postPic: "" });
                  setImageSelected(null);
                }}
              >
                <RxCross2 className="text-2xl" />
              </button>
            </div>
          )}

          {/* File Input */}
          <input
            id="postPic"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Post Content */}
        <div
          className={`border-l transition-colors duration-500 ease-in-out ${
            isFocused.content ? "border-light" : "border-darkish-50"
          }`}
        >
          <textarea
            ref={(el) => (textareasRef.current[2] = el)}
            type="text"
            placeholder="Content"
            className="w-full py-2 pl-10 text-xl bg-transparent text-lightest placeholder-text-darkish font-smallMedium placeholder:font-bigThird
                placeholder:text-2xl resize-none overflow-hidden outline-none"
            rows={5}
            maxLength={postMaxLength.content}
            value={post.content}
            onChange={(e) => {
              setPost({ ...post, content: e.target.value });
              setPostLength({ ...postLength, content: e.target.value.length });
            }}
            onInput={handleInput}
            onFocus={() => setIsFocused({ ...isFocused, content: true })}
            onBlur={() => setIsFocused({ ...isFocused, content: false })}
          />
          <div className="flex justify-end pl-10 pt-2">
            <p className="font-smallMedium text-light">
              {postLength.content} / {postMaxLength.content}
            </p>
          </div>
        </div>

        {/* Post Tags */}
        <div className="flex flex-wrap gap-3">
          {Array.isArray(post.tags) &&
            post.tags.map((tag, index) => (
              // Tags
              <div
                key={index}
                className="flex items-center gap-2 border border-lighter border-opacity-40 px-5 py-2 text-lighter
              hover:text-lightest hover:border-opacity-100 transition-colors duration-500 ease-in-out"
              >
                <p className="font-smallMedium">{tag}</p>
                <RxCross2
                  className="text-xl cursor-pointer"
                  onClick={() => {
                    setPost({
                      ...post,
                      tags: post.tags.filter((_, i) => i !== index),
                    });
                  }}
                />
              </div>
            ))}
          {/* Tag input */}
          <input
            type="text"
            placeholder={`${
              Array.isArray(post.tags) && post.tags.length > 0
                ? "Add new tag"
                : "Add a tag"
            }`}
            className="py-2 px-10 text-xl bg-transparent text-lightest placeholder-text-darkish font-smallMedium placeholder:font-bigThird
                placeholder:text-2xl border-l border-darkish-50 resize-none outline-none focus:border-light
                transition-colors duration-500 ease-in-out
              "
            value={tag || ""}
            onChange={(e) => {
              setTag(e.target.value);
            }}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Submit button */}
        <button
          className={`w-full text-2xl mt-5 bg-lightest hover:bg-lighter text-dark hover:text-darkest font-bigPrimary
        transition-colors duration-300 ease-in-out flex items-center justify-center ${
          loading ? "py-6" : "py-2"
        }`}
          type="submit"
        >
          {loading ? (
            <Loading size="3xl" color="dark" />
          ) : (
            <span>
              {type === "update" && postId !== "null" ? "Edit" : "Publish"}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

CreatepostForm.propTypes = {
  postId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CreatepostForm;
