import React from 'react'
import { FEATURES } from './config'
import { FeatureCard } from './components/FeatureCards/FeatureCards'

const PlatformFeatures = () => {
    return (
        <section className="px-6 py-6">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-center text-4xl font-bold text-white">
                    Platform Features
                </h2>
                <p className="mt-3 text-center text-[#475569]">
                    Everything you need for complete vehicle care
                </p>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {FEATURES.map((item) => (
                        <FeatureCard key={item.title} {...item} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PlatformFeatures
