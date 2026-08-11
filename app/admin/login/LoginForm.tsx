"use client";
import { useActionState } from "react";
import { loginAdmin, type AdminLoginState } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const initialState: AdminLoginState = {
    status: "idle",
    message: "",
};
const LoginForm = ({ disabled }: {
    disabled: boolean;
}) => {
    const [state, formAction, pending] = useActionState(loginAdmin, initialState);
    const isDisabled = disabled || pending;
    return (<Card>
      <CardHeader>
        <CardTitle>Admin sign in</CardTitle>
        <CardDescription>Use a Supabase Auth user allowed to manage articles.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input name="email" type="email" autoComplete="email" required disabled={isDisabled} placeholder="you@example.com"/>
          </div>

          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input name="password" type="password" autoComplete="current-password" required disabled={isDisabled}/>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
            {state.message ? (<div aria-live="polite" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {state.message}
              </div>) : null}

            <Button type="submit" disabled={isDisabled} className="ml-auto">
              <span className="icon-[lucide--log-in] size-4" aria-hidden="true"/>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);
};
export default LoginForm;
