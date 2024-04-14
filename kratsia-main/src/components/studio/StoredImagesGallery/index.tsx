import React, { useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";
import styles from "./index.module.css";
import { useState } from "react";
import { Modal } from "@mui/material";
import FrostedContainer from "@/components/common/FrostedContainer";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GridLoader } from "react-spinners";
import EditImageModal from "@/components/modals/EditImageModal";
import toast from "react-hot-toast";
import { Gallery, Item } from "react-photoswipe-gallery";
import { colors } from "@/utils/Colors";
import { Skeleton } from "antd";

const Container = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
  grid-template-rows: 160px;
  grid-gap: 1rem;
`;

const StoredImagesGallery = ({ data, dataLoaded }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [imagesArray, setImagesArray] = useState(data);
  const [fullscreenImage, setFullscreenImage] = useState(null); // To hold the image for full-screen preview

  const supabase = useSupabaseClient();

  useEffect(() => {
    setLoading(true);
    if (data.length === 0) {
      setLoading(true);
    } else {
      setImagesArray(data);
      setLoading(false);
    }
  }, [data]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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

  const editImage = (imageUrl) => {
    // Logic to edit the image
    setEditedImageUrl(imageUrl);
    openModal();
  };

  const deleteImage = async (id) => {
    const { error } = await supabase.from("images").delete().eq("id", id);
    setImagesArray(imagesArray.filter((image) => image.id != id));
    toast("Image successfully deleted", {
      icon: "🗑",
    });
    if (error) {
      console.log(error);
    }
  };

  const openFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl); // Set the image for full-screen preview
  };

  const closeFullscreen = () => {
    setFullscreenImage(null); // Clear the full-screen image
  };

  return (
    <>
      <Container>
        {!dataLoaded && <Skeleton.Image active={true} />}
        {dataLoaded && data.length === 0 && <h3>No images saved</h3>}
        {imagesArray?.map((media, index) => {
          const imageUrl = `data:image/jpeg;base64,${media?.blob}`;
          return (
            <div key={index} className={styles.imageContainer}>
              <Image
                style={{ borderRadius: 8 }}
                src={imageUrl}
                alt="Generated Image"
                height={150}
                width={150}
              />
              <div className={styles.dropdown}>
                <button className={styles.dropdownButton}>...</button>
                <div className={styles.dropdownContent}>
                  <a href="#" onClick={() => openFullscreen(imageUrl)}>
                    View
                  </a>
                  <a href="#" onClick={() => saveImage(imageUrl)}>
                    Save
                  </a>
                  <a href="#" onClick={() => editImage(imageUrl)}>
                    Edit
                  </a>
                  <a href="#" onClick={() => deleteImage(media.id)}>
                    Delete
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {fullscreenImage && (
          <Modal
            open={true}
            BackdropProps={{
              style: {
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                boxShadow: "none",
              },
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <button className={styles.closeButton} onClick={closeFullscreen}>
                X
              </button>
              <Image
                style={{ borderRadius: 16 }}
                src={fullscreenImage}
                alt="Full-Screen Preview"
                height={500}
                width={500}
              />
            </div>
          </Modal>
        )}

        {modalOpen && (
          <EditImageModal imageUrl={editedImageUrl} closeModal={closeModal} />
        )}
      </Container>
    </>
  );
};

export default StoredImagesGallery;
