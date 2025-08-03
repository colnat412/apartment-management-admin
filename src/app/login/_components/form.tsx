import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormSchema, LoginFormValues } from "./validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
export function LoginForm() {
  const { login, isPending } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),

    defaultValues: {
      identifier: "",
      password: ""
    }
  });
  const onSubmit = (values: LoginFormValues) => {
    if (values.identifier && values.password) {
      login(values.identifier, values.password, form.setError);
    }
  };

  return (
    <Form {...form}>
      <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Login to your Acme Inc account
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Tên đăng nhập" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder="Mật khẩu" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-3 flex flex-col items-center">
          <span className="text-center text-sm text-destructive">
            {form.formState.errors.root?.message}
          </span>
        </div>
        <Button className="mt-4 w-full" disabled={isPending} type="submit">
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
