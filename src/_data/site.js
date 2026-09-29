import config from "../../site.config.js";
export default {
  ...config,
  title: "Zachery Taylor",
  tagline: "Civil designer & Engineer Intern in Pensacola. Builder. Writer.",
  description:
    "Zachery Taylor, EI — civil engineering designer in Pensacola, Florida, working on land-development and utility infrastructure, mechanical engineering and math graduate of UWF, and a writer working on his first book.",
  buildTime: new Date(),
  year: new Date().getFullYear(),
  env: process.env.GITHUB_REPOSITORY ? "ci" : "local",
  isStaging: !config.indexable,
};
