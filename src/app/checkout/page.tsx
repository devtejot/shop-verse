"use client";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
} from "lucide-react";

type Step = "shipping" | "payment" | "confirmation";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
};

function inputCls(err?: string) {
  return `w-full px-4 py-2.5 rounded-lg border ${err ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-gray-400 focus:ring-gray-100"} focus:outline-none focus:ring-2 transition-colors text-sm`;
}

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("shipping");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [orderId] = useState(
    () => `TS-${Math.floor(Math.random() * 900000 + 100000)}`,
  );

  function update(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateShipping(): boolean {
    const e: Partial<FormData> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment(): boolean {
    const e: Partial<FormData> = {};
    if (form.cardNumber.replace(/\s/g, "").length < 12)
      e.cardNumber = "Enter valid card number";
    if (!form.cardExpiry.includes("/")) e.cardExpiry = "Format MM/YY";
    if (form.cardCvc.length < 3) e.cardCvc = "3-4 digits";
    if (!form.cardName.trim()) e.cardName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePlaceOrder() {
    if (!validatePayment()) return;
    setStep("confirmation");
    clearCart();
  }

  function formatCardNumber(val: string) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(val: string) {
    const cleaned = val.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3)
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order placed</h1>
        <p className="text-gray-500 mb-1">Thank you, {form.firstName}.</p>
        <p className="text-gray-400 text-sm mb-6">
          Order{" "}
          <span className="font-mono text-gray-700 font-bold">{orderId}</span>{" "}
          will be delivered to {form.address}, {form.city}.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-600 mb-4">
          Your cart is empty
        </h1>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const STEPS: Step[] = ["shipping", "payment"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/cart"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${step === s ? "bg-gray-900 text-white" : STEPS.indexOf(step) > i ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
            >
              {STEPS.indexOf(step) > i ? "✓" : i + 1}
              <span className="capitalize">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-6 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <div
              key="shipping"
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-semibold text-gray-900">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First name *
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className={inputCls(errors.firstName)}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last name *
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className={inputCls(errors.lastName)}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputCls(errors.email)}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address *
                </label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className={inputCls(errors.address)}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    City *
                  </label>
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={inputCls(errors.city)}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ZIP code *
                  </label>
                  <input
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className={inputCls(errors.zip)}
                  />
                  {errors.zip && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.zip}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateShipping()) setStep("payment");
                }}
                className="btn-primary w-full py-3"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div
              key="payment"
              className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-semibold text-gray-900">Payment Details</h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Card number *
                </label>
                <input
                  value={form.cardNumber}
                  onChange={(e) =>
                    update("cardNumber", formatCardNumber(e.target.value))
                  }
                  className={inputCls(errors.cardNumber)}
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Cardholder name *
                </label>
                <input
                  value={form.cardName}
                  onChange={(e) => update("cardName", e.target.value)}
                  className={inputCls(errors.cardName)}
                />
                {errors.cardName && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {errors.cardName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Expiry *
                  </label>
                  <input
                    value={form.cardExpiry}
                    onChange={(e) =>
                      update("cardExpiry", formatExpiry(e.target.value))
                    }
                    className={inputCls(errors.cardExpiry)}
                    maxLength={5}
                  />
                  {errors.cardExpiry && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {errors.cardExpiry}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    CVC *
                  </label>
                  <input
                    value={form.cardCvc}
                    onChange={(e) =>
                      update(
                        "cardCvc",
                        e.target.value.replace(/\D/g, "").slice(0, 4),
                      )
                    }
                    className={inputCls(errors.cardCvc)}
                    maxLength={4}
                  />
                  {errors.cardCvc && (
                    <p className="text-xs text-red-500 mt-0.5">
                      {errors.cardCvc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="btn-secondary px-4 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="btn-primary flex-1 py-3"
                >
                  Place Order — ${totalPrice().toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">
              Order ({totalItems()} items)
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => {
                const discounted =
                  item.product.price *
                  (1 - item.product.discountPercentage / 100);
                return (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">
                      ${(discounted * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">
                ${totalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
