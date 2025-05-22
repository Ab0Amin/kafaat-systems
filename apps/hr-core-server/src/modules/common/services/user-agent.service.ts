// import { Injectable } from '@nestjs/common';
// import { UAParser } from 'ua-parser-js';

// @Injectable()
// export class UserAgentService {
//   private parser: UAParser;

//   constructor() {
//     this.parser = new UAParser();
//   }

//   parse(userAgent: string) {
//     this.parser.setUA(userAgent);
//     const result = this.parser.getResult();

//     return {
//       os: result.os.name || 'Unknown',
//       browser: result.browser.name || 'Unknown',
//       device: result.device.type || 'desktop',
//     };
//   }
// }
