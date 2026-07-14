import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";

export function useHistoryNavigation() {
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "id";

  useEffect(() => {
    const homePath = `/${lang}`;
    const isHome = pathname === homePath;

    if (isHome) {
      window.history.pushState(null, "", homePath);
    } else {
      window.history.replaceState(null, "", homePath);
      window.history.pushState(null, "", pathname);
    }
  }, [lang, pathname]);
}
