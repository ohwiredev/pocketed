import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { signOut } = useAuth()

  return (
    <div className="home-page">
      <h1>Home</h1>

      <button onClick={signOut}>Logout</button>
    </div>
  );
}
