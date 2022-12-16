import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health-check/health.module';
import { ActivityHistoryModule } from './modules/activity-history/activity-history.module';
import { BlockchainsModule } from './modules/blockchains/module';
import { CheckPointModule } from './modules/check-point/check-point.module';
import { CronjobModule } from './modules/cronjobs/cronjob.module';
import { CronsModule } from './modules/crons/crons.module';
import { EvaluationModule } from './modules/evaluation/module';
import { LockerModule } from './modules/locker/locker.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('fallbackLanguage'),
        loaderOptions: {
          path: path.join(process.cwd(), 'dist/i18n/'),
          watch: true,
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    HealthModule,
    UserModule,
    EvaluationModule,
    BlockchainsModule,
    CronsModule,
    CronjobModule,
    CheckPointModule,
    ActivityHistoryModule,
    LockerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
