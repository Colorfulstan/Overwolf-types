
export type overwolf = Static

interface Static {
  utils: OverwolfUtils;
  profile: OverwolfProfile;
  extensions: OverwolfExtensions;
  games: OverwolfGames;
  media: OverwolfMedia;
  settings: OverwolfSettings;
  streaming: OverwolfStreaming;
  windows: OverwolfWindows;
  io: OverwolfIO

  version: string;
}

/**
 * Currently the boolean returns from the Game Events Provider are wrongly converted to JS from C#.
 * To get the correct value (and prevent breaking code in case it actually gets changed to boolean values)
 * use:
 * var value = TBuggedBoolean + ""
 * var booleanValue = JSON.parse(value.toLowerCase())
 * */
type TBuggedBoolean = 'False' | 'True'

/**
 * Currently this typings use League of Legends events as basis, so additional work might need to be done on
 * the generic event typings to fit more games
 * */

/** All defined features */
type TFeatures = TFeaturesLOL // TODO: expand when adding more games ( ... | CSGO.TFeaturesCSGO | ...)
/** All defined categories */
type TCategories = TCategoriesLOL // TODO: expand when adding more games ( ... | CSGO.TCategoriesCSGO | ...)
/** All defined Events */
type TEvents = TEventsLOL // TODO: expand when adding more games ( ... | CSGO.TEventsCSGO | ...)

/** abstract Result Type for overwolf.games.events.getInfo */
interface GameEventsInfoDB<F extends AvailableFeaturesMap> {
  /** (should be) available for all games */
  features: F

  /** additional properties depend on the game */
  [key: string]: Object
}

/** feature name will be one of the features required for the game through
 *  overwolf.games.events.setRequiredFeatures.
 *  The boolean will state if the feature is available */
interface AvailableFeaturesMap {
  [featureName: string]: TBuggedBoolean
}

type InfoCallback<F extends AvailableFeaturesMap, T extends GameEventsInfoDB<F>> = (arg: InfoCBArg<F, T>) => any
type InfoCBArg<F extends AvailableFeaturesMap, T extends GameEventsInfoDB<F>> =
  ODKCallbackArg
  & { /** shown when status is "error" */ reason?: string }
  & { res: T }

type NewEventsCallback<E extends EventData<TEvents>> = (arg: EventUpdate<E>) => void
type InfoUpdateCallback<F extends TFeatures, I extends InfoUpdateData> = (arg: InfoUpdate<F, I>) => void
type ErrorListener = OverwolfListenable<{ error: string, isRelaunching: boolean }>

interface InfoUpdate<F extends TFeatures, I extends InfoUpdateData> {
  info: I
  /** The name of the feature this Info belongs to */
  feature: F
}

/** abstract type for game-info results */
interface InfoUpdateData {[categoryName: string]: any}

interface EventUpdate<E extends EventData<TEvents>> {
  events: E[]
}

interface EventData<T extends TEvents> {
  name: T
  data: any
}

type TFeaturesLOL =
  'matchState'
  | 'spellsAndAbilities'
  | 'death'
  | 'respawn'
  /** @deprecated */
  | 'deathAndRespawn'
  | 'kill'
  | 'assist'
  | 'gold'
  | 'minions'
  | 'summoner_info'
  | 'gameMode'
  | 'teams'

interface AvailableFeaturesMapLOL extends AvailableFeaturesMap {
  matchState: TBuggedBoolean
  spellsAndAbilities: TBuggedBoolean
  /** @deprecated use solo events / features instead*/
  deathAndRespawn: TBuggedBoolean
  death: TBuggedBoolean
  respawn: TBuggedBoolean
  kill: TBuggedBoolean
  assist: TBuggedBoolean
  gold: TBuggedBoolean
  minions: TBuggedBoolean
  summoner_info: TBuggedBoolean
  gameMode: TBuggedBoolean
  teams: TBuggedBoolean
}

type TCategoriesLOL = 'summoner_info' | 'game_info' | 'level'

interface InfoUpdateDataLOL extends InfoUpdateData {
  summoner_info?: SummonerInfo
  game_info?: GameInfoLOL
  level?: { level: TODKNumericString }
}

type InfoUpdateLOL = InfoUpdate<TFeaturesLOL, InfoUpdateDataLOL>

type GameEventsInfoDBLOL = GameEventsInfoDB<AvailableFeaturesMapLOL> & InfoUpdateDataLOL

/** TODO: add 'disabled feature' documentation */

interface SummonerInfo { // unreliable?
  /** The user’s Summoner Id
   * @since Game Events Provider 0.7.0*/
  id?: TODKNumericString
  /** The user’s region (EUE, EUW, etc.)
   * @since Game Events Provider 0.7.0 */
  region?: string,
  /** The user’s champion as used for keys in RIOT API EXCEPT for FiddleSticks -> Fiddlesticks on RIOT
   * @since Game Events Provider 0.7.0 */
  champion?: string,
  /** The user’s summoner’s name (lowerCase)
   * @since Game Events Provider 0.7.0*/
  name?: string
  /** Marks whether the current champion can use the ult ability several times in a row
   * (like Elise or Jayce for example)
   * @since Game Events Provider 0.7.0 */
  championHasSubsequentUlts?: TBuggedBoolean
}

interface GameInfoLOL {
  /** current game mode
   * TODO: check if 'classic' has been removed or it's just a documentation error http://developers.overwolf.com/documentation/sdk/overwolf/games/events/league-of-legends/
   * @since Game Events Provider 0.14.0
   * */
  gameMode?: 'classic' | 'tutorial' | 'spectator' | 'ranked' | 'custom'
  /** @deprecated */
  game_mode?: 'classic' | 'tutorial' | 'spectator' | 'ranked' | 'custom'
  /**
   * Needs to be decoded:
   * decodeURI(JSON.parse(data))
   * TODO: more accurate typing of the decoded value
   * @since Game Events Provider 0.7.0
   * */
  teams?: string
  /** amount of gold the player currently has.
   * So after spending Gold this will be reset
   * @since Game Events Provider 0.7.0
   * */
  gold?: TODKNumericString
  /**
   * amount of enemy minions killed by the player
   * @since Game Events Provider 0.7.0
   * */
  minionKills?: TODKNumericString
  /**
   * amount of neutral minions killed by the player
   * @since Game Events Provider 0.7.0
   */
  neutralMinionKills?: TODKNumericString
  /** @since Game Events Provider 0.14.0 */
  matchStarted?: TBuggedBoolean
  /** @deprecated */
  match_started?: TBuggedBoolean
  /** @since Game Events Provider 0.14.0 */
  matchOutcome?: 'win' | 'lose'
  /** Total number of different kill types achieved within a game by the player
   * @since Game Events Provider 0.35 */
  kills: TODKNumericString
  doubleKills: TODKNumericString
  tripleKills: TODKNumericString
  quadraKills: TODKNumericString
  pentaKills: TODKNumericString

  /**  Number of deaths for this session
   * @since Game Events Provider 0.77.4 */
  deaths

}


type TEventsLOL = 'ability'
  | 'spell'
  | 'death'
  | 'respawn'
  | 'kill'
  | 'assist'
  | 'matchStart'
  | 'matchEnd'

type EventDataLOL =
  LolEventKill
  | LolEventDeathAndRespawn
  | LolEventDeath
  | LolEventRespawn
  | LolEventKill
  | LoLEventMatchState
  | LolEventSpellsAndAbilities
type EventUpdateLOL = EventUpdate<EventDataLOL>

type TLolSpellsAndAbilitiesEvent = 'ability' | 'spell'

/**
 * @event "ability": player uses an ability - numbered 1-4
 * @event "spell": player uses an summoner spell - numbered 1-2 // TODO: is this still accurate?
 * @since Game Events Provider 0.14.0
 */
interface LolEventSpellsAndAbilities extends EventData<TLolSpellsAndAbilitiesEvent> {
  data: TODKNumericString
}

type TLoLDeathEvent = 'death'
type TLoLRespawnEvent = 'respawn' // TODO: respawn event will be removed!?
/**
 * @event "death": player's champion died
 * @since Game Events Provider 0.77.4
 */
interface LolEventDeath extends EventData<TLoLDeathEvent> {
}

/**
 * @event "respawn": player respawned
 * @since Game Events Provider 0.77.4
 */
interface LolEventRespawn extends EventData<TLoLRespawnEvent> {
}

/** @deprecated with death / respawn solo events */
type TLoLDeathAndRespawnEvent = 'death' | 'respawn' // TODO: respawn event will be removed
/**
 * @event "death": player's champion died
 * @event "respawn": player's champion respawned
 * @since Game Events Provider 0.14.0
 * @deprecated with death / respawn solo events
 */
interface LolEventDeathAndRespawn extends EventData<TLoLDeathAndRespawnEvent> {
}


type TLoLKillEvent = 'kill'

/**
 * @event "kill": killing another champion
 * @since Game Events Provider 0.7.0
 */
interface LolEventKill extends EventData<TLoLKillEvent> {
  data: {
    /** Number of times this kill type happened in the match */
    count: TODKNumericString
    label: 'kill' | 'double_kill' | 'triple_kill' | 'quadra_kill' | 'penta_kill'
    /** The total kills in this match
     * @since Game Events Provider 0.35.0 */
    totalKills: TODKNumericString
  }
}

type TLoLAssistEvent = 'assist'

/**
 * Number of times this event happened in the match
 * @event "assist": When player assists in killing another champion
 * @since Game Events Provider 0.7.0
 */
interface LolEventAssist extends EventData<TLoLAssistEvent> {
  data: TODKNumericString
}

type TLoLMatchStateEvent = 'matchStart' | 'matchEnd'

/**
 * @event "matchStart": Match has started
 * @event "matchEnd": Match has ended
 * @since Game Events Provider 0.14.0
 */
interface LoLEventMatchState extends EventData<TLoLMatchStateEvent> {
}


/** numeric value */
type TODKNumericString = string
/** will be 'none' if click was used to drag a window */
type TODKMouseButton = 'none' | 'left' | 'middle' | 'right' | 'xbutton1' | 'xbutton2'
///////
/// overwolf
//////
/** An Overwolf event. */
interface OverwolfEventArgs { // TODO: remove this in favor of ODKCallbackArg
  /** @type {string} A status for the given event - either "success" or "failure". */
  status: string;
}

/** Denotes a listenable that just accepts an empty action. */
interface OverwolfParameterlessListenable {
  addListener(callback: () => void): void;

  removeListener(callback: () => void): void;
}

/** Denotes a generic listenable. This differs from an OverwolfEventDispatcher in that
 its publications do not have a status. */
interface OverwolfListenable<TArgType> {
  addListener(callback: (arg: TArgType) => void): void;

  removeListener(callback: (arg: TArgType) => void): void;
}

interface OverwolfGenericListenable<TCallbackType> {
  addListener(callback: TCallbackType): void;

  removeListener(callback: TCallbackType): void;
}

/** Denotes a generic event dispatcher. The type specified in the generic
 constraint is used as the argument type of the resulting listener callback. */
interface OverwolfEventDispatcher<TEventListenerArgs> {
  /**
   * Add a listener to this event.
   * @param {TEventListenerArgs) => void} callback Invoked when the event is called.
   */
  addListener(callback: (args: TEventListenerArgs) => any): void;

  removeListener(callback: (args: TEventListenerArgs) => any): void;
}

/** Argument passed to a callback */
interface ODKCallbackArg {
  status: 'success' | 'error'
  /** only available when status === 'error' stating the reason for failure */
  error?: string
}

///////
/// overwolf.streaming
//////
interface OverwolfStreaming {
  start(settings: StreamSettings, callback: (args: StartStreamEventArgs) => void): void;
}

interface StreamSettings {
  provider: StreamingProvider;
  settings: StreamParams;
}

interface StreamParams {
  stream_info: StreamInfo;
  auth: StreamAuthParams;
  video: StreamVideoOptions;
  audio: StreamAudioOptions;
  peripherals: StreamPeripheralsCaptureOptions;
  ingest_server: StreamIngestServer;
}

interface StreamInfo {
  url: string;
  title: string;
}

interface StreamAuthParams {
  client_id: string;
  token: string;
}

interface StreamVideoOptions {
  auto_calc_kbps: boolean;
  fps: number;
  width: number;
  height: number;
  max_kbps: number;
  encoder: StreamingVideoEncoderSettings;
  capture_desktop: StreamDesktopCaptureOptions;
}

interface StreamDesktopCaptureOptions {
  enable: boolean;
  monitor_id: number;
  force_capture: boolean;
}

interface StreamingVideoEncoderSettings {
  encoder: StreamEncoder;
  config: any;
}

interface StreamingVideoEncoderNVIDIA_NVECSettings {
  preset: StreamEncoderPreset_NVIDIA;
  rate_control: StreamEncoderRateControl_NVIDIA;
  keyframe_interval: number;
}

declare enum StreamEncoderPreset_NVIDIA {
  AUTOMATIC,
  DEFAULT,
  HIGH_QUALITY,
  HIGH_PERFORMANCE,
  BLURAY_DISK,
  LOW_LATENCY,
  HIGH_PERFORMANCE_LOW_LATENCY,
  HIGH_QUALITY_LOW_LATENCY,
  LOSSLESS,
  HIGH_PERFORMANCE_LOSSLESS
}

declare enum StreamEncoderRateControl_NVIDIA {
  RC_CBR,
  RC_CQP,
  RC_VBR,
  RC_VBR_MINQP,
  RC_2_PASS_QUALITY
}

interface StreamingVideoEncoderIntelSettings {
  // Unknown? Docs are empty.
  // http://developers.overwolf.com/api?id=StreamingVideoEncoderIntelSettings
}

interface StreamingVideoEncoderx264Settings {
  keyframe_interval: number;
  rate_control: StreamEncoderRateControl_x264;
  preset: StreamEncoderPreset_x264;
}

declare enum StreamEncoderPreset_x264 {
  ULTRAFAST,
  SUPERFAST,
  VERYFAST,
  FAST,
  MEDIUM,
  SLOW,
  SLOWER,
  VERYSLOW,
  PLACEBO
}

declare enum StreamEncoderRateControl_x264 {
  RC_CBR,
  RC_CQP,
  RC_VBR,
  RC_VBR_MINQP,
  RC_2_PASS_QUALITY
}

declare enum StreamEncoder {
  INTEL,
  X264,
  NVIDIA_NVEC
}

declare enum StreamingProvider {
  Twitch
}

interface StreamAudioOptions {
  mic: StreamDeviceVolume;
  game: StreamDeviceVolume;
}

interface StreamDeviceVolume {
  enable: boolean;
  volume: number;
  device_id: string;
}

interface StreamPeripheralsCaptureOptions {
  capture_mouse_cursor: StreamMouseCursor;
}

declare enum StreamMouseCursor {
  both,
  gameOnly,
  desktopOnly
}

interface StreamIngestServer {
  name: string;
  template_url: string;
}


interface StartStreamEventArgs extends OverwolfEventArgs {
  stream_id?: number;
  error?: string;
}

///////
/// overwolf.windows
/// updated: 2018/May/13
/// http://developers.overwolf.com/documentation/sdk/overwolf/windows/
//////
interface OverwolfWindows {

  /**
   * Returns a window object of the index page.
   * @return Window window declared as "Main" within manifest
   * @since 0.113.1
   */
  getMainWindow()

  /**
   * Calls the given function with the current window object as a parameter.
   * @param {ODKWindow) => void} callback will be called with the current window object as a parameter.
   * @since 0.78
   */
  getCurrentWindow(callback: (arg: ODKCallbackArg & { window: ODKWindow }) => void): void;

  /**
   * Creates or returns a window by the window name that was declared in the manifest.
   * @param windowName The name of the window that was declared in the data.windows section in the manifest.
   * @param callback A callback function which will be called with the requested window as a parameter.
   * @since 0.78
   */
  obtainDeclaredWindow(windowId: ODKWindowId, callback: (arg: ODKCallbackArg & { window: ODKWindow }) => void): void;

  /**
   * Start dragging a window.
   * @param {string} windowId The ID of the window to drag.
   * @param {function} callback called when the drag is finished.
   * @since 0.78
   */
  dragMove(windowId: ODKWindowId, callback?: () => void): void;

  /**
   * Start resizing the window from a specific edge or corner.
   * @param {string}         windowId The ID of the window to resize.
   * @param {ODKWindowDragEdge} edge     The edge or corner from which to resize the window.
   * @since 0.78
   */
  dragResize(windowId: ODKWindowId, edge: ODKWindowDragEdge): void;

  /**
   * Start resizing the window from a specific edge or corner.
   * @param {ODKWindowId} windowId The id or name of the window to resize.
   * @param {ODKWindowDragEdge} edge The edge or corner from which to resize the window.
   * @param contentRect The real content of the window (for the ingame drawing resizing white area)
   * @since 0.100
   */
  dragResize(windowId: ODKWindowId, edge: ODKWindowDragEdge, contentRect: ODKRect): void

  /**
   * Change the window size to the new width and height in pixels.
   * @param {string} windowId the ID of the window to change size.
   * @param {number} width    The new window width in pixels
   * @param {number} height   The new window height in pixels
   * @param {()  =>       void} callback A callback which is called when the size change is completed.
   * @since 0.78
   */
  changeSize(windowId: ODKWindowId, width: number, height: number, callback?: () => void): void;

  /**
   * Change the window position in pixels from the top left corner.
   * @param {string} windowId the ID of the window to change size.
   * @param {number} width    The new window position on the X axis.
   * @param {number} height   The new window position on the Y Axis.
   * @param {()  =>       void} callback A callback which is called when the position change is completed.
   * @since 0.78
   */
  changePosition(windowId: ODKWindowId, left: number, top: number, callback?: () => void): void;

  /**
   * Closes the window.
   * @param {string} windowId The ID of the window to close.
   * @param {()  =>       void}        callback Called after the window is closed.
   * @since 0.78
   */
  close(windowId: ODKWindowId, callback?: (arg: ODKCallbackArg & { window_id: string }) => void): void;

  /**
   * Minimizes the window.
   * @param windowId The ID or name of the window to minimize.
   * @param callback Called after the window is minimized.
   * @since 0.78
   */
  minimize(windowId: ODKWindowId, callback?: (arg: ODKCallbackArg & { window_id: string }) => void): void;

  /**
   * Maximizes the window.
   * @param {string} windowId The ID of the window to maximize.
   * @param {()  =>       void}        callback Called after the window is maximized.
   * @since 0.81.7
   */
  maximize(windowId: ODKWindowId, callback?: () => void): void;

  /**
   * Restores the window.
   * NOTE: currently (0.97) only works with the windowId, not the name
   * @param {string} windowId The ID of the window to restore.
   * @param {()  =>       void}        callback Called after the window is restored.
   * @since 0.78
   */
  restore(windowId: ODKWindowId, callback?: (arg: ODKCallbackArg & { window_id: string }) => void): void;

  /**
   * Hides the window from screen and taskbar.
   * @since 108.1
   * @param {ODKWindowId} windowId The id or name of the window to hide.
   * @param {(arg: ODKCallbackArg) => void} callback Called after the window was hidden.
   * @since 0.108.1
   */
  hide(windowId: ODKWindowId, callback?: (arg: ODKCallbackArg) => void): void;

  /**
   * BUG: nonexisting window-ids do report the window as closed instead of giving an error
   * Returns the state of the window (normal/minimized/maximized/closed).
   * @param windowId The id or name of the window.
   * @param callback Called with the window state.
   * @since 0.85
   */
  getWindowState(windowId: ODKWindowId,
                 callback: (arg: ODKCallbackArg & { window_id: string, window_state: ODKWindowStates }) => void
  ): void

  /** Returns the state of all windows owned by the app (normal/minimized/maximized/closed).
   * @param callback Called with an object containing the states of the windows.
   * @since 0.90.200
   * */
  getWindowsStates(callback: (arg: ODKCallbackArg & { result: { [windowName: string]: ODKWindowStates } }) => void): void

  /**
   * Opens the options page specified in the manifest file. Does nothing if no such page has been specified.
   * @param {(arg: ODKCallbackArg) => void} callback called when the page is opened
   * @since 0.89
   */
  openOptionsPage(callback: (arg: ODKCallbackArg) => void): void

  /**
   * Sets whether the window should be injected to games or not.
   * @param windowId The id or name of the window.
   * @param shouldBeDesktopOnly
   * @param callback
   * @since 0.89.100
   */
  setDesktopOnly(windowId: ODKWindowId, shouldBeDesktopOnly: boolean,
                 callback: (arg: ODKCallbackArg & { window_id: ODKWindowId }) => void
  ): void

  /**
   * Sets whether the window should have minimize/restore animations while in game.
   * @param {ODKWindowId} windowId
   * @param {boolean} shouldAnimationsBeEnabled
   * @param callback
   * @since 0.89.100
   */
  setRestoreAnimationsEnabled(windowId: ODKWindowId, shouldAnimationsBeEnabled: boolean,
                              callback: (arg: ODKCallbackArg & { window_id: ODKWindowId }) => void
  ): void

  /**
   * Change the window’s topmost status. Handle with care as topmost windows can negatively impact user experience.
   * @param windowId The id or name of the window.
   * @param shouldBeTopmost
   * @param callback
   * @since 0.89.100
   */
  setTopmost(windowId: ODKWindowId, shouldBeTopmost: boolean, callback: (arg: ODKCallbackArg) => void): void

  /**
   * Sends the window to the back
   * @param {ODKWindowId} windowId The id or name of the window.
   * @param {(arg: ODKCallbackArg) => void} callback Called with the result of the request.
   * @since 0.91.200
   */
  sendToBack(windowId: ODKWindowId, callback: (arg: ODKCallbackArg) => void): void

  /**
   * Sends a message to an open window.
   *
   * Note: Using sendMessage is not our suggested choice for communication between windows, since it might not work in some occasions (for example, when sending extremely big messages)
   * Please consider using getOpenWindows() function instead. More info about communication between windows can be
   * found [here]{@link http://developers.overwolf.com/documentation/sdk/overwolf/windows/#windows-communication}.
   *
   * @param windowId The id or name of the window to send the message to.
   * @param messageId An arbitrary message id.
   * @param messageContent The content of the message.
   * @param callback Called with the status of the request
   * @since 0.92.200
   */
  sendMessage(windowId: ODKWindowId, messageId: string, messageContent: ODKMessageContent,
              callback: (result: ODKCallbackArg) => void
  )

  /**
   * Add Window In Game styling (for example, allowing mouse clicks to be passed through the window into the game)
   * @param {ODKWindowId} windowId The id or name of the window to add style to.
   * @param {ODKWindowStyle} style The style to be added
   * @param {(result: ODKCallbackArg) => void} callback Called with the status of the request
   * @since 0.89.200
   */
  setWindowStyle(windowId: ODKWindowId, style: ODKWindowStyle,
                 callback: (result: ODKCallbackArg) => void
  )


  /**
   * Remove window style
   * @param {ODKWindowId} windowId The id or name of the window to remove style from.
   * @param {ODKWindowStyle} style The style to be removed
   * @param {(result: ODKCallbackArg) => void} callback Called with the status of the request
   * @since 0.89.200
   */
  removeWindowStyle(windowId: ODKWindowId, style: ODKWindowStyle,
                    callback: (result: ODKCallbackArg) => void
  )

  /**
   * WidgetStyleHideFromDesktop
   * @undocumented */
  setWidgetStyle(windowId: ODKWindowId, options: { values: string[] })

  /**
   * WidgetStyleHideFromDesktop
   * @undocumented */
  removeWidgetStyle(windowId: ODKWindowId, options: { values: string[] })

  /**
   * Returns an all open windows as objects. The objects can be manipulated like any other window
   * @since 0.92.200
   */
  getOpenWindows(callback: (result: { [windowName: string]: Window }) => void): void;

  /**
   * Set the current window mute state (on/off)
   * @param {boolean} shouldBeMuted Window mute state (true - mute is on, false - mute is off)
   * @param {(arg: ODKCallbackArg) => void} callback Called with the result of the request
   * @since 0.102.1
   */
  setMute(shouldBeMuted: boolean, callback: (arg: ODKCallbackArg) => void)

  /**
   * Mutes all sound sources for the current window.
   * (TODO: how is this different from setMute? - just same as setMute(true)??)
   * TODO: mroe specific doc
   * @param {(arg: ODKCallbackArg) => void} callback Called with the result of the request.
   * @since 0.102.1
   */
  muteAll(callback: (arg: ODKCallbackArg) => void)

  /**
   * Visibility state of the window – to be used only with windows without a transparent border.
   * “hidden” – The window is completely hidden.
   * “fully” – The window is fully visible to the user.
   * “partial” – The window is partially visible to the user (and partially covered by other window/s).
   * @param callback Called with the result of the request:
   * <br/>{"status": "error","reason": the reason}<br/>
   * or<br/>
   * {"status": "success","visible": "hidden" | "fully" | "partial"}
   * @since 0.102.1
   */
  isWindowVisibleToUser(callback: (arg: ODKCallbackArg & { visible: 'hidden' | 'fully' | 'partial' }) => void)


  /**
   * Fired when the main window is restored.
   * @since 0.85.0
   */
  onMainWindowRestored: OverwolfEventDispatcher<void>;
  /**
   * Fired when the state of a window is changed.
   * @since 0.85.0
   */
  onStateChanged: OverwolfEventDispatcher<ODKWindowStateChangeData>;

  /**
   * @since 0.92.200
   */
  onMessageReceived: OverwolfEventDispatcher<ODKMessage>

  /**
   * Fired when the user was prevented from closing a window using Alt+F4
   * @since 0.113.1
   */
  onAltF4Blocked: OverwolfEventDispatcher<any> // TODO: event typing
}

type ODKWindowDragEdge =
  'None'
  | 'Left'
  | 'Right'
  | 'Top'
  | 'Bottom'
  | 'TopLeft'
  | 'TopRight'
  | 'BottomLeft'
  | 'BottomRight'

type ODKWindowStates = 'normal' | 'minimized' | 'maximized' | 'closed'
type ODKCurrentWindowStates = 'Normal' | 'Minimized' | 'Maximized' | 'Closed'

/**
 * inputPassThrough: Mouse and keyboard input will pass through the window to the game (no input blocking)
 * An object which specifies the window style (used by setWindowStyle, removeWindowStyle)
 */
type ODKWindowStyle = 'inputPassThrough'

interface ODKWindowStateChangeData {
  app_id: string
  window_id: ODKWindowId
  window_name: ODKWindowId
  window_state: ODKWindowStates;
  window_previous_state: ODKWindowStates;
}

/** Content to be sent to another window. Can currently (0.97) only contain string-values */
interface ODKMessageContent {
  [key: string]: string | string[] | number | number[] | boolean | ODKMessageContent
}


interface ODKMessage {
  id: string
  content: ODKMessageContent
}

/** @interface ODKWindow*/
interface ODKWindow {
  /** @lends {ODKWindow} */
  /**@property*/
  id: string;
  /**Gets the window name as declared in the manifest.
   * @type {string}*/
  name: string;
  /** in pixels*/
  width: number;
  /** in pixels*/
  height: number;
  /**Gets the window Y coordinate in pixels from the top of the screen.*/
  top: number;
  /**Gets the window X coordinate in pixels from the top of the screen.*/
  left: number;
  /**Indicates if the window is currently visible or minimized.*/
  isVisible: boolean;
  parent: string
  state: ODKCurrentWindowStates
}

/** The ID or the name of a window
 * Id can be obtained through ODKWindow,
 * Name is defined within the manifest */
type ODKWindowId = string

///////
/// overwolf.settings
//////
interface OverwolfSettings {
  /**
   * Returns the hotkey assigned to a givenf eature id by calling the callback.
   * @param {string}                 featureId The feature id for which to get the set hotkey.
   * @param {GetHotkeyEventArgs) => void} callback A function called with the result of the request which contains the hotkey if success.
   */
  getHotKey(featureId: string, callback: (args: GetHotkeyEventArgs) => void): void;

  /**
   * Registers a callback for a given hotkey action. If the registration has failed, the callback is invoked immediately with the "error" status. Otherwise, the callback will be invoked each time the Hotkey is pressed.
   * @param {string}                 actionId The action to be hotkeyed.
   * @param {HotkeyRegistrationEvent) =>        void}        callback The callback to be invoked upon success or failure.
   */
  registerHotKey(featureId: string, callback: (args: ODKHotkeyCallbackArg) => void): void;

  /** @since 0.89.1000
   * Fired when fps settings are changed.
   * */
  onFpsSettingsChanged: any

  /** @since 0.117.1
   *   Fired when video capture settings are changed.
   * */
  OnVideoCaptureSettingsChanged

  /** Fired when audio capture settings are changed.
   * @since 0.117.1 */
  OnAudioCaptureSettingsChanged

  /**
   Fired when a hotkey is modified. Apps will only be notified of hotkey changes that relate to them.
   @since  0.119.1*/
  OnHotKeyChanged: OverwolfListenable<HotkeyChangedEventArgs>

  /**
   * Original
   * R1080p
   * R720p
   * R480p
   */
  ResolutionSettings: any

}

interface HotkeyChangedEventArgs extends ODKCallbackArg {
  /** "replayhud_save"*/
  source: string,
  /**"Replay HUD: Save Replay for later"*/
  description: string,
  /**"Ctrl+Shift+F7"*/
  hotkey: string
}

interface GetHotkeyEventArgs extends ODKCallbackArg {
  hotkey: string;
}


interface ODKHotkeyCallbackArg extends ODKCallbackArg {
  /** only available on success */
  featureId?: string
}

///////
/// overwolf.media
///////
interface OverwolfMedia {
  /**
   * Takes a screenshot and calls the callback with the success status and screenshot Url.
   * @param {ScreenshotEventArgs) => void} callback A function called after the screenshot was taken.
   */
  takeScreenshot(callback: (args: ScreenshotEventArgs) => void): void;

  /**
   * Opens the social network sharing console to allow the user to share a picture.
   * @param {string} imageUrl    The url of the image to share.
   * @param {string} description A description of the image.
   * @param {() => void}        callback An optional callback to invoke after sharing the image.
   */
  shareImage(imageUrl: string, description: string, callback?: () => void): void;

  /**
   * Opens the social network sharing console to allow the user to share a picture.
   * @param {any}    image       The image object to be shared.
   * @param {string} description A description of the image.
   * @param {() => void}        callback An otpional callback to invoke after sharing the image.
   */
  shareImage(image: any, description: string, callback?: () => void): void;

  /** @type {OverwolfParameterlessListenable} Fired when a screenshot was taken. */
  onScreenshotTaken: OverwolfParameterlessListenable;
}

interface ScreenshotEventArgs extends OverwolfEventArgs {
  url: string;
}

interface ODKRect {
  top: number
  left: number
  width: number
  height: number
}

interface ODKLauncherInfo {
  /** Returns the title of the represented launcher. */
  title: string
  /** Returns the instance id of the represented launcher. */
  id: number
  /** Returns the class id of the represented launcher. */
  classId: number
  /** Returns whether the launcher represented is currently in focus. */
  isInFocus: boolean
  /** Returns the launcher’s window position. */
  position: ODKRect
  /** Returns the launcher’s main window handle */
  handle: ODKWindowId // TODO: check if this is right
  /** Returns the launcher’s process command-line. */
  commandLine: string
  /** Returns the launcher’s process id. */
  processId: number // TODO: check if this is right
  /** Returns the process path of the represented launcher. */
  path: string
}

///////
/// overwolf.games
///////
interface OverwolfGames {

  /**
   * Returns an object with information about the currently running game, or null if no game is running.
   * @param {GameInfo) => void} callback Called with the currently running or active game info
   * @since 0.78
   */
  getRunningGameInfo(callback: (gameInfo?: ODKRunningGameInfo) => void): void;

  /**
   * Returns an object with information about the currently running game (or active games, if more than one), or null if no game is running.
   * @param GameClassId
   * @param callback Called with the currently running or active game info (GameInfo).
   * @since 0.93.1
   * @updated 2016/12/20 Client v0.101.15
   */
  getGameInfo(GameClassId: TODKGameClassId,
              callback: (arg: ODKCallbackArg & { gameInfo?: ODKStaticGameInfo }) => void
  ): void

  /** An API for interacting with games using shared memory. */
  events: {
    /** Sets the required features from the provider.
     * @since 0.93.1 */
    setRequiredFeatures(features: TFeatures[],
                        callback?: (arg: ODKCallbackArg & {
                                      /** Array with the names of all the supported features from the given names */
                                      supportedFeatures: string[]
                                    }
                        ) => void
    )
    /**
     * NOTE: "status" of the callback arg is here "status" instead of success, so we need to check for "error"
     * instead if we want to be sure the call was successfull.
     * @since 0.95
     * @updated 2016/12/20 Client v0.101.15
     * */
    getInfo<F extends AvailableFeaturesMap, T extends GameEventsInfoDB<F>>(callback: InfoCallback<F, T>)
    /**
     * Fired when there was an error in the game events system.
     * @since 0.78
     * */
    onError: ErrorListener
    /**
     * Fired when there are game info updates with a JSON object of the updates.
     * @since 0.96
     * */
    onInfoUpdates2: {
      addListener<F extends TFeatures, I extends InfoUpdateData>(callback: InfoUpdateCallback<F, I>)
      removeListener<F extends TFeatures, I extends InfoUpdateData>(callback: InfoUpdateCallback<F, I>)
    }
    /**
     * Fired when there are new game events with a JSON object of the events information.
     * @since 0.96
     * */
    onNewEvents: {
      addListener(callback: NewEventsCallback<EventData<TEvents>>)
      removeListener(callback: NewEventsCallback<EventData<TEvents>>)
    }
  }

  /**
   * An API for tracking keyboard/mouse events.
   * {@link http://developers.overwolf.com/documentation/sdk/overwolf/games/inputtracking/}
   * @since 0.88
   * @updated 2016/12/20 Client v0.101.15
   */
  inputTracking: {
    /** Returns the input activity information. The information includes presses for keyboard/mouse, total
     * session time, idle time and actions-per-minute. This information resets between game executions.
     * @since 0.92.200
     * */
    getActivityInformation(callback: (arg: ODKCallbackArg & {
                                        activity: {
                                          /** ?? active time ??
                                           * TODO: when does tracking start and stop?
                                           * */
                                          aTime: number
                                          /** actions per minute
                                           * TODO: over what timespan? When does this tracking start and end?
                                           * */
                                          apm: number
                                          /** idle time */
                                          iTime: number
                                          keyboard: {
                                            keys: { [idkWhat: string]: number } // TODO: keyboard-key key-names format
                                            total: number
                                          },
                                          mouse: {
                                            /** distance travelled
                                             * TODO: when does tracking start and stop?
                                             * */
                                            dist: number
                                            keys: {
                                              // M_Left: 1
                                              [idkWhat: string]: number // TODO: mouse-key key-names format
                                            }
                                          }
                                        }
                                      }
                           ) => void
    ): void // TODO

    /** Returns the input last mouse position in game. the data includes the mouse position and a boolean
     *  stating whether the keypress was on a game or on an Overwolf widget (onGame)
     *  @since 0.93.6.0
     *  @untested taken straight from the docs */
    getMousePosition(callback: (arg: ODKCallbackArg & {
                                  mousePosition: {
                                    x: number
                                    y: number
                                    onGame: boolean
                                    /** TODO: what's this?
                                     *  */
                                    handle: {
                                      value: number
                                    }
                                  }
                                }
                     ) => void
    ): void

    /**
     * Fired when a keyboard key has been released.
     * The event information includes the virtual key code (key) and a boolean stating whether the keypress was on a game or on an Overwolf widget (onGame)
     * NOTE: only works while a game is running
     * @since 0.78
     */
    onKeyUp: OverwolfListenable<{ key: string, onGame: boolean }> /** TODO: typing key */

    /**
     * Fired when a keyboard key has been pressed.
     * The event information includes the virtual key code (key) and a boolean stating whether the keypress was on a game or on an Overwolf widget (onGame)
     * NOTE: only works while a game is running
     * @since 0.78
     */
    onKeyDown: OverwolfListenable<{ key: string, onGame: boolean }> /** TODO: typing key */
    /**
     * Fired when a mouse key has been released.
     * The event information includes whether the left or white mouse button was clicked (button),
     * x and y coordinates (x, y) and a boolean stating whether the keypress was on a game or on an Overwolf widget (onGame)
     * NOTE: only works while a game is running
     * @since 0.78
     */
    onMouseUp: OverwolfListenable<{ button: TODKMouseButton, onGame: boolean, x: number, y: number }> /** TODO:
     typing
     button */

    /**
     * Fired when a mouse key has been released.
     * The event information includes whether the left or white mouse button was clicked (button),
     * x and y coordinates (x, y) and a boolean stating whether the keypress was on a game or on an Overwolf widget (onGame)
     * NOTE: only works while a game is running
     * @since 0.78
     */
    onMouseDown: OverwolfListenable<{ button: TODKMouseButton, onGame: boolean, x: number, y: number }>
  }

  launchers: {
    /**
     * Returns an object with information about the currently running launchers.
     * @callback Called with the currently running detected launchers.
     * */
    getRunningLaunchersInfo(callback: (data: { launchers: ODKLauncherInfo[] }) => void)
    /**
     * Fired when the launcher info is updated. Passes an ILauncherInfo object.
     * */
    onUpdated: OverwolfListenable<ODKLauncherInfo>
    /**
     * Fired when a launcher was launched.
     * */
    onLaunched: OverwolfListenable<any>
    /**
     * Fired when a launcher is closed.
     * */
    onTerminated: OverwolfListenable<any>
  }

  /** Fired when the game ifno is updated, including game name, game running, game terminated, game changing focus, etc.
   * @event
   * @since 0.78*/
  onGameInfoUpdated: OverwolfListenable<ODKGameInfoChangeData>;
  /** Fired when a game is launched.
   * @event
   * @since 0.78 */
  onGameLaunched: OverwolfListenable<ODKRunningGameInfo>;

  /** Fired when the rendering frame rate of the currently injected game changes dramatically. The “fps_status” field can be “None”, “Stable”, “Drop” and “Increase”.
   *
   * @example
   * ```
   * {
   *     "fps_status": "Increase",
   *     "fps": 35
   * }
   ```
   * @event
   * @type {OverwolfListenable<FramerateChange>}
   * @since 0.79 */
  onMajorFrameRateChange: OverwolfListenable<FramerateChange>;

  /**
   * @example
   * ```
   * {
   *     "detectedRenderer": "D3D9"
   *  }
   ```
   */
  onGameRendererDetected: OverwolfListenable<{ detectedRenderer: string }>

  // TODO: inputTracking

}

interface FramerateChange {
  fps_status: string;
  fps: number;
}

interface ODKGameInfoChangeData {
  gameInfo: ODKRunningGameInfo;
  /** Indicates if there was a change in resolution (i.e. the width or height properties were changed */
  resolutionChanged: boolean;
  /** Indicates if there was a change in the game focus status. */
  focusChanged: boolean;
  /** Indicates if there was a change in the game running status. */
  runningChanged: boolean;
  /** Indicates if the gameInfo property represents a different game than before. */
  gameChanged: boolean;
}

/**
 * numeric representation of a game TODO: more accurate description and link to game-is list if possible or way to find them
 */
type TODKGameClassId = number

/** @updated 2016/12/20 Client v0.101.15 */
interface ODKStaticGameInfo { // http://developers.overwolf.com/documentation/sdk/overwolf/games/#getgameinfo
  /** @Example 7764 for CS:GO */
  GameInfoClassID: TODKGameClassId,
  /** @Example 77641 for CS:GO*/
  GameInfoID: number,
  /** @example "D:\Steam\SteamApps\common\Counter-Strike Global Offensive\csgo.exe" */
  ProcessPath: string
  /** @example "D:\Steam\steam.exe" */
  LauncherPath: string
  /** @example "-applaunch 730" */
  LauncherCommandLineParams: string,
  LastTimeVerified: Date,
  ManuallyAdded: boolean,
  WasAutoAddedByProcessDetection: boolean,
  GameInfo: { // taken from call for League of Legends (GameClassId 5426)
    ActualDetectedRenderers: number
    ActualGameRendererAllowsVideoCapture: boolean
    AllowCCMix: boolean
    AllowCursorMix: boolean
    AllowRIMix: boolean
    Client_GameControlMode: number
    CommandLine: any // TODO type - prolly string | null
    ControlModes: number
    CursorMode: number
    DIT: number
    DetectDirKey: any // TODO: type
    DisableActionMixed: boolean
    DisableActivityInfo: boolean
    DisableAeroOnDX11: boolean
    DisableBlockChain: boolean
    DisableD3d9Ex: boolean
    DisableDIAquire: boolean
    DisableEXHandle: boolean
    DisableEternalEnum: boolean
    DisableFeature_TS3: boolean
    DisableFeature_VideoCapture: boolean
    DisableOWGestures: boolean
    DisableRenderAI: boolean
    DisableResizeRelease: boolean
    /** @example "CS: GO" */
    DisplayName: string
    EnableClockGesture: boolean
    EnableFocusOnAnyClick: boolean
    EnableMTCursor: boolean
    EnableRawInput: boolean
    EnableSmartDIFocus: boolean
    EnableSmartDIFocus2: boolean
    EnableSmartFocus: boolean
    EnableTXR: boolean
    ExecutedMoreThan: boolean
    FIGVTH: boolean
    FirstGameResolutionHeight: any // TODO: type - prolly number
    FirstGameResolutionWidth: any // TODO: type - prolly number
    FixActionFocus: boolean
    FixCC: boolean
    FixCOEx: boolean
    FixCVCursor: boolean
    FixCursorOffset: boolean
    FixDIBlock: boolean
    FixDIFocus: boolean
    FixDXThreadSafe: boolean
    FixFSTB: boolean
    FixHotkeyRI: boolean
    FixInputBlock: boolean
    FixInvisibleCursorCR: boolean
    FixMixModeCursor: boolean
    FixModifierMixMode: boolean
    FixMouseDIExclusive: boolean
    FixRCEx: boolean
    FixResolutionChange: boolean
    FixRestoreSWL: boolean
    FixSWL: boolean
    FixSWLW: boolean
    ForceCaptureChangeRehook: boolean
    ForceControlRehook: boolean
    ForceGBB: boolean
    GameGenres: string
    GameLinkURL: any // TODO: type - prolly string
    GameNotes: any // TODO: type - prolly string or string[]
    GameRenderers: number
    /** long title of the game
     * @example "Counter-Strike: Global Offensive"*/
    GameTitle: string
    GenericProcessName: boolean
    GroupTitle: any // TODO: type - prolly string
    /** Id of the game instance
     * @see {@link ODKStaticGameInfo.GameInfoID}*/
    ID: number
    IconFile: any // TODO: type - prolly string
    IgnoreMultipleDevices: boolean
    IgnoreRelease: boolean
    InjectionDecision: number
    Input: number
    InstallHint: any // TODO: type - prolly string
    IsConflictingWithControlHotkey: boolean
    IsNew: boolean
    IsSteamGame: boolean
    KeepInGameOnLostFocus: boolean
    Label: string
    LastInjectionDecision: number
    LastKnownExecutionPath: any // TODO: type
    LaunchParams: any // TODO: type
    Launchable: boolean
    /** @example
     * "HKEY_LOCAL_MACHINE/SOFTWARE/Riot Games/RADS/LocalRootFolder" */
    LauncherDirectoryRegistryKey: string
    /** @example
     * ```
     * ["steam.exe"]
     * ```*/
    LauncherNames: string[]
    ModifierStatus: number
    PassThruBoundsOffsetPixel: number
    PressToClickThrough: number
    ProcessCommandLine: any // TODO: type
    ProcessID: number
    /** @example
     * ```
     * ["SteamApps\*\Counter-Strike Global Offensive\csgo.exe"]
     * ```
     */
    ProcessNames: string[]
    RecreateSB: boolean
    ReleaseKBInOverlayFocus: boolean
    ResizeNotifyResolution: boolean
    RestoreBB: boolean
    RestoreRT: boolean
    RunElevated: boolean
    SendHotkeyRI: boolean
    SetDIInExclusive: boolean
    SkipGameProc: boolean
    StuckInTrans_Margin: number
    StuckInTrans_MouseMoveGap: any // TODO: type
    SupportedScheme: any // TODO: type
    /** @example
     * "0.51.325" */
    SupportedVersion: string
    TCModes: number
    TerminateOnWindowClose: boolean
    UnsupportedScheme: any // TODO: type
    UpdateCursor: boolean
    UpdateCursorMT: boolean
    UseAllSafeHook: boolean
    UseEH: any // TODO: type
    UseHardwareDevice: boolean
    UseLongHook: boolean
    /** @example
     * "6;10" */
    UseMCH: string
    UseMH: boolean
    UseMHScheme: any // TODO: type
    UseMKLL: boolean
    UseMW: boolean
    UsePR: boolean
    UseRI: boolean
    UseRIB: boolean
    UseSafeHook: boolean
    UseTSHook: boolean
    WaitRestore: boolean
    Win7Support: number
    Win8Support: number
    Win10Support: number
    XPSupport: number
  }
}

/** @updated 2016/12/20 Client v0.101.15 */
interface ODKRunningGameInfo { // http://developers.overwolf.com/documentation/sdk/overwolf/games/gameinfo/
  /** Returns whether the game represented is currently in focus.
   * @since 0.78 */
  isInFocus: boolean
  /** Returns whether the game represented is currently running.
   * @since 0.78 */
  isRunning: boolean
  /** Returns whether the game represented allows video to be captured.
   * @since 0.78 */
  allowsVideoCapture: boolean
  /** Returns the title of the represented game.
   * @since 0.78
   * @example
   * "Counter-Strike: Global Offensive" */
  title: string
  /** Returns the id of the represented game.
   * @since 0.78 */
  id: number
  /** Returns the pixel width of the represented game window.
   * @since 0.78*/
  width: number
  /** Returns the pixel height of the represented game window.
   * @since 0.78 */
  height: number
  /** Returns the game reported (logical) pixel width of the represented game window.
   * @since 0.78 */
  logicalWidth: number
  /** Returns the game reported (logical) pixel height of the represented game window.
   * @since 0.78 */
  logicalHeight: number
  /** Returns an array of the rendering technology names supported by the running game.
   * @since 0.78
   * @example
   * [ "D3D9" ]*/
  renderers: string[]
  /** Returns the rendering technology detected by the running game.
   * @since 0.89.102 */
  detectedRenderer: string
  /** Returns the game process commandline
   * @since 0.78
   * @example
   * "D://Steam/steamapps/common/Counter-Strike Global Offensive/csgo.exe" -steam -novid +mat_vignette_enable 0"*/
  commandLine: string
  /** undocumented
   * @example
   * "1a1b96a9d8bb439d8f21abc21faa1184"*/
  sessionId: any
  /** undocumented
   * @example
   * "D://Steam/steamapp/scommon/Counter-Strike Global Offensive/csgo.exe" */
  executionPath: any
}

///////
/// overwolf.extensions
///////
/** @updated 2016/10/28 Client v0.99 */
interface OverwolfExtensions {
  /**
   * Launch an extension by its unique id
   * @param {string} uid       The extension unique id
   * @param {any}    parameter A parameter to pass to the extension. The extension may or may not use this parameter.
   * @since 0.78
   */
  launch(uid: string, parameter?: any): void;

  /**
   * Retrieve a service obejct (which will usually provide external APIs) by an id.
   * @param {string} id       The service id.
   * @param {void}   callback A function called with the service, fi found, and a status indicating success or failure.
   * @since 0.78
   */
  getService<TServiceType>(id: string, callback: (args: LocateServiceEvent<TServiceType>) => void): void;

  /**
   * Sets a string for other extensions to read.
   * @param info A string to post
   * @since 0.91
   */
  setInfo(info: string): void

  /**
   * Gets an extension’s info string.
   * @param id The id of the extension to get info for.
   * @param callback Called with the info.
   * @since 0.91
   */
  getInfo(id: string, callback: (result: ODKCallbackArg & { info: string }) => any)

  /**
   * Requests info updates for extension. Will also be called when the extension launches/closes.
   * @param id The id of the extension to get updates for.
   * @param eventsCallback A callback to receive info updates.
   * @param callback The status of the request.
   * @since 0.91
   */
  registerInfo(id: string, eventsCallback, callback) // TODO: typing for callbacks

  /**
   * Stop requesting info for extension.
   * @param id The id of the extension to stop getting updates for.
   * @param callback The status of the request.
   * @since 0.91
   */
  unregisterInfo(id, callback) // TODO: typings

  /**
   * Gets the running state of an extension.
   * @param id The id of the extension to get updates for.
   * @param callback The result of the request.
   * @example
   * Callback argument
   * ```
   * {
   *     "status": "success",
   *     "isRunning": true
   * }
   * ```
   * @since 0.91
   */
  getRunningState(id, callback) // TODO: typings

  /**
   * Returns the requested extension’s manifest object.
   * @param id The id of the extension to get the manifest for.
   * @param callback A function called with the manifest data.
   * @since 0.91
   * @example
   * Callback argument:
   * ```
   * {
   *     "manifest_version": 1,
   *     "type": "WebApp",
   *     "meta": {
   *         "name": "App Name",
   *         "version": "1.0.0.0",
   *         "minimum-overwolf-version": "0.92.21.0",
   *         "author": "Author",
   *         "icon": "icon.png",
   *         "icon_gray": "icon_gray.png",
   *         "description": ""
   *     },
   *     "UID": "lftmchifcjibofkemmelmnjeialamgnigfpthzez",
   *     "permissions": [
   *         "Extensions",
   *         "Hotkeys",
   *         "GameInfo",
   *         "GameControl",
   *         "FileSystem"
   *     ],
   *     "channel-id": 0,
   *     "in-game-plugin": null,
   *     "dependencies": null,
   *     "data": {
   *         "externally_connectable": {
   *             "matches": [
   *                 "http://*.overwolf.com",
   *                 "http://overwolf.com"
   *             ]
   *         },
   *         "protocol_override_domains": null,
   *         "force_browser": "NotSet",
   *         "plugins": [
   *             "npSimpleIOPlugin.dll"
   *         ],
   *         "game_events": null,
   *         "extra-objects": null,
   *         "hotkeys": null,
   *         "content_scripts": null,
   *         "launch_events": [
   *             {
   *                 "event": 1,
   *                 "event_data": {
   *                     "game_ids": null,
   *                     "wait_for_stable_framerate": null
   *                 },
   *                 "start_minimized": true
   *             }
   *         ],
   *         "user_agent": null,
   *         "tray_menu": false,
   *         "logitech": null,
   *         "windows": {
   *             "index": {
   *                 "file": "index.html",
   *                 "show_in_taskbar": true,
   *                 "transparent": true,
   *                 "resizable": false,
   *                 "show_minimize": true,
   *                 "clickthrough": false,
   *                 "use_os_windowing": false,
   *                 "disable_rightclick": false,
   *                 "forcecapture": false,
   *                 "show_only_on_stream": false,
   *                 "ignore_keyboard_events": false,
   *                 "in_game_only": false,
   *                 "desktop_only": false,
   *                 "disable_restore_animation": false,
   *                 "grab_keyboard_focus": false,
   *                 "size": {
   *                     "width": 910,
   *                     "height": 560
   *                 },
   *                 "start_position": {
   *                     "top": 10,
   *                     "left": 10
   *                 },
   *                 "topmost": false
   *             }
   *         },
   *         "start_window": "index"
   *     },
   *     "is_launchable": true,
   *     "has_devtools": true,
   *     "is_enabled": true,
   *     "is_hidden": false,
   *     "disable_dockbutton": false,
   *     "has_dockbutton": true,
   *     "install_state": 2,
   *     "is_installed": true,
   *     "options_page": null,
   *     "has_options_page": false,
   *     "hide_from_store": false,
   *     "is_bundled": false
   * }
   * ```
   */
  getManifest(id, callback) // TODO: typings


  /**
   * opens the development-tool window for the stated application and window
   * @undocumented
   * */
  showDevTools(appUID: string, windowId: ODKWindowId): void

  /**
   * Triggered, whenever a Exception is thrown that is not caught.
   * Mainly useful to catch exceptions thrown by externally included scripts e.g. within IFrames
   *
   * addListener takes a function with following params:
   * message: string - the error message
   * functionName - ?
   * scriptName - ?
   * // TODO: TS typings and better documentation
   *
   * @undocumented
   * @since 0.99.10 // TODO check versioning when documented
   */
  onUncaughtException: any // TODO: typings - OverwolfListenable does not allow the callback to be given as type

  /**
   * Returns an object with functions providing more information and utilities regarding the current extension.
   * @type {any}
   * @since 0.78
   */
  current: {
    getExtraObject(): any // TODO: typings
    /**
     * Same as OverwolfExtensions.getManifest without requiring the id
     * @see {@link OverwolfExtensions#getManifest}
     */
    getManifest(callback) // TODO: typings
    // TODO: additional methods from extensions.current
  };

  /**
   * Fires when the current app is launched while already running.
   *
   * This is useful in the case where the app has custom logic for clicking its dock button while it is already running.
   * The event contain an ‘origin’ string which what triggered the app launch (dock, storeapi, odk, etc…)
   * @since 0.92.300
   */
  onAppLaunchTriggered: OverwolfListenable<{ origin: "dock" | "storeapi" | "odk" | string, parameter: any }>
}

interface ODKExtensionMetadata {
  /** Mandatory. Name of your app. @since 0.78 */
  name: string
  /** Mandatory. Who developed the app. @since 0.78 */
  author: string
  /**Mandatory. Version of your app. Needs to be in the format of X.X.X where the X’s are numbers. @since 0.78 */
  version: string
  /**Mandatory. Minimum version of the Overwolf Client with which the app is compatible. The format is similar to the version field. @since 0.78 */
  "minimum-overwolf-version": string

  /**A name in a Java-namespace-like format (com.[company].[product]) uniquely identifying the extension. @since 0.78 */
  "access-name": string
  /**Mandatory. The description of your app on the Appstore tile. Limited to 180 characters. @since 0.78 */
  description: string

  /**Short name of your app. Provide a short title that will fit in the dock button area – 18 chars max.     @since 0.79*/
  dock_button_title: string
  /** Mandatory. Name of your app. */

  /**A relative path from the app folder to the icon’s png file. Mandatory. This is the mouse-over (multi-colored) version of the icon that will be displayed on the Overwolf dock. The icon dimensions should be 256×256 pixels.
   * @since 0.78 */
  icon: string

  /**A relative path from the app folder to the icon’s png file. This is the grayscale version of the icon that will be displayed on the Overwolf dock. The icon dimensions should be 256×256 pixels.
   * @since 0.78 */
  icon_gray: string
  /**
   * A relative path from the app folder to a png file. This is the icon that will appear in the store library. The icon dimensions should be 200×200 pixels.
   * @since 0.82
   */
  store_icon
}

interface ODKManifest { // TODO - update with http://developers.overwolf.com/documentation/sdk/overwolf/manifest-json/ (complete rework necc.)
                        // "manifest_version": 1,
                        // "type": "WebApp",
  /** Mandatory. The extension metadata. @see {@link ODKExtensionMetadata}
   * @since 0.78*/
  meta: ODKExtensionMetadata, // Last uptade 2016/10/28
  /**
   * unique id for the app generated by the client
   * @example
   * lftmchifcjibofkemmelmnjeialamgnigfpthzez
   */
  UID: string,
  // "permissions": [
  //     "Extensions",
  //     "Hotkeys",
  //     "GameInfo",
  //     "GameControl",
  //     "FileSystem"
  //     ],
  // "channel-id": 0,
  // "in-game-plugin": null,
  // "dependencies": null,
  data: {
    //     "externally_connectable": {
    //         "matches": [
    //             "http://*.overwolf.com",
    //             "http://overwolf.com"
    //             ]
    //     },
    //     "protocol_override_domains": null,
    /**
     * Causes links in the app to be opened using the user’s default browser or Overwolf’s browser. Takes ‘user’ and ‘overwolf’ (case insensitive).
     * @since 0.91.200
     * */
    force_browser: "user" | "overwolf",
    //     "plugins": [
    //         "npSimpleIOPlugin.dll"
    //         ],
    //     "game_events": null,
    //     "extra-objects": null,
    //     "hotkeys": null,
    //     "content_scripts": null,
    //     "launch_events": [
    //         {
    //             "event": 1,
    //             "event_data": {
    //                 "game_ids": null,
    //                 "wait_for_stable_framerate": null
    //             },
    //             "start_minimized": true
    //         }
    //         ],
    //     "user_agent": null,
    //     "tray_menu": false,
    //     "logitech": null,
    //     "windows": {
    //         "index": {
    //             "file": "index.html",
    //             "show_in_taskbar": true,
    //             "transparent": true,
    //             "resizable": false,
    //             "show_minimize": true,
    //             "clickthrough": false,
    //             "use_os_windowing": false,
    //             "disable_rightclick": false,
    //             "forcecapture": false,
    //             "show_only_on_stream": false,
    //             "ignore_keyboard_events": false,
    //             "in_game_only": false,
    //             "desktop_only": false,
    //             "disable_restore_animation": false,
    //             "grab_keyboard_focus": false,
    //             "size": {
    //                 "width": 910,
    //                 "height": 560
    //             },
    //             "start_position": {
    //                 "top": 10,
    //                 "left": 10
    //             },
    //             "topmost": false
    //         }
    //     },
    //     "start_window": "index"
  },
  // "is_launchable": true,
  // "has_devtools": true,
  // "is_enabled": true,
  // "is_hidden": false,
  // "disable_dockbutton": false,
  // "has_dockbutton": true,
  // "install_state": 2,
  // "is_installed": true,
  // "options_page": null,
  // "has_options_page": false,
  // "hide_from_store": false,
  // "is_bundled": false
}

interface LocateServiceEvent<TServiceType> extends OverwolfEventArgs {
  /** @type {any} The located service. */
  service: TServiceType;
}

///////
/// overwolf.profile
//////
interface OverwolfProfile {
  /**
   * Get the current user.
   * "status": "success",
   * "username": "username",
   * "userId": "OW_44f4533c-7704-39b1-6560-36bd14d26d99",
   * "machineId": "00ea040e-af74-5046-6c8f-57a27dc20fb7",
   * "partnerId": 3713,
   * "channel": "Regular" // TODO: possible channels type
   * @param {any) => void} callback A callback to invoke with the current user or an error.
   */
  getCurrentUser(callback: (res: ODKCallbackArg & { username: string, userId: string, machineId: string, partnerId: number, channel: string }) => void): void;

  /** Open the login dialog. */
  openLoginDialog(): void;

  /**
   * Fired when a user logged in or logged out.
   */
  onLoginStateChanged: OverwolfEventDispatcher<LoginStateChangedEvent>;
}

interface LoginStateChangedEvent extends OverwolfEventArgs {
  /** @type {string} The state of the connection - "Online", "Offline" or "Connecting" */
  connectionState: string;
  /** @type {string} The username of the logged in user if the status is not "Offline". */
  username?: string;
}

interface ODKDisplay {
  name: string
  id: string
  x: number
  y: number
  width: number
  height: number
  is_primary: boolean
  handle: {
    value: number
  }
}

///////
/// overwolf.utils
//////
interface OverwolfUtils { // http://developers.overwolf.com/documentation/sdk/overwolf/utils
// TODO: full update and typings
  /**
   * Returns the data currently on the clipboard.
   * Requires the Clipboard permission.
   * @param {string) => void} callback Invoked with the data on the clipboard.
   */
  getFromClipboard(callback: (data: string) => void): void;

  // TODO: Monitor interface
  /**
   * Get the list of monitors active. Requires the DesktopStreaming permission.
   * @param {Array<any>) => void} callback An array of monitors.
   */
  getMonitorsList(callback: (data: { displays: ODKDisplay[] }) => void): void;

  /**
   * Returns system peripherals information.
   * @since 0.98.0
   * */
  getPeripherals(callback: any): void // TODO: typing

  /** Returns system information which includes information about CPU, Monitors, GPU, HDD, RAM and more.
   * @since 0.92.200
   */
  getSystemInformation(callback: any): void // TODO: typing

  /** Returns whether the current device has touch capabilities.
   * @since 0.91.100
   */
  isTouchDevice(callback: any): void // TODO: typing

  /**
   * Opens the app-store page for the app with the given id
   * @undocumented
   * */
  openStoreOneAppPage(uid: string)

  /** Opens the url in Overwolf’s browser.
   * @since 0.91.200 */
  openUrlInOverwolfBrowser(url: string): void

  /** Opens the url in the user’s default browser.
   * @since  0.91.200 */
  openUrlInDefaultBrowser(url: string): void

  /**
   * Opens Windows Explorer and selects a file received as an Overwolf media url.
   * @since 0.91.200
   */
  openWindowsExplorer(url: ODKMediaUrl, callback: any): void // TODO: typings

  /**
   * Opens a file picker dialog to browse for a file. A url to the selected file will be returned.
   * @dependency Permissions required: FileSystem
   * @param filter A file filter. Supports wild cards (*) and seperated by commas (,). Ex. myFile*.*,*.txt
   * @param callback Called with a url to the selected file.
   * @since 0.91.100
   */
  openFilePicker(filter: string, callback: any) // TODO: typings
  /**
   * Place the given data on the clipboard.
   * Requires the Clipboard permission.
   * @param {string} data The data to place on the clipboard.
   */
  placeOnClipboard(data: string): void;

  /**
   * Send a key stroke to the game. Requires the GameControl permission.
   * @param {string} keyString The keystroke to send.
   */
  sendKeyStroke(keyString: string): void;
}

/** An overwolf media url (overwolf://media/*) */
type ODKMediaUrl = string

interface OverwolfIO { // TODO http://developers.overwolf.com/documentation/sdk/overwolf/io/
  fileExists: (arg, callback) => any // TODO
  writeFileContents: (filePath, content, encoding, triggerUacIfRequired, callback) => any
  /** @undocumented */
  readFileContents: (filePath, encoding, callback) => any
}

declare interface SimpleIOPlugin extends HTMLElement { // TODO: typings

  // constants return paths without trailing slash
  PROGRAMFILES: string
  PROGRAMFILESX86: string
  COMMONFILES: string
  COMMONFILESX86: string
  COMMONAPPDATA: string
  DESKTOP: string
  WINDIR: string
  SYSDIR: string
  SYSDIRX86: string
  MYDOCUMENTS: string
  MYVIDEOS: string
  MYPICTURES: string
  MYMUSIC: string
  COMMONDOCUMENTS: string
  FAVORITES: string
  FONTS: string
  // TODO: what does History return? also a path?
  HISTORY: string
  STARTMENU: string
  LOCALAPPDATA: string

  /**
   * check if a file exists locally
   * @param filePath
   * @param callback
   */
  fileExists: (filePath: string, callback: (status: boolean) => void) => void
  /**
   * check if a given path is a directory (false if not or doesn't exist)
   * @param filePath
   * @param callback
   */
  isDirectory: (filePath: string, callback: (status: boolean) => void) => void
  /**
   * reads a file's contents and returns as text.
   * Use the second parameter to indicate if the file is in UCS-2 (2 bytes per char)
   * and it will automatically do the UTF8 conversion. Otherwise, returns in UTF8
   * @param filePath
   * @param isUCS2 indicates if the file is in UCS-2 (2 bytes per char). If true the data will be converted to UTF8
   * @param callback
   */
  getTextFile: (filePath: string, isUCS2: boolean, callback: (status: boolean, data: string) => void) => void

  // TODO: check if limit is documented correctly
  // TODO: check if callback arg "data" is correctly typed
  /**
   * reads a file's contents and returns as an array of byte values.
   * NOTE: this function is extremly slow!
   * Use only for small files or to get file header info using the second parameter (limit) to limit amount of data to fetch
   * @param filePath
   * @param limit sets the amount of bytes to receive. -1 indicates no limitation
   * @param callback
   */
  getBinaryFile: (filePath: string, limit: number, callback: (status: boolean, data: ArrayBuffer) => void) => void

  /**
   * Create a file on the local filesystem with given text content.
   * For security reasons, we only allow to write to the local-app-data folder
   * Note: can't append to files.
   * This function will either create a new file or overwrite the previous one (based on implementation).
   * @param filePathWithinLocalAppData
   * @param content
   * @param callback
   */
  writeLocalAppDataFile: (filePathWithinLocalAppData: string,
                          content: string,
                          callback: (status: boolean, message: string) => void
  ) => void

  // TODO: update documentation when https://github.com/overwolf/overwolf-plugins/issues/3 got solved
  /**
   * Stream a file on the local filesystem to a javascript callback (text files only)
   * NOTE: don't call other plugin APIs from callback
   * @param filePath
   * @param callback
   */
  listenOnFile: (fileId: string, filePath: string, startAtEnd: boolean,
                 callback: (fileId: string, status: boolean) => void
  ) => void
  /** TODO: update documentation when https://github.com/overwolf/overwolf-plugins/issues/3 got solved
   * registers a handler for the file-stream opened through listenOnFile
   */
  onFileListenerChanged: OverwolfGenericListenable<(listeningId: string, status: boolean, data: string) => void>
  /** TODO: update documentation when https://github.com/overwolf/overwolf-plugins/issues/3 got solved
   * Stop streaming a file that you previously passed when calling |listenOnFile|
   * NOTE: there are no callbacks - as this will never fail (even if the stream doesn't exist)
   * NOTE: you will get a call to |onFileListenerChanged| with status == false when calling this function
   * @param listeningId id passed to listenOnFile
   */
  stopFileListen: (listeningId: string) => void

  /**
   * Retreive the most updated (latest accessed) file in a given folder (good for game logs)
   */
  getLatestFileInDirectory: (path: string, callback: (status: boolean, filename: string) => void) => void
  /**
   * Lists the content of given directory
   * @param path
   * @param callback
   */
  listDirectory: (path: string, callback: (status: boolean, listing: ODKFileToken[]) => void) => void
}

// TODO: check if correct when https://github.com/overwolf/overwolf-plugins/issues/4 got solved
/** A simple representation of a local file */
interface ODKFileToken {
  name: string
  type: 'dir' | 'file'
}
