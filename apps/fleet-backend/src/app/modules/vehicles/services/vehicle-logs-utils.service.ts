import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { parse } from 'date-fns';
import { concatMap, endWith, interval, startWith, Subject, takeUntil, timer } from 'rxjs';
import { LogSeverity } from '../../../common/entities/log.entity';
import { CreateVehicleLogDto } from '../dto/create-vehicle-log.dto';
import { GenerateVehicleLogsDto } from '../dto/generate-vehicle-logs.dto';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { VehicleLogsDataLoader } from '../loader/vehicle-logs-data.loader';
import { VehicleLogsService } from './vehicle-logs.service';

const INPUT_FILE_LOG_REGEX =
  /\[(?<timestamp>[^\]]+)\] \[VEHICLE_ID:(?<vehicleId>\d+)\] \[(?<severity>[^\]]+)\] \[CODE:(?<code>[^\]]+)\] \[(?<message>[^\]]+)\]/;

@Injectable()
export class VehicleLogsUtilsService {
  private readonly logger = new Logger(VehicleLogsUtilsService.name);

  private readonly _generateStopSignal = new Subject<void>();

  private _generating = false;

  constructor(
    private readonly vehicleLogsService: VehicleLogsService,
    private readonly vehicleLogsDataLoader: VehicleLogsDataLoader,
  ) {}

  async parseAndSave(file: {
    originalname: string;
    filename: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }): Promise<VehicleLog[]> {
    this.logger.log(`File received: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);

    const lines = file.buffer.toString('utf-8').split('\n');

    try {
      const vehicleLogs = await Promise.all(
        lines
          .filter((line) => line.trim().length > 0)
          .map(async (line) => {
            const match = line.match(INPUT_FILE_LOG_REGEX);
            if (!match || !match.groups) {
              throw new Error('Invalid log line format');
            }
            const { groups } = match;

            const vehicleLog = new CreateVehicleLogDto();
            vehicleLog.timestamp = parse(groups.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
            vehicleLog.vehicleId = parseInt(groups.vehicleId, 10);
            vehicleLog.severity = groups.severity as LogSeverity;
            vehicleLog.code = groups.code;
            vehicleLog.message = groups.message;

            const errors = await validate(vehicleLog);

            if (errors.length > 0) {
              throw new Error('Validation failed: ' + JSON.stringify(errors));
            }
            return vehicleLog;
          }),
      );

      this.logger.log(`Successfully read ${vehicleLogs.length} logs. Saving to database...`);
      return this.vehicleLogsService.createMany(vehicleLogs);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      this.logger.error(`Failed to parse: Error: ${message}`);
      throw new BadRequestException('Failed to parse uploaded file: ' + message);
    }
  }

  startGeneratingLogs(generateDto: GenerateVehicleLogsDto): void {
    if (this._generating) {
      throw new ConflictException('Vehicle logs generation is already in progress');
    }
    this._generating = true;
    this.logger.log(`Starting vehicle logs generation for ${generateDto.duration} ms...`);

    interval(generateDto.interval)
      .pipe(
        startWith(-1), // trigger immediately on subscription
        // generate logs on each interval tick and wait for each completion
        concatMap(() => this.vehicleLogsDataLoader.generateAndSaveVehicleLogs(generateDto.max)),
        takeUntil(
          // stop after the specified duration
          timer(generateDto.duration).pipe(
            // allow external stop signal
            takeUntil(this._generateStopSignal),
            // propagate external stop signal to the outer takeUntil
            endWith(undefined),
          ),
        ),
      )
      .subscribe({
        error: () => {
          this._generating = false;
          this.logger.log('Vehicle logs generation stopped due to error');
        },
        complete: () => {
          this._generating = false;
          this.logger.log('Stopped vehicle logs generation');
        },
      });
  }

  stopGeneratingLogs(): void {
    this.logger.log('Stop signal sent for vehicle logs generation');
    this._generateStopSignal.next();
  }
}
