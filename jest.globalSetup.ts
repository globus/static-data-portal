export default async function globalSetup() {
  /**
   * Ensure UTC timezone is used in test contexts.
   */
  process.env.TZ = "UTC";
}
