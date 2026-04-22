import { TModulRes } from "@/api/user/modul/type";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CardModuleProps {
  modul: TModulRes;
  index: number;
}

const CardModule: React.FC<CardModuleProps> = ({ modul, index }) => {
  const navigate = useNavigate();

  const goDetail = () => {
    navigate(`/module/${modul._id}`);
  };

  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      onClick={goDetail}
      whileHover={{
        y: -6,
        boxShadow: "0px 24px 48px -8px rgba(0,0,0,0.12)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative w-full flex flex-col p-6 rounded-[20px] bg-white border border-[#EBEBEB] hover:border-transparent hover:cursor-pointer overflow-hidden min-h-[200px]"
    >
      {/* Gradient top bar — reveals on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[20px]" />

      {/* Decorative ordinal number */}
      <span className="absolute top-3 right-5 text-[56px] font-extrabold text-[#F3F3F3] font-secondary leading-none select-none pointer-events-none">
        {ordinal}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shrink-0">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 7H16V6C16 4.93913 15.5786 3.92172 14.8284 3.17157C14.0783 2.42143 13.0609 2 12 2C10.9391 2 9.92172 2.42143 9.17157 3.17157C8.42143 3.92172 8 4.93913 8 6V7H5C4.73478 7 4.48043 7.10536 4.29289 7.29289C4.10536 7.48043 4 7.73478 4 8V19C4 19.7956 4.31607 20.5587 4.87868 21.1213C5.44129 21.6839 6.20435 22 7 22H17C17.7956 22 18.5587 21.6839 19.1213 21.1213C19.6839 20.5587 20 19.7956 20 19V8C20 7.73478 19.8946 7.48043 19.7071 7.29289C19.5196 7.10536 19.2652 7 19 7ZM10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6V7H10V6ZM18 19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H7C6.73478 20 6.48043 19.8946 6.29289 19.7071C6.10536 19.5196 6 19.2652 6 19V9H8V10C8 10.2652 8.10536 10.5196 8.29289 10.7071C8.48043 10.8946 8.73478 11 9 11C9.26522 11 9.51957 10.8946 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V9H14V10C14 10.2652 14.1054 10.5196 14.2929 10.7071C14.4804 10.8946 14.7348 11 15 11C15.2652 11 15.5196 10.8946 15.7071 10.7071C15.8946 10.5196 16 10.2652 16 10V9H18V19Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 z-10 relative flex flex-col gap-1.5">
        <p className="text-[#0F0F0F] font-secondary font-bold text-[18px] leading-[1.35]">
          {modul.name}
        </p>
        {modul.description && (
          <p className="text-[#939393] font-secondary font-normal text-[13px] leading-[1.6] line-clamp-2">
            {modul.description}
          </p>
        )}
      </div>

      {/* Footer — arrow animates on hover */}
      <div className="mt-5 flex items-center gap-1.5 z-10 relative">
        <span className="text-[13px] font-secondary font-semibold text-blue-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          Explore
        </span>
        <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </motion.div>
  );
};

export default CardModule;
