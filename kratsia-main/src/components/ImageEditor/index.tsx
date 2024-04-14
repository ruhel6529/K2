import React, { useRef, useState, useEffect } from "react";
import { GridLoader } from "react-spinners";

import FrostedContainer from "@/components/common/FrostedContainer";
import { Slider } from "@mui/material";
import { colors } from "@/utils/Colors";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAuth } from "@/context/Auth";
import toast, { Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import styles from "./index.module.css";

const ImageEditor = ({ setMedia }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [posText, setPosText] = useState({ x: "center", y: "center" });

  const [userFileName, setUserFileName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [negativeUserPrompt, setNegativeUserPrompt] = useState("");
  const [numberOfImages, setNumberOfImages] = useState(4);
  const [credits, setCredits] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(0.7); // Initial scaling factor

  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const fileInput = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const maxWidth = 400; // Adjust the maximum width as needed
      const maxHeight = 400; // Adjust the maximum height as needed

      const newWidth = Math.min(window.innerWidth * 0.8, maxWidth);
      const newHeight = Math.min(window.innerHeight * 0.8, maxHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, newWidth, newHeight);

      if (image) {
        const scaledWidth = (image.width * scaleFactor) / 2;
        const scaledHeight = (image.height * scaleFactor) / 2;
        const x = pos.x + (image.width - scaledWidth) / 2;
        const y = pos.y + (image.height - scaledHeight) / 2;
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [imageId, pos, posText, scaleFactor]);

  useEffect(() => {
    (async () => {
      await getCredits();
    })();
  }, []);

  const handleImageUpload = (img) => {
    setLoading(true);
    if (!img) return;

    const formData = new FormData();
    formData.append("image", img);

    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/v1/uploadImage`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOKKER_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.cutout_image) {
          const cutoutImg = new Image();
          cutoutImg.onload = () => {
            const canvas = canvasRef.current;
            const initialX = (canvas.width - cutoutImg.width) / 2;
            const initialY = (canvas.height - cutoutImg.height) / 2;
            setPos({ x: initialX, y: initialY });
            setImage(cutoutImg);
            setLoading(false);
            setImageId(data.id);
          };
          cutoutImg.src = data.cutout_image.url;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserFileName(file?.name);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          handleImageUpload(file);
          setScaleFactor(0.7);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (image) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - (image.width * 0.4) / 2;
      const y = e.clientY - rect.top - (image.height * 0.4) / 2;

      if (x >= pos.x && y >= pos.y) {
        setDragging(true);
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - image.width / 2;
      const y = e.clientY - rect.top - image.height / 2;
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      let newX = "center";
      if (relativeX < 150) {
        newX = "left";
      } else if (relativeX > 230) {
        newX = "right";
      }

      let newY = "center";
      if (relativeY < 120) {
        newY = "top";
      } else if (relativeY > 280) {
        newY = "bottom";
      }
      setPos({ x, y });
      setPosText({ x: newX, y: newY });
    }
  };

  const getCredits = async () => {
    const { data, error } = await supabase
      .from("credits")
      .select("credits")
      .eq("client_id", user?.id);

    if (data && data[0]) {
      setCredits(data[0].credits);
    } else {
      console.log("checkCredits() error", error);
    }
  };

  const subtractCredits = async () => {
    const { error } = await supabase
      .from("credits")
      .update({ credits: credits - numberOfImages })
      .eq("client_id", user?.id);

    setCredits((prevState) => prevState - numberOfImages);

    if (error) {
      console.log(error);
    }
  };

  const generateImage = async (
    image: string,
    pos_prompt: string,
    neg_prompt: string,
    numberOfImages: number,
    x: string,
    y: string,
    scaleFactor: number
  ) => {
    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image,
          pos_prompt,
          neg_prompt,
          numberOfImages,
          x,
          y,
          scaleFactor,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      //const responseData = dummyData

      // Save images to the database

      const { error } = await Promise.all(
        responseData.images.map(async (imageData: any) => {
          return supabase.from("images").insert({
            id: uuidv4(),
            blob: imageData.image.data,
            client_id: user.id,
            uploaded_at: new Date().toISOString(),
          });
        })
      );
      await subtractCredits();

      const processedImages = await responseData.images.map(
        (imageData: any) => ({
          id: uuidv4(),
          blob: imageData.image.data,
          client_id: user.id,
          uploaded_at: new Date().toISOString(),
        })
      );

      // Merge the processed images with the existing media data

      setMedia((prevMedia) => [...processedImages, ...prevMedia]);

      if (error) {
        console.log(error);
      }
    } catch (error) {
      throw error;
      console.error(error.message, "generateImage() error message");
    }
  };

  const uploadToServer = async () => {
    if (imageId && userPrompt && credits >= numberOfImages) {
      await toast.promise(
        generateImage(
          imageId,
          userPrompt,
          negativeUserPrompt,
          numberOfImages,
          posText.x,
          posText.y,
          scaleFactor
        ),
        {
          loading: "Generating Image...", // Display loading spinner text
          success: "Image successfully generated!", // Success toast message
          error: "Image generation failed!", // Error toast message
        }
      );
    } else {
      if (credits < numberOfImages) {
        toast("Not enough credits", {
          duration: 2000,
          icon: "❌",
        });
      }
      if (!userPrompt) {
        toast("The prompt is empty", {
          duration: 2000,
          icon: "❌",
        });
      }
      if (!imageId) {
        toast("No image uploaded", {
          duration: 2000,
          icon: "❌",
        });
      }
    }
  };

  const handleNumberOfImages = (e: number) => {
    setNumberOfImages(e);
  };

  return (
    <div
      style={{
        flexDirection: "column",
        display: "flex",
        width: "100vw",
        paddingRight: "20px",
        paddingLeft: "20px",
        maxWidth: "450px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && (
          <div style={{ position: "absolute", zIndex: 1 }}>
            <GridLoader color={colors.primary} />
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          height={window.innerHeight * 0.8} // Adjust the initial height
          width={window.innerWidth * 0.8} // Adjust the initial width
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            backdropFilter: "blur(8.5px)",
            WebkitBackdropFilter: "blur(8.5px)",
            borderRadius: 16,
            marginBottom: 16,
            maxWidth: "400px",
          }}
        >
          Canvas not supported
        </canvas>
      </div>

      {image && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <h5 style={{ marginRight: 20 }}>Resize</h5>{" "}
          <Slider
            name="scaleFactor"
            value={scaleFactor}
            min={0.1}
            max={1}
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
            step={0.1}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
          />
        </div>
      )}
      <div style={{ flexDirection: "row" }}>
        <button
          onClick={() => fileInput.current.click()}
          className={styles.uploadButton}
          style={{ marginRight: 10 }}
        >
          Upload
        </button>
        <input
          type="file"
          accept="image/*"
          className="input-field"
          onChange={handleFileChange}
          ref={fileInput}
          style={{ display: "none" }}
        />
        {userFileName
          ? userFileName.length > 20
            ? userFileName.slice(0, 20) + "..."
            : userFileName
          : "No file chosen"}
      </div>
      <input
        style={{
          padding: 20,
          fontFamily: "Inter",

          marginTop: 16,
          height: 30,
          alignSelf: "stretch",
          backgroundColor: "#F6FAFF",
          borderRadius: 20,
          border: "none",
          color: "black",
        }}
        type="text"
        placeholder="Insert your prompt here"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
      <input
        style={{
          padding: 20,
          marginTop: 4,
          fontFamily: "Inter",

          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(8.5px)",
          WebkitBackdropFilter: "blur(8.5px)",
          height: 30,
          alignSelf: "stretch",
          borderRadius: 20,
          border: "none",
          color: "black",
        }}
        type="text"
        placeholder="Insert your negative prompt here (optional)"
        value={negativeUserPrompt}
        onChange={(e) => setNegativeUserPrompt(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5 style={{ marginTop: 24 }}>Number of images</h5>

        <Slider
          name="brightness"
          value={numberOfImages}
          min={1}
          max={7}
          sx={{
            marginTop: 2,

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
          onChange={(e, value) => handleNumberOfImages(value)}
        />
        <p style={{ marginLeft: 20, fontFamily: "roboto" }}>{numberOfImages}</p>

        <button
          style={{
            width: 150,
            padding: 10,
            borderRadius: 25,
            backgroundColor: "#EDF1FF",
            color: "black",
            border: "3px solid #581449",
            marginTop: 12,
            fontWeight: "bold",
          }}
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          GENERATE
        </button>
        <h1>{credits}</h1>
      </div>
    </div>
  );
};

export default ImageEditor;
