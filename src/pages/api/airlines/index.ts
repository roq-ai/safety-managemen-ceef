import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { airlineValidationSchema } from 'validationSchema/airlines';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAirlines();
    case 'POST':
      return createAirline();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAirlines() {
    const data = await prisma.airline
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'airline'));
    return res.status(200).json(data);
  }

  async function createAirline() {
    await airlineValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.compliance_report?.length > 0) {
      const create_compliance_report = body.compliance_report;
      body.compliance_report = {
        create: create_compliance_report,
      };
    } else {
      delete body.compliance_report;
    }
    if (body?.risk_assessment?.length > 0) {
      const create_risk_assessment = body.risk_assessment;
      body.risk_assessment = {
        create: create_risk_assessment,
      };
    } else {
      delete body.risk_assessment;
    }
    if (body?.safety_report?.length > 0) {
      const create_safety_report = body.safety_report;
      body.safety_report = {
        create: create_safety_report,
      };
    } else {
      delete body.safety_report;
    }
    const data = await prisma.airline.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
