import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error(
        "All fields are required"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name,
              email,
              password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      toast.success(
        "Registration successful"
      );

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.message ||
          "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
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
            Create Account
          </CardTitle>

          <CardDescription>
            Register to manage your
            watchlist
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <Input
              type="email"
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

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "Creating Account..."
                : "Register"}
            </Button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}