class GameSync {
  constructor() {
    this.channelName = 'name_that_canadian_sync';
    this.channel = null;
    this.stateCallbacks = [];
    this.soundCallbacks = [];
    this.requestStateCallbacks = [];
    this.isPresenterConnected = false;
    this.presenterStatusCallbacks = [];
    this.isPresenterMode = false;
    this.isAdminMode = false;
    this.lastPresenterPing = 0;
    this.heartbeatInterval = null;

    this.init();
  }

  init() {
    try {
      if (window.BroadcastChannel) {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event) => {
          this.handleMessage(event.data);
        };
      } else {
        window.addEventListener('storage', (event) => {
          if (event.key === 'canadian_game_sync_msg' && event.newValue) {
            try {
              const msg = JSON.parse(event.newValue);
              this.handleMessage(msg);
            } catch (e) {
              console.error("Failed to parse storage event", e);
            }
          }
        });
      }
    } catch (e) {
      console.error("Failed to initialize sync channel", e);
    }
  }

  setPresenterMode(enabled) {
    this.isPresenterMode = !!enabled;
  }

  setAdminMode(enabled) {
    this.isAdminMode = !!enabled;
  }

  startHeartbeatMonitor(timeoutMs = 9000) {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      if (!this.isAdminMode) return;

      if (this.isPresenterConnected && this.lastPresenterPing > 0) {
        if (Date.now() - this.lastPresenterPing > timeoutMs) {
          this.isPresenterConnected = false;
          this.lastPresenterPing = 0;
          this.notifyPresenterStatus(false);
        }
      }
    }, 2000);
  }

  handleMessage(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'STATE_UPDATE':
        this.stateCallbacks.forEach(cb => cb(msg.payload));
        break;
      case 'TRIGGER_SOUND':
        this.soundCallbacks.forEach(cb => cb(msg.payload));
        break;
      case 'REQUEST_STATE':
        this.requestStateCallbacks.forEach(cb => cb());
        if (this.isPresenterMode) {
          this.send({ type: 'PRESENTER_PING' });
        }
        break;
      case 'PRESENTER_PING':
        if (this.isAdminMode) {
          this.lastPresenterPing = Date.now();
          if (!this.isPresenterConnected) {
            this.isPresenterConnected = true;
            this.notifyPresenterStatus(true);
          }
        }
        break;
      case 'ADMIN_PING':
        if (this.isPresenterMode) {
          this.send({ type: 'PRESENTER_PING' });
        }
        break;
    }
  }

  send(msg) {
    try {
      if (this.channel) {
        this.channel.postMessage(msg);
      } else {
        localStorage.setItem('canadian_game_sync_msg', JSON.stringify({
          ...msg,
          _t: Date.now()
        }));
      }
    } catch (e) {
      console.error("Error sending sync message", e);
    }
  }

  broadcastState(state) {
    this.send({
      type: 'STATE_UPDATE',
      payload: state
    });
  }

  requestState() {
    this.send({
      type: 'REQUEST_STATE'
    });
  }

  triggerSound(soundName) {
    this.send({
      type: 'TRIGGER_SOUND',
      payload: soundName
    });
  }

  pingPresenter() {
    this.send({
      type: 'ADMIN_PING'
    });
  }

  onStateReceived(callback) {
    this.stateCallbacks.push(callback);
  }

  onSoundReceived(callback) {
    this.soundCallbacks.push(callback);
  }

  onRequestStateReceived(callback) {
    this.requestStateCallbacks.push(callback);
  }

  onPresenterStatusChange(callback) {
    this.presenterStatusCallbacks.push(callback);
  }

  notifyPresenterStatus(isConnected) {
    this.presenterStatusCallbacks.forEach(cb => cb(isConnected));
  }
}

const sync = new GameSync();
window.gameSync = sync;
