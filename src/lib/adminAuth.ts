import crypto from "node:crypto";
import { loadEnv } from "./env";

loadEnv();

export const ADMIN_SESSION_COOKIE = "santosh_admin_session";

/**
 * Not one of the course's two allowed keys, so it must have a working
 * default — the app must run without staff setting a third env var.
 * Override it locally via ADMIN_PASSWORD for a real deployment.
 */
const DEFAULT_ADMIN_PASSWORD = "santosh-kitchen";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function computeAdminSessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`santosh-admin:${getAdminPassword()}`)
    .digest("hex");
}

export function checkAdminPassword(candidate: string): boolean {
  return candidate === getAdminPassword();
}

export function isValidAdminSession(token: string | undefined | null): boolean {
  if (!token) return false;
  return token === computeAdminSessionToken();
}
