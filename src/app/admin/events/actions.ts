"use server";

import { revalidatePath } from "next/cache";
import { createEvent, type EventRecord } from "@/lib/booking";

export async function createEventAction(formData: FormData) {
  const menu = formData.getAll("menu").map(String);
  createEvent({
    date: String(formData.get("date") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    seatCap: Number(formData.get("seatCap") ?? 0),
    priceInr: Number(formData.get("priceInr") ?? 0),
    menu,
    status: String(formData.get("status") ?? "open") as EventRecord["status"],
  });
  revalidatePath("/admin/events");
  revalidatePath("/this-weekend");
  revalidatePath("/");
}
