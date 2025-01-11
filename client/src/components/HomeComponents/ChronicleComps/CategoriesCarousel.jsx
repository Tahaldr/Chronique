import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdArrowBackIos } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

const CategoriesCarousel = ({
  setActiveCategory,
  activeCategory,
  setSearchSubmitted,
  setSearchFinalTerm,
}) => {
  const slider = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { id: 1, name: "Popular" },
    { id: 2, name: "Technology" },
    { id: 3, name: "Sports" },
    { id: 4, name: "History" },
    { id: 5, name: "Science" },
    { id: 6, name: "Art and Design" },
    { id: 7, name: "Culture" },
    { id: 8, name: "Entertainment" },
    { id: 9, name: "Politics" },
    { id: 10, name: "Education" },
    { id: 11, name: "Health" },
    { id: 12, name: "Business" },
    { id: 13, name: "Fun and Hobbies" },
  ];

  const settings = {
    infinite: false,
    dots: false,
    arrows: false,
    speed: 300,
    slidesToShow: 5.3,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2.5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2.5,
        },
      },
    ],
    afterChange: (current) => {
      const slick = slider.current;
      const slidesToShow = slick.innerSlider.props.slidesToShow;
      const totalSlides = slick.innerSlider.props.children.length;

      const isBeginning = current === 0;
      const isEnd = current >= totalSlides - slidesToShow;

      setCanScrollLeft(!isBeginning);
      setCanScrollRight(!isEnd);
    },
  };

  // Mouse event handlers for detecting drag
  let startX = 0;
  const dragThreshold = 10;

  const handleMouseDown = (e) => {
    setIsDragging(false);
    startX = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (Math.abs(e.clientX - startX) > dragThreshold) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (category) => {
    if (!isDragging) {
      setActiveCategory(category.name);
      setSearchSubmitted(false);
      setSearchFinalTerm("");
    }
  };

  return (
    <div className="order-2 md:order-1 w-full md:w-2/3 h-1/2 md:h-14 flex items-center justify-center relative overflow-hidden font-smallMedium text-sm">
      {/* Left Arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.span
            className="w-1/12 left-8 h-full mb-[2px] z-10 absolute bg-gradient-to-r from-lighter to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.span>
        )}
        {canScrollLeft && (
          <motion.button
            onClick={() => slider?.current?.slickPrev()}
            className="flex place-items-center absolute left-4 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MdArrowBackIos className="text-dark hover:text-darkest text-base" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slider */}
      <div
        className="w-[85%] lg:w-[90%] z-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
      >
        <Slider ref={slider} {...settings}>
          {categories.map((category) => (
            <div
              key={category.id}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => handleMouseUp(category)}
              className={`${
                category.name === activeCategory
                  ? "bg-light text-black"
                  : "bg-lightish text-darkest"
              } py-1 px-2 hover:bg-light hover:text-black text-center whitespace-nowrap`}
            >
              {category.name}
            </div>
          ))}
        </Slider>
      </div>

      {/* Right Arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.span
            className="w-1/12 right-8 h-full mb-[2px] z-10 absolute bg-gradient-to-l from-lighter to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.span>
        )}
        {canScrollRight && (
          <motion.button
            onClick={() => slider?.current?.slickNext()}
            className="flex place-items-center absolute right-4 bg-transparent z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MdArrowBackIos className="rotate-180 text-dark hover:text-darkest text-base" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

CategoriesCarousel.propTypes = {
  setActiveCategory: PropTypes.func.isRequired,
  activeCategory: PropTypes.string.isRequired,
  setSearchSubmitted: PropTypes.func.isRequired,
  setSearchFinalTerm: PropTypes.func.isRequired,
};

export default CategoriesCarousel;
