import { designSystem } from './index';

export const generateCssVariables = () => {
    let cssVariables = ':root {\n';

    // Colors
    Object.entries(designSystem.colors).forEach(([colorName, colorValues]) => {
        if (typeof colorValues === 'object') {
            Object.entries(colorValues).forEach(([shade, value]) => {
                cssVariables += `  --color-${colorName}-${shade}: ${value};\n`;
            });
        } else {
            cssVariables += `  --color-${colorName}: ${colorValues};\n`;
        }
    });

    // Font families
    Object.entries(designSystem.typography.fontFamily).forEach(([name, value]) => {
        cssVariables += `  --font-${name}: ${value};\n`;
    });

    // Font sizes
    Object.entries(designSystem.typography.fontSizes).forEach(([name, value]) => {
        cssVariables += `  --text-${name}: ${value};\n`;
    });

    // Spacing
    Object.entries(designSystem.spacing).forEach(([name, value]) => {
        cssVariables += `  --spacing-${name}: ${value};\n`;
    });

    // Shadows
    Object.entries(designSystem.shadows).forEach(([name, value]) => {
        cssVariables += `  --shadow-${name}: ${value};\n`;
    });

    cssVariables += '}';

    return cssVariables;
};