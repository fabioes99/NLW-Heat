
import prismaClient from "../prisma";



class GetLast3MessagesService {
  async execute() {
    const messages = await prismaClient.message.findMany({
      take: 3,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: true,
      },
    });

    // SELECT * from MESSAGES LIMIT 3 ORDER BY created_at desc

    return messages;
  }
}

export { GetLast3MessagesService };