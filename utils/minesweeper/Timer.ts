export class Timer {
  private returnType: ReturnType<typeof setInterval> | undefined
  private num: number
  private isPaused: boolean

  constructor() {
    this.returnType = undefined
    this.num = 0
    this.isPaused = false
  }

  public getReturnType(): ReturnType<typeof setInterval> | undefined {
    return this.returnType
  }

  public getNum(): number {
    return this.num
  }

  public getIsPaused(): boolean {
    return this.isPaused
  }

  public start(): void {
    this.isPaused = false
    this.returnType = setInterval(() => {
      this.num++
    }, 1000)
  }

  public isStarted(): boolean {
    return this.returnType !== undefined
  }

  public stop(): void {
    clearInterval(this.returnType)
  }

  public reset(): void {
    this.returnType = undefined
    this.num = 0
    this.isPaused = false
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.start()
    } else {
      this.stop()
      this.isPaused = true
    }
  }
}
