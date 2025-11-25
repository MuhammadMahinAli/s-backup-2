'use client'

import { Heart, AlertTriangle, Shield, Lightbulb, BookOpen, Phone } from 'lucide-react'

export function HelpGuidelines() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="bg-card rounded-xl p-8 border border-border mb-8">
            <div className="flex items-start gap-4">
              <Heart size={40} className="text-accent flex-shrink-0 mt-2" />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Peer Advocate Guidelines & Best Practices
                </h1>
                <p className="text-muted-foreground text-lg">
                  Everything you need to support youth safely and confidently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Do's & Don'ts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Do's Card */}
          <div className="bg-card rounded-xl p-6 border border-border border-t-4 border-t-accent">
            <div className="flex items-center gap-3 mb-4">
              <Heart size={24} className="text-accent" />
              <h2 className="text-lg font-semibold text-card-foreground">DO's</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Listen non-judgmentally',
                'Validate feelings',
                'Keep responses short, simple, clear',
                'Encourage professional help when necessary',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts Card */}
          <div className="bg-card rounded-xl p-6 border border-border border-t-4 border-t-red-400">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h2 className="text-lg font-semibold text-card-foreground">DON'Ts</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Do not give medical advice',
                'Do not diagnose',
                'Do not promise confidentiality',
                'Do not dismiss feelings',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Rules Card */}
          <div className="bg-card rounded-xl p-6 border border-border border-t-4 border-t-blue-400">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-card-foreground">Safety Rules</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Escalate crisis cases',
                'Report harmful behavior',
                'Use trauma-informed language',
                'Prioritize youth safety always',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trauma-Informed Response Guide */}
        <div className="bg-secondary rounded-xl p-8 mb-12">
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">
              How to Respond with Care
            </h2>

            <div className="space-y-6 mb-8">
              {[
                {
                  step: '1. Acknowledge',
                  description: 'Recognize and validate what the person has shared with you',
                },
                {
                  step: '2. Normalize',
                  description: 'Help them understand their feelings are valid and not alone',
                },
                {
                  step: '3. Guide',
                  description: 'Suggest safe, supportive next steps or resources',
                },
                {
                  step: '4. Avoid',
                  description: 'Never give commands, judgments, or medical advice',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      {item.step.split('.')[0]}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">{item.step}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Example Response Box */}
            <div className="bg-secondary rounded-lg p-6 border border-border">
              <p className="text-sm font-semibold text-card-foreground mb-3">Example Response:</p>
              <p className="text-sm text-card-foreground italic">
                {"Thank you for sharing this with me. What you're feeling is valid, and you're not alone. Here are a few gentle steps that may help: take some time for self-care, reach out to a trusted adult, or contact a professional counselor who can give you specialized support."}
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Escalation Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Red Flags */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h2 className="text-lg font-semibold text-card-foreground">Crisis Red Flags</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Mentions of self-harm or suicide',
                'Sexual abuse or assault',
                'Trafficking concerns',
                'Severe eating disorders',
                'Drug or alcohol abuse',
                'Coercion or threats',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-card-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What to Do */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Phone size={24} className="text-accent" />
              <h2 className="text-lg font-semibold text-card-foreground">What to Do</h2>
            </div>
            <p className="text-sm text-card-foreground mb-4">
              When you recognize crisis indicators, follow the emergency protocol immediately.
            </p>
            <button className="w-full px-6 py-3 rounded-lg font-medium transition-all bg-red-500 text-white hover:opacity-90">
              Open Emergency Protocol
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              This will guide you through proper escalation steps and resources
            </p>
          </div>
        </div>

        {/* Quick Tips Block */}
        <div className="bg-accent bg-opacity-10 rounded-xl p-8 mb-12 border border-accent border-opacity-20">
          <h2 className="text-xl font-semibold text-card-foreground mb-6">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Keep replies under 4 sentences',
              'Avoid sensitive medical claims',
              'Use inclusive, non-gendered language',
              'Respond kindly—even when unsure',
            ].map((tip, idx) => (
              <div key={idx} className="bg-card rounded-lg p-4 border border-border flex items-start gap-3">
                <Lightbulb size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-card-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Callout */}
        <div className="bg-card rounded-xl p-8 border border-border text-center">
          <BookOpen size={32} className="text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-card-foreground mb-2">
            {"When in doubt, always choose safety first."}
          </h2>
          <p className="text-muted-foreground mb-6">
            For comprehensive guidance on peer support best practices, consult the full SHY Support Handbook.
          </p>
          <button className="px-6 py-2 rounded-lg font-medium transition-all bg-accent text-accent-foreground hover:opacity-90">
            View Full SHY Support Handbook
          </button>
        </div>
      </div>
    </div>
  )
}
