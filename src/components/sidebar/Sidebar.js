import './Sidebar.scss'
import {useContext, useState} from "react";
import {Button, ButtonGroup, FormGroup, Intent, NumericInput, Slider} from "@blueprintjs/core";
import classNames from "classnames";
import CollapsibleSection from "../collapsible-section/CollapsibleSection";
import {useLocalStorage} from "react-use";
import TelemetryService from '../../services/TelemetryService';
import BrobotContext from '../../context/BrobotContext';

function Sidebar() {
    const [isOpen, setIsOpen] = useLocalStorage('sidebar', false);

    const {
        maxDepth,
        setMaxDepth,
        minDepth,
        setMinDepth,
        maxHeight,
        setMaxHeight,
        fudgeFactor,
        setFudgeFactor
    } = useContext(BrobotContext);

    const classes = classNames({
        'bp3-dark': true,
        Sidebar: true,
        Sidebar__Open: isOpen,
        Sidebar__Closed: !isOpen
    })

    return (
        <>
            {isOpen && (
                <div className="SidebarOverlay" onClick={() => setIsOpen(false)} />
            )}
            {!isOpen && (
                <div className="SidebarOpenButton bp3-dark" onClick={() => setIsOpen(true)}>
                    <Button
                    onClick={() => setIsOpen(true)}
                    icon={'menu-open'}
                    minimal
                    />
                </div>
            )}
            <div className={classes}>
                <div className="SidebarHeader">
                    {isOpen && (
                        <>
                        Controls
                        </>
                    )}
                    <div className="SidebarHeader__Spacer" />
                    <Button
                        onClick={() => setIsOpen(!isOpen)}
                        icon={isOpen ? 'menu-closed' : 'menu-open'}
                        minimal
                    />
                </div>
                {isOpen && (
                    <div className="SidebarContent dark-scrollbar">
                        <CollapsibleSection padding title={"Actions"} startOpen>
                            <h1>System</h1>
                            <ButtonGroup fill vertical>
                                <ButtonGroup fill>
                                <Button intent={Intent.DANGER} icon="power" onClick={() => TelemetryService.sendCommand('shutdown')}>Shutdown</Button>
                                <Button intent={Intent.WARNING} icon="refresh" onClick={() => TelemetryService.sendCommand('restart')}>Restart</Button>
                                </ButtonGroup>
                                <Button onClick={() => TelemetryService.sendCommand('restart_ros')}>Restart ROS</Button>
                            </ButtonGroup>
                            <br />
                            <h1>Hardware Utilities</h1>
                            <ButtonGroup fill vertical>
                                <Button fill onClick={() => TelemetryService.sendCommand('zero_yaw_gimbal')}>Zero Yaw Gimbal</Button>
                                <Button fill onClick={() => TelemetryService.sendCommand('launch_ball')}>Launch Ball</Button>
                                <Button fill onClick={() => TelemetryService.sendCommand('spin_up_motors')}>Spin Up Motors</Button>
                                <Button fill onClick={() => TelemetryService.sendCommand('calibrate')}>Calibrate</Button>
                            </ButtonGroup>
                        </CollapsibleSection>
                        <CollapsibleSection padding title={"Perception Options"} startOpen>
                            <h1>Sensing Boundaries</h1>
                            <FormGroup label="Near Plane (m)" fill>
                                <NumericInput clampValueOnBlur fill min={0.1} max={10} stepSize={0.01} minorStepSize={0.001} majorStepSize={0.1} value={minDepth} onValueChange={(e) => setMinDepth(e)}/>
                            </FormGroup>
                            <FormGroup label="Far Plane (m)" fill>
                                <NumericInput clampValueOnBlur fill min={0} max={10} stepSize={0.01} minorStepSize={0.001} majorStepSize={0.1} value={maxDepth} onValueChange={(e) => setMaxDepth(e)}/>
                            </FormGroup>
                            <FormGroup label="Maximum Height (m)" fill>
                                <NumericInput clampValueOnBlur fill min={0} max={10} stepSize={0.01} minorStepSize={0.001} majorStepSize={0.1} value={maxHeight} onValueChange={(e) => setMaxHeight(e)}/>
                            </FormGroup>
                        </CollapsibleSection>
                        <CollapsibleSection padding title={"Actuation Options"} startOpen>
                            <h1>Actuation</h1>
                            <p></p>
                            <FormGroup label="VESC Fudge Factor Scale (%)" fill>
                                <NumericInput clampValueOnBlur fill min={50} max={200} stepSize={1} minorStepSize={0.1} majorStepSize={10} value={fudgeFactor} onValueChange={(e) => setFudgeFactor(e)} />
                            </FormGroup>
                            <br />
                        </CollapsibleSection>
                    </div>
                )}
            </div>
        </>
    )
}

export default Sidebar;