import React, { useState, useEffect } from "react";
import FrostedContainer from "@/components/common/FrostedContainer";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/Auth";
import stripePromise from "@/config/stripe"; // Import the stripePromise you created
import styles from "./index.module.css";
import toast, { Toaster } from "react-hot-toast";
import { colors } from "@/utils/Colors";
import StoredImagesGallery from "@/components/studio/StoredImagesGallery";

const Profile = () => {
  const [userCredits, setUserCredits] = useState(0);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { user } = useAuth();
  const firstName = "Afnan";
  const { status } = router.query;

  useEffect(() => {
    // Function to fetch the user's credits from the Supabase table
    const fetchCredits = async () => {
      try {
        // Fetch the user's credits from the Supabase table
        const { data, error } = await supabase
          .from("credits")
          .select("credits")
          .eq("client_id", user?.id)
          .single();

        if (error) {
          console.error("Error fetching user credits:", error);
        } else {
          setUserCredits(data?.credits);
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
      }
    };

    // Fetch the credits on initial load
    fetchCredits();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push({
        pathname: "/Login",
        query: { redirectTo: "/Profile" }, // Add the query parameter
      });
    }
  }, [user]);

  useEffect(() => {
    if (status === "success") {
      toast.success("Payment was successful! Credits added.");
    } else if (status === "cancel") {
      toast.error("Payment was cancelled.");
    }
  }, [status]);

  const products = [
    {
      name: "10 credits",
      apiKey: "price_1NKMGJEsCAClsCWszuPAGgbX",
      creditValue: 10,
    },
    {
      name: "20 credits",
      apiKey: "price_1NKSg8EsCAClsCWsDvnNwyRX",
      creditValue: 20,
    },
    {
      name: "30 credits",
      apiKey: "price_1NKSg8EsCAClsCWsDvnNwyRX",
      creditValue: 30,
    },
  ];

  const handlePayment = async (priceId: string, creditValue: number) => {
    const stripe = await stripePromise;

    // Create a checkout session with the selected product
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId: user?.id,
        creditValue,
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe checkout page
    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result.error) {
      console.error(result.error.message, "Handle payment error");
    }
  };

  return (
    <div className="profile">
      <Toaster />
      <FrostedContainer
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 100,
          marginRight: 50,
          marginLeft: 50,
          padding: 12,
        }}
      >
        <h1 style={{ color: "white" }}>Hi {firstName}!</h1>
        <p style={{ color: "white" }}>
          Welcome to your account hub, your gateway to topping up credits and
          exploring your gallery of saved photos.
        </p>
        <h3 style={{ marginTop: 24 }}>Current Credits: {userCredits}</h3>
        <p>These credits are the remaining balance on your subscription.</p>

        <h3 style={{ marginTop: 24 }}>
          Need more credits? We&apos;ve got you covered!
        </h3>
        <div className={styles.productsContainer}>
          {products.map((product, index) => {
            return (
              <div key={index}>
                <button
                  style={{
                    backgroundColor: "#EDF1FF",
                    border: `solid ${colors.primary}`,
                    color: "black",
                    borderWidth: "5px",
                    marginRight: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 100,
                    width: 150,
                    borderRadius: 16,
                    marginBottom: 8,
                  }}
                  onClick={() => {
                    handlePayment(product.apiKey, product.creditValue);
                  }}
                >
                  <h3>{product.name}</h3>
                  $10 / One off
                </button>
              </div>
            );
          })}
        </div>
      </FrostedContainer>
    </div>
  );
};

export default Profile;
