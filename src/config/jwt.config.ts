import { JwtModuleOptions } from "@nestjs/jwt";

export const JWT_SECRET = 'nestjs_is_awesome';

const jwtConfig : JwtModuleOptions = {
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: '1h' },
}

export default jwtConfig;