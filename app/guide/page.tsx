import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "First Timer's Guide | PO Dads",
  description: 'Practical advice for dads heading out with toddlers in the PO area.',
}

const tips = [
  {
    emoji: '🎒',
    title: "The Dad's Bag",
    content: [
      'Nappies (more than you think — double it)',
      'Wet wipes (the universal tool)',
      'Change of clothes for the toddler AND yourself',
      'Water bottle and snacks (hungry toddlers = chaos)',
      'Small first aid kit: plasters, antiseptic wipe, paracetamol',
      'Sun cream and a hat in summer',
      'Rain cover for the pushchair',
      'A carrier/sling for when they decide to refuse the buggy',
    ],
  },
  {
    emoji: '🚗',
    title: 'Getting There',
    content: [
      "Leave 15 minutes earlier than you think — toddlers don't do schedules",
      'Look up parking before you go — nothing worse than circling with a screaming toddler',
      'Check if there\'s a "parent and child" bay — they\'re worth it',
      'For beaches: check the tide times. Low tide = massive beach. High tide = tiny strip',
      'Feed them before you go, not when you get there',
    ],
  },
  {
    emoji: '👶',
    title: 'Changing on the Go',
    content: [
      "Almost every major park, soft play and café has baby change now — check the 'facilities' badge on each place listing",
      "If there's no dedicated baby change, most disabled toilets have a fold-down table",
      "Changing mat in the bag at all times — surfaces you find in the wild can be grim",
      "Keep a disposable bag for nappy disposal when bins are miles away",
    ],
  },
  {
    emoji: '🤝',
    title: "Joining Toddler Groups as a Dad",
    content: [
      "Walk in like you own the place — confidence is everything",
      'Most groups are run by mums but they\'re always delighted to see dads — you\'ll get a warm welcome',
      "Get there early and bag a spot near the toy kitchen — toddlers love it and it gives you something to do while they play",
      "Don't force your toddler to interact — let them warm up in their own time",
      "Library Rhyme Time is one of the best free sessions and has a brilliant dad-friendly atmosphere",
      "Say hi to the other adults — most are just as grateful for conversation",
    ],
  },
  {
    emoji: '☀️',
    title: 'Outdoor Days Made Easy',
    content: [
      "Let them walk wherever possible — it wears them out and they sleep better",
      'Pack a picnic blanket — sitting on wet grass is grim, and it doubles as a fort',
      "Puddles are not the enemy — waterproof trousers are £8 from Lidl and they'll wear them every day",
      "Give them a mission: spotting birds, collecting leaves, finding the 'biggest stick'",
      'Built-in play equipment near cafes = you can have a hot drink while they play. Win.',
    ],
  },
  {
    emoji: '🏠',
    title: 'Rainy Day Survival',
    content: [
      "Soft play on a Tuesday morning = empty. Soft play on a Saturday = chaos. Plan accordingly",
      "Libraries are completely free and most run story/rhyme sessions",
      "Museums are free for under-5s and often have hands-on exhibits at toddler height",
      "The weather in Hampshire isn't that bad — invest in proper waterproofs and embrace it",
    ],
  },
  {
    emoji: '💬',
    title: 'Building Your Dad Crew',
    content: [
      "PO Dads Forum is the best place to start — introduce yourself in the Introductions section",
      "Organise or join a meetup — showing up once builds connections that last",
      "WhatsApp groups form naturally from meetups — don't be afraid to share yours",
      "Most dads are in the same boat and just as keen to connect — just ask",
    ],
  },
]

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <span className="text-5xl">🌳</span>
        <h1 className="text-4xl font-bold mt-4 mb-3">First Timer's Guide</h1>
        <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">
          Practical advice for dads heading out with toddlers in the Waterlooville,
          Havant and Fareham area. No fluff — just what actually works.
        </p>
      </div>

      <div className="space-y-8">
        {tips.map(section => (
          <div key={section.title} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <span className="text-2xl">{section.emoji}</span>
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.content.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-[var(--primary)] mt-0.5 flex-shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#2d6a4f] rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Know something we don't?</h2>
        <p className="opacity-80 mb-6">
          Share your wisdom with other dads — add a place, leave a tip, or jump into the forum.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/places/add" className="bg-white text-[#2d6a4f] rounded-xl px-5 py-2.5 font-semibold text-sm hover:bg-gray-100 transition-colors">
            Add a place
          </a>
          <a href="/forum/new" className="bg-white/20 text-white rounded-xl px-5 py-2.5 font-semibold text-sm hover:bg-white/30 transition-colors">
            Join the forum
          </a>
        </div>
      </div>
    </div>
  )
}
