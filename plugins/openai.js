const OpenAI = require("openai-api");
require("dotenv").config();

export default ({ app }, inject) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const openai = new OpenAI(OPENAI_API_KEY);

    inject("openai", openai);
};
