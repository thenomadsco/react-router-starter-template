import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { 
  ClipboardCopy, 
  FileText, 
  Signature, 
  LayoutGrid, 
  ArrowUpRight,
  Plane,
  MapIcon,
  Shield,
  Headphones,
  Compass,
  SlidersHorizontal 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export function BentoServices() {
  return (
    <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      transition: {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{
        staggerChildren: 0.1,
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={"skelenton-one" + i}
          variants={variants}
          className="flex flex-row rounded-full border border-neutral-400 p-2 items-center space-x-2 bg-neutral-400 w-full h-4"
        >
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
          <div className="h-1 w-full rounded-full bg-neutral-600" />
        </motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.2,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-col space-y-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"skelenton-two" + i}
          variants={variants}
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
          }}
          className="flex flex-row rounded-full border border-neutral-400 p-2 items-center space-x-2 bg-neutral-400 w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-[#d1d1d6] p-4 border border-neutral-300 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-600 mt-4">
          Personalized Itineraries
        </p>
        <p className="border border-red-500 bg-red-100 text-red-600 text-[10px] rounded-full px-2 py-0.5 mt-4">
          Custom
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-[#d1d1d6] p-4 border border-neutral-300 flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0" />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-600 mt-4">
          Local Experiences
        </p>
        <p className="border border-green-500 bg-green-100 text-green-600 text-[10px] rounded-full px-2 py-0.5 mt-4">
          Curated
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-[#d1d1d6] p-4 border border-neutral-300 flex flex-col items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex-shrink-0" />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-600 mt-4">
          Luxury Stays
        </p>
        <p className="border border-orange-500 bg-orange-100 text-orange-600 text-[10px] rounded-full px-2 py-0.5 mt-4">
          Verified
        </p>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    hover: {
      x: 5,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-200 p-2  items-start space-x-2 bg-[#d1d1d6]"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white/60 to-slate-400 flex-shrink-0" />
        <p className="text-xs text-neutral-700">
          "The support was incredible throughout the trip! 24/7 service truly means 24/7."
        </p>
      </motion.div>
      <motion.div
        variants={variants}
        transition={{
          duration: 0.2,
        }}
        className="flex flex-row rounded-full border border-neutral-200 p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-[#d1d1d6]"
      >
        <p className="text-xs text-neutral-700">Always here.</p>
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-white/60 to-slate-200 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Visa & Document Support",
    description: (
      <span className="text-sm">
        Hassle-free documentation and visa assistance for every destination.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1 bg-[#d4d4d8]",
    icon: <ClipboardCopy className="h-4 w-4 text-black" />,
  },
  {
    title: "End-to-End Planning",
    description: (
      <span className="text-sm">
        From itinerary creation to returning home safely, we handle it all.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1 bg-[#d4d4d8]",
    icon: <FileText className="h-4 w-4 text-black" />,
  },
  {
    title: "Premium Tour Packages",
    description: (
      <span className="text-sm">
        Curated packages focusing on luxury, comfort, and unique experiences.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <Signature className="h-4 w-4 text-black" />,
  },
  {
    title: "Flexible Itineraries & Group Travel",
    description: (
      <span className="text-sm">
        Customized plans that adapt to your pace and preferences, perfect for groups.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <LayoutGrid className="h-4 w-4 text-black" />,
  },
  {
    title: "24/7 On-Trip Assistance",
    description: (
      <span className="text-sm">
        Always just a message away whenever you need us, anywhere in the world.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <ArrowUpRight className="h-4 w-4 text-black" />,
  },
];
