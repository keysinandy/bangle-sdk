export interface IOptions {
  debug: boolean
}

declare function init(projectId: string, options?: IOptions): void
declare function setUser(id: string): void

export as namespace banglesdk;
export default init
export { init, setUser }