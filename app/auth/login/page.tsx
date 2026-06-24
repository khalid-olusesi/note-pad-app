"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { loginSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AppLogo from "@/components/ui/web/AppLogo";

export default function LogIn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully");
            setTimeout(() => {
              router.push("/main");
            }, 500);
          },

          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  return (
    <>
      <Card className="w-full max-w-[420px] mx-auto text-base py-4 px-4 sm:px-6 text-center shadow-2xl rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
        <CardHeader className="text-white text-base pb-2">
          <AppLogo />
          <p className="text-base sm:text-lg mt-1 font-semibold">
            Welcome back
          </p>
        </CardHeader>
        <CardDescription className="text-center text-zinc-400 text-[12px] sm:text-xs -mt-1 mb-2">
          Login to view your notes
        </CardDescription>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-2 text-left">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel className="text-xs py-0.5 text-zinc-300">
                        Email
                      </FieldLabel>
                      <Input
                        className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field>
                      <FieldLabel className="text-xs py-0.5 text-zinc-300">
                        Password
                      </FieldLabel>
                      <Input
                        className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9"
                        placeholder="••••••••"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  );
                }}
              />
              <Button
                disabled={isPending}
                type="submit"
                className="mt-2 py-2 px-4 text-sm font-semibold rounded-lg cursor-pointer bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 w-full h-9"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span> Log in</span>
                )}
              </Button>

              <div className="relative my-3">
                <Separator className="bg-white/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-[#09090b] px-2 text-[11px] text-zinc-500">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="py-2 flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-white/5 border-white/10 hover:bg-white/10 text-white transition-colors w-full h-9"
                onClick={() => {
                  authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/main",
                  });
                }}
              >
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="Google icon"
                  width={14}
                  height={14}
                />
                <span className="text-xs">Continue with Google</span>
              </Button>

              <p className="text-center text-[11px] flex justify-center items-center gap-1.5 mt-3">
                <span className="text-zinc-400">Don't have an account?</span>{" "}
                <Link
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                  href={"/auth/signup"}
                >
                  Sign up
                </Link>
              </p>

              <p className="text-center text-[11px] flex justify-center items-center mt-2">
                <a
                  className="text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer underline"
                  href="tel:09038244886"
                >
                  Contact Us
                </a>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
