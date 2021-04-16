import IHashProvider from "../models/IHashProvider";
import { hash, compare } from 'bcryptjs';

class BCryptHashProvider implements IHashProvider {

  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default BCryptHashProvider;
