import { FormEvent, useState } from "react"
import { ArrowLeft } from "phosphor-react"
import { FeedbackType, feedbackTypes } from ".."
import { CloseButton } from "../../CloseButton"
import { ScreenshotButton } from "../ScreenshotButton"
import { api } from "../../../lib/api"
import { Loading } from "../Loading"

interface FeedbackContentStepProps {
  feedbackType: FeedbackType
  onFeedbackRestartRequest: () => void
  onFeedbackSent: () => void
}

export function FeedbackContentStep({ 
  feedbackType, 
  onFeedbackRestartRequest,
  onFeedbackSent,
}: FeedbackContentStepProps) {
  const feedbackTypeInfo = feedbackTypes[feedbackType]
  const [screenshot, setScreeshot] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault()

    try {
      setIsSendingFeedback(true)
      const dataSend = {
        type: feedbackType,
        comment,
        screenshot
      }
      await api.post('/feedbacks', dataSend)
      onFeedbackSent()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSendingFeedback(false)
    }
  }

  return (
    <>
      <header>
        <button 
          type="button" 
          className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequest}
        >
          <ArrowLeft weight="bold" className="w-4 h-4" />
        </button>

        <span className="text-xl leading-6 flex items-center gap-2" >
          <img 
            src={feedbackTypeInfo.image.source} 
            alt={feedbackTypeInfo.image.alt}
            className="w-6 h-6"
          />
          {feedbackTypeInfo.title}
        </span>

        <CloseButton />
      </header>

      <form
        className="my-4 w-full"
        onSubmit={handleSubmitFeedback}
      > 
        <textarea 
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-100
            text-zinc-100 border-zinc-600 bg-transparent rounded-md
            focus:border-brand-500 focus:ring-brand-500 focus:ring-1 
            focus:outline-none resize-none
            scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent
          "
          placeholder="Conte com detalhes o que está acontencendo..."
          onChange={(e) => setComment(e.target.value)}
        />

        <footer
          className="flex gap-2 mt-2"
        >
          <ScreenshotButton 
            screenshot={screenshot}
            onScreenshotTook={setScreeshot}
          />

          <button
            type="submit"
            className="p-2 bg-brand-500 rounded-md border-transparent flex flex-1 justify-center
              items-center text-sm hover:bg-brand-300 focus:outline-none
              focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900
              focus:ring-brand-500 transition-colors
              disabled:opacity-50 disabled:hover:bg-brand-500
            "
            disabled={!comment || isSendingFeedback}
          >
            { isSendingFeedback ? <Loading /> : 'Enviar feedback' }
          </button>
        </footer>
      </form>
    </>
  )
}