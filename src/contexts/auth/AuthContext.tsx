
import React, { createContext } from "react";
import { Session } from "@supabase/supabase-js";
import { AuthContextType, UserProfile } from "./types";

// Create the AuthContext with initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The actual provider component will be defined in AuthProvider.tsx
