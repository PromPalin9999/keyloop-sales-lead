import { KlCard } from "@/components";
import { LoginForm } from "./components";

const LoginPage = () => {
  return (
    <main className="fixed inset-0 flex items-center justify-center">
      <KlCard>
        <img
          src="/kl-avt.png"
          alt="logo"
          className="mx-auto mb-8 max-h-8 w-auto"
        />

        <LoginForm />
      </KlCard>
    </main>
  );
};

export default LoginPage;
