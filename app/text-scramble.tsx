"use client";

import React, { useState, useEffect } from "react";

interface TextScrambleProps {
    text: string;
    className?: string;
    delay?: number;
}

const TextScramble: React.FC<TextScrambleProps> = ({ text, className = "", delay = 0 }) => {
    const [displayText, setDisplayText] = useState("");
    const chars = "!<>-_\\/[]{}—=+*^?#________";

    useEffect(() => {
        let frame = 0;
        const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];

        // Build queue
        for (let i = 0; i < text.length; i++) {
            const from = text[i];
            const to = text[i];
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            queue.push({ from, to, start, end });
        }

        const update = () => {
            let output = "";
            let complete = 0;

            for (let i = 0; i < queue.length; i++) {
                let { from, to, start, end, char } = queue[i];

                if (frame >= end) {
                    complete++;
                    output += to;
                } else if (frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = chars[Math.floor(Math.random() * chars.length)];
                        queue[i].char = char;
                    }
                    output += `<span class="text-violet-400">${char}</span>`;
                } else {
                    output += from;
                }
            }

            setDisplayText(output);

            if (complete === queue.length) {
                return;
            }

            frame++;
            setTimeout(update, 50);
        };

        const timeout = setTimeout(() => {
            update();
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    return (
        <span
            className={className}
            dangerouslySetInnerHTML={{ __html: displayText }}
        />
    );
};

export default TextScramble;
