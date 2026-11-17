import {
  Calculator,
  Car,
  ChevronRight,
  Coins,
  CreditCard,
  FileText,
  Gift,
  Globe,
  Headset,
  Home as HomeIcon,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Umbrella,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Screen } from '../components/Phone'
import { Card, LargeHeader, SectionTitle } from '../components/ui'
import { useStore } from '../store'

function Tile({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="flex h-[78px] w-[112px] shrink-0 flex-col justify-between p-3">
      <span className="text-navy">{icon}</span>
      <span className="text-[13px] leading-tight text-ink">{label}</span>
    </Card>
  )
}

export function More() {
  const { notify, push, reset } = useStore()
  const i = 'size-[19px]'
  return (
    <Screen className="bg-mist">
      <LargeHeader title="More" />
      <div className="space-y-6 px-4 pt-5">
        <section>
          <SectionTitle action="See all" onAction={() => notify('Browse all 40+ Westpac products')}>
            Products
          </SectionTitle>
          <div className="no-scrollbar -mx-4 grid auto-cols-[112px] grid-flow-col grid-rows-2 gap-2.5 overflow-x-auto px-4 pb-1">
            <Tile icon={<Coins className={i} />} label="Bank accounts" onClick={() => reset([{ name: 'accounts' }])} />
            <Tile icon={<HomeIcon className={i} />} label="Home loans" onClick={() => push({ name: 'iq', tab: 'products' })} />
            <Tile icon={<CreditCard className={i} />} label="Credit cards" onClick={() => notify('Altitude Black: 0% balance transfer for 24 months')} />
            <Tile icon={<Car className={i} />} label="Personal loans" onClick={() => notify('Personal loans from 6.49% p.a.')} />
            <Tile icon={<Globe className={i} />} label="International travel" onClick={() => notify('Westpac Worldwide Wallet · 10 currencies')} />
            <Tile icon={<Umbrella className={i} />} label="Insurance" onClick={() => notify('Home & contents quote in 2 minutes')} />
          </div>
        </section>

        <Card onClick={() => notify('Borrowing power: up to $812,000 (illustrative)')} className="flex items-center gap-3 p-4">
          <Calculator className="size-5 text-navy" />
          <span className="flex-1 text-[15px] font-semibold text-navy">Calculators</span>
          <ChevronRight className="size-5 text-wred" />
        </Card>

        <section>
          <SectionTitle>Services</SectionTitle>
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            <Tile icon={<Headset className={i} />} label="Contact us" onClick={() => notify('Connecting you to a Westpac specialist…')} />
            <Tile icon={<TriangleAlert className={i} />} label="Urgent card support" onClick={() => push({ name: 'iq', tab: 'shield' })} />
            <Tile icon={<FileText className={i} />} label="Statements & documents" onClick={() => notify('October statement ready to download')} />
            <Tile icon={<Settings className={i} />} label="Settings" onClick={() => notify('Settings')} />
          </div>
        </section>

        <section>
          <SectionTitle>Popular areas</SectionTitle>
          <div className="space-y-2.5">
            <Card onClick={() => notify('3 new offers: 10% back at Bunnings, 5% at Myer…')} className="flex items-center gap-3 p-3.5">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lilac to-blush text-wred">
                <Gift className="size-7" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy">Rewards and offers</span>
                <span className="block text-[13px] leading-snug text-muted">Get access to discounts, deals and cashback</span>
              </span>
            </Card>
            <Card onClick={() => push({ name: 'iq' })} className="flex items-center gap-3 p-3.5">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-navy text-blush">
                <Sparkles className="size-7" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy">Cash Flow IQ</span>
                <span className="block text-[13px] leading-snug text-muted">Your Shadow Private Banker finds leaks and sweeps savings</span>
              </span>
            </Card>
            <Card onClick={() => push({ name: 'iq', tab: 'shield' })} className="flex items-center gap-3 p-3.5">
              <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-wred text-white">
                <ShieldCheck className="size-7" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy">SafeBlock & Scam Shield</span>
                <span className="block text-[13px] leading-snug text-muted">Lock merchants and make single-use cards for trials</span>
              </span>
            </Card>
          </div>
        </section>

        <button onClick={() => notify('Signed out (demo)')} className="flex w-full items-center justify-center gap-2 py-3 text-[15px] font-medium text-wred">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </Screen>
  )
}
