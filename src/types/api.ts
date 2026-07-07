import type { PassengerItem } from './passenger'

export interface FetchPassengerParams {
  selectdate?: '0' | '1'
  numOfRows?: string
  pageNo?: string
}

export interface PassengerApiBody {
  items: PassengerItem[]
  numOfRows: number
  pageNo: number
  totalCount: number
}

export interface PassengerApiResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: PassengerApiBody
  }
}
