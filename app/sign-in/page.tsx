"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
 
export default function SignIn() {
  const router = useRouter();
  return (
        <div className="flex justify-center items-center w-screen h-screen">
            <button
              className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
              onClick={() => {
              signIn("google")
              .then(() => {
                  router.push("/");
              })
            }}>Sign in with google</button>
        </div>
    )
}