import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import generateToken from 'src/utils/generateToken';
import { SendEmail } from 'src/utils/send-email';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;

      if (!name || !email || !password) {
        throw new HttpException('Some fields missing!', HttpStatus.BAD_REQUEST);
      }

      const doesUserExist = await this.userModel.findOne({ email }).exec();
      if (doesUserExist) {
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });

      return await newUser.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      return await this.userModel
        .find({}, 'id name email createdAt')
        .sort({ createdAt: 1 })
        .exec();
    } catch (error) {
      throw new HttpException(
        'Error retrieving users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userModel.findOne({ id }, { password: 0 }).exec();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        'Error retrieving user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findOne({ id }).exec();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.name = updateUserDto.name || user.name;
      user.email = updateUserDto.email || user.email;

      await user.save();

      return 'Profile updated successfully';
    } catch (error) {
      throw new HttpException(
        'Error updating user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userModel.deleteOne({ id }).exec();

      if (result.deletedCount === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        'Error deleting user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new HttpException('Some fields missing!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException('Invalid fields', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    const token = generateToken(user._id, this.JWT_SECRET);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();

    return { user: userWithoutPassword, token };
  }

  async updatePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Invalid current password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = jwt.sign(
      { id: user._id, key: 'password-reset' },
      this.JWT_SECRET,
      { expiresIn: '1h' },
    );

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const resetUrl = `http://your-frontend-url/reset-password?token=${resetToken}`;
    console.log(resetUrl);
    await SendEmail(
      user.email,
      'Password Reset',
      `You requested a password reset. Click the link to reset your password: \n${resetUrl}`,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decodedToken: string | jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (decodedToken && decodedToken['key'] === 'password-reset') {
      const user = await this.userModel.findOne({
        _id: decodedToken['id'],
        resetToken: token,
      });

      if (!user || user.resetTokenExpiry < new Date()) {
        throw new HttpException(
          'Invalid or expired token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
