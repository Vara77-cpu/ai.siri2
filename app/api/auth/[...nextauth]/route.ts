import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({


  providers: [

    /* USER LOGIN (Google) */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /* 🔥 ADMIN LOGIN */
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {

        if (
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            name: "Admin",
            email: "credentials.email",
            role: "admin"
          }
        }

        return null
      }
    })

  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {

    /* 🔥 FIXED JWT */
    async jwt({ token, user }) {

      // When user logs in first time
      if (user) {
        token.role = (user as any).role || "user"
      }

      // Ensure role always exists
      if (!token.role) {
        token.role = "user"
      }

      return token
    },

    /* 🔥 FIXED SESSION */
    async session({ session, token }) {

      if (session.user) {
        session.user.role = token.role as string
      }

      return session
    },

  },

  secret: process.env.NEXTAUTH_SECRET,

})

export { handler as GET, handler as POST }