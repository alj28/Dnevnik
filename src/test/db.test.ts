import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

import {
    WorkInterval,
    WorkLocation,
} from '../backend/model'

suite('DB Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Time interval', () => {
        /* Timestamp start created automatically if not specified */
        const dut_1 = new WorkInterval(WorkLocation.Home);
        assert.strictEqual(false, dut_1.isCompleted());
        assert.strictEqual(undefined, dut_1.getTimestampEnd());
        const timestamp_start_1 = dut_1.getTimestampStart();
        assert.strictEqual(true, timestamp_start_1 instanceof Date);
        const timestamp_now_1 = new Date();
        assert.strictEqual((timestamp_now_1.getTime() - timestamp_start_1.getTime()) < 1000, true);

        /* Pass timestamp start to constructor */
        const timestamp_start_2 = new Date((new Date()).getTime() - (1000*60*60));
        const dut_2 = new WorkInterval(WorkLocation.Home, timestamp_start_2);
        assert.strictEqual(false, dut_2.isCompleted());
        assert.strictEqual(undefined, dut_2.getTimestampEnd());
        assert.strictEqual(timestamp_start_2, dut_2.getTimestampStart());

        /* Pass timestamp start and end to constructor */
        const timestamp_start_3 = new Date((new Date()).getTime() - (1000*60*60*2));
        const timestamp_end_3 = new Date((new Date()).getTime() - (1000*60*60*1));
        const dut_3 = new WorkInterval(WorkLocation.Home, timestamp_start_3, timestamp_end_3);
        assert.strictEqual(true, dut_3.isCompleted());
        assert.strictEqual(timestamp_start_3, dut_3.getTimestampStart());
        assert.strictEqual(timestamp_end_3, dut_3.getTimestampEnd());

        /* Pass end timestamp and not start */
        const timestamp_start_4 = undefined;
        const timestamp_end_4 = new Date((new Date()).getTime() - (1000*60*60*1));
        assert.throws(() => new WorkInterval(WorkLocation.Home, timestamp_start_4, timestamp_end_4));

        /* Set end timestamp before start */
        const timestamp_start_5 = new Date();
        const timestamp_end_5 = new Date(timestamp_start_5.getTime() - 1000);
        assert.throws(() => new WorkInterval(WorkLocation.Home, timestamp_start_5, timestamp_end_5));

        const dut_5 = new WorkInterval(WorkLocation.Home, timestamp_start_5);
        assert.throws(() => dut_5.setTimestampEnd(new Date(dut_5.getTimestampStart().getTime() - 1000)));
    });

    test('Duration ms to format', () => {
        const interval: number = 15756512
        const disassembled = WorkInterval.convertMs(interval);

        for (const key in disassembled) {
            if (disassembled.hasOwnProperty(key)) {
                console.log(`${key} : ${disassembled[key as keyof typeof disassembled]}`);
            }
        }
    });
});
