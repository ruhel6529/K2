import styles from "@/styles/Home.module.css";
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import StoredImagesGallery from "@/components/studio/StoredImagesGallery";
import ImageEditor from "@/components/ImageEditor";
import {useAuth} from "@/context/Auth";
import {useRouter} from "next/router";
import  { Toaster } from 'react-hot-toast';

interface ImageData {
    message: string;
    image_id: string;
    images: any;
}


const MainContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const WorkArea = styled.div`
  flex-direction: column;
  display: flex;
  padding-right: 16px;
  align-items: center;
`;


export default function Studio() {
    const [media, setMedia] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false)
    const supabase = useSupabaseClient();
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            if (user?.id) {
                await getMedia()
            }
        })();
        if (!user) {
            router.push({
                pathname: '/Login',
                query: { redirectTo: '/Studio' } // Add the query parameter
            });
        }
    }, [user]);

    async function getMedia() {
        const {data, error} = await supabase
            .from("images")
            .select("*")
            .eq("client_id", user.id)
            .order("uploaded_at", {ascending: false});

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
                    <Toaster  toastOptions={{style: { background: "rgba(255, 255, 255, 0.15)",
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                            backdropFilter: "blur(8.5px)",
                            WebkitBackdropFilter: "blur(8.5px)",
                        color: 'white'}}}/>
                    <WorkArea>
                        <ImageEditor setMedia={setMedia}/>

                    </WorkArea>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{paddingLeft: 16}}>
                            <h3>Your past Images</h3>
                            <StoredImagesGallery data={media} dataLoaded={dataLoaded}/>
                        </div>
                    </div>
                </MainContainer>
            </main>
        </>

    );
}
