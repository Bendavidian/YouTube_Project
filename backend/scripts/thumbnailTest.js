const axios = require("axios");

// Function to fetch a thumbnail URL from a random image service
const getThumbnailUrl = async () => {
  try {
    const response = await axios.get("https://picsum.photos/200/300", {
      maxRedirects: 0, // Do not follow redirects
      validateStatus: (status) => status >= 200 && status < 400, // Accept status codes between 200 and 399
    });

    // Check if the response is a redirect (302 status code)
    if (response.status === 302) {
      console.log("thumbnail:", response.headers.location);
      return response.headers.location; // Return the location header from the redirect response
    } else {
      throw new Error("Unexpected response status: " + response.status); // Throw an error if the status is not 302
    }
  } catch (error) {
    console.error("Error fetching thumbnail URL:", error.message);
    return "https://via.placeholder.com/300"; // Fallback URL if an error occurs
  }
};

// Execute the function to get a thumbnail URL
getThumbnailUrl();
