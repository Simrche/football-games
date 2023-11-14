/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,vue}"],
    theme: {
        extend: {
            height: {
                "33vh": "33vh",
            },
            width: {
                "25vw": "25vw",
            },
            minHeight: {
                "10vh": "10vh",
                "20vh": "20vh",
                "20vh": "20vh",
                "30vh": "30vh",
                "40vh": "40vh",
                "50vh": "50vh",
                "60vh": "60vh",
                "70vh": "70vh",
                "80vh": "80vh",
                "90vh": "90vh",
            },
            blur: {
                2: "2px",
                4: "4px",
                6: "6px",
                8: "8px",
                10: "10px",
            },
        },
    },
    plugins: [],
};
