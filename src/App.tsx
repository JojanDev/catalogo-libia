import { useHashRoute } from "./hooks/useHashRoute.ts";
import { LandingPage } from "./features/landing/LandingPage.tsx";
import { Prototipo2Page } from "./features/prototipo-2/Prototipo2Page.tsx";
import { Prototipo3Page } from "./features/prototipo-3/Prototipo3Page.tsx";
import { CheckoutPage } from "./features/checkout/CheckoutPage.tsx";

export function App() {
  const { route } = useHashRoute();

  switch (route.page) {
    case "catalogo":
      return <Prototipo2Page />;
    case "catalogo-admin":
      return <Prototipo3Page />;
    case "checkout":
      return <CheckoutPage />;
    default:
      return <LandingPage />;
  }
}
