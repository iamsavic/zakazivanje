'use client'

import { Check } from 'lucide-react'

interface Step {
  number: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li
            key={step.number}
            className={`relative ${
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''
            }`}
          >
            {step.number < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="mt-2 text-xs font-medium text-indigo-600">{step.label}</div>
              </>
            ) : step.number === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                  <span className="text-indigo-600 font-semibold">{step.number}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-indigo-600">{step.label}</div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span className="text-gray-500">{step.number}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-gray-500">{step.label}</div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
