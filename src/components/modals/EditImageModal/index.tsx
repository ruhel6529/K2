import React, { useState, useRef } from "react";
import FrostedContainer from "@/components/common/FrostedContainer";
import styles from "./index.module.css";
import NextImage from "next/image";
import { Modal, Slider } from "@mui/material";
import styled from "@emotion/styled";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const EditImageModal = ({ imageUrl, closeModal }) => {
  const [imageConfig, setImageConfig] = useState({
    brightness: 100, // Example: brightness value
    contrast: 100, // Example: contrast value
    grayscale: 0,
    saturation: 100,
    hueRotate: 0,
    invert: 0,
    // Add more configuration values as needed
  });
  const canvasRef = useRef(null);

  const handleSliderChange = (event) => {
    // Update the corresponding configuration value based on slider changes
    const { name, value } = event.target;
    setImageConfig((prevConfig) => ({
      ...prevConfig,
      [name]: parseFloat(value),
    }));
  };

  const saveImage = (imageUrl) => {
    // Logic to save the image
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "downloadedImage";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    // Create a new Image element to apply filters
    const img = new Image();

    // Set the crossOrigin attribute to handle CORS issues when using external images
    img.crossOrigin = "Anonymous";

    // Load the original image with the filters applied using the Image component
    const filteredImage = new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");

        // Apply filters to the image
        context.filter = `brightness(${imageConfig.brightness}%) contrast(${imageConfig.contrast}%) grayscale(${imageConfig.grayscale}%) saturate(${imageConfig.saturation}%) hue-rotate(${imageConfig.hueRotate}deg) invert(${imageConfig.invert}%)`;
        context.drawImage(img, 0, 0);

        // Convert canvas to base64 image
        const editedImage = canvas.toDataURL("image/jpeg");

        // Resolve the Promise with the filtered image data URL
        resolve(editedImage);
      };
    });

    // Set the source of the Image element to the original image URL
    img.src = imageUrl;

    // Wait for the filtered image to be generated
    const editedImage = await filteredImage;

    // Save the filtered image
    saveImage(editedImage);
  };

  return (
    <Modal
      onClose={closeModal}
      open={true}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          boxShadow: "none",
        },
      }}
    >
      <FrostedContainer
        style={{
          width: "50vh",
          alignSelf: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className={styles.modalBody}>
          <button className={styles.closeButton} onClick={closeModal}>
            X
          </button>
          {/* Invisible Canvas element to handle image editing */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <NextImage
            crossOrigin="anonymous"
            style={{
              borderRadius: 8,
              filter: `brightness(${imageConfig.brightness}%) contrast(${imageConfig.contrast}%) grayscale(${imageConfig.grayscale}%) saturate(${imageConfig.saturation}%) hue-rotate(${imageConfig.hueRotate}deg) invert(${imageConfig.invert}%)`,
            }}
            src={imageUrl}
            alt="Generated Image"
            height={300}
            width={300}
          />
          <div className={styles.sliderContainer}>
            <Row>
              <label className={styles.label}>Brightness</label>
              <Slider
                name="brightness"
                value={imageConfig.brightness}
                min={0}
                max={200}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
                step={1}
                onChange={handleSliderChange}
              />
            </Row>
            <Row>
              <label className={styles.label}>Contrast</label>
              <Slider
                name="contrast"
                value={imageConfig.contrast}
                min={0}
                max={200}
                step={1}
                onChange={handleSliderChange}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
              />
            </Row>
            <Row>
              <label className={styles.label}>Saturation</label>
              <Slider
                name="saturation"
                value={imageConfig.saturation}
                min={0}
                max={200}
                step={1}
                onChange={handleSliderChange}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
              />
            </Row>
            <Row>
              <label className={styles.label}>Grayscale</label>
              <Slider
                name="grayscale"
                value={imageConfig.grayscale}
                min={0}
                max={100}
                step={1}
                onChange={handleSliderChange}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
              />
            </Row>

            <Row>
              <label className={styles.label}>Hue</label>
              <Slider
                name="hueRotate"
                value={imageConfig.hueRotate}
                min={0}
                max={360}
                step={1}
                onChange={handleSliderChange}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
              />
            </Row>
            <Row>
              <label className={styles.label}>invert</label>
              <Slider
                name="invert"
                value={imageConfig.invert}
                min={0}
                max={100}
                step={1}
                onChange={handleSliderChange}
                sx={{
                  width: 130,
                  "& .MuiSlider-thumb": {
                    color: "purple",
                  },
                  "& .MuiSlider-rail": {
                    color: "white",
                  },
                  "& .MuiSlider-track": {
                    color: "white",
                  },
                }}
              />
            </Row>

            {/* Add more sliders for other configuration values */}
          </div>
          <button onClick={handleSave}>Save</button>
        </div>
      </FrostedContainer>
    </Modal>
  );
};

export default EditImageModal;
