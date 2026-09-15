import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { NavBar } from "@/components/NavBar";

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Change Password" backHref="/settings" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pt-8">
        <ChangePasswordForm />
      </main>
    </div>
  );
}
