import React, {
  useState
} from "react";

import {
  Navigate,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../components/Card";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { TrendingUp } from "lucide-react";

import { toast } from "sonner";

export function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isSubmitting,
    setIsSubmitting] =
    useState(false);

  const {
    login,
    user,
    isLoading
  } = useAuth();

  const navigate =
    useNavigate();

  if (isLoading) return null;

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setIsSubmitting(
          true
        );

        await login(
          email,
          password
        );

        toast.success(
          "Login successful"
        );

        navigate("/");

      } catch {

        toast.error(
          "Invalid credentials"
        );

      } finally {

        setIsSubmitting(
          false
        );
      }
    };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">

      <Card className="w-full max-w-md">

        <CardHeader className="text-center">

          <div className="flex justify-center mb-4">

            <div className="bg-primary text-primary-foreground p-3 rounded-xl">

              <TrendingUp className="h-8 w-8" />

            </div>

          </div>

          <CardTitle>
            Login
          </CardTitle>

          <CardDescription>
            Enter your account details
          </CardDescription>

        </CardHeader>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <CardContent className="space-y-4">

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </CardContent>

          <CardFooter>

            <Button
              className="w-full"
              type="submit"
              disabled={
                isSubmitting
              }
            >

              {isSubmitting
                ? "Signing In..."
                : "Login"}

            </Button>

          </CardFooter>

        </form>

      </Card>

    </div>
  );
}