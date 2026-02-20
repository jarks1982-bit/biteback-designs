module.exports = function (eleventyConfig) {
  // ── Pass-through copies ──────────────────────────────────────────
  // These files get copied as-is into _site/ (no processing)
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/img");

  // ── Watch targets ────────────────────────────────────────────────
  // Auto-reload browser when these change during `npm run dev`
  eleventyConfig.addWatchTarget("src/assets/css/");

  // ── Shortcodes ───────────────────────────────────────────────────
  // Usage in templates: {% coach "bri" %} → outputs coach's color
  eleventyConfig.addShortcode("coachColor", function (coachName, mode) {
    const colors = {
      bri:    { dark: "#FF6B9D", light: "#D4507A" },
      jay:    { dark: "#64748B", light: "#475569" },
      kenji:  { dark: "#EF4444", light: "#DC2626" },
      claire: { dark: "#7C3AED", light: "#6D28D9" },
      mason:  { dark: "#34D399", light: "#059669" },
    };
    return colors[coachName]?.[mode || "dark"] || "#FFFFFF";
  });

  // ── Filters ──────────────────────────────────────────────────────
  // Usage: {{ "bri" | coachGradient }}
  eleventyConfig.addFilter("coachGradient", function (coachName) {
    const gradients = {
      bri:    "linear-gradient(135deg, #FF6B9D, #FF2E6C)",
      jay:    "linear-gradient(135deg, #64748B, #334155)",
      kenji:  "linear-gradient(135deg, #EF4444, #991B1B)",
      claire: "linear-gradient(135deg, #C4B5FD, #7C3AED)",
      mason:  "linear-gradient(135deg, #34D399, #059669)",
    };
    return gradients[coachName] || "linear-gradient(135deg, #333, #111)";
  });

  // ── Directory structure ──────────────────────────────────────────
  return {
    dir: {
      input: "src",          // Source files live here
      includes: "_includes", // Partials & layouts (relative to input)
      layouts: "_layouts",   // Layout files (relative to input)
      data: "_data",         // Global data files (relative to input)
      output: "_site",       // Built site goes here
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
