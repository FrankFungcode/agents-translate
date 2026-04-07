import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { DIRECTIONS, type Direction } from '../../core/types';

export class TranslateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Transform(({ value }) => String(value).trim())
  content!: string;

  @IsEnum(DIRECTIONS)
  direction!: Direction;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (value == null ? undefined : String(value).trim()))
  context?: string;
}

export class TranslateStreamDto extends TranslateDto {}
