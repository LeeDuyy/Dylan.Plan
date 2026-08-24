import { signIn } from "@/auth";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl ?? "/" });
        }}
      >
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Đăng nhập bằng Google
        </button>
      </form>
    </div>
  );
}
