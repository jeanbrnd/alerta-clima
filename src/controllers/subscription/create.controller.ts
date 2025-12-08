import { subscriptionCreateSchema } from "#validation";
import db from "database/index.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";


export async function subscriptionCreateController(req: FastifyRequest, reply: FastifyReply) {
    const data = subscriptionCreateSchema.parse(req.body);
    
    let subscription;
    
    const subExist = await db.subscription.getByPhone(data.phone);
     
    try {
        
      if(subExist) {
         subscription = await db.subscription.update({ where: { id: subExist.id }, data });
      } else {
         subscription = await db.subscription.create({ data });
      };

      return await reply.status(StatusCodes.OK).send({
         message: "Subscription create successfully",
         data: subscription
      });

    } catch (error: any) {
        console.log(error);
        return await reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
             message: "Error create subscription",
             error
        });
    }

};