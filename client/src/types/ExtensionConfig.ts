/**
 * Represents a user.
 */
export type ExtensionConfig = {
  /**
   * JFrog platform URL
   * @type {string}
   * @memberof User
   * @property url
   * @required
   */
  url?: string;
  /**
   * The user's name
   * @type {string}
   * @memberof User
   * @property name
   * @required
   * @example
   * "smith@jfrog.com"
   */
  username?: string;

  /**
   * The user's password
   * @type {string}
   * @memberof User
   * @property password
   * @optional
   * @example
   * "password"
   */
  password?: string;

  /**
   * The user's access token date
   * @type {string}
   * @memberof User
   * @property accesToken
   * @required
   * @example
   * "abc"
   */
  accessToken?: string;

  /**
   * JFrog watches
   * @type {string}
   * @memberof User
   * @property accesToken
   * @required
   * @example
   * "watch1,watch2,..."
   */
  watches?: string;
  /**
   * JFrog project
   * @type {string}
   * @memberof User
   * @property accesToken
   * @required
   * @example
   * "project"
   */
  project?: string;

  /**
   * The user's authenticate type
   * @type {string}
   * @memberof User
   * @property accessToken
   * @required
   * @example
   * "basic" | "accessToken"
   */
  authType?: string;
};
