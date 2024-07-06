import React, { useState } from "react";

const SubscriptionButton = () => {
  const [subscribed, setSubscribed] = useState(false); // State for subscription status
  const [count, setCount] = useState(Math.floor(Math.random() * 301) + 200); // Random number between 200 and 500 for initial count

  // Toggle subscription state and update count
  const toggleSubscribed = () => {
    setSubscribed(!subscribed); // Toggle subscription status
    setCount((prevCount) => (subscribed ? prevCount - 1 : prevCount + 1)); // Update count based on subscription status
  };

  return (
    <button
      className={`subscribe-button ${subscribed ? "subbed" : ""}`}
      onClick={toggleSubscribed}
      data-count={count}
    >
      <svg
        className="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          className="checkmark__circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
        />
        <path
          className="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
      <svg
        className="plus"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <line
          className="plus__line1"
          x1="6"
          y1="1"
          x2="6"
          y2="11"
          stroke="white"
        />
        <line
          className="plus__line2"
          x1="1"
          y1="6"
          x2="11"
          y2="6"
          stroke="white"
        />
      </svg>
      <span className="subscribe-text">
        {subscribed ? "Subscribed" : "Subscribe"}
      </span>
    </button>
  );
};

export default SubscriptionButton;
