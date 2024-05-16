const Bullets: React.FC<{ bullet_text: string }> = ({ bullet_text }) => {
    // Function to convert bullet_text block to an array of lines
    const textToArray = (bullet_text: string): string[] => {
        return bullet_text.split('\n').map(line => line.trim());
    };

    // Function to create SVG element for text along circular path
    const createSvgElement = (line: string, key: number): string => {
        return `
             <svg key=${key} width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Define circular path -->
                    <path id="circlePath${key}" d="M 50,50 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0" fill="none" />
                </defs>
                <!-- Render circular path -->
                <path d="M 50,50 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0" fill="none" stroke="lightgray" />
                <!-- Render text along circular path -->
                <text>
                    <textPath xlink:href="#circlePath${key}">${line}</textPath>
                </text>
            </svg>
        `;
    };

    // Convert text block to array of lines
    const lines = textToArray(bullet_text);

    // Create SVG elements for each line of text
    const svgElements: string[] = lines.map((line, index) => createSvgElement(line, index));

    return svgElements.join('');
};

export default Bullets;