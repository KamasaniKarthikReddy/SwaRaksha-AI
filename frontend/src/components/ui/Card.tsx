import React from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
    svg: React.ReactNode;
    heading: string;
    body: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ svg, heading, body, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/survey');
        }
    };

    return (
        <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] border border-purple-100/50 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(100,50,150,0.12)] hover:-translate-y-1">
            <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-2xl sm:text-[1.75rem] font-semibold text-[#181D27] tracking-tight leading-snug">
                        {heading}
                    </h2>
                    <div className="flex-shrink-0 pt-0.5">
                        {svg}
                    </div>
                </div>

                <p className="text-[#535862] text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                    {body}
                </p>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleClick}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white font-medium text-sm transition-all duration-200"
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default Card;