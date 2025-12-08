import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export function zodHandlerError(error: FastifyError, _: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    const errors = error.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message
    }));

    return reply.status(StatusCodes.BAD_REQUEST).send({
      status: "Validation error",
      validation: true,
      errors
    });
  } else { 
     return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ 
       status: "Internal server error",
       error: error
     })
  };
}

