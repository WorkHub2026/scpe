"use server";
import { prisma } from "@/lib/prisma";
export const createAnnouncement = async (
  title: string,
  content: string,
  image_path: string | null,
  created_by: number
) => {
  try {
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        image_path,
        created_by,
      },
    });

    return {
      success: true,
      announcement,
    };
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      success: true,
      announcements,
    };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
};
