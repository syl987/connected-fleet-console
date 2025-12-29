import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogSeverity } from '../../../common/entities/log.entity';
import { VehicleLog } from '../entities/vehicle-log.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Injectable()
export class VehicleLogsDataLoader {
  private readonly logger = new Logger(VehicleLogsDataLoader.name);

  // Sample log messages for different severities
  private readonly messages = {
    INFO: [
      'Vehicle started successfully',
      'Regular maintenance completed',
      'System diagnostics passed',
      'Fuel level check completed',
      'Battery status normal',
      'Tire pressure check completed',
    ],
    WARNING: [
      'Low fuel level detected',
      'Battery voltage below optimal',
      'Tire pressure slightly low',
      'Oil change recommended soon',
      'Air filter replacement recommended',
      'Brake pad wear detected',
    ],
    ERROR: [
      'Engine temperature warning',
      'Check engine light activated',
      'ABS system malfunction',
      'Transmission fault detected',
      'Airbag system error',
      'Power steering failure',
    ],
    CRITICAL: [
      'Engine overheating - immediate action required',
      'Brake system failure',
      'Fuel system leak detected',
      'Battery critical - vehicle may not start',
      'Transmission complete failure',
      'Critical safety system offline',
    ],
    DEBUG: [
      'System diagnostic initiated',
      'ECU firmware update available',
      'Sensor calibration check',
      'Performance metrics logged',
      'Network connectivity test',
      'GPS signal strength check',
    ],
  };

  // Error codes range by severity
  private readonly codRanges: Record<string, { min: number; max: number }> = {
    INFO: { min: 1000, max: 1999 },
    WARNING: { min: 2000, max: 2999 },
    ERROR: { min: 3000, max: 3999 },
    CRITICAL: { min: 4000, max: 4999 },
    DEBUG: { min: 5000, max: 5999 },
  };

  constructor(
    @InjectRepository(VehicleLog) private readonly vehicleLogsRepository: Repository<VehicleLog>,
    @InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>,
  ) {}

  async loadInitialData(maxLogsPerVehicle = 5): Promise<void> {
    const count = await this.vehicleLogsRepository.count();

    if (count > 0) {
      this.logger.log('Vehicle logs data already exists, skipping initial data load');
      return;
    }
    await this.generateAndSaveVehicleLogs(maxLogsPerVehicle);
  }

  async generateAndSaveVehicleLogs(maxLogsPerVehicle: number, chancePerVehicle = 0.1): Promise<void> {
    try {
      const vehicles = await this.vehiclesRepository.find({ where: { deletedAt: null } });

      if (vehicles.length === 0) {
        this.logger.warn('No vehicles found, cannot generate logs');
        return;
      }

      this.logger.log(
        `Generating randomly up to ${maxLogsPerVehicle} logs for around ${chancePerVehicle * 100}% of the available ${vehicles.length} vehicles...`,
      );

      const logs: VehicleLog[] = [];

      for (const vehicle of vehicles) {
        if (Math.random() > chancePerVehicle) {
          continue; // skip generating logs for this vehicle
        }
        const vehicleLogs = this.generateLogsForVehicle(vehicle, Math.floor(Math.random() * (maxLogsPerVehicle + 1)));
        logs.push(...vehicleLogs);
      }

      await this.vehicleLogsRepository.save(logs);
      this.logger.log(`Successfully saved ${logs.length} vehicle logs`);
    } catch (error) {
      this.logger.error(
        `Failed to load initial vehicle logs data: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }

  private generateLogsForVehicle(vehicle: Vehicle, count: number): VehicleLog[] {
    const logs: VehicleLog[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      // Generate timestamp within the last 365 days
      const daysAgo = Math.floor(Math.random() * 365);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const secondsAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
      timestamp.setSeconds(timestamp.getSeconds() - secondsAgo);

      // Pick random severity
      const severity = this.pickRandom(Object.values(LogSeverity));

      // Generate code within severity range
      const codeRange = this.codRanges[severity];
      const code = '' + this.randomInt(codeRange.min, codeRange.max);

      // Pick random message for severity
      const message = this.pickRandom(this.messages[severity as keyof typeof this.messages]);

      const log = this.vehicleLogsRepository.create({
        timestamp,
        severity,
        code,
        message,
        vehicle,
      });

      logs.push(log);
    }

    // Sort logs by timestamp descending (newest first)
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return logs;
  }

  private pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
