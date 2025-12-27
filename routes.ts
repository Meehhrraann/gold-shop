// export const publicRoutes = [
//   "/",
//   "/auth/new-verification",
//   "/packages",
//   "/hotels/.*",
//   "/destinations",
//   "/destinations/.*",
// ];

// export const authRoutes = [
//   "/auth/login",
//   "/auth/register",
//   "/auth/error",
//   "/auth/reset",
//   "/auth/new-password",
// ];

// export const apiAuthPrefix = "/api/auth";
// export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/packages",
  "/destinations",
  "/about",
  "/products",
  "/categories",
  "/x",
];

/**
 * An array of route patterns (regex) that are accessible to the public
 * These routes do not require authentication
 * @type {RegExp[]}
 */
export const publicRoutePatterns = [
  /^\/hotels\/.*/,
  /^\/destinations\/.*/,
  /^\/products\/.*/, // <-- ADD THIS LINE
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
