import { isAxiosError } from "axios";

type ApiErrorBody = { message?: string; error?: string };

export function getErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro",
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.message || error.response?.data?.error || fallback
    );
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}
