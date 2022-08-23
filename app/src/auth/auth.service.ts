import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  
    constructor(private readonly jwtService: JwtService) {}

    login(requestBody: LoginRequestDto): LoginResponseDto {
        // The credentials should be validated against some database of users
        if (requestBody.password !== 'passwd') {
            throw new UnauthorizedException('Incorrect credentials');
        }
        const user = new UserDto('admin');

        // Payload of the sign method has to be a plain object
        return new LoginResponseDto(this.jwtService.sign({...user}));
    }
}
