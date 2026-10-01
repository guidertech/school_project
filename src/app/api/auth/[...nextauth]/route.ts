import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        gmail: { label: "Gmail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.gmail || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const cleanGmail = credentials.gmail.trim().toLowerCase();
        const cleanPassword = credentials.password.trim();

        const { data: school, error } = await supabase
          .from("schools")
          .select("*")
          .eq("gmail", cleanGmail)
          .eq("password", cleanPassword)
          .maybeSingle();

        if (error || !school) {
          throw new Error("Invalid credentials. Please check your email and password.");
        }

        return {
          id: String(school.id || school.school_id || cleanGmail),
          role: "school",
          school_id: school.school_id,
          school_name: school.school_name || "School Portal",
          gmail: school.gmail,
          email: school.gmail,
          name: school.school_name,
        };
      },
    }),
    CredentialsProvider({
      id: "student-credentials",
      name: "Student Credentials",
      credentials: {
        gmail: { label: "Gmail", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.gmail) {
          throw new Error("Please enter your email.");
        }

        const cleanGmail = credentials.gmail.trim().toLowerCase();

        const { data: student, error } = await supabase
          .from("student")
          .select("*")
          .eq("gmail", cleanGmail)
          .maybeSingle();

        if (error || !student) {
          throw new Error("Student email not registered. Please contact your school admin.");
        }

        return {
          id: String(student.id || cleanGmail),
          role: "student",
          school_id: student.school_id,
          gmail: student.gmail,
          email: student.gmail,
          name: student.gmail,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.school_id = user.school_id;
        token.school_name = user.school_name;
        token.gmail = user.gmail;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.school_id = token.school_id;
        session.user.school_name = token.school_name;
        session.user.gmail = token.gmail;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
