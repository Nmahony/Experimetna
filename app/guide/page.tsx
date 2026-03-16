import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'First Timer? Dad Guide | PO Dads',
  description: 'A practical guide for dads taking toddlers out solo. Packing tips, changing facilities, and survival advice.',
}

const tips = [
  {
    emoji: '🎒',
    title: "The Dad Bag Essentials",
    items: [
      "2x nappies minimum (always pack more than you think you need)",
      "Travel changing mat — public changing tables aren't always clean",
      "Spare clothes for the little one AND yourself (splash zone is real)",
      "Wipes — they solve 90% of all toddler problems",
      "Snacks: raisins, rice cakes, pouches — the holy trinity",
      "A water bottle (yours) and a sippy cup",
      "Sun cream in summer, waterproofs in winter",
      "A carrier/sling for when legs give out on longer walks",
    ],
  },
  {
    emoji: '🚼',
    title: "Baby Changing in Public",
    items: [
      "Most supermarkets have decent facilities — Morrisons and M&S are reliably good",
      "Disabled toilets often have space for a changing mat when there's no dedicated room",
      "Always use your portable mat — you'll thank yourself later",
      "Many Wetherspoon pubs have decent facilities and are toddler-friendly until early evening",
      "The Staunton Country Park café has excellent, clean baby-changing facilities",
      "National Trust properties and English Heritage sites are always reliable",
    ],
  },
  {
    emoji: '👨‍👧',
    title: "Joining Toddler Groups as a Dad",
    items: [
      "You belong there — it might feel weird at first but it gets easier fast",
      "Most groups are welcoming; if yours isn't, find a different one",
      "Nursery school drop-offs are a great way to meet other parents naturally",
      "Look for 'dads and kids' specific sessions — libraries and children's centres often run them",
      "PO Dads meetups are specifically for you — come along, no awkwardness",
      "Being there makes a massive difference — the kids love it too",
    ],
  },
  {
    emoji: '🌦️',
    title: "Handling Bad Weather",
    items: [
      "The weather widget on this site tells you current conditions near Waterlooville",
      "There is no such thing as bad weather, only bad clothing (up to about 10°C)",
      "Rain gear: waterproof all-in-one suits are life-changing for toddlers",
      "Have a list of 3 indoor backup options ready — soft play, library, café",
      "Fun Station and The Base are your best all-weather bets locally",
      "Fareham Library rhyme time is free and perfect for grim Tuesday mornings",
    ],
  },
  {
    emoji: '🚗',
    title: "Getting Out of the House",
    items: [
      "Set a departure time and treat it like a deadline — momentum is everything",
      "Pack the bag the night before, not the morning of",
      "Lower your expectations: a 45-minute outing is a win",
      "The car park at QECP can be busy on weekends — arrive before 10am",
      "Sandy Point and Hill Head beach parking is much quieter on weekday mornings",
      "If it goes wrong, leave. There will be another day.",
    ],
  },
  {
    emoji: '💬',
    title: "Mental Health & Connection",
    items: [
      "Isolation is real for dads too — it's okay to admit that",
      "The forum on this site is low-pressure and supportive",
      "Arranging a meetup is easier than it sounds — even one other dad is enough",
      "Most dads feel exactly like you do but don't say it — be the one who does",
      "A morning out resets everything — for you and the little one",
      "You're doing great, even on the days it doesn't feel like it",
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="text-6xl block mb-4">🌿</span>
        <h1 className="text-4xl font-black text-gray-900 mb-3">The Dad's Survival Guide</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          First time out solo with your toddler? No worries. Here's everything you actually need to know.
        </p>
      </div>

      {/* Tips sections */}
      <div className="space-y-8">
        {tips.map(section => (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-[#2d6a4f] px-6 py-4 flex items-center gap-3">
              <span className="text-3xl">{section.emoji}</span>
              <h2 className="text-xl font-black text-white">{section.title}</h2>
            </div>
            <ul className="divide-y divide-gray-50">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 px-6 py-4">
                  <span className="text-[#2d6a4f] font-bold mt-0.5 text-sm">{i + 1}.</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-[#2d6a4f] text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-black mb-2">Ready to get out there?</h2>
        <p className="text-white/70 mb-6">Find the best toddler spots in Waterlooville, Havant and Fareham.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/places"
            className="bg-[#f59e0b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d97706] transition-colors"
          >
            Browse Places
          </Link>
          <Link
            href="/meetups"
            className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/20"
          >
            Find Meetups
          </Link>
        </div>
      </div>
    </div>
  )
}
