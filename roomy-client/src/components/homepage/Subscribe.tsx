"use client";

import { useCreateCheckoutSessionMutation } from "@/store/services/stripe-service";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function Subscribe() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPaymentSuccess = searchParams.get("success");
  console.log(isPaymentSuccess, "isPaymentSuccess");
  const [
    createCheckoutSession,
    { data, isLoading, isError, error, isSuccess },
  ] = useCreateCheckoutSessionMutation();
  function handlePayment() {
    createCheckoutSession();
  }
  useEffect(() => {
    if (isError) {
      if (error && "status" in error && error.status === 409) {
        toast.success("You already have an active subscription.");
        window.open(
          (error as { data: { redirectUrl: string } }).data.redirectUrl,
          "_blank"
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
    if (isSuccess) {
      toast.success("Checkout session created successfully.");
      const url = `https://checkout.stripe.com/c/pay/${data.id}#fidkdWxOYHwnPyd1blpxYHZxWjA0VTF8PDNMc3RzcURzQk1Kbn9Tbm5uYEt3NXxyNHNJcXUxaDNAajJhYz1kSjdjfTdQbG5XcnVdam9mNUNcZHBRUE5hc39HUjByMmw1dkd0NEtNaFxAVHFHNTU9fVNNSkIwQScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl`;
      router.push(url);
    }
    if (isPaymentSuccess == "true") {
      toast.success("Payment was successful.");
      router.push("/");
    }
    if (isPaymentSuccess == "false") {
      toast.error("Payment was not successful. Please try again.");
      router.push("/");
    }
  }, [isError, data, isSuccess, isPaymentSuccess, error, router]);

  return (
    <>
      <Toaster></Toaster>
      <div className="pt-5 bg-gray-900" id="scrollsub">
        <div className="mx-auto pb-20 mt-4 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-base font-semibold leading-7 text-indigo-400">
              Pricing
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Whether it is just you, or your entire team - we have got you
              covered.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
            Choose the product that works best for you and your team, and enjoy
            all the benefits of our platform. From listing postings to allowing
            subscribed customers to contact you, Roomy offers a seamless
            experience for individuals and teams alike. Plus, with our secure
            payment processing through Stripe, you can trust that your
            transactions are safe and reliable.
          </p>
          <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="ring-1 ring-white/10 rounded-3xl p-8 xl:p-10">
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  id="product1"
                  className="text-lg font-semibold leading-8 text-white"
                >
                  Free Tier
                </h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Unpaid plan for those who want to try out the platform
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  Free
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300"></span>
              </p>
              <a
                aria-describedby="product1"
                className="bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Already subscribed
              </a>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  View all listings
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Search for listings and filter by location
                </li>
              </ul>
            </div>

            <div className="bg-white/5 ring-2 ring-indigo-500 rounded-3xl p-8 xl:p-10">
              <div className="flex items-baseline justify-between gap-x-4">
                <h2
                  id="product2"
                  className="text-lg font-semibold leading-8 text-white"
                >
                  Monthly Subscription
                </h2>
                <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                  Most popular
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Perfect for those who want to contact unlimited listings
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  $ 20 / month
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300"></span>
              </p>

              {isLoading ? (
                <a
                  href="#"
                  className="bg-[#5c4cda] text-white shadow-sm hover:bg-[#4b3fb8] focus-visible:outline-[#5c4cda] mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Loading...
                </a>
              ) : (
                <button
                  onClick={handlePayment}
                  className="bg-[#5c4cda] text-white shadow-sm hover:bg-[#4b3fb8] focus-visible:outline-[#5c4cda] mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ width: "100%" }}
                >
                  Try Now
                </button>
              )}

              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Contact unlimited listings
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  24/7 customer support
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Manage your subscription
                </li>
              </ul>
            </div>

            <div className="ring-1 ring-white/10 rounded-3xl p-8 xl:p-10">
              <div className="flex items-center justify-between gap-x-4">
                <h2
                  id="product3"
                  className="text-lg font-semibold leading-8 text-white"
                >
                  Enterprise Plan
                </h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                For large teams or companies that need a custom solution
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  Contact us
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-300"></span>
              </p>
              <button
                onClick={() => {
                  // open email client
                  window.location.href = "mailto:test@test.com";
                }}
                className="bg-[#5c4cda] text-white shadow-sm hover:bg-[#4b3fb8] focus-visible:outline-[#5c4cda] mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ width: "100%" }}
              >
                Contact us
              </button>

              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Custom branding
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Premium features
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-6 w-5 flex-none text-white"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
