import * as yaml from 'yaml'
import { 
    WorkInterval, 
    WorkLocation, 
    WorkDay,
} from './models'; 

interface ModelSerializer<T> {
    serialize: (data: T) => string;
    deserialize: (data: string) => T;
    toObject: (data: T) => unknown;
};

export class WorkIntervalSerializer implements ModelSerializer<WorkInterval> {
    private readonly VERSION: string = "1.0"

    serialize(data: WorkInterval): string {
        return yaml.stringify(this.toObject(data));
    }

    deserialize(data: string): WorkInterval {
        const obj = yaml.parse(data);
        return new WorkInterval(
            obj.location,
            new Date(obj.timestamp_start),
            new Date(obj.timestamp_end)
        );
    }

    toObject(data: WorkInterval): unknown {
        return {
            version: this.VERSION,
            timestamp_start: data.getTimestampStart().toISOString(),
            timestamp_end: data.getTimestampEnd()?.toISOString(),
            location: data.getLocation()
        };
    }
}

export class WorkDaySerializer implements ModelSerializer<WorkDay> {
    private readonly VERSION: string = "1.0"

    private work_interval_serializer: ModelSerializer<WorkInterval>;

    constructor(work_interval_serializer: ModelSerializer<WorkInterval>) {
        this.work_interval_serializer = work_interval_serializer;
    }

    serialize(data: WorkDay): string {
        return yaml.stringify(this.toObject(data));
    }

    deserialize(data: string): WorkDay {    
        const obj = yaml.parse(data);
        const wd = new WorkDay();
        obj.intervals.map((interval: string) => {
            wd.addInterval(this.work_interval_serializer.deserialize(interval));
        });
        wd.setText(obj.text);
        return wd;
    }

    toObject(data: WorkDay): unknown {
        return {
            version: this.VERSION,
            intervals: data.getIntervals().map((interval: WorkInterval) => this.work_interval_serializer.toObject(interval)),
            text: data.getText()
        };
    }
}




