export const fontFamilies = {
    sans: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
    ].join(', '),
    mono: [
        'Space Mono',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
    ].join(', '),
    serif: [
        'Georgia',
        'Times New Roman',
        'serif',
    ].join(', '),
};

export const fontFamily = {
    body: fontFamilies.sans,
    heading: fontFamilies.sans,
    mono: fontFamilies.mono,
};