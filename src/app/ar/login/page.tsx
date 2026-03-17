import LoginView from "@/components/auth/LoginView";

export const metadata = {
  title: "تسجيل دخول المسؤول • KOMC",
  description: "وصول آمن إلى لوحة تحكم KOMC للمستخدمين المخوّلين.",
};

export default function LoginPage() {
  return <LoginView lang="ar" />;
}
