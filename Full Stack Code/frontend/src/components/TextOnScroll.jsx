import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const TextAnime = () => {
    const containerRef = useRef();
    

    useGSAP(() => {
        const quotes = containerRef.current.querySelectorAll('.quote-item');
        gsap.registerPlugin(ScrollTrigger);
        quotes.forEach((quote, index) => {
            gsap.from(quote, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 1,
                scrollTrigger: {
                    trigger: quote,
                    start: "top 80%",
                    end: "top 30%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            });
        });
    }, []);

    const quotes = [
        "Your journey, your progress, your story—start capturing it today.",
        "Reflect on yesterday, focus on today, and plan for tomorrow.",
        "Stay consistent, stay motivated, and watch your goals transform into achievements.",
        "Your life is a masterpiece—track every stroke with clarity and purpose.",
        "Self-discovery starts with a single step. Journaling helps you take the next one.",
        "Visualize your progress, reflect on your growth, and keep moving forward.",
        "Daily habits, meaningful reflections, and goal tracking—all in one place.",
        "Turn dreams into plans and plans into accomplishments.",
        "Look back to learn, act today to grow, and plan tomorrow to succeed.",
        "Stay focused, stay on track, and make your aspirations a reality."
    ];

    return (
        <div className="min-h-screen py-4" ref={containerRef}>
            {quotes.map((quote, index) => (
                <div
                    key={index}
                    className="quote-item max-w-4xl mx-auto my-32 p-8 bg-white rounded-lg shadow-lg"
                >
                    <div className="relative">
                        <div className="absolute -left-4 -top-4 text-6xl text-gray-200">"</div>
                        <p className="text-2xl md:text-3xl font-semibold text-gray-700 text-center px-8">
                            {quote}
                        </p>
                        <div className="absolute -right-4 bottom-0 text-6xl text-gray-200">"</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TextAnime;