import { ConflictException, Injectable } from '@nestjs/common';
import { concatMap, interval, Subject, takeUntil, timer } from 'rxjs';
import { GenerateVehicleLogsDto } from '../dto/generate-vehicle-logs.dto';
import { VehicleLogsDataLoader } from '../loader/vehicle-logs-data.loader';

@Injectable()
export class VehicleLogsUtilsService {
  private readonly _generateStopSignal = new Subject<void>();

  private _generating = false;

  constructor(private readonly vehicleLogsDataLoader: VehicleLogsDataLoader) {}

  startGeneratingLogs(generateDto: GenerateVehicleLogsDto): void {
    if (this._generating) {
      throw new ConflictException('Vehicle logs generation is already in progress');
    }
    this._generating = true;

    interval(generateDto.interval)
      .pipe(
        // generate logs at each interval and wait for each completion
        concatMap(() => this.vehicleLogsDataLoader.generateAndSaveVehicleLogs(generateDto.max)),
        takeUntil(
          // stop after the specified duration
          timer(generateDto.duration).pipe(
            takeUntil(this._generateStopSignal), // allow external stop signal
          ),
        ),
        takeUntil(this._generateStopSignal), // allow external stop signal
      )
      .subscribe({
        error: () => (this._generating = false),
        complete: () => (this._generating = false),
      });
  }

  stopGeneratingLogs(): void {
    this._generateStopSignal.next();
  }
}
