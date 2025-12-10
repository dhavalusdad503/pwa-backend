import userRepository from "@features/user/user.repository";
import { Role } from "@models";
import { verifyJWTToken } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

export const roleMiddleware =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.substring(7);

    try {
      const decoded: any = verifyJWTToken(token);

      const user = await userRepository.findById(decoded.id, {
        include: [
          {
            model: Role,
            as: "role",
            where: {
              slug: { [Op.in]: roles },
            },
          },
        ],
      });

      if (!user) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
