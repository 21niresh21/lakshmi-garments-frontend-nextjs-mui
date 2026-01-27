export function normalizeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.data === "string"
  ) {
    return (error as any).response.data;
  }
  return "Something went wrong. Please try again.";
}