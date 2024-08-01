import * as jwt from 'jsonwebtoken';

export default (id: any, secret: string) => {
  return jwt.sign({ id }, secret, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });
};
