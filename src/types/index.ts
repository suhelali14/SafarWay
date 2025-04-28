declare module 'pako';

import type { ReactNode } from "react"

export interface TravelPackage {
  id: string
  title: string
  location: string
  price: string
  image: string
  duration?: string
  rating?: number
}

export interface Destination {
  id: number
  name: string
  price: string
  image: string
  badge?: string
}

export interface Feature {
  id: number
  title: string
  description: string
  icon: ReactNode
}

export interface Testimonial {
  id: number
  name: string
  photo: string
  rating: number
  text: string
}

