"use server";
import { draftMode } from "next/headers";

export async function disable() {
  (await draftMode()).disable();
}
