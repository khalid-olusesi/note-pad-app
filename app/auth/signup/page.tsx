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

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import AppLogo from "@/components/ui/web/AppLogo";
import { signupSchema } from "../schemas/auth";
import { Loader2 } from "lucide-react";

export default function SignUp() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(signupSchema as any),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  // Helper to register without passing value (avoids controlled/uncontrolled warning)
  const registerInput = (
    name: "name" | "email" | "password" | "confirmPassword",
  ) => {
    const { onChange, onBlur, ref, name: fieldName } = register(name);
    return { onChange, onBlur, ref, name: fieldName };
  };

  function onSubmit(data: z.infer<typeof signupSchema>) {
    startTransition(async () => {
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: async () => {
            toast.success("account created successfully");
            // Send verification email
            try {
              await authClient.sendVerificationEmail({
                email: data.email,
              });
            } catch (error) {
              console.error("Failed to send verification email:", error);
            }
            setTimeout(() => {
              router.push("/auth/verify-email");
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
    <Card className="w-full max-w-[420px] mx-auto text-base py-4 px-4 sm:px-6 text-center shadow-2xl rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
      <CardHeader className="text-white text-base pb-2">
        <AppLogo />
        <p className="text-base sm:text-lg mt-1 font-semibold">
          Create an account
        </p>
      </CardHeader>
      <CardDescription className="text-center text-zinc-400 text-[12px] sm:text-xs -mt-1 mb-2">
        Start organizing your notes for free
      </CardDescription>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-2 text-left">
            <Field>
              <FieldLabel className="text-xs py-0.5 text-zinc-300">
                Full Name
              </FieldLabel>
              <input
                className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9 w-full"
                type="text"
                aria-invalid={!!errors.name}
                {...registerInput("name")}
                placeholder="e.g. John Doe"
                defaultValue=""
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            <Field>
              <FieldLabel className="text-xs py-0.5 text-zinc-300">
                Email
              </FieldLabel>
              <input
                className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9 w-full"
                type="email"
                aria-invalid={!!errors.email}
                {...registerInput("email")}
                placeholder="you@example.com"
                defaultValue=""
              />
              {errors.email && <FieldError errors={[errors.email]} />}
            </Field>

            <Field>
              <FieldLabel className="text-xs py-0.5 text-zinc-300">
                Password
              </FieldLabel>
              <input
                className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9 w-full"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                type="password"
                {...registerInput("password")}
                defaultValue=""
              />
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>

            <Field>
              <FieldLabel className="text-xs py-0.5 text-zinc-300">
                Confirm Password
              </FieldLabel>
              <input
                className="py-1.5 px-3 text-sm bg-black/20 border-white/10 text-white focus:border-purple-500 rounded-lg h-9 w-full"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                type="password"
                {...registerInput("confirmPassword")}
                defaultValue=""
              />
              {errors.confirmPassword && (
                <FieldError errors={[errors.confirmPassword]} />
              )}
            </Field>
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
                <span> Create account</span>
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
              <span className="text-zinc-400">Already have an account?</span>{" "}
              <Link
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
                href={"/auth/login"}
              >
                Log in
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
