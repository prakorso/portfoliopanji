import SectionHeading from './SectionHeading'
import SolutionRows from './SolutionRows'
import { PERSONAL_SOLUTIONS } from '../data/content'

export default function PersonalSection() {
  return (
    <section id="personal" className="bg-bone py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 xl:gap-28">
          <SectionHeading
            eyebrow="For Your Personal"
            title="Designed Around Your Life."
            copy="From everyday drives to family journeys, we'll help you find a Hyundai that fits the way you live."
            className="lg:sticky lg:top-32 lg:self-start"
          />
          <SolutionRows rows={PERSONAL_SOLUTIONS} />
        </div>
      </div>
    </section>
  )
}
