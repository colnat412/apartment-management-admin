import Link from "next/link";

import { LoginForm } from "./form";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginForm />

          <div className="relative hidden bg-muted md:block">
            {/* <Image
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              src="/placeholder.svg"
            /> */}
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
