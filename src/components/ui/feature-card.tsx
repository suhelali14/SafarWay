import type { Feature } from "../../types"

interface FeatureCardProps {
  feature: Feature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const { title, description, icon } = feature

  return (
    <article className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </article>
  )
}

