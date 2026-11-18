import type { Building } from '@/api/types/building'
import { http } from '../http'

export function getBuildings(): Promise<Building[]> {
  return http.get<Building[]>('/buildings')
}

export function getBuilding(id: number): Promise<Building> {
  return http.get<Building>(`/buildings/${id}`)
}
