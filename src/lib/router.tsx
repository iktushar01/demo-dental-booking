import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  queryParams: URLSearchParams;
  navigate: (to: string, params?: Record<string, string>) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  queryParams: new URLSearchParams(),
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
      setQueryParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, params?: Record<string, string>) => {
    let fullUrl = to;
    if (params && Object.keys(params).length > 0) {
      const search = new URLSearchParams(params).toString();
      fullUrl = `${to}?${search}`;
    }

    if (window.location.pathname + window.location.search !== fullUrl) {
      window.history.pushState({}, '', fullUrl);
      setPath(to);
      setQueryParams(new URLSearchParams(params ? params : ''));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ path, queryParams, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}

export function Link({
  to,
  params,
  className,
  activeClassName,
  children,
  onClick,
  ...props
}: {
  to: string;
  params?: Record<string, string>;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { path, navigate } = useRouter();
  const isActive = path === to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to, params);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className || ''} ${isActive && activeClassName ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </a>
  );
}
