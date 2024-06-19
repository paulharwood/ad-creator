import { useActivityFeed } from "../context/ActivityFeedContext";

export const useApiWithActivityFeed = () => {
  const { addMessage } = useActivityFeed();

  const fetchWithActivityFeed = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      addMessage(`API Response: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      addMessage(`API Error: ${errorMessage}`);
      throw error;
    }
  };

  return fetchWithActivityFeed;
};
