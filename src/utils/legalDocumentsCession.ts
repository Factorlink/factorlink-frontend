const DOCS_CESSION_STATUSES = new Set([400, 403, 422]);

const DOCS_CESSION_MESSAGE_PATTERN =
  /documentos?\s+legales?|al\s+menos\s+3|aprobad/i;

const flattenMessage = (message: unknown): string => {
  if (typeof message === "string") return message;
  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === "string").join(" ");
  }
  return "";
};

/** Backend rejected cession because the empresa lacks 3 approved legal documents. */
export const isLegalDocumentsCessionError = (error: unknown): boolean => {
  const axiosError = error as {
    response?: { status?: number; data?: { message?: unknown } };
  };
  const status = axiosError?.response?.status;
  if (!status || !DOCS_CESSION_STATUSES.has(status)) return false;

  const message = flattenMessage(axiosError.response?.data?.message);
  return DOCS_CESSION_MESSAGE_PATTERN.test(message);
};
