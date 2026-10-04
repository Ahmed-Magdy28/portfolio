'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type SubmitTarget =
  | HTMLFormElement
  | FormData
  | URLSearchParams
  | Record<string, any>
  | null;

export interface SubmitOptions {
  method?: string;
  action?: string;
  encType?: string;
}

export interface Fetcher<TData = any> {
  data: TData | undefined;
  state: 'idle' | 'submitting' | 'loading';
  submit: (target: SubmitTarget, options?: SubmitOptions) => Promise<void>;
  Form: React.ForwardRefExoticComponent<
    React.FormHTMLAttributes<HTMLFormElement> & React.RefAttributes<HTMLFormElement>
  >;
}

export function useFetcher<TData = any>(): Fetcher<TData> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [state, setState] = useState<'idle' | 'submitting' | 'loading'>('idle');
  const router = useRouter();

  const submit = useCallback(
    async (target: SubmitTarget, options?: SubmitOptions) => {
      let body: BodyInit | null = null;
      let action = options?.action || (typeof window !== 'undefined' ? window.location.pathname : '');
      const method = (options?.method || 'POST').toUpperCase();

      if (typeof window !== 'undefined' && target instanceof HTMLFormElement) {
        action = options?.action || target.getAttribute('action') || target.action || window.location.pathname;
        body = new FormData(target);
      } else if (typeof FormData !== 'undefined' && target instanceof FormData) {
        body = target;
      } else if (typeof URLSearchParams !== 'undefined' && target instanceof URLSearchParams) {
        body = target;
      } else if (target && typeof target === 'object') {
        const formData = new FormData();
        Object.entries(target).forEach(([key, val]) => {
          if (val instanceof Blob) {
            formData.append(key, val);
          } else {
            formData.append(key, String(val));
          }
        });
        body = formData;
      }

      setState('submitting');
      try {
        const response = await fetch(action, {
          method,
          body,
        });

        setState('loading');
        let responseData: any = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          try {
            responseData = JSON.parse(text);
          } catch {
            responseData = text;
          }
        }

        setData(responseData);
        router.refresh();
      } catch (err: any) {
        setData({ error: err?.message || 'Submission failed' } as unknown as TData);
      } finally {
        setState('idle');
      }
    },
    [router]
  );

  const Form = React.forwardRef<
    HTMLFormElement,
    React.FormHTMLAttributes<HTMLFormElement>
  >(function FetcherForm({ children, onSubmit, action, method, ...props }, ref) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        (onSubmit as any)(e);
      }
      const targetForm = e.currentTarget;
      const targetAction =
        (typeof action === 'string'
          ? action
          : targetForm.getAttribute('action')) ||
        (typeof window !== 'undefined' ? window.location.pathname : '');
      const targetMethod =
        (typeof method === 'string'
          ? method
          : targetForm.getAttribute('method')) || 'POST';

      await submit(targetForm, { action: targetAction, method: targetMethod });
    };

    return (
      <form
        ref={ref}
        action={action}
        method={method}
        onSubmit={handleSubmit}
        {...props}
      >
        {children}
      </form>
    );
  });

  Form.displayName = 'FetcherForm';

  return {
    data,
    state,
    submit,
    Form,
  };
}

export function useRevalidator() {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading'>('idle');

  const revalidate = useCallback(() => {
    setState('loading');
    router.refresh();
    setTimeout(() => {
      setState('idle');
    }, 100);
  }, [router]);

  return {
    revalidate,
    state,
  };
}
