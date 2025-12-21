import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { concatMap, endWith, interval, Subject, takeUntil, timer } from 'rxjs';
import { GenerateVehicleLogsDto } from '../dto/generate-vehicle-logs.dto';
import { VehicleLogsDataLoader } from '../loader/vehicle-logs-data.loader';

@Injectable()
export class VehicleLogsUtilsService {
  private readonly logger = new Logger(VehicleLogsUtilsService.name);

  private readonly _generateStopSignal = new Subject<void>();

  private _generating = false;

  constructor(private readonly vehicleLogsDataLoader: VehicleLogsDataLoader) {}

  startGeneratingLogs(generateDto: GenerateVehicleLogsDto): void {
    if (this._generating) {
      throw new ConflictException('Vehicle logs generation is already in progress');
    }
    this._generating = true;
    this.logger.log(`Starting vehicle logs generation for ${generateDto.duration} ms...`);

    interval(generateDto.interval)
      .pipe(
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
    this.logger.log('Stopping vehicle logs generation');
    this._generateStopSignal.next();
  }
}
