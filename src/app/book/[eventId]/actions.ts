"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addToWaitlist,
  confirmBookingPayment,
  createPendingBooking,
} from "@/lib/booking";

export async function createBookingAction(eventId: number, formData: FormData) {
  const result = createPendingBooking({
    eventId,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    seats: Number(formData.get("seats") ?? 0),
    dietaryNotes: String(formData.get("dietaryNotes") ?? ""),
    vegOnly: formData.get("vegOnly") === "on",
  });

  if (!result.ok) {
    redirect(`/book/${eventId}?error=${result.reason}`);
  }
  redirect(`/book/${eventId}?bookingId=${result.bookingId}`);
}

export async function confirmPaymentAction(eventId: number, bookingId: number) {
  const ok = confirmBookingPayment(bookingId);
  if (!ok) {
    redirect(`/book/${eventId}?error=expired`);
  }
  revalidatePath("/this-weekend");
  revalidatePath("/");
  redirect(`/book/confirmed/${bookingId}`);
}

export async function joinWaitlistAction(eventId: number, formData: FormData) {
  addToWaitlist({
    eventId,
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    seats: Number(formData.get("seats") ?? 1),
  });
  redirect(`/book/${eventId}?waitlisted=1`);
}
