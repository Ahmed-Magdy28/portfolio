import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type ContactFormStatus = "idle" | "sending" | "success" | "error";

const emptyFormData = {
  name: "",
  email: "",
  message: "",
};

export const useContactForm = () => {
  const [formData, setFormData] = useState(emptyFormData);
  const [status, setStatus] = useState<ContactFormStatus>("idle");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      setFormData(emptyFormData);
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    status,
  };
};
