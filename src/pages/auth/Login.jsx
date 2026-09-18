import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShoppingCart, Percent } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/common/Logo";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function Login() {

 const navigate = useNavigate();
const { login } = useAuth();

const [showPassword, setShowPassword] = useState(false);

const [formData, setFormData] = useState({
  email: "",
  password: "",
  rememberMe: false,
});

const handleChange = (event) => {
  const { name, value, type, checked } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: type === "checkbox" ? checked : value,
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();

  login({
    id: 1,
    name: "Lokesh Kumar",
    email: formData.email.trim(),
    phone: "+91 98765 43210",
    role: "CUSTOMER",
  });

  navigate("/home");
};

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative hidden min-h-[600px] overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 md:flex">
            {/* Decorative glow */}
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col items-center justify-between px-10 py-12 text-center">
              {/* Logo */}
              <div>
                <Logo dark />
              </div>

              {/* Main text */}
              <div className="flex flex-col items-center">
                <h1 className="mt-8 text-3xl font-bold leading-tight text-white">
                  Best Deals. Fast Orders.
                </h1>

                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">
                  Limited Stock. Big Savings.
                </p>

                {/* Illustration */}
                <div className="relative mt-12 flex h-48 w-64 items-end justify-center">
                  {/* Cart */}
                  <div className="relative rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                    <ShoppingCart
                      size={92}
                      strokeWidth={1.2}
                      className="text-slate-200"
                    />

                    {/* Percentage badge */}
                    <div className="absolute -right-5 -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 shadow-lg">
                      <Percent
                        size={28}
                        strokeWidth={2.5}
                        className="text-slate-950"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom text */}
              <p className="text-xs text-slate-400">Shop smarter. Save more.</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex min-h-[600px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            {/* Mobile logo */}
            <div className="mb-8 flex justify-center md:hidden">
              <Logo />
            </div>

            {/* Tabs */}
            <div className="mb-8 flex border-b border-slate-200">
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
                Login
              </button>

              <Link
                to="/signup"
                className="
    w-1/2
    border-b-2
    border-transparent
    pb-3
    text-center
    text-sm
    font-medium
    text-slate-500
    transition
    hover:text-indigo-600
  "
              >
                Sign Up
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Back!
              </h2>

              <p className="mt-1 text-sm text-slate-500">Login to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
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
                      bg-white
                      px-3
                      py-2.5
                      pr-11
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-indigo-500
                      focus:ring-2
                      focus:ring-indigo-100
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      hover:text-slate-600
                    "
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <span className="text-xs text-slate-600">Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button */}
              <Button type="submit">Login</Button>
            </form>

            {/* Signup */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
