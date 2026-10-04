"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleLanguage } from "../store/langSlice";

export const LanguageSwitcher = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((state) => state.lang.current);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleLanguage())}
      className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
      aria-label="Toggle language"
    >
      {mounted ? (lang === "en" ? "العربية" : "EN") : "العربية"}
    </button>
  );
};
