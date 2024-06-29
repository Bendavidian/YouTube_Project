const axios = require("axios");

const getThumbnailUrl = async () => {
  try {
    const response = await axios.get("https://picsum.photos/200/300", {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Check if the response is a redirect (302 status code)
    if (response.status === 302) {
      console.log("thumbnail:", response.headers.location);
      return response.headers.location;
    } else {
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error) {
    console.error("Error fetching thumbnail URL:", error.message);
    return "https://via.placeholder.com/300"; // Fallback URL
  }
};

getThumbnailUrl();
