import { Module } from '@nestjs/common';
import { TokenModule } from 'src/core/security/token';
import { AuthService } from './auth.service';
import { JwtConfigModule } from '../../../../global/config/jwt-config';

@Module({
	imports: [TokenModule, JwtConfigModule],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthServiceModule {}
