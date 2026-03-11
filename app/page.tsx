import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session?.user?.image)

  return (
    <div className="flex-col justify-center items-center w-full">
      <h1>Welcome, {session?.user?.name}!</h1>
      <p>Email: {session?.user?.email}</p>
      <img src={session?.user?.image as string} alt="Profile Picture" className="rounded-full w-16 h-16" />
    </div>
  );
}
