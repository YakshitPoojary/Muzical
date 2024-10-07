import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Users, Radio } from "lucide-react"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <Appbar/>
      <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Music
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Empower your audience to curate your streams soundtrack.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="#">
                  <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
                </Link>
                <Link href="#">
                  <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400/10">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <Users className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">Fan Interaction</h3>
                <p className="text-gray-400">Let fans choose your stream&apos;s music.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Radio className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">Live Streaming</h3>
                <p className="text-gray-400">High-quality, low-latency streaming.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Music className="h-12 w-12 text-purple-400" />
                <h3 className="text-xl font-bold">Vast Music Library</h3>
                <p className="text-gray-400">Millions of tracks to choose from.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Transform Your Streams?</h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join MusicStreamChoice today and create unforgettable experiences.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-purple-400" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 MusicStreamChoice. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-purple-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:text-purple-400" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}