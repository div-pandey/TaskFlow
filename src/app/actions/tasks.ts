"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createTask(title: string, description?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!title) {
    throw new Error("Title is required");
  }

  return await prisma.task.create({
    data: {
      title,
      description,
      status: "TODO",
      userId: session.user.id,
    },
  });
}

export async function updateTaskStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await prisma.task.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: { status },
  });
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await prisma.task.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });
}
