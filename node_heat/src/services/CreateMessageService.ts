import prismaClient from "../prisma";

import { io } from "../app";

class CreateMessageService {
  async execute(text: string, user_Id: string) {
    const message = await prismaClient.message.create({
      data: {
        text,
        user_Id,
      },
      include: {
        user: true,
      },
    });

    const infoWs = {
      id: message.id,
      text: message.text,
      user_id: message.user_Id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit("new_message", infoWs);

    return message;
  }
}

export { CreateMessageService };