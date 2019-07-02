interface Callback {
  (): void;
}

interface PluginEnterCallback {
  /**
   * 用户进入插件时uTools将执行该事件，所有uTools事件及方法都需要在窗口加载完成后执行。
   * onPluginEnter为进入插件时窗口完成加载后uTools会调用。
   */
  (ev: { code: string, type: string, payload: string | object | any[] }): void;
}

interface UtoolsEvents {

  /**
   * 当插件装载成功，uTools将会主动调用这个方法（生命周期内仅调用一次）。
   * 注意：在此方法未被执行前，无法调用其他方法。
   * */
  onPluginReady(callback: Callback): void;

  /**
   * 每当插件从后台进入到前台时，uTools将会主动调用这个方法。
   * 注意：在此方法未被执行前，无法调用其他方法。
   */
  onPluginEnter(callback: PluginEnterCallback): void;

  /**
   * 每当插件从前台进入到后台时，uTools将会主动调用这个方法。
   */
  onPluginOut(callback: Callback): void;

  /**
   * 用户对插件进行分离操作时，uTools将会主动调用这个方法。
   */
  onPluginDetach(callback: Callback): void;

  /**
   * 当此插件的数据在其他设备上被更改后同步到此设备时，uTools将会主动调用这个方法（必须在插件可视的情况下才会触发）
   */
  onDbPull(callback: Callback): void;
}

interface DbError {
  error: true
  message: 'doc not _id field' | 'param error' | 'not array' | 'Document update conflict' | 'missing'
  name: 'exception' | 'conflict' | 'not_found',
  id?: string
}

interface PutDb {
  _id: string;
  _rev?: string;
  [key: string]: any;
}

interface PutDbResult {
  id: string;
  rev: string;
  ok: true;
}

interface UtoolsDb {
  /**
   * 执行该方法将会创建或更新数据库文档
   * `_id`代表这个文档在数据库中唯一值，如果值不存在，则会创建一个新的文档，如果值已经存在，则会进行更新。
   * 你可能已经注意到，返回对象中包含一个`rev`属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败。
   * 另外需要注意，每次更新时都要传入完整的文档数据，无法对单个字段进行更新。
   */
  put<T extends PutDb>(doc: T): PutDbResult | DbError;

  /**
   * 执行该方法将会根据文档ID获取数据
   */
  get<T extends PutDb>(id: string): T | null;

  /**
   * 执行该方法将会删除数据库文档，可以传入文档对象或文档id进行操作。
   */
  remove<T extends PutDb>(doc: string | T): PutDbResult | DbError;

  /**
   * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
   */
  bulkDocs<T extends PutDb>(docs: T[]): Array<PutDbResult | DbError>;

  /**
   * 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定ID的数组，不传入则为获取所有文档。
   */
  allDocs<T extends PutDb>(preKey?: string | string[]): T[] | DbError;
}

interface UtoolsWindowMethods {
  /**
   * 执行该方法将会隐藏uTools主窗口，包括此时正在主窗口运行的插件，分离的插件不会被隐藏。
   */
  hideMainWindow(): boolean;

  /**
   * 执行该方法将会显示uTools主窗口，包括此时正在主窗口运行的插件。
   */
  showMainWindow(): boolean;

  /**
  * 执行该方法将会修改插件窗口的高度。
  */
  setExpendHeight(height: number): boolean;

  /**
  * 设置子输入框，进入插件后，原本uTools的搜索条主输入框将会变成子输入框，设置完子输入框搜索条子输入框可以为插件所使用。
  */
  setSubInput(callback: (ev: { text: string }, placeholder?: string) => void): boolean;

  /**
  * 移出先前设置的子输入框，在插件切换到其他页面时可以重新设置子输入框为其所用。
  */
  removeSubInput(): boolean;

  /**
  * 直接对子输入框的值进行设置。
  */
  setSubInputValue(value: string): boolean;

  /**
  * 执行该方法将会退出当前插件。
  */
  outPlugin(): boolean;

  /**
  * 执行该方法将会弹出一个系统通知。
  * @param {string} body 显示的内容
  * @param {null|string} 用户点击系统通知时，uTools将会使用此`code`进入插件
  * @param {boolean} silent 是否播放声音
  */
  showNotification(body: string, clickFeatureCode: null | string, silent: boolean): boolean;
}

interface CmdsType {
  label: string;
  type?: string | 'img' | 'over';
}

interface CmdsFileType extends CmdsType {
  type: 'file';
  fileType: 'file' | 'directory';
  minNum: number;
  maxNum: number;
}

interface CmdsRegType extends CmdsType {
  type: 'regex'
  match: RegExp;
  minLength: number;
  maxLength: number;
}

interface FeatureConf {
  code?: string;
  explain?: string;
  cmds?: (string | CmdsType | CmdsFileType | CmdsRegType)[];
}

interface UtoolsFeatures {

  /**
   * 返回本插件所有动态增加的功能。
   */
  getFeatures(): string[] | null;

  /**
   * 为本插件动态新增某个功能。
   * 
   */
  setFeature(featureConf: FeatureConf): boolean;

  /**
   * 动态删除本插件的某个功能。
   */
  removeFeature(featureCode: string): boolean;
}

interface PathMap {
  'home': string;
  'appData': string;
  'userData': string;
  'temp': string;
  'exe': string;
  'desktop': string;
  'documents': string;
  'downloads': string;
  'music': string;
  'pictures': string;
  'videos': string;
  'logs': string;
}

interface UtoolsHelper {
  /**
   * 该方法只适用于在macOS下执行，用于判断uTools是否拥有辅助权限，如果没有可以调用API方法requestPrivilege请求
   */
  isHadPrivilege(): boolean;

  /**
   * 该方法只适用于在macOS下执行，该方法调用后会弹出窗口向用户申请辅助权限。
   */
  requestPrivilege(): boolean;

  /**
   * 你可以通过名称请求以下的路径:
   * - `home` 用户的 home 文件夹（主目录）
   * - `appData` 当前用户的应用数据文件夹，默认对应：
   *  - `%APPDATA%` Windows 中
   *  - `~/Library/Application Suppor`t macOS 中
   * - `userData` 储存你应用程序设置文件的文件夹，默认是 appData 文件夹附加应用的名称
   * - `temp` 临时文件夹
   * - `exe` 当前的可执行文件
   * - `desktop` 当前用户的桌面文件夹
   * - `documents` 用户文档目录的路径
   * - `downloads` 用户下载目录的路径
   * - `music` 用户音乐目录的路径
   * - `pictures` 用户图片目录的路径
   * - `videos` 用户视频目录的路径
   * - `logs` 应用程序的日志文件夹
   */
  getPath<k extends keyof PathMap>(name: k): PathMap[k];

  /**
   * 复制图片到剪贴板
   */
  copyImage(buffer: Buffer): any;

  /**
   * 复制文件到剪贴板
   */
  copyFile(filepaths: string): any;
}

interface Utools extends UtoolsEvents, UtoolsWindowMethods, UtoolsFeatures, UtoolsHelper {
  db: UtoolsDb,
  robot: any, // todo
}

declare var utools: Utools;
