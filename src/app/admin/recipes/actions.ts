"use server";

import { revalidatePath } from "next/cache";
import { runPipelineForSlug } from "@/lib/pipeline/run";
import { approveRecipe } from "@/lib/pipeline/store";
import { DISH_SLUGS, type DishSlug } from "@/lib/schema/recipe";

export async function runExtractionAction(formData: FormData) {
  const slug = String(formData.get("slug")) as DishSlug;
  await runPipelineForSlug(slug);
  revalidatePath("/admin/recipes");
  revalidatePath(`/admin/review/${slug}`);
}

export async function runAllExtractionsAction() {
  for (const slug of DISH_SLUGS) {
    await runPipelineForSlug(slug);
  }
  revalidatePath("/admin/recipes");
}

export async function approveRecipeAction(formData: FormData) {
  const slug = String(formData.get("slug"));
  approveRecipe(slug);
  revalidatePath("/admin/recipes");
  revalidatePath(`/admin/review/${slug}`);
}
