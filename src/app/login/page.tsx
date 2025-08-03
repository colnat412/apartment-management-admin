"use client";

import { LoginPage } from "@/app/login/_components/page";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-grow flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginPage />
      </div>
    </div>
  );
}
