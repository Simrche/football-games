/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,vue}"],
    theme: {
        extend: {
            minHeight: {
                "10vh": "10vh",
                "90vh": "90vh",
            },
        },
    },
    plugins: [],
};
