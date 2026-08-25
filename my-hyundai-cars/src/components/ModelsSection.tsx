import ModelCarousel from './ModelCarousel'
import SectionHeading from './SectionHeading'

export default function ModelsSection() {
  return (
    <section id="models" className="overflow-x-clip bg-paper py-24 sm:py-28 lg:py-40">
      <div className="shell">
        <SectionHeading
          title="Find the Hyundai That Fits You."
          copy="Explore the Hyundai models available through My Hyundai Cars."
          className="max-w-[36rem]"
        />
      </div>
      <div className="mt-12 lg:mt-16">
        <ModelCarousel />
      </div>
    </section>
  )
}
