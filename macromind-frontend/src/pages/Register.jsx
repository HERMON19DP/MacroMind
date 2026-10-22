import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  signupUser,
  verifyOtp,
  resendOtp,
  checkEmailAvailability,
} from "../api/authApi";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary — little exercise" },
  { value: "lightly_active", label: "Lightly active — light exercise" },
  { value: "moderately_active", label: "Moderately active — regular exercise" },
  { value: "very_active", label: "Very active — hard exercise" },
  { value: "extra_active", label: "Extra active — demanding activity" },
];

const WEEKLY_RATES = [
  { value: "0.25", label: "Gradual — 0.25 kg/week" },
  { value: "0.5", label: "Moderate — 0.5 kg/week" },
  { value: "1", label: "Fast — 1 kg/week" },
];

const inputClassName =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all";

const labelClassName = "text-[11.5px] font-medium text-gray-500 block mb-1.5";

export default function Register() {
  usePageTitle("Create account");

  const [step, setStep] = useState(1);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "Lose weight",
    targetWeight: "",
    activityLevel: "lightly_active",
    goalRateKgWeek: "0.25",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const isMaintain = form.goal === "Maintain weight";

  const estimatedTargetDate = (() => {
    if (isMaintain) return null;

    const currentWeight = Number(form.weight);
    const targetWeight = Number(form.targetWeight);
    const rate = Number(form.goalRateKgWeek);

    if (
      !form.weight ||
      !form.targetWeight ||
      !form.goalRateKgWeek ||
      !Number.isFinite(currentWeight) ||
      !Number.isFinite(targetWeight) ||
      !Number.isFinite(rate) ||
      currentWeight <= 0 ||
      targetWeight <= 0 ||
      rate <= 0 ||
      (form.goal === "Gain weight" && targetWeight <= currentWeight) ||
      (form.goal === "Lose weight" && targetWeight >= currentWeight)
    ) {
      return null;
    }

    const weeks = Math.ceil(Math.abs(targetWeight - currentWeight) / rate);

    const date = new Date();
    date.setDate(date.getDate() + weeks * 7);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  })();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (
      !Number.isFinite(age) ||
      age < 13 ||
      age > 120 ||
      !Number.isFinite(height) ||
      height < 50 ||
      height > 300 ||
      !Number.isFinite(weight) ||
      weight < 10 ||
      weight > 500
    ) {
      setError("Please enter valid age, height, and current weight values.");
      return;
    }

    let targetWeightKg = null;
    let goalRateKgWeek = null;

    if (!isMaintain) {
      const targetWeight = Number(form.targetWeight);
      const rate = Number(form.goalRateKgWeek);

      if (
        !form.targetWeight ||
        !Number.isFinite(targetWeight) ||
        targetWeight < 10 ||
        targetWeight > 500
      ) {
        setError("Enter a valid target weight between 10 and 500 kg.");
        return;
      }

      if (
        (form.goal === "Gain weight" && targetWeight <= weight) ||
        (form.goal === "Lose weight" && targetWeight >= weight)
      ) {
        setError(
          form.goal === "Gain weight"
            ? "Your target weight must be higher than your current weight."
            : "Your target weight must be lower than your current weight.",
        );
        return;
      }

      if (![0.25, 0.5, 1].includes(rate)) {
        setError("Select a valid weekly weight-change rate.");
        return;
      }

      targetWeightKg = targetWeight;
      goalRateKgWeek = rate;
    }

    setLoading(true);

    try {
      const response = await signupUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        age,
        gender: form.gender,
        height,
        weight,
        goal: form.goal,
        targetWeightKg,
        activityLevel: form.activityLevel,
        goalRateKgWeek,
      });

      setOtpStep(true);
      setOtp("");
      setMessage(
        response.data?.message || "Verification code sent. Check your email.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not start registration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp({
        email: form.email.trim().toLowerCase(),
        otp,
      });

      const auth = response.data;

      if (!auth?.user || !auth?.accessToken || !auth?.refreshToken) {
        throw new Error(
          "Verification succeeded, but authentication details were missing.",
        );
      }

      login(auth.user, auth.accessToken, auth.refreshToken);
      navigate("/overview", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await resendOtp({
        email: form.email.trim().toLowerCase(),
      });

      setOtp("");
      setMessage(
        response.data?.message || "A new verification code has been sent.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not resend the code. Please try again later.",
      );
    } finally {
      setResending(false);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const email = form.email.trim().toLowerCase();

    if (!email) {
      setError("Enter your email address.");
      return;
    }

    setCheckingEmail(true);

    try {
      await checkEmailAvailability(email);

      set("email", email);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not verify this email. Please try again.",
      );
    } finally {
      setCheckingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center mx-auto mb-3">
            <Leaf size={20} className="text-white" />
          </div>

          <h1 className="text-[22px] font-semibold text-gray-900">
            {otpStep ? "Verify your email" : "Create account"}
          </h1>

          {!otpStep && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === step ? "w-6 bg-brand-400" : "w-3 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {otpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-[13px] text-gray-500">
                Enter the six-digit code sent to
              </p>

              <p className="text-[13px] font-medium text-gray-800 break-all">
                {form.email}
              </p>

              <div>
                <label className={labelClassName}>Verification code</label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="text-sm text-green-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || resending}
                className="w-full bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-60 transition-colors"
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>

              <button
                type="button"
                disabled={resending || loading}
                onClick={handleResendOtp}
                className="w-full text-brand-600 text-[13px] font-medium hover:underline disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend verification code"}
              </button>

              <button
                type="button"
                disabled={loading || resending}
                onClick={() => {
                  setOtpStep(false);
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="w-full text-gray-500 text-[12px] hover:underline disabled:opacity-60"
              >
                Back to registration
              </button>
            </form>
          ) : step === 1 ? (
            <form onSubmit={handleContinue} className="space-y-3.5">
              <p className="text-[12px] text-gray-400 mb-1">
                Step 1 of 2 — account details
              </p>

              {[
                {
                  label: "Full name",
                  key: "name",
                  type: "text",
                  placeholder: "Peter P",
                },
                {
                  label: "Email",
                  key: "email",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  label: "Password",
                  key: "password",
                  type: "password",
                  placeholder: "At least 8 characters",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClassName}>{field.label}</label>

                  <input
                    type={field.type}
                    required
                    minLength={field.key === "password" ? 8 : undefined}
                    maxLength={field.key === "password" ? 72 : undefined}
                    value={form[field.key]}
                    onChange={(e) => set(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClassName}
                  />
                </div>
              ))}

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={checkingEmail}
                className="w-full bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-60 transition-colors mt-1"
              >
                {checkingEmail ? "Checking email..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <p className="text-[12px] text-gray-400 mb-1">
                Step 2 of 2 — your health profile
              </p>

              <div>
                <label htmlFor="gender" className={labelClassName}>
                  Gender
                </label>

                <select
                  id="gender"
                  required
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Age",
                    key: "age",
                    placeholder: "21",
                    min: 13,
                    max: 120,
                  },
                  {
                    label: "Height (cm)",
                    key: "height",
                    placeholder: "175",
                    min: 50,
                    max: 300,
                  },
                  {
                    label: "Current weight (kg)",
                    key: "weight",
                    placeholder: "79",
                    min: 10,
                    max: 500,
                  },
                ].map((field) => (
                  <div
                    key={field.key}
                    className={field.key === "weight" ? "col-span-2" : ""}
                  >
                    <label className={labelClassName}>{field.label}</label>

                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step="any"
                      required
                      value={form[field.key]}
                      onChange={(e) => set(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClassName}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="activityLevel" className={labelClassName}>
                  Activity level
                </label>

                <select
                  id="activityLevel"
                  required
                  value={form.activityLevel}
                  onChange={(e) => set("activityLevel", e.target.value)}
                  className={inputClassName}
                >
                  {ACTIVITY_LEVELS.map((activity) => (
                    <option key={activity.value} value={activity.value}>
                      {activity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Your goal</label>

                <div className="grid grid-cols-3 gap-2">
                  {["Lose weight", "Gain weight", "Maintain weight"].map(
                    (goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => {
                          set("goal", goal);
                          setError("");
                        }}
                        aria-pressed={form.goal === goal}
                        className={`py-2 rounded-xl text-[12px] font-medium border transition-colors ${
                          form.goal === goal
                            ? "bg-brand-50 border-brand-300 text-brand-700"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {goal === "Maintain weight" ? "Maintain" : goal}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {!isMaintain && (
                <div className="space-y-3 rounded-xl bg-gray-50 border border-gray-100 p-3.5">
                  <div>
                    <label htmlFor="targetWeight" className={labelClassName}>
                      Target weight (kg)
                    </label>

                    <input
                      id="targetWeight"
                      type="number"
                      min="10"
                      max="500"
                      step="0.1"
                      required
                      value={form.targetWeight}
                      onChange={(e) => set("targetWeight", e.target.value)}
                      placeholder={
                        form.goal === "Gain weight"
                          ? "Your desired weight"
                          : "Your target weight"
                      }
                      className={inputClassName}
                    />

                    {form.weight && form.targetWeight && (
                      <p className="text-[11px] text-gray-500 mt-1.5">
                        {form.goal === "Gain weight"
                          ? Number(form.targetWeight) > Number(form.weight)
                            ? `Gain ${(
                                Number(form.targetWeight) - Number(form.weight)
                              ).toFixed(1)} kg`
                            : "Target must be above your current weight."
                          : Number(form.targetWeight) < Number(form.weight)
                            ? `Lose ${(
                                Number(form.weight) - Number(form.targetWeight)
                              ).toFixed(1)} kg`
                            : "Target must be below your current weight."}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="goalRateKgWeek" className={labelClassName}>
                      Preferred weekly rate
                    </label>

                    <select
                      id="goalRateKgWeek"
                      required
                      value={form.goalRateKgWeek}
                      onChange={(e) => set("goalRateKgWeek", e.target.value)}
                      className={inputClassName}
                    >
                      {WEEKLY_RATES.map((rate) => (
                        <option key={rate.value} value={rate.value}>
                          {rate.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    role="status"
                    className="rounded-lg border border-brand-100 bg-white px-3 py-2.5"
                  >
                    <p className="text-[11px] text-gray-500">
                      Estimated target date
                    </p>

                    <p className="text-[13px] font-semibold text-brand-700 mt-0.5">
                      {estimatedTargetDate || "Enter a valid target weight"}
                    </p>

                    <p className="text-[10.5px] text-gray-400 mt-1">
                      This is an estimate based on your selected weekly rate.
                      Actual progress may vary.
                    </p>
                  </div>
                </div>
              )}

              {isMaintain && (
                <p className="text-[11.5px] text-gray-500">
                  We'll help you maintain your current weight. You don't need to
                  set a target weight or timeline.
                </p>
              )}

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setMessage("");
                  }}
                  disabled={loading}
                  className="flex-1 border border-gray-200 text-[13px] font-medium py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 disabled:opacity-60 transition-colors"
                >
                  {loading ? "Sending code..." : "Send verification code"}
                </button>
              </div>
            </form>
          )}
        </div>

        {!otpStep && (
          <p className="text-center text-[12px] text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
