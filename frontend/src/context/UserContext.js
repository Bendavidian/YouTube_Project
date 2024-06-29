// // src/context/UserContext.js
// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState("");

//   useEffect(() => {
//     const sessionToken = sessionStorage.getItem("token");
//     if (sessionToken) {
//       setToken(sessionToken);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (token) {
//         try {
//           const response = await axios.get(
//             "http://localhost:8080/api/auth/me",
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           console.log("fetched user:", response.data);
//           setUser(response.data);
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     fetchUserDetails();
//   }, [token]);

//   return (
//     <UserContext.Provider value={{ user, setUser, loading, setToken }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    if (accessToken) {
      fetchUserDetails(accessToken);
    }
  }, [accessToken]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response.status === 401) {
        refreshAccessToken();
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/refresh-token",
        {
          refreshToken: localStorage.getItem("refreshToken"),
        }
      );
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      fetchUserDetails(response.data.accessToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );
      setAccessToken(response.data.accessToken);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      fetchUserDetails(response.data.accessToken);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

export const useUser = () => useContext(UserContext);
