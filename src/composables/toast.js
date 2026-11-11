import { reactive } from 'vue'

export const toastState = reactive({ msg: '', on: false })
let tt = 0

export function toast(msg) {
  toastState.msg = msg
  toastState.on = true
  clearTimeout(tt)
  tt = setTimeout(() => {
    toastState.on = false
  }, 1800)
}
