import { useState } from "react";
import {authService} from "../client/src/services/api";

export default function AuthCard({ onAuth }) {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function update(e) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);

    if (!form.email || !form.password || (isSignup && !form.name)) {
      setMsg({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isSignup) {
        result = await authService.register(form);
      } else {
        result = await authService.login(form);
      }

      const { token, user } = result;
      setMsg({
        type: "success",
        text: isSignup ? "Registered successfully." : "Logged in successfully.",
      });
      
      if (typeof onAuth === "function") {
        onAuth({ token, user });
      }

      // Clear form after successful auth
      setForm({ name: "", email: "", password: "" });
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data?.errors?.[0]?.msg
        || err.message 
        || "An error occurred";
      setMsg({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xs mx-auto  my-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-center text-indigo-600 mb-4">
        {isSignup ? "Sign Up" : "Log In"}
      </h2>

      {/* Message Alert */}
      {msg && (
        <div
          className={`p-2 mb-4 rounded-md text-sm font-medium  border ${
            msg.type === "error"
              ? "bg-red-100 text-xs text-red-700 border-red-300"
              : "bg-green-100 text-xs text-green-700 border-green-300"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-3">
        {isSignup && (
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={update}
              disabled={loading}
              className="w-full px-2.5 py-1.5 text-sm placeholder:text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500  focus:outline-none placeholder-gray-400 text-gray-800"
            />
          </div>
        )}

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={update}
            disabled={loading}
            className="w-full px-2.5 py-1.5 text-sm placeholder:text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500  focus:outline-none placeholder-gray-400 text-gray-800"
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={update}
            disabled={loading}
            className="w-full px-2.5 py-1.5 text-sm placeholder:text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500  focus:outline-none placeholder-gray-400 text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 text-white text-sm font-semibold rounded-md transition-colors duration-300
          bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      {/* Switch form type */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setMsg(null);
          }}
          className="font-semibold text-xs text-indigo-500 hover:text-red-500 hover:cursor-pointer focus:outline-none"
        >
          {isSignup ? "Log in" : "Sign up"}
        </button>
      </div>
    </div>
  );
}
