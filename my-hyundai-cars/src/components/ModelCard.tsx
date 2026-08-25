import SceneBackdrop from './art/SceneBackdrop'
import VehicleImage from './art/VehicleImage'
import type { HyundaiModel } from '../data/models'

/**
 * Showcase only. Intentionally not a link, button or clickable surface — no
 * href, no onClick, no pointer cursor, no hover affordance.
 */
export default function ModelCard({ model }: { model: HyundaiModel }) {
  return (
    <article className="select-none">
      <div className="relative isolate aspect-[4/3] overflow-hidden bg-sand">
        <SceneBackdrop
          tone="light"
          horizon={0.82}
          streaks={false}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-x-[3%] top-[24%] h-[52%]">
          <VehicleImage
            specKey={model.id}
            photo={model.photo}
            alt={`Hyundai ${model.name}`}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="border-t border-rule pt-5 sm:pt-6">
        <p className="eyebrow text-mute">{model.category}</p>
        <h3 className="mt-3 text-[1.375rem] leading-tight font-normal tracking-[-0.025em] text-ink sm:text-[1.5rem]">
          {model.name}
        </h3>
        <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-mute">
          {model.statement}
        </p>
      </div>
    </article>
  )
}
