import { CashSessionForm } from "@/components/CashSessionForm";
import { NavBar } from "@/components/NavBar";

import { createCashSession } from "./actions";

export default function NewCashSession() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title="Cash Session" backHref="/sessions/new" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12 pt-4">
        <CashSessionForm action={createCashSession} />
      </main>
    </div>
  );
}
