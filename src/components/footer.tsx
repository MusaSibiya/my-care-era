import Link from "next/link";
import { GraduationCap, Heart, ExternalLink } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Universities", href: "/universities" },
      { label: "Courses", href: "/courses" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Upload Results", href: "/upload-results" },
      { label: "Get Recommendations", href: "/recommendations" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Provinces",
    links: [
      { label: "Gauteng", href: "/universities?province=Gauteng" },
      { label: "Western Cape", href: "/universities?province=Western Cape" },
      { label: "KwaZulu-Natal", href: "/universities?province=KwaZulu-Natal" },
      { label: "Eastern Cape", href: "/universities?province=Eastern Cape" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1.5">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">My Care-era</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Helping South African students find the right courses, careers, and
              university experiences.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} My Care-era. Built for South African students.
          </p>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            Made with <Heart className="inline h-3.5 w-3.5 fill-red-500 text-red-500" /> for SA
          </p>
        </div>
      </div>
    </footer>
  );
}
