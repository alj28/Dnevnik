import { time } from "console";

export enum WorkLocation {
    Home = 0,
    Office = 1,
    ElseWhere = 2
};

export class WorkInterval {
    private timestamp_start: Date;
    private location: WorkLocation;
    private timestamp_end?: Date;

    constructor(location: WorkLocation, start?: Date, end?: Date) {
        this.timestamp_start = new Date();
        this.location = location;
        if (start) {
            this.timestamp_start = start;
        }
        if (end) {
            this.timestamp_end = end;
        }

        if (this.timestamp_end) {
            if (this.timestamp_end < this.timestamp_start) {
                throw new Error("End time cannot be before start time.");
            }
        }
    }

    setLocation(location: WorkLocation) {
        this.location = location;
    }

    getLocation(): WorkLocation {
        return this.location;
    }

    getTimestampStart(): Date {
        return this.timestamp_start;
    }

    setTimestampStart(timestamp: Date) {
        if (this.timestamp_end) {
            if (timestamp > this.timestamp_end) {
                throw new Error("End time cannot be before start time.");
            }
        }
        this.timestamp_start = timestamp;
    }

    getTimestampEnd(): Date | undefined {
        return this.timestamp_end;
    }

    setTimestampEnd(timestamp: Date) {
        if (timestamp < this.timestamp_start) {
            throw new Error("End time cannot be before start time.");
        }
        this.timestamp_end = timestamp;
    }

    getDuration(): number | undefined {
        if (this.timestamp_end) {
            return this.timestamp_start.getTime() - this.timestamp_end.getTime();
        }
        return undefined;
    }

    isCompleted(): boolean {
        if (this.timestamp_end) {
            return true;
        }
        return false;
    }

    toString(): string {
        const duration = this.getDuration();
        if (duration) {
            const [hours, minutes, seconds] = WorkInterval.convertMs(duration);
            return `Start ${this.timestamp_start.toISOString()}, End ${this.timestamp_end?.toISOString()},  \
Duration: ${WorkInterval.formatDuration(hours, minutes, seconds)}`;
        }
        return `Start ${this.timestamp_start.toISOString()}, Ongoing`;
    }

    static convertMs(duration_ms: number) {
        const hours: number = Math.floor(duration_ms / (1000*60*60));
        const minutes: number = Math.floor((duration_ms / (1000*60)) % 60);
        const seconds: number = Math.floor((duration_ms / (1000)) % 60);
        //const mseconds: number = Math.floor(duration_ms % 1000);
        return [hours, minutes, seconds];
    }
    
    static formatDuration(hours: number, minutes: number, seconds: number): string {
      return `${hours}:${minutes}:${seconds}`;
    }
};

export class WorkDay {
    private intervals: Array<WorkInterval> = [];
    private text: string = "";

    getLastInterval(): WorkInterval | undefined {
        return this.intervals.at(-1);
    }

    getIntervals(): Array<WorkInterval> {
        return this.intervals;
    }

    addInterval(interval: WorkInterval) {
        this.intervals.push(interval);
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