import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugifyNameUseCase {
  async execute(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_');
  }
}
