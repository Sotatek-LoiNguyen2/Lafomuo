import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
export class FileUtils {
  static async saveFile(request: any, config: ConfigService): Promise<any> {
    if(!request){
      return;
    }
    if (request.url)
      return request;
    if (!request.data) {
      return;
    }
    const date = new Date();
    console.log("File name: ", request.name);
    const dir = `${config.get('storeConfig.path')}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const indexExt = request.name.lastIndexOf('.');
    const ext = indexExt > -1 ? request.name.substring(indexExt) : request.name;
    const fileName = `${date.getTime()}.${Math.round(date.getTime() * Math.random())}.${ext}`;
    const path = `${dir}/${fileName}`;
    const index = request.data.indexOf('base64,');
    if (index > -1) {
      request.data = request.data.substring(index + 7);
    }
    fs.writeFileSync(path, request.data, { encoding: 'base64' });
    const url = path.replace(config.get('storeConfig.path'), config.get('storeConfig.url', ''));
    return { path, url, name: request.name, host: config.get('storeConfig.host', 'http://localhost:3000') };
  }
}

