import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';

@Resolver()
export class AuthResolver {
    
    constructor(private readonly authService: AuthService) {}

    @Mutation(returns => LoginResponseDto, {
        description: 'Simple password authentication; Password: passwd'
    })
    async login(@Args('password') password: string): Promise<LoginResponseDto> {
        return this.authService.login(new LoginRequestDto(password));
    }
}
