import React, {useEffect} from "react";
import styles from "./Navbar.module.css";
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useAuth} from "@/context/Auth";
import toast from "react-hot-toast";
import {duration} from "@mui/material";

const Navbar = () => {
    const { user } = useAuth()
    const { signOut } = useAuth()

    const handleLogout = () => {
        signOut()


        toast('Your are succesfully logged out',{
            duration: 3000
        })
    }


    return (
        <nav className={styles.navbar}>
            <div className={styles["left-side"]}>Kratsia.AI</div>
            <div className={styles["right-side"]}>
                <ul>
                    <li><Link href="/">
                        Home
                    </Link></li>
                    <li><Link href='/Profile'>
                        How To
                    </Link></li>
                    <li><Link  href='/Studio'>
                        Studio
                    </Link></li>
                    <li><Link  href="/Profile" >
                        Profile
                    </Link></li>
                    {user && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
