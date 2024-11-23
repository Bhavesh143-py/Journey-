import { useState, useRef, useEffect } from "react";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

const NamePlate =()=>{
    const [header, setHeader] = useState("Journey");
    const headerref = useRef();
    gsap.registerPlugin(useGSAP);
    useGSAP(() => {
        const heads = headerref.current.querySelectorAll("span");
        gsap.registerPlugin(ScrollTrigger);
            gsap.from(heads, {
                y: -200,
                opacity: 0.5,
                duration: 0.8,
                delay: 1,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: heads,
                    start: "top 80%",
                    end: "top 30%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            });
        
    },[]);
    function BreakTheText({ prop }) {
        return (
            <div>
                {prop.split("").map((char, index) => (
                    <span id="parts" className="inline-block" key={index}>{char}</span>
                ))}
            </div>
        );
    }
    return(
        <div>
            <h1 ref={headerref} className="mb-6 font-extrabold text-10xl text-center py-6">
                <BreakTheText prop={header} />
            </h1>
        </div>
    )
}
export default NamePlate;