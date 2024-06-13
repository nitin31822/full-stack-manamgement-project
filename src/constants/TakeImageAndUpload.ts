import { writeFile } from "fs/promises";
import { uploadOnCloudinary } from "./cloudinary";

export const TakeAndUpload = async (file: File) => {
  if (!file) {
    return null;
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);
  const path = `./public/${file.name}`;
  await writeFile(path, buffer);

  const image = await uploadOnCloudinary(path);

  if (image === null) {
    return null;
  }
  return image;
};