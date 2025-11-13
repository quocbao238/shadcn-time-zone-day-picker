export type TTimezone = {
  label: string
  labelDetail: string
  value: string
}

export const usTimezones: TTimezone[] = [
  {
    label: 'EST',
    labelDetail: 'New York City',
    value: 'America/New_York',
  },
  {
    label: 'CST',
    labelDetail: 'Chicago',
    value: 'America/Chicago',
  },
  {
    label: 'MST',
    labelDetail: 'Denver',
    value: 'America/Denver',
  },
  {
    label: 'PST',
    labelDetail: 'Los Angeles',
    value: 'America/Los_Angeles',
  },
  {
    label: 'AKST',
    labelDetail: 'Anchorage',
    value: 'America/Anchorage',
  },
  {
    label: 'HAST',
    labelDetail: 'Honolulu',
    value: 'Pacific/Honolulu',
  },
]

