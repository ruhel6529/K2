import Head from "next/head";
import {Inter} from "next/font/google";

import Navbar from "@/components/NavBar";
import { useSupabaseClient} from "@supabase/auth-helpers-react";


import {useState, useEffect} from "react";
import {Auth} from "@supabase/auth-ui-react";
import styled from "styled-components";
import styles from "./index.module.css";
import FrostedContainer from "@/components/common/FrostedContainer";
import {useRouter} from "next/router";
import {colors} from "@/utils/Colors";

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border-radius: 16px;
  color: #ffffff;

  letter-spacing: 0.2rem;
`;

const customTheme = {
    default: {
        colors: {
            brand: colors.primary,
            brandAccent:  colors.primary,
            brandButtonText: "white",
            // ..
        },
    },
};

export default function Login() {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // Check if the user is authenticated
            if (session) {
                const {
                    user: { id: userUUID },
                } = session;

                // Check if the user has an entry in the credits table
                supabase
                    .from('credits')
                    .select('*')
                    .eq('client_id', userUUID)
                    .then(({ data }) => {
                        if (data.length === 0) {
                            // User doesn't have an entry, add initial credits
                            const initialCredits = 0; // Set the initial credits amount

                            supabase
                                .from('credits')
                                .insert([{ client_id: userUUID, credits: initialCredits }])
                                .then(response => {
                                    console.log('Initial credits added:', response);
                                })
                                .catch(error => {
                                    console.error('Error adding initial credits:', error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error('Error checking credits:', error);
                    });
            }
        });

        return () => subscription.unsubscribe();
    }, [session]);

    useEffect(() => {
        // Check if the user is authenticated
        if (session) {
            // Extract the redirectTo query parameter from the URL
            const redirectTo = router.query.redirectTo;
            if (redirectTo) {
                // Redirect the user back to the saved path after login
                router.replace(redirectTo);
            } else {
                // If there is no redirectTo query parameter, redirect to a default page (e.g., Home)
                router.replace("/"); // Replace "/Home" with the desired default page
            }
        }
    }, [session]);

    if (!session) {
        return (
            <div
                style={{
                    backgroundImage: `url("./background.png")`,
                    backgroundSize: "cover",
                    display: "flex",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <FrostedContainer
                    style={{
                        height: "70vh",
                        width: '70vh',
                        marginTop: "5%",
                        padding: 30,
                    }}
                >
                    <h1 style={{color: "black"}}>Sign in to your account</h1>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: customTheme,
                            className: {
                                input: styles["form-input"],
                                button: styles["form-button"],
                                //..
                            },
                        }}
                        providers={["google", "apple"]}
                    />
                </FrostedContainer>
            </div>
        );
    }
}
