import { auth, signOut } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();
  // console.log("session",session?.user)
  return (
    <div>
    <div>{JSON.stringify(session)}</div>
    <form action={async () => {
      "use server"

      await signOut();
    }}>
      <button type="submit">
        Sign out
      </button>
    </form>
    </div>
  )
}
export default SettingsPage