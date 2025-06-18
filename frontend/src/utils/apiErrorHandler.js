// export function handleApiError(error) {
//   if (!error.response) {
//     return "Network error. Please check your connection.";
//   }

//   switch (error.response.status) {
//     case 403:
//       return (
//         error.response.data.error || "Unauthorized: You do not have permission."
//       );
//     case 404:
//       return "Resource not found.";
//     case 422:
//       return error.response.data.details || "Invalid input.";
//     case 500:
//       console.error("Server error:", error.response.data.error);
//       return "Something went wrong. Please try again later.";
//     default:
//       return "Unexpected error occurred.";
//   }
// }

export function handleApiError(error) {
  if (!error.response) {
    return { general: ["Network error. Please check your connection."] };
  }

  const { status, data } = error.response;

  switch (status) {
    case 401: // ✅ Handle authentication failures
      return { general: [data.error || "Unauthorized: Invalid credentials."] };
    case 403:
      return {
        general: [
          data.error?.includes("Unauthorized action")
            ? "Unauthorized Action. You do not have permission to perform this request."
            : data.error || "Access denied.",
        ],
      };
    case 404:
      return { general: ["Resource not found."] };
    case 422:
      return data.details ? data.details : { general: ["Invalid input."] }; // ✅ Returns full validation errors instead of a single message
    case 500:
      console.error("Server error:", data.error);
      return { general: ["Something went wrong. Please try again later."] };
    default:
      console.error("Unexpected error:", data);
      return { general: ["Unexpected error occurred."] };
  }
}
