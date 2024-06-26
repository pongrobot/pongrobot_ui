import React from 'react';
import { createRoot } from 'react-dom/client';
import './assets/css/main.scss';
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";

import { FocusStyleManager, NonIdealState, Spinner } from "@blueprintjs/core";
import Viewports from "./components/viewports/Viewports";
import useTelemetrySubscription from './hooks/useTelemetrySubscription';
import { BrobotContextProvider } from './context/BrobotContext';

FocusStyleManager.onlyShowFocusOnTabs();

const container = document.getElementById('root');
const root = createRoot(container);

function Root() {
    const connected = useTelemetrySubscription('online', false);
    const showConnectedOverlay = false;

    /**
     * Sidebar
     *
     * Three main views we want to show:
     * - 3D/2D viewport
     * - System and ros service logs
     * - Telemetry data, topic monitoring
     *
     */
    return (
      <BrobotContextProvider>
        {(!connected && showConnectedOverlay) && (
            <div className="OfflineOverlay">
              <div className="OfflineOverlay__Inner bp3-card bp3-elevation-2">
                <NonIdealState
                  icon='offline'
                  title='Brobot Offline'
                  description='The UI will automatically reconnect when possible.'
                  action={(
                    <Spinner size={16} />
                  )}
                />
              </div>
            </div>
        )}
        <div className="LayoutHorizontal">
            <Sidebar />
            <div className="LayoutVertical">
                <Header />
                <Viewports />
            </div>
        </div>
      </BrobotContextProvider>
    );
}

root.render(
  <Root />
);
