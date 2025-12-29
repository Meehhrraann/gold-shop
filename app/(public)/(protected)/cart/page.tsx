import { auth } from "@/auth";
import { getCart } from "@/lib/actions/cart.actions";
import { CartList } from "@/components/cart/CartList";
import { CheckoutSummary } from "@/components/cart/CheckoutSummary";

export default async function CartPage() {
  const session = await auth();

  // Initial pre-fetch for Server Component benefits (Optional but recommended)
  const initialCart = session?.user?.id ? await getCart(session.user.id) : [];

  return (
    <div className="container mx-auto mt-10 mb-20 px-4">
      <h1 className="text-primary mb-8 text-right text-2xl font-bold">
        سبد خرید شما
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row-reverse">
        {/* Main List */}
        <div className="flex-1">
          <CartList />
        </div>

        {/* Sidebar Summary */}
        <aside className="">
          <CheckoutSummary />
        </aside>
      </div>
    </div>
  );
}
