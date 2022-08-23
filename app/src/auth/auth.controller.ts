import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller()
@ApiTags('Authentication')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Simple password authentication', description: 'Password: passwd' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: LoginResponseDto,
        description: 'Authentication successful'
    })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Authentication failed' })
    login(@Body() loginRequest: LoginRequestDto): LoginResponseDto {
        return this.authService.login(loginRequest);
    }
}
