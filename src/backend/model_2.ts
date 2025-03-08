/*  File contains description of the data.
 *
 *  Classes:
 *      TimeInterval     
 */

export enum WorkLocation {
  Home = 0,
  Office,
  ElseWhere
}

export class WorkInterval {
  private timestamp_start: Date;
  private timestamp_end?: Date; // Optional for ongoing intervals
  private location: WorkLocation;
  
  constructor(location: WorkLocation, start?: Date, end?: Date) {
      this.location = location;
      this.timestamp_start = new Date();
      if (start) {
          this.timestamp_start = start;
      }
      if (end) {
          this.timestamp_end = end;
      }
  }

  getLocation(): WorkLocation {
    return this.location;
  }

  setLocation(location: WorkLocation) {
    this.location = location;
  }

  getStartTime(): Date {
    return this.timestamp_start;
  }
  
  setStartTime(start: Date): void {
    if (this.timestamp_end && start > this.timestamp_end) {
      throw new Error("Start time cannot be after the end time.");
    }
    this.timestamp_start = start;
  }
  
  getEndTime(): Date | undefined {
    return this.timestamp_end;
  }
  
  setEndTime(end: Date): void {
    if (end < this.timestamp_start) {
      throw new Error("End time cannot be before start time.");
    }
    this.timestamp_end = end;
  }
  
  // Get duration in milliseconds
  getDuration(): number | null {
    return this.timestamp_end ? this.timestamp_end.getTime() - this.timestamp_start.getTime() : null;
  }

  isCompleted(): boolean {
    if (this.timestamp_end) {
      return true;
    }
    return false;
  }
  
  toString(): string {
    const duration = this.getDuration();
    if (this.isCompleted() && (undefined != duration)) {
      const [hours, minutes, seconds, _] = WorkInterval.convertMs(duration);
      return `Start: ${this.timestamp_start.toISOString()}, End: ${this.timestamp_end?.toISOString()}, \
Duration ${WorkInterval.formatDuration(hours, minutes, seconds)}`
    }
    return `Start: ${this.timestamp_start.toISOString()}, Ongoing`;
  }

  static convertMs(duration_ms: number) {
    const hours: number = Math.floor(duration_ms / (1000*60*60));
    const minutes: number = Math.floor((duration_ms / (1000*60)) % 60);
    const seconds: number = Math.floor((duration_ms / (1000)) % 60);
    const mseconds: number = Math.floor(duration_ms % 1000);
    return [hours, minutes, seconds, mseconds];
  }

  static formatDuration(hours: number, minutes: number, seconds: number): string {
    return `${hours}:${minutes}:${seconds}`;
  }
}


export class WorkLogEntry {
  private interval: WorkInterval;
  private text: string = ""

  constructor(interval: WorkInterval) {
    this.interval = interval;
  }

  toString(): string {
    return `${this.interval.toString()}:
${this.text}`
  }

  getInterval(): WorkInterval {
    return this.interval;
  }

  getText(): string {
    return this.text;
  }

  setText(text: string) {
    this.text = text;
  }

  addText(text: string) {
    this.text += text;
  }
}

export class WorkDay {
  private logs: Array<WorkLogEntry> = [];

  getLastLog(): WorkLogEntry | undefined {
    return this.logs.at(-1);
  }

  addLog(log: WorkLogEntry) {
    this.logs.push(log);
  }

  getAllLogs(): Array<WorkLogEntry> {
    return this.logs;
  }

  toString(): string {
    let total_duration: number = 0;
    this.logs.forEach(function (l: WorkLogEntry) {
      let log_duration = l.getInterval().getDuration();
      if (undefined != log_duration) {
        total_duration += log_duration;
      }
    });

    return "";

  }
}
