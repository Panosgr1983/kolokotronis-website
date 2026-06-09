import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

function supabaseAnonFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

function getCloudflareEnv(): Record<string, unknown> {
  return (globalThis as Record<string, unknown>).__env__ as Record<string, unknown> || {};
}

function supabaseServiceFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const cfEnv = getCloudflareEnv();
  const serviceKey = cfEnv.SUPABASE_SERVICE_KEY as string | undefined;
  if (!serviceKey) return supabaseAnonFetch(path, options);
  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function handleApiContact(_request: Request): Promise<Response> {
  if (_request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = await _request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const { name, email, phone, message } = body;
  if (!name || !email || !message) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  const insertRes = await supabaseAnonFetch("contact_submissions", {
    method: "POST",
    body: JSON.stringify({ name, email, phone: phone || "", message }),
  });

  if (!insertRes.ok) {
    const text = await insertRes.text();
    return jsonResponse({ error: "Failed to save message" }, 500);
  }

  const cfEnv = getCloudflareEnv();
  const serviceKey = cfEnv.SUPABASE_SERVICE_KEY as string | undefined;

  let recipientEmail: string | undefined;
  try {
    const settingsRes = await (serviceKey ? supabaseServiceFetch : supabaseAnonFetch)(
      "site_settings?select=value&key=eq.contact_email",
    );
    const settingsData: { value: string }[] = settingsRes.ok ? await settingsRes.json() : [];
    recipientEmail = settingsData?.[0]?.value;
  } catch (e) {
    console.error("Error reading contact_email setting:", e);
  }

  // Forward email via Supabase Edge Function (SMTP)
  if (recipientEmail) {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type: "new",
        name,
        email,
        phone: phone || "",
        message,
      }),
    }).catch((emailError: unknown) => console.error("Email forward error:", emailError));
  }

  return jsonResponse({ success: true });
}

export default {
  async fetch(request: Request) {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/api/contact") {
        return await handleApiContact(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
