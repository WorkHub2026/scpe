// src/lib/actions/chat.actions.ts
"use server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateChatThread(documentId: number) {
  try {
    let thread = await prisma.chatThread.findUnique({
      where: { document_id: documentId },
      include: {
        document: true,
      },
    });

    if (!thread) {
      thread = await prisma.chatThread.create({
        data: {
          document_id: documentId,
        },
        include: {
          document: true,
        },
      });
    }

    return { success: true, thread };
  } catch (error: any) {
    console.error("❌ Chat thread error:", error);
    return { success: false, message: error.message };
  }
}

export async function sendChatMessage(data: {
  thread_id: number;
  sender_id: number;
  content: string;
}) {
  try {
    if (!data.content.trim()) {
      throw new Error("Message cannot be empty");
    }

    const thread = await prisma.chatThread.findUnique({
      where: { document_id: data.thread_id },
      select: { id: true },
    });
    if (!thread) {
      throw new Error("Invalid thread ID");
    }

    const message = await prisma.chatMessage.create({
      data: {
        thread_id: thread.id,
        sender_id: data.sender_id,
        content: data.content,
      },
      include: {
        sender: {
          select: {
            user_id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return { success: true, message };
  } catch (error: any) {
    console.error("❌ Send message error:", error);
    return { success: false, message: error.message };
  }
}

export async function getChatMessages(threadId: number) {
  try {
    const thread = await prisma.chatThread.findUnique({
      where: { document_id: threadId },
      select: { id: true },
    });
    if (!thread) {
      throw new Error("Invalid thread ID");
    }

    const messages = await prisma.chatMessage.findMany({
      where: { thread_id: thread.id },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            user_id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error("❌ Fetch messages error:", error);
    return { success: false, message: error.message };
  }
}

// export async function markMessagesAsRead(
//   threadId: number,
//   userId: number
// ) {
//   try {
//     const unreadMessages = await prisma.chatMessage.findMany({
//       where: {
//         thread_id: threadId,
//         sender_id: { not: userId },
//       },
//       select: { id: true },
//     });

//     const reads = unreadMessages.map((m) => ({
//       message_id: m.id,
//       user_id: userId,
//     }));

//     await prisma.chatRead.createMany({
//       data: reads,
//       skipDuplicates: true,
//     });

//     return { success: true };
//   } catch (error: any) {
//     console.error("❌ Read status error:", error);
//     return { success: false, message: error.message };
//   }
// }

export async function closeChatThread(threadId: number) {
  try {
    const updated = await prisma.chatThread.update({
      where: { id: threadId },
      data: { isClosed: true },
    });

    return { success: true, thread: updated };
  } catch (error: any) {
    console.error("❌ Close chat error:", error);
    return { success: false, message: error.message };
  }
}
