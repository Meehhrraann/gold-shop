import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <h2 className="text-primary mb-4 text-4xl font-bold">
        محتوای مورد نظر پیدا نشد
      </h2>

      <Link
        href="/products"
        className="border-primary border-b-2 text-gray-300"
      >
        مشاهده همه محصولات
      </Link>
    </div>
  );
}
