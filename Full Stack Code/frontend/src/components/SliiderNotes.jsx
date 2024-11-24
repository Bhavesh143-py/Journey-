import React, { useRef } from "react";

const SlidingLogos = () => {
    const logos = useRef(null);
    const logos_slide = useRef(null);

    const Card = ({ imgSrc, title, description, tagline }) => (
        <span className="group inline-flex flex-shrink-0 w-[450px] mx-4 h-[200px] items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden transition-all duration-300 ease-in-out hover:w-[500px] hover:h-[260px] relative hover:scale-105 hover:z-10">
            <img
                className="object-cover h-[200px] w-[160px] rounded-s-lg transition-all duration-300 group-hover:h-[260px] group-hover:w-[200px]"
                src={imgSrc}
                alt=""
            />
            <div className="flex flex-col justify-between p-4 w-[calc(100%-160px)] h-full group-hover:w-[calc(100%-200px)] transition-all duration-300">
                <div className="flex flex-col h-[140px] group-hover:h-[200px]">
                    <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-xl transition-all duration-300">
                        {title}
                    </h5>
                    <div className="relative flex-grow overflow-hidden">
                        <p className="text-sm font-normal text-gray-700 dark:text-gray-400 break-words whitespace-normal group-hover:text-base transition-all duration-300">
                            {description}
                        </p>
                    </div>
                </div>
                <p className="italic text-sm text-gray-400 group-hover:text-base transition-all duration-300">{tagline}</p>
            </div>
        </span>
    );

    const cards = [
        {
            imgSrc: "/src/assets/texteditor.png",
            title: " Journal Your Journey",
            description: "Your journal is more than just a diary—it's your personal growth space. With our intuitive editor, you can record daily highlights, assess productivity, and track satisfaction rates. Our thoughtfully designed interface makes reflection a natural part of your day.",
            tagline: "Write. Reflect. Evolve."
        },
        {
            imgSrc: "/src/assets/trackprev.png",
            title: " Revisit and Reflect",
            description: "Every step counts! Explore your previous journal entries effortlessly.Relive your achievements, understand your patterns, and build a deeper connection with your personal growth journey.",
            tagline: "Learn from the past to shape your future."
        },

        {
            imgSrc: "/src/assets/goalss.png",
            title: "Track Goals with Heatmap",
            description: "Stay motivated by tracking your progress visually! The heatmap highlights your consistency over time, giving you a clear picture of your journey. Watch your progress unfold day by day, and celebrate your dedication to personal growth.",
            tagline: "Keep moving forward, one day at a time."
        },
        {
            imgSrc: "/src/assets/tasktable.png",
            title: "Build Powerful Habits",
            description: "Our Daily Actions feature helps you focus on what truly matters. Set your priorities for the day, check them off as you go, and stay consistent. Every small step counts, and we’re here to keep you on track.",
            tagline: "Plan your day, conquer your goals."
        },
    ];

    return (
        <div className="relative">
            <style>
                {`
                @keyframes slide {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }
                .animate-slide {
                    animation: slide 35s linear infinite;
                }
                .animate-slide:hover {
                    animation-play-state: paused;
                }
                `}
            </style>
            <div
                ref={logos}
                className="overflow-hidden relative bg-white py-8 dark:bg-gray-900"
                style={{ whiteSpace: "nowrap" }}
            >
                <div
                    ref={logos_slide}
                    className="inline-block animate-slide"
                >
                    {/* First set of cards */}
                    {cards.map((card, index) => (
                        <Card key={`card-1-${index}`} {...card} />
                    ))}

                    {/* Duplicate set of cards for seamless loop */}
                    {cards.map((card, index) => (
                        <Card key={`card-2-${index}`} {...card} />
                    ))}
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent"></div>

            </div>
        </div>
    );
};

export default SlidingLogos;