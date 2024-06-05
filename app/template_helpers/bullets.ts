import { useState } from 'react';

interface BulletsProps {
    bullets_text: string;
    icons?: string[]; // List of FontAwesome icon names
}

const Bullets: React.FC<BulletsProps> = ({ bullets_text, icons }) => {
    // Function to convert text block to an array of lines
    const textToArray = (bullets_text: string): string[] => {
        return bullets_text.split('\n').map(line => line.trim());
    };

    

    // Function to create SVG element for text along circular path with icon
    const createSvgElement = (line: string, icon: string | undefined, key: number): string => {
        const iconElement = icon ? `<div class='bullet-icon'><div class="fa-thin ${icon}"></div></div>` : '';
        return `
            <div class="bullet bullet-${key}">
                <svg key=${key} viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <!-- Define circular path -->
                        <style>
                            text {
                                fill:#d0d6d9;
                                font-size:1.3em;
                                letter-spacing:0.12em;
                            }
                        </style>

                        <path id="circlePath${key}" d="M3,70c0,37.1,30.1,67.1,67.1,67.1s67.1-30.1,67.1-67.1S107.2,2.9,70.2,2.9,3,32.9,3,70" fill="none" />
                    </defs>
                    <!-- Render circular path -->
                    <path d="M3,70c0,37.1,30.1,67.1,67.1,67.1s67.1-30.1,67.1-67.1S107.2,2.9,70.2,2.9,3,32.9,3,70" fill="none" stroke="#d0d6d9" stroke-width="2" />
                    <!-- Render text along circular path -->
                    <text>
                        <textPath xlink:href="#circlePath${key}" startOffset="20">
                            <!-- <tspan dy="-7">${line}</tspan> -->
                        </textPath>
                    </text>
                    <!-- Render FontAwesome icon -->
                    <foreignObject x="0" y="0" width="140" height="140">
                        ${iconElement}
                    </foreignObject>
                </svg>
             <div class="bullet-text">${line}</div>
          </div>
        `;
    };

    // Convert text block to array of lines
    let lines = textToArray(bullets_text);
    if (lines.length >= 5 ) {
        lines = lines.slice(0, 5); // ensure we only have 5  
    }

    // Create SVG elements for each line of text
    const svgElements: string[] = lines.map((line, index) => {
        const icon = icons && icons.length > index ? icons[index] : undefined;
        return createSvgElement(line, icon, index);
    });

    return svgElements.join('');
};

export default Bullets;