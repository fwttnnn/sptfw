import { create } from "zustand"

export type Tooltip = {
  text: string
  show: boolean
  setTooltip: (show: boolean, text: string) => void
}

export default create<Tooltip>((set) => ({
  text: "",
  show: false,
  setTooltip: (show, text) => set({ show, text }),
}))
