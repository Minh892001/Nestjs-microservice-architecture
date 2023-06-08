import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformTrimSpace } from '../../../../../shared/decorators/transform-trim-space.decorator';
import { USER_ROLE, USER_TYPE } from '../../../../../shared/constants/common';

export class UserInputDto {
  @TransformTrimSpace()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEnum(USER_TYPE)
  type: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsEnum(USER_ROLE, { each: true })
  roles: string[];
}
