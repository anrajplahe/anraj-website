import "server-only";
import { randomUUID } from "node:crypto";

// Only these categories/codes leave this module. Never log error objects,
// messages, stacks, query parameters, request bodies, credentials or Blob URLs.
export function classifyImageFailure(cause: unknown) {
  const seen = new Set<unknown>();
  let current = cause;
  for (let depth = 0; depth < 5 && current && typeof current === "object" && !seen.has(current); depth++) {
    seen.add(current);
    const error = current as { code?: unknown; name?: unknown; message?: unknown; cause?: unknown };
    const knownNames: Record<string, string> = {
      BlobAccessError: "blob_access_denied",
      BlobNotFoundError: "blob_object_missing",
      BlobStoreNotFoundError: "blob_store_missing",
      VercelOidcTokenError: "blob_oidc_rejected",
    };
    if (typeof error.name === "string" && Object.hasOwn(knownNames, error.name)) return knownNames[error.name];
    if (error.code === "42P01") return "database_table_missing";
    if (error.code === "42703") return "database_column_missing";
    if (error.code === "28P01" || error.code === "42501") return "database_access_denied";
    const message = typeof error.message === "string" ? error.message : "";
    if (/No read-write token found|No blob credentials found|no storeId was found/i.test(message)) return "blob_credentials_missing";
    if (/Missing webhook public key/i.test(message)) return "blob_webhook_key_missing";
    if (/OIDC.*(?:expired|invalid|environment|enabled)|(?:expired|invalid).*OIDC/i.test(message)) return "blob_oidc_rejected";
    if (message === "Unauthorised.") return "admin_session_required";
    if (["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET"].includes(String(error.code))) return "network_failure";
    current = error.cause;
  }
  return "operation_failed";
}

export function reportImageFailure(operation: string, cause: unknown) {
  const reference = randomUUID();
  const category = classifyImageFailure(cause);
  console.error("[journal-image]", { operation, reference, category });
  const guidance: Record<string, string> = {
    database_table_missing: "The image upload database table is missing. Review the prepared migration before applying it.",
    database_column_missing: "The image upload database schema is out of date. Review the prepared migration.",
    database_access_denied: "The server cannot access the image upload database.",
    blob_credentials_missing: "Blob authentication is unavailable. Check the server's Blob connection and local OIDC configuration.",
    blob_webhook_key_missing: "The Blob SDK requires BLOB_WEBHOOK_PUBLIC_KEY for signed upload issuance. Check the server's Blob connection configuration.",
    blob_access_denied: "Blob denied access. Check the store connection and project/environment permissions.",
    blob_object_missing: "The uploaded image is not in the configured Blob store. Retry verification or upload again.",
    blob_store_missing: "The configured Blob store could not be found. Check the server's Blob connection.",
    blob_oidc_rejected: "Blob rejected the OIDC credentials. Check their expiry and project/environment access.",
    admin_session_required: "Your administrator session is unavailable. Sign in again and retry.",
    network_failure: "The server could not reach storage or the database. Retry when the connection is restored.",
  };
  return { reference, error: `${guidance[category] ?? "The image operation failed. Retry and check the matching server diagnostic."} Operation: ${operation}. Reference: ${reference}.` };
}
