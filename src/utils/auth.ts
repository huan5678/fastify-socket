import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const { JWT_EXPIRES_DAY } = process.env;

export const generateToken = async (payload: { userId: string; role: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${JWT_EXPIRES_DAY}d`)
    .sign(JWT_SECRET);
};

interface CustomJWTPayload extends JWTPayload {
  userId: string;
  role: string;
}

export const verifyToken = async (token: string) => {
  if (!token) {
    throw new Error('JWT token is missing');
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as CustomJWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getToken = (req: Request) =>
{
  const token = req.headers.get('Authorization')?.split('Bearer ').pop();
  return token;
};


export const verifyPassword = (password: string, passhash: string): boolean => {
    return bcrypt.compareSync(password, passhash);
  };

export const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},./\\;'[\]-]).{8,}$/;

export const passwordCheck = (password: string) => {
  return passwordRule.test(password);
};

export const randomPassword = () => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const calpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const num = '1234567890';
  const specials = ',.!@#$%^&*/|][-_=+?><;:~`{}()';
  const options = [alpha, alpha, alpha, calpha, calpha, num, num, specials];
  let opt: number, choose: number;
  let pass = '';
  for (let i = 0; i < 8; i++) {
    opt = Math.floor(Math.random() * options.length);
    choose = Math.floor(Math.random() * options[opt].length);
    pass = pass + options[opt][choose];
    options.splice(opt, 1);
  }
  return pass;
};
