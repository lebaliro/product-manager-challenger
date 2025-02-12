import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggerGlobal extends ConsoleLogger {}
