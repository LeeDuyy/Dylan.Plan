import { BriefcaseBusiness, ShieldCheck, WalletCards } from "lucide-react";

import { signIn } from "@/auth";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Email này chưa được cấp quyền truy cập Dylan Plan.",
  Configuration: "Hệ thống đăng nhập đang gặp sự cố cấu hình, thử lại sau.",
  Verification: "Liên kết đăng nhập đã hết hạn hoặc không hợp lệ."
};

const showcaseFeatures = [
  [BriefcaseBusiness, "Theo dõi roadmap 40M net", "Pipeline ứng tuyển, phỏng vấn và offer trong một nơi duy nhất."],
  [WalletCards, "Quản lý thu chi cá nhân", "Nhập nhanh chi tiêu, theo dõi ngân sách 35M/tháng theo danh mục."],
  [ShieldCheck, "Riêng tư và bảo mật", "Chỉ tài khoản Google được cấp quyền mới truy cập được dữ liệu."]
] as const;

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const errorMessage = error ? AUTH_ERROR_MESSAGES[error] ?? "Đăng nhập không thành công, vui lòng thử lại." : null;

  return (
    <div className="auth-shell">
      <div className="auth-grid">
        <aside className="auth-showcase">
          <div className="auth-brand">
            <span className="auth-badge">D</span>
            <span>Dylan Plan</span>
          </div>
          <span className="auth-eyebrow">Career · Buy to Build · Finance</span>
          <h1>
            Kế hoạch sự nghiệp,
            <br />
            sản phẩm và thu chi
          </h1>
          <div className="auth-features">
            {showcaseFeatures.map(([Icon, title, desc]) => (
              <div className="auth-feature" key={title}>
                <Icon size={20} />
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="auth-panel">
          <div>
            <h2>Đăng nhập để tiếp tục</h2>
            <p className="muted">Sử dụng tài khoản Google đã được cấp quyền để vào dashboard.</p>
          </div>

          {errorMessage ? <div className="auth-error">{errorMessage}</div> : null}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl ?? "/" });
            }}
          >
            <button className="google-btn" type="submit">
              <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20">
                <path
                  d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.78-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.82z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.94H1.3v3.1C3.27 21.3 7.31 24 12 24z"
                  fill="#34A853"
                />
                <path d="M5.3 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3v-3.1H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4-3.1z" fill="#FBBC05" />
                <path
                  d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.6l4 3.1c.94-2.83 3.58-4.95 6.7-4.95z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập bằng Google
            </button>
          </form>

          <p className="auth-note">Ứng dụng riêng tư — chỉ dành cho tài khoản được cấp quyền truy cập.</p>
        </div>
      </div>
    </div>
  );
}
