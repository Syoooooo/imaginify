"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../db";
import { handleError } from "../utils";

// ADD IMAGE
export async function addImage({
  image,
  userId,
  path,
}: AddImageParams) {
  try {
    const author = await db.user.findUnique({
      where: { id: userId },
    });

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await db.image.create({
      data: { ...image, authorId: author.id },
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}
// UPDATE IMAGE
export async function updateImage({
  image,
  userId,
  path,
}: UpdateImageParams) {
  try {
    const imageToUpdate = await db.image.findUnique({
      where: { id: userId },
    });

    if (
      !imageToUpdate ||
      imageToUpdate.authorId !== userId
    ) {
      throw new Error("Unauthorized or image not found");
    }

    const updateImage = db.image.update({
      where: { id: imageToUpdate.id },
      data: image,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updateImage));
  } catch (error) {
    handleError(error);
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    const deleteImage = await db.image.delete({
      where: { id: imageId },
    });

    return JSON.parse(JSON.stringify(deleteImage));
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    const image = await db.image.findUnique({
      where: { id: imageId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES

export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    cloudinary.config({
      cloud_name:
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.COUDINARY_API_KEY,
      api_secret: process.env.COUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=imaginify";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourcesId = resources.map(
      (resource: any) => resource.public_id
    );


    let query = {}

    if (searchQuery) {
      query = {
        OR: [
          {
            publicId: {
              in: resourcesId,
            },
          },
          {
            title: {
              contains: searchQuery,
            },
          },
        ],
      };
    }
    const skipAmount = (Number(page) -1)  * limit;

    const images = await db.image.findMany({
      where: query,
      orderBy: { updatedAt: 'desc' },
      skip: skipAmount,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    const totalImages = await db.image.count({ where: query });
    const savedImages = await db.image.count();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    }

  } catch (error) {
    handleError(error);
  }
}
