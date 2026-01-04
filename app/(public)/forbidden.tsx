// app/forbidden.tsx
import Link from "next/link";
import { ShieldAlert } from "lucide-react"; // Optional: npm install lucide-react

export default function Forbidden() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Icon and Error Code */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <p className="text-base font-semibold text-red-600">خطای ۴۰۳</p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          دسترسی غیرمجاز
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-600">
          متأسفانه شما اجازه دسترسی به این بخش از سایت را ندارید.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/auth/login"
            className="text-sm font-semibold text-gray-900 transition-colors hover:text-indigo-600"
          >
            ورود با حساب کاربری دیگر <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
