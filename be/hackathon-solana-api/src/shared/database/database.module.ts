import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('database.user');
        const password = configService.get('database.pass');
        const database = configService.get('database.name'); 
        const host = configService.get('database.host'); 
        const port = configService.get('database.port'); 

        console.log({
          username, password, database, host, port
        })
        if(!username){
          return {
            uri: `mongodb://${host}:${port}/${database}?directConnection=true`,
            dbName: database,
            
          }
        }
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${database}?directConnection=true&authSource=admin&retryWrites=true&w=majority`,
          dbName: database,
          
        }
      },
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule {}
