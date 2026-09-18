import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Signup form:", formData);

    alert("Signup functionality will be connected to the backend later.");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">

          {/* LEFT */}
          <div className="relative hidden min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 md:flex">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col items-center justify-center px-10 text-center">
              <Logo dark />

              <h1 className="mt-10 text-3xl font-bold text-white">
                Join FlashSale
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                Discover amazing deals and experience fast,
                secure shopping.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex min-h-[600px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">

            <div className="mb-8 flex justify-center md:hidden">
              <Logo />
            </div>

            {/* Tabs */}
            <div className="mb-8 flex border-b border-slate-200">
           <Link
  to="/login"
  className="
    w-1/2
    border-b-2
    border-transparent
    pb-3
    text-center
    text-sm
    font-medium
    text-slate-500
    hover:text-indigo-600
  "
>
  Login
</Link>

              <button
                className="
                  w-1/2
                  border-b-2
                  border-indigo-600
                  pb-3
                  text-sm
                  font-semibold
                  text-indigo-600
                "
              >
                Sign Up
              </button>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign up to start shopping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                label="Full Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      px-3
                      py-2.5
                      pr-11
                      text-sm
                      outline-none
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button type="submit">
                Create Account
              </Button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
  to="/login"
  className="font-semibold text-indigo-600 hover:text-indigo-700"
>
  Login
</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;