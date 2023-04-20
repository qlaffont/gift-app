import { NextkitError } from 'nextkit';

import { api } from '../../../../../../server';
import { getUserFromReq } from '../../../../../../services/apis/authUser';
import prisma from '../../../../../../services/prisma';
import sendim from '../../../../../../services/sendim';

export default api({
  async GET({ req }) {
    const user = await getUserFromReq(req);

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    return giftList?.giftListUserAccesses?.map((e) => e.owner.email);
  },
  async PUT({ req }) {
    const user = await getUserFromReq(req);

    if (!req.body.email || req.body.email.length === 0) {
      throw new NextkitError(400, 'Not found');
    }

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
        owner: true,
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    if (!giftList.giftListUserAccesses.find((v) => v.owner.email === req.body.email)) {
      const generatedUserName = `invitedUser${new Date().getTime()}`;
      const user = await prisma.user.upsert({
        where: {
          email: req.body.email,
        },
        create: {
          email: req.body.email,
          name: generatedUserName,
          lang: 'FR',
        },
        update: {},
      });

      //Send email to inform that we have an access to gift list
      await sendim.sendTransactionalMail({
        templateId: user.lang === 'EN' ? '2' : '1',
        to: [
          {
            email: req.body.email,
            name: user.name.startsWith(generatedUserName) ? undefined : user.name,
          },
        ],
        sender: undefined,
        params: {
          USERNAME: giftList.owner.name,
          EMAIL: giftList.owner.email,
          URL: new URL(`/${giftList.owner.name}/${giftList.owner.id}`, process.env.NEXT_PUBLIC_BASE_URL!).toString(),
        },
      });

      await prisma.giftListUserAccess.create({
        data: {
          giftListId: giftList.id,
          ownerId: user.id,
        },
      });
    }

    return 'OK';
  },
  async DELETE({ req }) {
    const user = await getUserFromReq(req);

    if (!req.body.email || req.body.email.length === 0) {
      throw new NextkitError(400, 'Not found');
    }

    const giftList = await prisma.giftList.findFirst({
      where: {
        id: req.query.id as string,
        ownerId: user.id,
      },
      include: {
        giftListUserAccesses: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!giftList) {
      throw new NextkitError(404, 'Not found');
    }

    await prisma.giftListUserAccess.deleteMany({
      where: {
        giftListId: giftList.id,
        owner: {
          email: req.body.email,
        },
      },
    });

    return 'OK';
  },
});
