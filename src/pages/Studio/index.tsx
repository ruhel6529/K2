import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import StoredImagesGallery from "@/components/studio/StoredImagesGallery";
import ImageEditor from "@/components/ImageEditor";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const WorkArea = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    margin-right: 32px;
    align-items: center;
  }

  @media (max-width: 768px) {
  }
`;

export default function Studio() {
  const [media, setMedia] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (user?.id) {
        await getMedia();
      }
    })();
    if (!user) {
      router.push({
        pathname: "/Login",
        query: { redirectTo: "/Studio" }, // Add the query parameter
      });
    }
  }, [user]);

  async function getMedia() {
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("client_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (data) {
      setMedia(data);
      setDataLoaded(true);
    } else {
      console.log("getMedia() error", error);
    }
  }

  return (
    <>
      <main className={styles.main}>
        <MainContainer>
          <Toaster
            toastOptions={{
              style: {
                background: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(8.5px)",
                WebkitBackdropFilter: "blur(8.5px)",
                color: "white",
              },
            }}
          />
          <WorkArea>
            <ImageEditor setMedia={setMedia} />
          </WorkArea>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StoredImagesGallery data={media} dataLoaded={dataLoaded} />
          </div>
        </MainContainer>
      </main>
    </>
  );
}
