/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,vue}"],
    theme: {
        extend: {
            minHeight: {
                "10vh": "10vh",
                "90vh": "90vh",
            },
            blur: {
                2: "2px",
                4: "4px",
                6: "6px",
                8: "8px",
                10: "10px",
            }
        },
    },
    plugins: [],
};
