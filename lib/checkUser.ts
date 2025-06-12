import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@/prisma/generated/prisma";

const db = new PrismaClient();

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const newUser = await db.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        password: user.primaryEmailAddressId!
      },
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
};