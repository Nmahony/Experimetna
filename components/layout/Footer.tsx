import Link from 'next/link'

export function Footer() {
  return (
    <footer className="hidden md:block bg-[#1b4332] text-white/70 text-sm py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <p className="font-bold text-white">PO Dads</p>
              <p className="text-xs">Your crew is out there, Dad.</p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { href: '/places', label: 'Places' },
              { href: '/map', label: 'Map' },
              { href: '/forum', label: 'Forum' },
              { href: '/meetups', label: 'Meetups' },
              { href: '/guide', label: 'Guide' },
              { href: '/admin', label: 'Admin' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} PO Dads. Made with ❤️ in Hampshire.
          </p>
        </div>
      </div>
    </footer>
  )
}
