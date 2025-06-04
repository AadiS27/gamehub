"use client";

import { ClerkProvider, SignIn, useAuth, useUser } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";

interface ConvexClientProviderProps {
  children: React.ReactNode
}

const ConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!
const convex = new ConvexReactClient(ConvexUrl);

// This component handles creating the user in Convex after sign-in
function CreateUserOnSignIn() {
  const { user } = useUser();
  const updateUser = useMutation(api.user.update);
  const identity = useQuery(api.user.getCurrentIdentity);
  const existingUser = useQuery(api.user.getUser, { userId: "currentUser" });
  
  useEffect(() => {
    const createUserInConvex = async () => {
      // Only create/update the user if:
      // 1. We have the authenticated user
      // 2. We have the identity information
      // 3. Either the user doesn't exist in our database or it needs creation
      if (user && identity && (!existingUser || existingUser.needsCreation)) {
        try {
          // Use the update function which handles both creation and updates
          // BUT DON'T RESET EXISTING USER DATA
          await updateUser({
            name: identity.name,
            exp: existingUser?.exp || 0, // Keep existing XP if available
            level: existingUser?.level || 1, // Keep existing level if available
            avatar: identity.pictureUrl,
          });
          console.log("User synced in Convex");
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };
    
    createUserInConvex();
  }, [user, updateUser, identity, existingUser]);
  
  return null;
}

export const ConvexProvider = ({ children }: ConvexClientProviderProps) => {
    return(
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
              <AuthLoading>
                {/* Show full-screen animated loading while auth status is being determined */}
                <div className="flex items-center justify-center min-h-screen bg-black">
                  <div className="text-white">Loading...</div>
                </div>                           
              </AuthLoading>

              <Unauthenticated>
                {/* Show SignIn only when user is confirmed unauthenticated */}
                <div className="flex flex-col items-center justify-center min-h-screen bg-black">
                  <SignIn routing="hash" afterSignInUrl="/dashboard"/>
                </div>
              </Unauthenticated>

              <Authenticated>
                {/* Create user in Convex when authenticated */}
                <CreateUserOnSignIn />
                {/* Show app only when fully authenticated */}
                {children}
              </Authenticated>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}