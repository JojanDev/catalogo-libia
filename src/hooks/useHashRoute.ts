import { useState, useEffect, useCallback } from "react";

export interface RouteParts {
  page: string;
  coleccion: string | null;
  productoId: number | null;
}

function parseHash(): RouteParts {
  const hash = window.location.hash.replace(/^#\//, "") || "landing";
  const parts = hash.split("/");

  if (parts[0] === "coleccion" && parts[1]) {
    return { page: parts[0], coleccion: parts[1], productoId: null };
  }

  if (parts[0] === "producto" && parts[1]) {
    const id = Number(parts[1]);
    return { page: "producto", coleccion: null, productoId: Number.isNaN(id) ? null : id };
  }

  return { page: parts[0], coleccion: null, productoId: null };
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteParts>(parseHash);

  const handleHashChange = useCallback(() => {
    setRoute(parseHash());
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const navigate = useCallback((path: string) => {
    window.location.hash = `#/${path}`;
  }, []);

  return { route, navigate };
}
