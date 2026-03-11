import NextAuth from "next-auth"
import prisma from "./lib/prisma"
import authConfig from "./auth.config"


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user, account, profile }) {
        if (account && profile?.email) {
            try {
                prisma.user.upsert({
                    where: {
                        email: profile.email
                    },
                    update: {
                        name: profile.name,
                        image: profile.picture
                    },
                    create: {
                        email: profile.email,
                        name: profile.name,
                        image: profile.picture
                    }
                })

                token.id = profile.id;
                token.name = profile.name;
                token.email = profile.email;
                token.picture = profile.picture;
            } catch (error) {
                console.error("Error occurred while upserting user:", error)
            }
        }

        return token
    },

    async session({ session, token }) {
        if (token) {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            session.user.image = token.picture as string;
        }

        return session
    }
  }
  
})