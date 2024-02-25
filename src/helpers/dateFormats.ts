class DateFormat {
  public convertISO = (time: string) => {
    const [hour, minute] = time.split(":")
    const date = new Date()
    date.setHours(Number(hour))
    date.setMinutes(Number(minute))
    return date.toISOString()
  }
}

export default new DateFormat()
