import { reactive } from 'vue'

export const ui = reactive({
  askOpen: false,
  askId: 'nasyai',
  askQuestion: null,
  askNonce: 0,
  crewVisible: false,
})

export function openAsk(id = 'nasyai', question = null) {
  ui.askId = id
  ui.askQuestion = question
  ui.askNonce++
  ui.askOpen = true
}

export function closeAsk() {
  ui.askOpen = false
  ui.askQuestion = null
}

// Footer faces and other crew buttons: use the pane if the page has one, else the corner chat.
export function pickCrew(id) {
  const pane = document.querySelector('[data-crew]')
  if (pane) {
    window.dispatchEvent(new CustomEvent('nasyai:crew-pick', { detail: { id } }))
    pane.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else {
    openAsk(id)
  }
}
