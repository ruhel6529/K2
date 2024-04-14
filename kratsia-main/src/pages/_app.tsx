import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import 'typeface-roboto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {useState} from 'react';
import Navbar from '../components/Navbar';
import React, {useEffect} from "react";
import {useUser} from "@supabase/auth-helpers-react";
import {AuthProvider} from "@/context/Auth";
import {supabaseClient} from "@/config/supabase-client";

export default function App({Component, pageProps}: AppProps) {


    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
        <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
        </AuthProvider>
        </SessionContextProvider>
   )
}
