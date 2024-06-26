import './TelemetryView.scss';
import {useContext, useEffect, useRef, useState} from "react";
import jpeg from 'jpeg-js';
import useTelemetrySubscription from '../../hooks/useTelemetrySubscription';
import { Icon } from '@blueprintjs/core';

function rgb8ImageToBase64Jpeg (msg) {
    var raw = atob(msg.data)
    var array = new Uint8Array(new ArrayBuffer(raw.length))
    for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i)
    }

    var frameData = Buffer.alloc(msg.width * msg.height * 4)
    for (let i = 0; i < msg.width * msg.height; i++) {
        frameData[4 * i + 0] = array[3 * i + 0]
        frameData[4 * i + 1] = array[3 * i + 1]
        frameData[4 * i + 2] = array[3 * i + 2]
        frameData[4 * i + 3] = 0
    }
    var rawImageData = {
        data: frameData,
        width: msg.width,
        height: msg.height
    }
    return jpeg.encode(rawImageData, 50).data.toString('base64')
}



function TelemetryView() {
    const cameraFrame = useTelemetrySubscription('camera_frame', {
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0
    });
    const target = useTelemetrySubscription('launcher_target', {
        x: null,
        y: null,
        z: null
    });
    const launcherVelocity = useTelemetrySubscription('launcher_velocity', null);
    const launcherYaw = useTelemetrySubscription('launcher_yaw', null);

    const [hasTarget, setHasTarget] = useState(false);
    const [hasBall, setHasBall] = useState(false);

    useEffect(() => {
        if (target.x) {
            setHasTarget(true); 
        } else {
            setHasTarget(false);
        }
    }, [target]);

    return (
        <div className="TelemetryView">
            <h4 style={{marginTop: '0px'}}>Camera Pose</h4>
            <div className="TelemetryView__Row">
                <div className="bp3-card TelemetryView__Card">
                    <Icon icon="move" iconSize="24" />
                    <div className="TelemetryView__Card__Text">
                        <h2>X: {cameraFrame.x.toFixed(4)} m</h2>
                        <h2>Y: {cameraFrame.y.toFixed(4)} m</h2>
                        <h2>Z: {cameraFrame.z.toFixed(4)} m</h2>
                    </div>
                </div>
                <div className="bp3-card TelemetryView__Card">
                    <Icon icon="refresh" iconSize="24" />
                    <div className="TelemetryView__Card__Text">
                        <h2>RX: {cameraFrame.rx.toFixed(6)} rad</h2>
                        <h2>RY: {cameraFrame.ry.toFixed(6)} rad</h2>
                        <h2>RZ: {cameraFrame.rz.toFixed(6)} rad</h2>
                    </div>
                </div>
            </div>
            <h4>Launcher Status</h4>
            <div className="TelemetryView__Row">
            <div className="bp3-card TelemetryView__Card">
                <Icon icon="locate" iconSize="24" />
                <div className="TelemetryView__Card__Text">
                    <h2>Target X: {target.x ? target.x.toFixed(4) : '--'} m</h2>
                    <h2>Target Y: {target.y ? target.y.toFixed(4) : '--'} m</h2>
                    <h2>Target Z: {target.z ? target.z.toFixed(4) : '--'} m</h2>
                </div>
            </div>
            <div className="bp3-card TelemetryView__Card">
                <Icon icon="send-to" iconSize="24" />
                <div className="TelemetryView__Card__Text">
                    <h2>Velocity: {launcherVelocity ? launcherVelocity.toFixed(4) : '--'} m/s</h2>
                    <h2>Yaw: {launcherYaw ? launcherYaw.toFixed(0) : '--'} deg</h2>
                </div>
            </div>
            </div>
            <div className="TelemetryView__Row" style={{marginTop: '10px'}}>
                <div className="bp3-card TelemetryView__Card" style={{
                    backgroundColor: hasBall ? '#a8ff9e' : '#ffb1b1'
                }}>
                    <div className="TelemetryView__Card__BigText">
                        {hasBall ? (
                            <>
                            Ball in Launcher
                            </>
                        ) : (
                            <>
                            No Ball in Launcher
                            </>
                        )}
                    </div>
                </div>
                <div className="bp3-card TelemetryView__Card" style={{
                    backgroundColor: hasTarget ? '#cc9eff' : '#ffb1b1'
                }}>
                    <div className="TelemetryView__Card__BigText">
                        {hasTarget ? (
                            <>
                            Target Acquired
                            </>
                        ) : (
                            <>
                            No Target
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div style={{
                minHeight: '100px'
            }}>

            </div>
        </div>
    );
}

export default TelemetryView;