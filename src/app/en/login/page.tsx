import LoginView from "@/components/auth/LoginView";

export const metadata = {
  title: "Admin Login • KOMC",
  description: "Secure access to the KOMC admin dashboard for authorized users.",
};

export default function LoginPage() {
  return <LoginView lang="en" />;
}
