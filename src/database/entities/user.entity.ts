import { IsEmail } from "@nestjs/class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn()
    @ApiPropertyOptional()
    id: number

    @Column()
    @ApiProperty()
    name: string

    @Column()
    @Exclude()
    @ApiProperty()
    password: string

    @Column()
    @IsEmail()
    @ApiProperty()
    email: string

    @Column({default: false})
    @ApiPropertyOptional({default: false})
    status: boolean
}
