module.exports = {
    compilerOptions: {
        // Base directory to resolve non-relative module names
        baseUrl: ".",
        // Helpful path aliases for cleaner imports
        paths: {
            "@/*": ["src/*"],
            "@components/*": ["src/components/*"],
            "@utils/*": ["src/utils/*"],
            "@pages/*": ["src/pages/*"]
        },
        // Optional convenience flags
        allowSyntheticDefaultImports: true,
        jsx: "react",
        target: "ES6"
    },
    include: ["src/**/*", "index.js"],
    exclude: ["node_modules", "dist", "build"]
};