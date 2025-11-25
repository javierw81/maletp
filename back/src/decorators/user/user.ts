import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { jwtPayload } from "src/auth/jwtPayload";

export const UserDecorator = createParamDecorator(
    
    (data: keyof jwtPayload | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest(); 

        const user = request.user as jwtPayload; 

        return data ? user[data] : user; 
    }
    
) 


