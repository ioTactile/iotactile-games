export class Timer {
  private returnType: ReturnType<typeof setInterval>
  private num: number
  private isPaused: boolean

  constructor() {
    this.returnType = setInterval(() => {}, 1000)
    this.num = 0
    this.isPaused = false
  }

  public getNum(): number {
    return this.num
  }

  public getIsPaused(): boolean {
    return this.isPaused
  }

  public start(): void {
    this.returnType = setInterval(() => {
      this.num++
    }, 1000)
  }

  public stop(): void {
    clearInterval(this.returnType)
  }

  public reset(): void {
    clearInterval(this.returnType)
    this.num = 0
  }

  public togglePause(): void {
    if (this.isPaused) {
      this.start()
    } else {
      this.stop()
    }
    this.isPaused = !this.isPaused
  }
}
