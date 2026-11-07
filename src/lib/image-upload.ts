import sharp from "sharp";
import { ApiError } from "./http";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export async function optimizeImage(input: Buffer) {
  if (!input.length || input.length > MAX_UPLOAD_BYTES) throw new ApiError(413, "La fotografía debe ocupar como máximo 4 MB.");
  try {
    const image = sharp(input, { limitInputPixels: 40_000_000, animated: false });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format ?? "") || (metadata.pages ?? 1) > 1) throw new Error("Unsupported image");
    return await image.rotate().resize(2560, 2560, { fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
  } catch {
    throw new ApiError(400, "Usa una fotografía JPG, PNG o WebP válida, sin animación y de hasta 40 megapíxeles.");
  }
}
