import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./SocialMediaModal.css";
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord } from "react-icons/fa";

// SocialMediaModal component for displaying a modal with social media share options
const SocialMediaModal = ({ showModal, handleCloseModal }) => {
  // Styles for centering the title
  const centerTitle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  // Styles for centering elements
  const ce = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  };

  // Styles for the large button
  const largeButtonStyle = {
    padding: "10px 20px",
    fontSize: "1.2rem",
    borderRadius: "8px",
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}> {/* Modal component from react-bootstrap */}
      <Modal.Header closeButton> {/* Modal header with close button */}
        <Modal.Title
          style={{
            fontSize: "1.9rem",
            letterSpacing: "0.05em",
            ...centerTitle,
          }}
        >
          Share on Social Media
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          fontSize: "1.2rem",
          letterSpacing: "0.03em",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="social-icons">
          <ul>
            {/* List of social media icons with links */}
            <li className="item">
              <a href="https://www.facebook.com">
                <FaFacebook className="icon" />
              </a>
            </li>
            <li className="item">
              <a href="https://www.instagram.com">
                <FaInstagram className="icon" />
              </a>
            </li>
            <li className="item">
              <a href="https://www.twitter.com">
                <FaTwitter className="icon" />
              </a>
            </li>
            <li className="item">
              <a href="https://www.discord.com">
                <FaDiscord className="icon" />
              </a>
            </li>
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer style={ce}>
        <Button
          variant="secondary"
          style={largeButtonStyle}
          onClick={handleCloseModal}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SocialMediaModal; // Exporting the component as default
