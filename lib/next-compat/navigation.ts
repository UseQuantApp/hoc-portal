import {
  useNavigate,
  useLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from 'react-router-dom';
import { useMemo } from 'react';

export function useRouter() {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      push: (url: string) => navigate(url),
      replace: (url: string) => navigate(url, { replace: true }),
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => window.location.reload(),
      prefetch: () => {},
    }),
    [navigate]
  );
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function useParams() {
  return useRouterParams();
}

export function redirect(url: string) {
  window.location.href = url;
}
